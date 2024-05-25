const { createVNode, appState } = require("./vdom")
const Title = require("./components/title")
const Gallery = require("./components/gallery")

const App = (initialNumImages = 3) => {
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
      Title(),
      createVNode(
        "div",
        {
          id: "controls"
        },
        [
          createVNode(
            "button",
            {
              onClick: increaseImages,
              ...(numImages === 8 && { disabled: true })
            },
            ["Add 1 images"]
          ),
          createVNode(
            "button",
            {
              onClick: decreaseImages,
              ...(numImages === 0 && { disabled: true })
            },
            ["Remove 1 images"]
          ),
        ]
      ),
      Gallery(numImages)
    ]
  )
}

module.exports = App
