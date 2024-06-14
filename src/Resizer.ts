class Resizer {
    private classList: string;

    constructor(option: string) {
        this.classList = option;
    }

    createResizer(element: HTMLElement): HTMLElement {
        const resizer = document.createElement('div');
        resizer.classList.value = this.classList;
        resizer.draggable = false;
        element.insertAdjacentElement('afterend', resizer);
        return resizer;
    }
}

export default Resizer;