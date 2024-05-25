const { RENDER_FLAG, createVNode, appState } = require("../vdom")
const Image = require("./image")

const Gallery = (numImage = 3) => {
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
  const images = Array.from({ length: numImage }).map((_, idx) => {
    const imageIdx = ((idx + position) % numImage + 1)
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
    },
    [
      createVNode(
        "button",
        {
          id: "back",
          onClick: handleBack,
        },
        ["<"]
      ),
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
      createVNode(
        "button",
        {
          id: "next",
          onClick: handleNext,
        },
        [">"]
      ),
    ]
  )
}

module.exports = Gallery
