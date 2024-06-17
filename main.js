import Resize from './bin/Resize.js'

const resizableElements = document.querySelectorAll('.resizableElement');

console.log(resizableElements);
const resize = new Resize(
    {
      resizableElements:resizableElements,
      resizerClassList : 'resizer cursor-col-resize w-1 hover:border border-blue-500',
      saveName: 'resizableElements',
      classToCheck: 'hidden'
    }
  );