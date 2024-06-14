import Resizer from "./Resizer.js";

interface ResizeOptions {
  resizableElement: HTMLElement[];
  resizerClassList: string;
  saveName: string;
  classToCheck: string;
}

class Resize {
  private resizableElement: HTMLElement[];
  private resizerClassList: string;
  private memoryName: string;
  private classToCheck: string;
  private resizer: Resizer;

  constructor(option: ResizeOptions) {
    console.log(option);

    this.resizableElement = option.resizableElement;
    this.resizerClassList = option.resizerClassList;
    this.memoryName = option.saveName;
    this.classToCheck = option.classToCheck;

    this.giveSize(this.resizableElement);
    this.resizer = new Resizer(this.resizerClassList);

    this.addResizer(this.resizableElement, this.resizerClassList).forEach(resizer => {
      this.moveResizer(resizer, this.resizableElement);
    });

    this.resizableElement.forEach(el => {
      this.observeElementChanges(el, this.resizableElement, this.classToCheck);
    });
  }

  private observeElementChanges(targetElement: HTMLElement, resizableElement: HTMLElement[], classToCheck: string): void {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (targetElement.classList.contains(classToCheck)) {
            console.log('La classe ' + classToCheck + ' è stata aggiunta all\'elemento.');
            this.giveSize(this.checkResizableElement(this.resizableElement));
          } else {
            console.log('la classe ' + classToCheck + ' è stata rimossa');
            this.giveSize(this.checkResizableElement(this.resizableElement));
          }
        }
      }
    });

    observer.observe(targetElement, { attributes: true });
  }

  private checkResizableElement(elements: HTMLElement[]): HTMLElement[] {
    let result:HTMLElement[] = [];
    elements.forEach(el => {
      if (!el.classList.contains(this.classToCheck)) {
        result.push(el);
      }
    })
    return result;
  }

  private giveSize(resizableElement: HTMLElement[]): void {
    const sizes = JSON.parse(localStorage.getItem(this.memoryName + 'Size') || 'null');

    if (sizes) {
      const sizesSum = sizes.reduce((sum: number, size: { percW: number }) => sum + size.percW, 0);
      const sizesStart = sizes.map((size: { percW: number }) => (size.percW * sizes.length) / resizableElement.length * 100 / sizesSum);

      resizableElement.forEach((el, i) => {
        el.style.width = sizesStart[i] + '%';
      });
    }
  }

  private addResizer(elementArray: HTMLElement[], classList: string): HTMLElement[] {
    const resizers: HTMLElement[] = [];
    for (let i = 0; i < (elementArray.length - 1); i++) {
      const elem = elementArray[i];
      const resizer = document.createElement('div');
      resizer.classList.value = classList;
      resizer.draggable = false;

      elem.insertAdjacentElement('afterend', resizer);
      resizers.push(resizer);
    }
    return resizers;
  }

  private moveResizer(resizer: HTMLElement, resizableElement: HTMLElement[]): void {
    const memoryName = this.memoryName;
    const classToCheck = this.classToCheck;
    const check = this.checkResizableElement.bind(this);

    let pos1 = 0, pos3 = 0;
    let mouseXStart: number | null = null;
    let rightDiv: HTMLElement | null = null;
    let rightDivInitialWidth: number | null = null;
    let leftDiv: HTMLElement | null = null;
    let leftDivInitialWidth: number | null = null;
    let trueResizable: HTMLElement[] | null = null;

    resizer.onmousedown = dragMouseDown;

    function dragMouseDown(e: MouseEvent) {
      e.preventDefault();

      trueResizable = check(resizableElement);
      pos3 = e.clientX;

      mouseXStart = e.clientX;
      const resizerH = resizer.getBoundingClientRect().height;
      resizer.style.position = 'absolute';
      resizer.style.height = resizerH + 'px';
      resizer.style.left = mouseXStart + 'px';

      rightDiv = resizer.nextElementSibling as HTMLElement;
      leftDiv = resizer.previousElementSibling as HTMLElement;

      rightDivInitialWidth = rightDiv.getBoundingClientRect().width;
      leftDivInitialWidth = leftDiv.getBoundingClientRect().width;

      document.onmouseup = closemoveResizer;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos3 = e.clientX;

      resizer.style.left = (resizer.offsetLeft - pos1) + "px";

      const mouseDelta = e.clientX - (mouseXStart as number);

      if (leftDiv && rightDiv) {
        leftDiv.style.width = (leftDivInitialWidth as number + mouseDelta) + 'px';
        rightDiv.style.width = (rightDivInitialWidth as number - mouseDelta) + 'px';
      }
    }

    function closemoveResizer() {
      document.onmouseup = null;
      document.onmousemove = null;

      saveSize();
      resizer.style.position = '';
      resizer.style.height = '';
      resizer.style.left = '';
    }

    function saveSize() {
      let elSize: { id: string, percW: number }[] = [];
      if (localStorage.getItem(memoryName + 'Size')) {
        elSize = JSON.parse(localStorage.getItem(memoryName + 'Size') || '[]');

        elSize.forEach((size, i) => {
          if (!resizableElement[i].classList.contains(classToCheck)) {
            size = {
              id: resizableElement[i].id,
              percW: (resizableElement[i].getBoundingClientRect().width * 100) / resizableElement[i].parentElement!.getBoundingClientRect().width
            };
            elSize[i] = size;
          }
        });
        localStorage.setItem(memoryName + 'Size', JSON.stringify(elSize));
      } else {
        resizableElement.forEach((el, i) => {
          const percW = (el.getBoundingClientRect().width * 100) / el.parentElement!.getBoundingClientRect().width;
          elSize.push({ id: el.id, percW: percW });
        });
        localStorage.setItem(memoryName + 'Size', JSON.stringify(elSize));
      }
    }
  }
}

export default Resize;


