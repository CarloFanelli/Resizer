import Resizer from "./Resizer.js";
class Resize {
    constructor(option) {
        console.log(option);
        this.resizableElements = option.resizableElements;
        this.resizerClassList = option.resizerClassList;
        this.memoryName = option.saveName;
        this.classToCheck = option.classToCheck;
        this.giveSize(this.resizableElements);
        this.resizer = new Resizer(this.resizerClassList);
        this.addResizer(this.resizableElements, this.resizerClassList).forEach(resizer => {
            this.moveResizer(resizer, this.resizableElements);
        });
        this.resizableElements.forEach(el => {
            this.observeElementChanges(el, this.resizableElements, this.classToCheck);
        });
    }
    observeElementChanges(targetElement, resizableElement, classToCheck) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (targetElement.classList.contains(classToCheck)) {
                        this.giveSize(this.checkResizableElement(this.resizableElements));
                    }
                    else {
                        this.giveSize(this.checkResizableElement(this.resizableElements));
                    }
                }
            }
        });
        observer.observe(targetElement, { attributes: true });
    }
    checkResizableElement(elements) {
        let result = [];
        elements.forEach(el => {
            if (!el.classList.contains(this.classToCheck)) {
                result.push(el);
            }
        });
        return result;
    }
    giveSize(resizableElement) {
        const sizes = JSON.parse(localStorage.getItem(this.memoryName + 'Size') || 'null');
        if (sizes) {
            const sizesSum = sizes.reduce((sum, size) => sum + size.percW, 0);
            const sizesStart = sizes.map((size) => (size.percW * sizes.length) / resizableElement.length * 100 / sizesSum);
            resizableElement.forEach((el, i) => {
                el.style.width = sizesStart[i] + '%';
            });
        }
    }
    addResizer(elementArray, classList) {
        const resizers = [];
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
    moveResizer(resizer, resizableElement) {
        const memoryName = this.memoryName;
        const classToCheck = this.classToCheck;
        const check = this.checkResizableElement.bind(this);
        let pos1 = 0, pos3 = 0;
        let mouseXStart = null;
        let rightDiv = null;
        let rightDivInitialWidth = null;
        let leftDiv = null;
        let leftDivInitialWidth = null;
        let trueResizable = null;
        resizer.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e.preventDefault();
            trueResizable = check(resizableElement);
            pos3 = e.clientX;
            mouseXStart = e.clientX;
            const resizerH = resizer.getBoundingClientRect().height;
            resizer.style.position = 'absolute';
            resizer.style.height = resizerH + 'px';
            resizer.style.left = mouseXStart + 'px';
            rightDiv = resizer.nextElementSibling;
            leftDiv = resizer.previousElementSibling;
            rightDivInitialWidth = rightDiv.getBoundingClientRect().width;
            leftDivInitialWidth = leftDiv.getBoundingClientRect().width;
            document.onmouseup = closemoveResizer;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos3 = e.clientX;
            resizer.style.left = (resizer.offsetLeft - pos1) + "px";
            const mouseDelta = e.clientX - mouseXStart;
            if (leftDiv && rightDiv) {
                leftDiv.style.width = (leftDivInitialWidth + mouseDelta) + 'px';
                rightDiv.style.width = (rightDivInitialWidth - mouseDelta) + 'px';
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
            let elSize = [];
            if (localStorage.getItem(memoryName + 'Size')) {
                elSize = JSON.parse(localStorage.getItem(memoryName + 'Size') || '[]');
                elSize.forEach((size, i) => {
                    if (!resizableElement[i].classList.contains(classToCheck)) {
                        size = {
                            id: resizableElement[i].id,
                            percW: (resizableElement[i].getBoundingClientRect().width * 100) / resizableElement[i].parentElement.getBoundingClientRect().width
                        };
                        elSize[i] = size;
                    }
                });
                localStorage.setItem(memoryName + 'Size', JSON.stringify(elSize));
            }
            else {
                resizableElement.forEach((el, i) => {
                    const percW = (el.getBoundingClientRect().width * 100) / el.parentElement.getBoundingClientRect().width;
                    elSize.push({ id: el.id, percW: percW });
                });
                localStorage.setItem(memoryName + 'Size', JSON.stringify(elSize));
            }
        }
    }
}
export default Resize;
