const { createVNode } = require('../vdom')

const Title = (props) => createVNode(
  'h1',
  {
    id: 'title',
    style: 'color: blue',
    ...props,
  },
  [
    'Hello, World!'
  ]
)

module.exports = Title
