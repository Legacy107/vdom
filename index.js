const { mount, createApp, diff, appState } = require("./vdom")
const App = require("./app")

let app = App()
let root = mount(createApp(app), document.getElementById("app"))
console.log(`Initial\nNum images: 3\nNode created: ${window.nodeCreated}\nNode mounted: ${window.nodeMounted}\nNode deleted: ${window.nodeDeleted}\nNode moved: ${window.nodeMoved}\nAttribute modified: ${window.attributeModified}`)

// setInterval(() => {
  // window.nodeCreated = 0
  // window.nodeMounted = 0
//   window.nodeMoved = 0
//   window.attributeModified = 0
//   const random = Math.floor(Math.random() * 10)
//   // const random = 3
//   const newApp = App(random)
//   const patch = diff(app, newApp)
//   root = patch(root)
//   app = newApp

//  console.log(`Num images: ${random}\nNode created: ${window.nodeCreated}\nNode mounted: ${window.nodeMounted}\nNode deleted: ${window.nodeDeleted}\nNode moved: ${window.nodeMoved}\nAttribute modified: ${window.attributeModified}`)
// }, 1000)

const { addListener } = appState

addListener(() => {
  const { numImages } = appState.getState()
  window.nodeCreated = 0
  window.nodeMounted = 0
  window.nodeDeleted = 0
  window.nodeMoved = 0
  window.attributeModified = 0

  const newApp = App()
  const patch = diff(app, newApp)
  root = patch(root)
  app = newApp
  console.log(`Num images: ${numImages}\nNode created: ${window.nodeCreated}\nNode mounted: ${window.nodeMounted}\nNode deleted: ${window.nodeDeleted}\nNode moved: ${window.nodeMoved}\nAttribute modified: ${window.attributeModified}`)
})
