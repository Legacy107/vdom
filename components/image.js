const { createVNode } = require("../vdom")

/**
 * An image component.
 *
 * @param {Object} props - The properties of the image component.
 * @param {string} props.src - The source URL of the image.
 * @param {string} props.key - The unique key of the image component.
 * @returns {VNode} - The virtual DOM node representing the image component.
 */
const Image = ({ src, key } = {}) => (
  createVNode("img", { src, key })
)

module.exports = Image
