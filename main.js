import Resize from './bin/Resize.js'

const resizableElement = document.querySelectorAll('.resizableElement');


const resize = new Resize(
    {
      resizableElement:resizableElement,
      resizerClassList : 'resizer',
      saveName: 'resizableElements',
      classToCheck: 'hidden'
    }
  );