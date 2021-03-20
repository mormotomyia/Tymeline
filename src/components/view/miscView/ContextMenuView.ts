import { CustomHTMLElement, CustomNoTemplateHTMLElement } from 'customhtmlbase';
import dialogPolyfill from 'dialog-polyfill';
import { timeStamp } from 'node:console';
import { ITableData } from '../../../interfaces/IObject';
import { IObservable } from '../../../observer/Observable';
import { IObserver } from '../../../observer/Observer';
import { ContextMenuControl, IContextMenuView } from '../../control/ContextMenuControl';
import { ISharedState } from '../../control/MainControl';
import {
    CustomButton,
    CustomButtonBase,
    CustomSubMenuButton,
} from '../../custom-components/customButton';
import {
    DialogComponent,
    DialogComponentContainer,
} from '../../custom-components/DialogComponents';

@CustomNoTemplateHTMLElement({
    selector: 'contextmenu-view',

    useShadow: false,
})
export class ContextMenuView extends HTMLElement implements IContextMenuView {
    dialog: DialogComponentContainer;
    visible = false;
    sharedstate: ISharedState;

    // contextMenu: HTMLDivElement = document.createElement('div');
    rootElement: HTMLElement;
    subscribers: Array<IObserver> = [];

    constructor(rootElement: HTMLElement, sharedState: ISharedState) {
        super();
        this.sharedstate = sharedState;
        this.rootElement = rootElement;
        this.dialog = new DialogComponentContainer();
        this.appendChild(this.dialog);
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
        viewOptions: Map<
            string,
            { kind: typeof CustomButtonBase; dialog: typeof DialogComponent }
        >
    ) {
        this.createContextMenu(viewOptions);
    }

    emit(keyword: string, data: any): void {
        this.publish(keyword, data);
    }

    render(x: number, y: number) {
        this.rootElement.appendChild(this);
        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
        this.visible = true;
    }

    hide() {
        console.log('hide context ');
        if (this.visible) {
            this.dialog.hide();
            this.visible = false;
            this.rootElement.removeChild(this);
        }
    }

    fireOnContext(event: MouseEvent) {
        console.log(event);
    }

    private createContextMenu(
        viewOptions: Map<
            string,
            { kind: typeof CustomButtonBase; dialog: typeof DialogComponent }
        >
    ) {
        this.className = 'context-menu';
        this.style.width = 'inherit';
        viewOptions.forEach((value, key) => {
            const item = new value.kind(key);
            item.className = 'context-button';
            item.hammerEvents.on('tap', (event) =>
                this.publish(`tap${event.target.innerText}`, event)
            );
            this.append(item);
        });

        this.style.zIndex = '999';
        this.style.display = 'block';
        // this.contextMenu.style.height = '200px'
        this.style.width = '120px';
        this.style.backgroundColor = 'rgb(240,240,240)';
        this.style.borderRadius = '2px';
        this.style.position = 'absolute';
        this.style.boxShadow = '5px 5px 5px rgb(150,150,150)';
        this.style.height = `${viewOptions.size * 34}px`; // 136 // 102 // 68

        //34 // 36
    }

    renderDialog(template: typeof DialogComponent, id: string) {
        // here I probably need different Dialogs but lets see
        console.log('render dialog');
        console.log(this.sharedstate);
        const contextItem = this.sharedstate.visibleElements.filter(
            (element: ITableData) => element.id === id
        );
        this.dialog.render(template, id, contextItem[0]);

        // this.appendChild(this.dialog);
    }
}
