// initialize global variables for tracking
// the number of nodes created, mounted, deleted, moved, and attribute modified
if (!window.nodeMounted) {
  window.nodeCreated = 0
  window.nodeMounted = 0
  window.nodeDeleted = 0
  window.nodeMoved = 0
  window.attributeModified = 0
}

/**
 * Render flags used for virtual DOM rendering to indicate the rendering behavior.
 * 
 * @enum {number}
 */
const RENDER_FLAG = {
  NORMAL: 1,
  REORDER: 2
}

/**
 * Virtual DOM node.
 * @typedef {Object} VNode
 * @property {string} type - The type of the virtual DOM node.
 * @property {object} props - The properties of the virtual DOM node.
 * @property {Array} children - The children of the virtual DOM node.
 * @property {number} [flag=RENDER_FLAG.NORMAL] - The render flag of the virtual DOM node.
 */

/**
 * Creates a virtual DOM node.
 *
 * @param {string} type - The type of the virtual DOM node.
 * @param {object} props - The properties of the virtual DOM node.
 * @param {Array} children - The children of the virtual DOM node.
 * @param {number} [flag=RENDER_FLAG.NORMAL] - The render flag of the virtual DOM node.
 * @returns {VNode} - The created virtual DOM node.
 */
function createVNode(type, props, children, flag = RENDER_FLAG.NORMAL) {
  return { type, props, children, flag }
}


/**
 * Render a DOM element based on the virtual DOM element.
 * If the element is a string, it creates a text node.
 * If the element is an object, it creates an HTML element with the specified type, props, and children.
 * 
 * @param {string|VNode} element - The virtual DOM element to render.
 * @returns {Node} - The created DOM element.
 */
function createApp(element) {
  ++window.nodeCreated
  if (typeof element === "string") {
    return document.createTextNode(element)
  }

  const { type, children } = element
  const { onClick, ...props } = element.props

  const el = document.createElement(type)

  if (onClick) {
    ++window.attributeModified
    el.addEventListener("click", onClick)
  }

  Object.keys(props).forEach(key => {
    ++window.attributeModified
    el.setAttribute(key, props[key])
  })

  if (children?.length) {
    children.forEach(child => {
      if (typeof child === "function") {
        child = child()
      }
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child))
        return
      }
      childApp = createApp(child)
      el.appendChild(childApp)
    })
  }
  return el
}

/**
 * Mounts the given element into the specified container.
 *
 * @param {Node} element - The element to be mounted.
 * @param {Node} container - The container element where the element will be mounted.
 * @returns {Node} - The mounted element.
 */
function mount(element, container) {
  ++window.nodeMounted
  container.replaceWith(element)
  return element
}

/**
 * Performs a diffing algorithm to compute the differences between two virtual DOM trees
 * and generate patches.
 * 
 * @param {VNode} oldTree - The old virtual DOM tree.
 * @param {VNode} newTree - The new virtual DOM tree.
 * @returns {Function} - A function that applies the patches to the DOM element.
 */
function diff(oldTree, newTree) {
  if (oldTree === undefined) {
    return (element) => mount(createApp(newTree), element)
  }

  if (newTree === undefined) {
    return (element) => {
      ++window.nodeDeleted
      element.remove()
      return undefined
    }
  }

  if (typeof oldTree === "string" || typeof newTree === "string") {
    if (oldTree !== newTree) {
      return (element) => mount(createApp(newTree), element)
    }
    return (element) => element
  }

  if (oldTree.type !== newTree.type) {
    return (element) => mount(createApp(newTree), element)
  }

  const patchProps = diffProps(oldTree.props, newTree.props)
  const patchChildren = diffChildren(oldTree.children, newTree.children, newTree.flag)
  return (element) => {
    patchProps(element)
    patchChildren(element)
    return element
  }
}

/**
 * Compares the old and new props of an element and generates a set of patches
 * to be applied to the element's attributes.
 *
 * @param {Object} oldProps - The old props of the element.
 * @param {Object} newProps - The new props of the element.
 * @returns {Function} - A function that applies the patches to the DOM element.
 */
function diffProps(oldProps, newProps) {
  const patches = []

  for (let key in newProps) {
    if (oldProps[key] !== newProps[key]) {
      patches.push((element) => {
        ++window.attributeModified
        element.setAttribute(key, newProps[key]);
        return element
      })
    }
  }

  for (let key in oldProps) {
    if (!(key in newProps)) {
      patches.push((element) => {
        ++window.attributeModified
        element.removeAttribute(key);
        return element
      })
    }
  }

  return (element) => {
    for (const patch of patches) {
      patch(element)
    }
    return element
  }
}

/**
 * Performs diffing on two arrays of children with reordering algorithm.
 *
 * @param {Array} oldChildren - The array of old children.
 * @param {Array} newChildren - The array of new children.
 * @returns {Function} - A function that applies the patches to the DOM element.
 */
