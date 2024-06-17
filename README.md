# Resize
this library implements the resizing of two or more div.

## Installation
`git clone https://github.com/CarloFanelli/Resizer`

### install package
`npm i`

### run the project with
`nm run dev`

### for production run
`npm run build`

## usage
*import the 'Resize'*
br
`import Resize from './bin/resize.js'`
use your path

## all the elements need an id to save in the localStorage properly
#### the parent of the resizableElements element must to be in position relative
**this library expose a contructor:**

```
const resizer2 = new Resize(
  {
    resizableElements:resizableElements, //html elements that has to be resizable
    resizerClassList : 'resizer cursor-col-resize w-1 hover:border border-blue-500', //class list for the resizer (between two elements)
    saveName: 'resizableElements', //name for the local storage
    classToCheck: 'hidden' //class that can be added or removed from a resizable element (hidden for example if you want to hide or show a div and adapt the others)
  }
); 
```
