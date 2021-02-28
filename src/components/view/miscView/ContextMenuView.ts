import { CustomHTMLElement } from 'customhtmlbase';
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
    // contextMenu: HTMLDivElement = document.createElement('div');
    rootElement: HTMLElement;
    subscribers: Array<IObserver> = [];

    constructor(rootElement: HTMLElement) {
        super();
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
        console.log(this.rootElement);
        if (command === 'show') {
            this.rootElement.appendChild(this);
        } else {
            this.rootElement.removeChild(this);
        }
        // this.contextMenu.style.display = command === 'show' ? 'block' : 'none';
    };

    fireOnContext = (event: MouseEvent) => {
        this.publish('onContextMenu', { test: 2 });
        const classes: DOMTokenList = event.target.classList;
        event.preventDefault();
        // console.log(classes);
        console.log(this.rootElement);
        if (classes.contains('mormo-element')) {
            this.style.left = `${event.pageX - 5}px`;
            this.style.top = `${event.pageY - 5}px`;
            this.toggleMenu('show');
        }
    };

    createContextMenu() {
        this.className = 'context-menu';
        this.style.width = 'inherit';

        const info = new CustomButton('Info');
        const modify = new CustomButton('Change');
        const del = new CustomButton('Delete');
        const align = new CustomSubMenuButton('Align');
        // align.style.
        // 	22B3
        const alignMenu = new ContextMenuView(this);

        info.className = 'context-button';
        modify.className = 'context-button';
        del.className = 'context-button';
        align.className = 'context-button';
        this.appendChild(info);
        this.appendChild(modify);
        this.appendChild(del);
        this.appendChild(align);

        // this.contextMenu.appendChild(list)

        this.style.zIndex = '999';
        this.style.display = 'block';
        // this.contextMenu.style.height = '200px'
        this.style.width = '120px';
        this.style.backgroundColor = 'rgb(240,240,240)';
        this.style.borderRadius = '2px';
        this.style.position = 'absolute';
        this.style.boxShadow = '5px 5px 5px rgb(150,150,150)';
    }
}
