import {
    CustomElement,
    CustomHTMLElement,
    CustomNoTemplateHTMLElement,
} from 'customhtmlbase';

@CustomNoTemplateHTMLElement({
    selector: 'custom-button',

    useShadow: false,
    extender: 'button',
})
export class CustomButton extends HTMLButtonElement {
    constructor(template: string) {
        super();
        // console.log(this.style);
        this.innerHTML = `${template}`;
        this.style.backgroundColor = 'white';
        this.style.border = 'none';
        this.style.width = 'inherit';
        this.style.height = '2vw';
        this.style.margin = '2px 0 2px 0';
    }

    setTemplate() {
        console.log(this);
        // this.children[1].innerHTML = template
    }
}

@CustomNoTemplateHTMLElement({
    selector: 'custom-submenu-button',
    useShadow: false,
    extender: 'button',
})
export class CustomSubMenuButton extends HTMLButtonElement {
    constructor(template: string) {
        super();
        // console.log(this.style);
        this.innerHTML = `${template}`;
        // this.style.content = ' \\00A7';
        this.style.backgroundColor = 'white';
        this.style.border = 'none';
        this.style.width = 'inherit';
        this.style.height = '2vw';
        this.style.margin = '2px 0 2px 0';
    }

    setTemplate() {
        console.log(this);
        // this.children[1].innerHTML = template
    }
}
