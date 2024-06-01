const { createVNode, appState } = require("./vdom")
const Title = require("./components/title")
const Gallery = require("./components/gallery")
const Button = require("./components/button")

const App = ({ initialNumImages = 3 } = {}) => {
  const { getState, setState } = appState
  const numImages = getState().numImages

  if (getState().numImages === undefined) {
    setState({
      numImages: initialNumImages
    })
  }

  const increaseImages = () => {
    setState({
      numImages: getState().numImages + 1,
      position: 0
    })
  }

  const decreaseImages = () => {
    setState({
      numImages: getState().numImages - 1,
      position: 0
    })
  }

  return createVNode(
    "div",
    {
      id: "app"
    },
    [
      Title({ text: "Image Gallery" }),
      createVNode(
        "div",
        {
          id: "controls"
        },
        [
          Button({
            text: "Add 1 images",
            onClick: increaseImages,
            disabled: numImages === 8
          }),
          Button({
            text: "Remove 1 images",
            onClick: decreaseImages,
            disabled: numImages === 0
          }),
        ]
      ),
      Gallery({ numImages })
    ]
  )
}

module.exports = App
