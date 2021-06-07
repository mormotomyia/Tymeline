import { CustomHTMLElement } from 'customhtmlbase';
import { IObserver } from '../../../observer/Observer';
import { ICreationView } from '../../model/ViewPresenter/ICreationView';

@CustomHTMLElement({
    selector: 'creation-view-container',
    template: '<button class="create" id="create">new element</button>',
    style: 'button.create#create{background-color:red}',
    useShadow: false,
    extender: 'div',
})
export class CreationView extends HTMLDivElement implements ICreationView {
    subscribers: any;
    constructor() {
        super();
        this.style.setProperty('width', '50%');
        this.style.setProperty('height', '50%');
        this.style.backgroundColor = 'red';
    }

    setContainer(container: HTMLElement) {
        container.appendChild(this);
        return this;
    }

    emit(keyword: string, data: any) {
        this.publish(keyword, data);
    }

    subscribe(observer: IObserver) {
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

    render() {}
}
