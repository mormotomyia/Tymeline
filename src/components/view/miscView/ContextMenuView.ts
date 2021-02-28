import { CustomHTMLElement } from 'customhtmlbase';
import dialogPolyfill from 'dialog-polyfill';
import { IObservable } from '../../../observer/Observable';
import { IObserver } from '../../../observer/Observer';
import { CustomButton, CustomSubMenuButton } from '../../custom-components/customButton';

@CustomHTMLElement({
    selector: 'contextmenu-view',
    template: '<div>',
    useShadow: false,
    style: '',
})
export class ContextMenuView extends HTMLElement implements IObservable {
    dialog: HTMLDialogElement;
    visible: boolean;
    setMenu(x: number, y: number) {
        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
    }
    // contextMenu: HTMLDivElement = document.createElement('div');
    rootElement: HTMLElement;
    subscribers: Array<IObserver> = [];

    constructor(rootElement: HTMLElement) {
        super();
        this.dialog = document.createElement('dialog');
        dialogPolyfill.registerDialog(this.dialog);
        this.rootElement = rootElement;

        this.rootElement.oncontextmenu = (event: MouseEvent) => this.fireOnContext(event);
    }
    public subscribe(observer: IObserver) {
        this.subscribers.push(observer);
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

    toggleMenu = (command: string) => {
        if (command === 'show') {
            this.rootElement.appendChild(this);
            this.visible = true;
        } else {
            if (this.rootElement.getElementsByTagName('contextmenu-view').length !== 0)
                this.rootElement.removeChild(this);
            this.hideDialog();
            this.visible = false;
        }
    };

    fireOnContext = (event: MouseEvent) => {
        this.publish('contextMenu', event);
    };

    createContextMenu() {
        this.className = 'context-menu';
        this.style.width = 'inherit';

        const info = new CustomButton('Info');
        const modify = new CustomButton('Change');
        const del = new CustomButton('Delete');
        const align = new CustomSubMenuButton('Align');

        info.hammerEvents.on('tap', (event) => this.publish('tapInfo', event));
        modify.hammerEvents.on('tap', (event) => this.publish('tapModify', event));
        del.hammerEvents.on('tap', (event) => this.publish('tapDel', event));
        align.hammerEvents.on('tap', (event) => this.publish('tapAlign', event));
        // this.hammerview.on('tap', this.onSelect.bind(this));

        // align.onclick = console.log;
        // const alignMenu = new ContextMenuView(this);

        info.className = 'context-button';
        modify.className = 'context-button';
        del.className = 'context-button';
        align.className = 'context-button';
        this.appendChild(info);
        this.appendChild(modify);
        this.appendChild(del);
        this.appendChild(align);

        this.style.zIndex = '999';
        this.style.display = 'block';
        // this.contextMenu.style.height = '200px'
        this.style.width = '120px';
        this.style.backgroundColor = 'rgb(240,240,240)';
        this.style.borderRadius = '2px';
        this.style.position = 'absolute';
        this.style.boxShadow = '5px 5px 5px rgb(150,150,150)';
    }

    renderInfoDialog() {}
    renderModifyDialog() {}
    renderDeleteDialog() {}

    renderDialog(content: string, id: string) {
        // here I probably need different Dialogs but lets see

        const template = `<div><h2>${content}</h2> ${id} </div>`;
        this.dialog.innerHTML = template;
        this.appendChild(this.dialog);
        this.dialog.show();
    }

    hideDialog() {
        if (this.dialog.open) this.dialog.close();
        // this.dialog.setAttribute('open', 'none');
    }
}
