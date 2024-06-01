const { createVNode } = require('../vdom')

/**
 * A title component.
 *
 * @param {Object} props - The properties for the title component.
 * @param {string} props.text - The text to be displayed as the title.
 * @param {string} [props.color='blue'] - The color of the title. Defaults to 'blue'.
 * @param {string} props.key - The unique key of the component.
 * @returns {VNode} The virtual DOM node representing the title component.
 */
const Title = ({ text, color, key } = {}) => (
  createVNode(
    'h1',
    {
      id: 'title',
      style: `color: ${color ?? 'blue'}`,
      ...(key && { key }),
    },
    [
      text,
    ]
  )
)

module.exports = Title
