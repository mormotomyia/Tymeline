import { CustomHTMLElement } from 'customhtmlbase';
import dialogPolyfill from 'dialog-polyfill';
import { IObservable } from '../../../observer/Observable';
import { IObserver } from '../../../observer/Observer';
import { ContextMenuControl } from '../../control/ContextMenuControl';
import { CustomButton, CustomSubMenuButton } from '../../custom-components/customButton';

export interface IContextMenuView extends IObservable, IObserver {
    visible: boolean;
    subMenu: IContextMenuView | undefined;
    rootElement: HTMLElement;
    setMenu(
        x: number,
        y: number,
        args: Array<{ name: string; kind: typeof CustomButton }>
    ): void;
    hide(): void;
    renderDialog(content: string, id: string): void;
    renderSubMenu(content: string, id: string): void;
}

@CustomHTMLElement({
    selector: 'contextmenu-view',
    template: '<div>',
    useShadow: false,
    style: '',
})
export class ContextMenuView extends HTMLElement implements IContextMenuView {
    dialog: HTMLDialogElement;
    visible = false;
    subMenu: IContextMenuView | undefined;

    // contextMenu: HTMLDivElement = document.createElement('div');
    rootElement: HTMLElement;
    subscribers: Array<IObserver> = [];

    constructor(rootElement: HTMLElement) {
        super();
        this.dialog = document.createElement('dialog');
        dialogPolyfill.registerDialog(this.dialog);
        this.rootElement = rootElement;
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

    setMenu(
        x: number,
        y: number,
        args: Array<{ name: string; kind: typeof CustomButton }>
    ) {
        this.createContextMenu(args);
        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
        this.rootElement.appendChild(this);
        this.visible = true;
    }

    emit(keyword: string, data: any): void {
        this.publish(keyword, data);
    }

    hide() {
        if (this.rootElement.getElementsByTagName('contextmenu-view').length !== 0)
            this.rootElement.removeChild(this);
        this.hideDialog();
        this.visible = false;
        this.rootElement.removeChild(this);
    }

    fireOnContext(event: MouseEvent) {}

    private createContextMenu(
        buttons: Array<{
            name: string;
            kind: typeof CustomButton | typeof CustomSubMenuButton;
        }>
    ) {
        this.className = 'context-menu';
        this.style.width = 'inherit';
        const contextmenuItems = [];
        buttons.forEach((element) => {
            const item = new element.kind(element.name);
            item.className = 'context-button';
            item.hammerEvents.on('tap', (event) =>
                this.publish(`tap${event.target.innerText}`, event)
            );
            this.append(item);
            // contextmenuItems.push(new element.kind(element.name));
        });

        this.style.zIndex = '999';
        this.style.display = 'block';
        // this.contextMenu.style.height = '200px'
        this.style.width = '120px';
        this.style.backgroundColor = 'rgb(240,240,240)';
        this.style.borderRadius = '2px';
        this.style.position = 'absolute';
        this.style.boxShadow = '5px 5px 5px rgb(150,150,150)';
        this.style.height = `${buttons.length * 34}px`; // 136 // 102 // 68

        //34 // 36
    }

    renderSubMenu(content: string, id: string) {
        if (this.subMenu) {
            console.log(this.subMenu);
            this.subMenu.hide();
            this.subMenu = undefined;

            // delete this.subMenu;
        } else {
            this.subMenu = new ContextMenuView(this);
            // this.subMenu.setMenu([{ name: 'Info', kind: CustomButton }]);
            // this.subMenu.subscribe(this);
            // this.appendChild(this.subMenu);
        }
    }

    renderDialog(content: string, id: string) {
        // here I probably need different Dialogs but lets see

        const template = `<div><h2>${content}</h2> ${id} </div>`;
        this.dialog.innerHTML = template;
        this.appendChild(this.dialog);
        this.dialog.show();
    }
}
