# vDOM Implementation

This project is a simple implementation of a virtual DOM (vDOM). It includes a gallery component that demonstrates the rendering logic and the use of state management in the vDOM.

## Project Structure

- `app.js`: This is the main application file where the App component is defined.
- `index.js`: This is the entry point of the application.
- `vdom.js`: This file contains the implementation of the vDOM.
- `components/`: This directory contains the components used in the application.

## How to Run the Project

1. Install the project dependencies:

```sh
yarn install
```

2. Run development server:

```sh
yarn dev
```

3. Open the browser and navigate to [http://localhost:1234](http://localhost:1234) to see the application in action.

## How to Build the Project

1. Build the project:

```sh
yarn build
```

Replace the script tag in index.html with the following:

```html
<script src="bundle.js"></script>
```

2. Open the `index.html` file in your browser to see the application in action.
