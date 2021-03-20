import { CustomHTMLElement, CustomNoTemplateHTMLElement } from 'customhtmlbase';

export interface IDialogComponent {
    ElementId: string | undefined;
}

@CustomNoTemplateHTMLElement({
    selector: 'dialog-container',
    useShadow: false,
})
export class DialogComponentContainer extends HTMLElement {
    template: DialogComponent | undefined = undefined;
    constructor() {
        super();
        this.style.display = 'none';
    }

    render(template: typeof DialogComponent, id: string) {
        if (this.template === undefined) {
            this.template = new template(id);
            this.template.render();
            this.appendChild(this.template);
            this.style.left = '30vw';
            this.style.top = '10vw';
            this.style.display = 'block';
            this.style.position = 'fixed';
            this.style.backgroundColor = 'white';
            this.style.borderRadius = '5px';
            this.style.height = '40vw';
            this.style.width = '40vw';
            this.style.boxShadow = '2px 2px 2px  2px rgb(55,55,55)';
        }
    }

    hide() {
        this.style.display = 'none';
        if (this.template !== undefined) this.removeChild(this.template);
        this.template = undefined;
    }
}

export class DialogComponent extends HTMLElement implements IDialogComponent {
    ElementId: string | undefined = undefined;

    constructor(id: string) {
        super();
    }
    render() {
        this.innerHTML = this.ElementId ? this.ElementId : 'empty';
        this.style.textAlign = 'center';
        this.style.display = 'inherit';
        this.style.position = 'inherit';
        this.style.backgroundColor = 'inherit';
        this.style.borderRadius = 'inherit';
        this.style.height = 'inherit';
        this.style.width = 'inherit';
    }
}

@CustomNoTemplateHTMLElement({
    selector: 'custom-info-dialog',
    useShadow: false,
})
export class DataInfoDialog extends DialogComponent {
    ElementId: string;
    constructor(id: string) {
        super(id);
        this.ElementId = id;
    }

    render() {
        super.render();
        this.innerHTML = this.innerHTML + 'Data Info';
    }
}

@CustomNoTemplateHTMLElement({
    selector: 'custom-modify-dialog',

    useShadow: false,
})
export class DataModifyDialog extends DialogComponent {
    ElementId: string;
    constructor(id: string) {
        super(id);
        this.ElementId = id;
    }
}
@CustomNoTemplateHTMLElement({
    selector: 'custom-delete-dialog',

    useShadow: false,
})
export class DataDeleteDialog extends DialogComponent {
    ElementId: string;
    constructor(id: string) {
        super(id);
        this.ElementId = id;
    }
}
@CustomNoTemplateHTMLElement({
    selector: 'custom-align-dialog',

    useShadow: false,
})
export class DataAlignDialog extends DialogComponent {
    ElementId: string;
    constructor(id: string) {
        super(id);
        this.ElementId = id;
    }
}
