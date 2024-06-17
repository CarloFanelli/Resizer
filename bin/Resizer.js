class Resizer {
    constructor(option) {
        this.classList = option;
    }
    createResizer(element) {
        const resizer = document.createElement('div');
        resizer.classList.value = this.classList;
        resizer.draggable = false;
        element.insertAdjacentElement('afterend', resizer);
        return resizer;
    }
}
export default Resizer;
