const { createVNode } = require("../vdom")

const Image = ({ src, key }) => createVNode("img", { src, key })

module.exports = Image
