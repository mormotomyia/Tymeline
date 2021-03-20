import { CustomHTMLElement, CustomNoTemplateHTMLElement } from 'customhtmlbase';
import { timeStamp } from 'node:console';
import { ITableData } from '../../interfaces/IObject';
import { IObservable } from '../../observer/Observable';
import { IObserver } from '../../observer/Observer';

export interface IDialogComponent {
    ElementId: string | undefined;
}

@CustomNoTemplateHTMLElement({
    selector: 'dialog-container',
    useShadow: false,
})
export class DialogComponentContainer extends HTMLElement implements IObservable {
    template: DialogComponent | undefined = undefined;

    constructor() {
        super();
        this.style.display = 'none';
    }

    subscribers: Array<IObserver> = [];

    public subscribe(observer: IObserver) {
        //we could check to see if it is already subscribed
        this.subscribers.push(observer);
        console.log(`${observer} "has been subscribed`);
    }
    public unsubscribe(observer: IObserver) {
        this.subscribers = this.subscribers.filter((el) => {
            return el !== observer;
        });
    }
    public publish(keyword: string, data: any) {
        this.subscribers.forEach((subscriber) => {
            subscriber.emit(keyword, data);
        });
    }

    render(template: typeof DialogComponent, id: string, contextItem: ITableData) {
        if (this.template === undefined) {
            this.template = new template(id, contextItem);
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
    ElementId: string;
    contextItem: ITableData;
    workingItem: ITableData;
    text!: HTMLInputElement;
    constructor(id: string, contextItem: ITableData) {
        super();
        this.ElementId = id;
        this.contextItem = contextItem;
        this.workingItem = Object.assign({}, this.contextItem);
    }

    render() {
        this.style.textAlign = 'center';
        this.style.display = 'inherit';
        this.style.position = 'inherit';
        this.style.backgroundColor = 'inherit';
        this.style.borderRadius = 'inherit';
        this.style.height = 'inherit';
        this.style.width = 'inherit';
        // time.oninput = (event) => this.change(event);
    }

    change(event: Event) {
        console.log(event);
    }
}

@CustomNoTemplateHTMLElement({
    selector: 'custom-info-dialog',
    useShadow: false,
})
export class DataInfoDialog extends DialogComponent {
    form!: HTMLFormElement;
    time!: HTMLInputElement;
    date!: HTMLInputElement;
    submit!: HTMLInputElement;
    constructor(id: string, contextItem: ITableData) {
        super(id, contextItem);
        console.log(this.contextItem);
        // this.ElementId = id;
        // this.contextItem = contextItem
    }

    render() {
        super.render();
        this.form = document.createElement('form');
        this.time = document.createElement('input');
        this.date = document.createElement('input');
        this.text = document.createElement('input');
        this.submit = document.createElement('input');
        this.form.appendChild(this.time);
        this.form.appendChild(this.date);
        this.form.appendChild(this.text);
        this.form.appendChild(this.submit);
        this.appendChild(this.form);
        this.submit.value = 'Submit';
        this.submit.type = 'Submit';
        this.time.type = 'time';
        this.form.onsubmit = (event) => {
            event.preventDefault(), console.log(event);
        };
        this.text.oninput = (event) => this.change(event);
        this.time.oninput = (event) => this.change(event);
        this.date.oninput = (event) => this.change(event);
        this.time.setAttribute(
            'value',
            this.workingItem.start.format().split('T')[1].split('+')[0]
        );
        this.date.type = 'date';
        // date.value = this.workingItem.start.format().split('T')[0];
        this.date.setAttribute('value', this.workingItem.start.format().split('T')[0]);

        // this.innerHTML = this.innerHTML + 'Data Info';
    }
}

@CustomNoTemplateHTMLElement({
    selector: 'custom-modify-dialog',

    useShadow: false,
})
export class DataModifyDialog extends DialogComponent {
    ElementId: string;
    constructor(id: string, contextItem: ITableData) {
        super(id, contextItem);
        this.ElementId = id;
    }
}
@CustomNoTemplateHTMLElement({
    selector: 'custom-delete-dialog',

    useShadow: false,
})
export class DataDeleteDialog extends DialogComponent {
    ElementId: string;
    constructor(id: string, contextItem: ITableData) {
        super(id, contextItem);
        this.ElementId = id;
    }
}
@CustomNoTemplateHTMLElement({
    selector: 'custom-align-dialog',

    useShadow: false,
})
export class DataAlignDialog extends DialogComponent {
    ElementId: string;
    constructor(id: string, contextItem: ITableData) {
        super(id, contextItem);
        this.ElementId = id;
    }
}
