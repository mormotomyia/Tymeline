import { CustomNoTemplateHTMLElement } from 'customhtmlbase';
import { IObservable, Observable } from '../../observer/Observable';
import { IObserver } from '../../observer/Observer';
import { CustomButton } from '../custom-components/customButton';

@CustomNoTemplateHTMLElement({
    selector: 'main-view',
    useShadow: false,
})
export class MainView extends HTMLElement implements IObservable {
    subscribers: Array<IObserver> = [];
    constructor(root: HTMLElement, tableOptions?: any) {
        super();
        // if (root.nodeName !== 'DIV') {
        //     const basediv = document.createElement('div');
        //     root.appendChild(basediv);
        //     root = basediv;
        // }
        root.appendChild(this);
        // this.rootElement = root;
        this.styleItem(tableOptions);

        this.addEvents();
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

    addEvents() {
        // FIXME THESE EVENTS NEED TO BE IN THE MAINVIEW AND NEED TO BE BUBBLED UP TO THIS COMPONENT VIA THE OBSERVABLE!

        const hammerview = new Hammer(this);
        hammerview.on('pan', (event) => this.publish('pan', event));
        hammerview.on('panstart', (event) => this.publish('panstart', event));
        hammerview.on('panend', (event) => this.publish('panend', event));
        this.onwheel = (event) => this.publish('onwheel', event);
    }

    private styleItem(tableOptions?: any) {
        this.classList.add('mormo-timeline');
        this.style.display = 'block';
        // this.timeContainer.style.position = 'absolute';
        // this.timeContainer.style.bottom = '0';
        // this.timeContainer.style.left = '0';
        // this.timeContainer.style.height = '50px';
        // this.timeContainer.style.width =
        //     '-moz-available'; /* WebKit-based browsers will ignore this. */
        // this.timeContainer.style.width =
        //     '-webkit-fill-available'; /* Mozilla-based browsers will ignore this. */
        // this.timeContainer.style.width = 'fill-available';
        // this.timeContainer.style.border = 'solid';
        // this.timeContainer.style.borderWidth = 'thin';
        // this.timeContainer.style.borderTopWidth = 'thick';
        // this.timeContainer.style.overflow = 'hidden';

        if (tableOptions) {
            this.style.width = `${tableOptions.size.width}px`;
            this.style.height = `${tableOptions.size.height}px`;

            if (tableOptions.colorschema) {
                this.style.color = `${tableOptions.colorschema.text}`;
                this.style.backgroundColor = `${tableOptions.colorschema.background}`;
                // this.timeContainer.style.borderColor = `${tableOptions.colorschema.borders}`;
            }
        }
    }

    render() {
        // this doesnt do anything.
        // this component is just scaffolding to hold the child views
    }
}
