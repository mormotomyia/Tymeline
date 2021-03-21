import { CustomHTMLElement, CustomNoTemplateHTMLElement } from 'customhtmlbase';
import { timeStamp } from 'node:console';
import { ITableData } from '../../interfaces/IObject';
import { IObservable } from '../../observer/Observable';
import { IObserver } from '../../observer/Observer';
import { IDataService } from '../services/DataService';

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
        this.classList.add('dialog-container');
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

            this.style.display = 'block';
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
    dataService: IDataService;
    constructor(id: string, contextItem: ITableData, dataService: IDataService) {
        super();
        this.ElementId = id;
        this.dataService = dataService;
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

    constructor(id: string, contextItem: ITableData, dataService: IDataService) {
        super(id, contextItem, dataService);
        console.log(this.contextItem);
        // this.ElementId = id;
        // this.contextItem = contextItem
    }

    render() {
        super.render();
        this.form = document.createElement('form');
        this.form.classList.add('dialog-form');
        this.time = document.createElement('input');
        this.time.classList.add('dialog-input');
        this.date = document.createElement('input');
        this.date.classList.add('dialog-input');
        this.text = document.createElement('input');
        this.text.classList.add('dialog-input');
        // this.text.placeholder = '';
        this.text.setAttribute('value', this.workingItem.content.text);
        this.submit = document.createElement('input');
        this.submit.classList.add('dialog-input');

        const p1 = document.createElement('p');
        const p2 = document.createElement('p');
        const p3 = document.createElement('p');
        p1.classList.add('dialog-input');
        p2.classList.add('dialog-input');
        p3.classList.add('dialog-input');
        p1.innerHTML = 'time';
        this.form.appendChild(p1);
        this.form.appendChild(this.time);
        p2.innerHTML = 'date';
        this.form.appendChild(p2);
        this.form.appendChild(this.date);
        p3.innerHTML = 'text';
        this.form.appendChild(p3);

        this.form.appendChild(this.text);
        this.form.appendChild(this.submit);
        this.appendChild(this.form);
        this.submit.value = 'Submit';
        this.submit.type = 'Submit';
        this.time.type = 'time';
        this.form.onsubmit = (event) => {
            event.preventDefault();
            console.log(event);
            this.dataService;
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
    constructor(id: string, contextItem: ITableData, dataService: IDataService) {
        super(id, contextItem, dataService);
        this.ElementId = id;
    }
}
@CustomNoTemplateHTMLElement({
    selector: 'custom-delete-dialog',

    useShadow: false,
})
export class DataDeleteDialog extends DialogComponent {
    ElementId: string;
    constructor(id: string, contextItem: ITableData, dataService: IDataService) {
        super(id, contextItem, dataService);
        this.ElementId = id;
    }
}
@CustomNoTemplateHTMLElement({
    selector: 'custom-align-dialog',

    useShadow: false,
})
export class DataAlignDialog extends DialogComponent {
    ElementId: string;
    constructor(id: string, contextItem: ITableData, dataService: IDataService) {
        super(id, contextItem, dataService);
        this.ElementId = id;
    }
}