function diffChildrenWithReordering(oldChildren, newChildren) {
  const patches = []
  const individualPatches = []

  let startIdxOld = 0
  let startIdxNew = 0
  let maxLength = 0

  // find the longest sequence of children in common based on key
  // example
  // old: 1 5 2 3 4
  // new: 2 3 4 1 5
  // longest common sequence: 2 3 4
  // startIdxOld: 2
  // startIdxNew: 0
  // maxLength: 3
  for (let i = 0; i < oldChildren?.length ?? 0; i++) {
    let curStartIdxNew = 0
    let curLength = 0
    for (let j = 0; j < newChildren?.length ?? 0; j++) {
      if (i + curLength >= oldChildren?.length) {
        break
      }

      // assume keys are unique for simplicity
      // else another nested loop is needed
      if (oldChildren[i + curLength].props.key === newChildren[j].props.key) {
        if (curLength === 0) {
          curStartIdxNew = j
        }
        curLength++
        if (curLength > maxLength) {
          startIdxOld = i
          startIdxNew = curStartIdxNew
          maxLength = curLength
        }
      } else {
        curLength = 0
      }
    }
  }

  if (maxLength > 0) {
    if (startIdxOld > startIdxNew) {
      // example
      // old: 5 1 2 3 4
      // new: 0 2 3 4 1
      // remove 5 and append it to the end
      patches.push((element) => {
        for (let i = 0; i < startIdxOld - startIdxNew; i++) {
          ++window.nodeMoved
          // this actually moves the child node. Hence, no need to remove it
          // https://stackoverflow.com/questions/12146888/why-does-appendchild-moves-a-node
          element.appendChild(element.childNodes[i])
        }

        return element
      })

    } else if (startIdxOld < startIdxNew) {
      // example
      // old: 1 2 3 4 5 6
      // new: 5 0 1 2 3 4
      // remove 5 and prepend it to the beginning
      patches.push((element) => {
        for (let i = 0; i < startIdxNew - startIdxOld; i++) {
          ++window.nodeMoved
          // this actually moves the child node. Hence, no need to remove it
          // https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
          element.insertBefore(element.childNodes[element.childNodes.length - 1 - i], element.childNodes[0])
        }
        return element
      })
    }
  }

  // diff each child after reordering
  for (let i = 0; i < oldChildren?.length ?? 0; i++) {
    individualPatches.push(diff(
      oldChildren[(startIdxOld + i) % oldChildren.length],
      newChildren[(startIdxNew + i) % newChildren.length]
    ))
  }

  return (element) => {
    patches.forEach(patch => patch(element))
    for (let i = 0; i < individualPatches.length; i++) {
      individualPatches[i](element.childNodes[i])
    }
    return element
  }
}

/**
 * Diff the children of two virtual DOM nodes and generate a patch function.
 *
 * @param {Array} oldChildren - The array of old children.
 * @param {Array} newChildren - The array of new children.
 * @param {number} [flag=RENDER_FLAG.NORMAL] - The flag indicating the rendering behavior.
 * @returns {Function} - The patch function that applies the changes to the DOM element.
 */
function diffChildren(oldChildren, newChildren, flag = RENDER_FLAG.NORMAL) {
  // only handle reordering if the number of children is the same for simplicity
  // more complex cases can be handled by a more complex algorithm
  if (oldChildren?.length === newChildren?.length && (flag & RENDER_FLAG.REORDER))
    return diffChildrenWithReordering(oldChildren, newChildren)

  const patches = []
  const additionalPatches = []

  for (let i = 0; i < oldChildren?.length ?? 0; i++) {
    patches.push(diff(oldChildren[i], newChildren[i]))
  }

  for (let i = oldChildren?.length ?? 0; i < newChildren?.length ?? 0; i++) {
    additionalPatches.push((element) => {
      ++window.nodeMounted
      element.appendChild(createApp(newChildren[i]))
      return element
    })
  }

  return (element) => {
    for (let i = patches.length - 1; i >= 0; i--) {
      // go in reverse order as we may remove elements
      patches[i](element.childNodes[i])
    }

    for (let i = 0; i < additionalPatches.length; i++) {
      additionalPatches[i](element)
    }

    return element
  }
}

/**
 * Represents the application state.
 *
 * @typedef {Object} AppState
 * @property {function} addListener - Adds a listener function to be called when the state changes.
 * @property {function} getState - Retrieves the current state.
 * @property {function} setState - Updates the state with the provided new state.
 */

/**
 * Creates and returns the application state object.
 * The state is implemented as a closure.
 *
 * @returns {AppState} The application state object.
 */
const appState = (function () {
  let state = {}
  let listeners = []

  /**
   * Adds a listener function to be called when the state changes.
   * @param {Function} listener - The listener function to be added.
   */
  const addListener = (listener) => listeners.push(listener)

  /**
   * Retrieves the current state.
   * @returns {Object} The current state.
   */
  const getState = () => state

  /**
   * Updates the state with the provided new state.
   * @param {Object} newState - The new state to be merged with the current state.
   */
  const setState = (newState) => {
    state = {
      ...state,
      ...newState
    }

    listeners.forEach(listener => listener())
  }

  return { addListener, getState, setState }
})()

module.exports = {
  RENDER_FLAG,
  createVNode,
  createApp,
  mount,
  diff,
  appState
}
