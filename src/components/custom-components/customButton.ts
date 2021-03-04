import { CustomHTMLElement, CustomNoTemplateHTMLElement } from 'customhtmlbase';
import { extend } from 'dayjs';

export class CustomButtonBase extends HTMLButtonElement {
    hammerEvents: HammerManager;

    constructor(template: string) {
        super();
        this.hammerEvents = new Hammer(<HTMLElement>this);
        this.innerHTML = `${template}`;
        this.style.boxShadow = 'rgb(250,50,250) 0px 2px 0px';
        this.style.backgroundColor = 'white';
        this.style.border = 'none';
        this.style.width = 'inherit';
        this.style.height = '30px';
        this.style.margin = '2px 0 2px 0';
    }
}

@CustomNoTemplateHTMLElement({
    selector: 'custom-button',

    useShadow: false,
    extender: 'button',
})
export class CustomButton extends CustomButtonBase {
    constructor(template: string) {
        super(template);
    }

    setTemplate() {
        console.log(this);
    }
}

@CustomHTMLElement({
    selector: 'custom-submenu-button',
    template: '<i class ="fa fa-caret-right"></i>',
    style: 'i{position:absolute; right:10px}',
    useShadow: false,
    extender: 'button',
})
export class CustomSubMenuButton extends CustomButtonBase {
    constructor(template: string) {
        super(template);
    }

    setTemplate() {
        console.log(this);
        // this.children[1].innerHTML = template
    }
}
