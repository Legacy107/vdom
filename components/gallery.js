const { RENDER_FLAG, createVNode, appState } = require("../vdom")
const Image = require("./image")
const Button = require("./button")

/**
 * A carousel gallery component.
 *
 * @param {Object} props - The properties for the gallery component.
 * @param {number} [props.numImages=3] - The number of images to display in the gallery.
 * @param {string} props.key - The unique key of the component.
 * @returns {VNode} The virtual DOM node representing the gallery component.
 */
const Gallery = ({ numImages = 3, key } = {}) => {
  // a carousel gallery
  let position = appState.getState().position
  if (position === undefined) {
    appState.setState({
      position: 0
    })
    position = 0
  }
  const handleBack = () => {
    appState.setState({
      position: appState.getState().position - 1
    })
  }
  const handleNext = () => {
    appState.setState({
      position: appState.getState().position + 1
    })
  }

  // rotate images based on position
  const images = Array.from({ length: numImages }).map((_, idx) => {
    const imageIdx = ((idx + position) % numImages + 1)
    return Image({
      key: "image-" + imageIdx,
      src: "https://picsum.photos/200/200?id=" + imageIdx
    })
  })

  return createVNode(
    "div",
    {
      id: "gallery",
      style: "display: flex; justify-content: space-around;",
      ...(key && { key }),
    },
    [
      Button({
        text: "<",
        onClick: handleBack,
      }),
      createVNode(
        "div",
        {
          id: "container",
          style: "display: flex; gap: 10px;",
        },
        [
          ...images,  
        ],
        RENDER_FLAG.NORMAL | RENDER_FLAG.REORDER
      ),
      Button({
        text: ">",
        onClick: handleNext,
      }),
    ]
  )
}

module.exports = Gallery
