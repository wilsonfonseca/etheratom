export class EtheratomView {
    constructor() {
        this.element = document.createElement;
        this.element = document.createElement('atom-panel');
        let att = document.createAttribute('id');
        att.value = 'etheratom-panel';
        this.element.setAttributeNode(att);
        this.element.classList.add('etheratom-panel');

        this.dispose = this.dispose.bind(this);
        this.getElement = this.getElement.bind(this);
        this.destroy = this.destroy.bind(this);
    }
    getElement() {
        return this.element;
    }
    dispose() {
        this.destroy();
    }
    destroy() {
        return this.element.remove();
    }
}