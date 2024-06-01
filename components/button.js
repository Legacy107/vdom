const { createVNode } = require("../vdom")

/**
 * Button component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.text - The text to display on the button.
 * @param {function} props.onClick - The click event handler for the button.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled or not.
 * @param {string} props.key - The unique key of the component.
 * @returns {VNode} The virtual DOM node representing the button.
 */
const Button = ({ text, onClick, disabled=false, key } = {}) => (
  createVNode(
    "button",
    {
      onClick,
      ...(disabled && { disabled }),
      ...(key && { key }),
    },
    [text]
  )
)

module.exports = Button
