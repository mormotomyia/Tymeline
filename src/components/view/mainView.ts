import { CustomNoTemplateHTMLElement } from 'customhtmlbase';
import { time } from 'node:console';
import { IObservable, Observable } from '../../observer/Observable';
import { IObserver } from '../../observer/Observer';
import { IMainView } from '../control/MainControl';
import { CustomButton } from '../custom-components/customButton';
import { IDataView } from '../model/ViewPresenter/IDataView';
import { ITimelineView } from '../model/ViewPresenter/ITimelineView';

@CustomNoTemplateHTMLElement({
    selector: 'main-view',
    useShadow: false,
})
export class MainView extends HTMLElement implements IMainView {
    subscribers: Array<IObserver> = [];
    constructor() {
        super();
        this.oncontextmenu = (event) => event.preventDefault();
        this.addEvents();
    }

    setContainer(container: HTMLElement) {
        container.appendChild(this);
        return this;
    }

    addOptions(options: any) {
        this.styleItem(options);
        return this;
    }

    addDataView(dataView: IDataView) {
        this.appendChild(dataView.asHtmlElement());
        // dataView.asHtmlElement().style.height = '500px';
        return this;
    }

    addTimelineView(timelineView: ITimelineView) {
        this.append(timelineView.node);
        return this;
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

    private addEvents() {
        // FIXME THESE EVENTS NEED TO BE IN THE MAINVIEW AND NEED TO BE BUBBLED UP TO THIS COMPONENT VIA THE OBSERVABLE!

        const hammerview = new Hammer(this);
        this.onmousedown = (event) => this.publish('tap', event);
        hammerview.on('pan', (event) => this.publish('pan', event));
        hammerview.on('panstart', (event) => this.publish('panstart', event));
        hammerview.on('panend', (event) => this.publish('panend', event));
        this.onwheel = (event) => this.publish('onwheel', event);
    }

    private styleItem(tableOptions?: any) {
        this.classList.add('mormo-timeline');
        this.style.display = 'block';

        if (tableOptions) {
            this.style.position = 'relative';
            // this.style.marginLeft = '50px';
            // this.style.marginTop = '50px';
            this.style.width = `${tableOptions.size.width}px`;
            this.style.height = `${tableOptions.size.height}px`;

            if (tableOptions.colorschema) {
                this.style.color = `${tableOptions.colorschema.text}`;
                this.style.backgroundColor = `${tableOptions.colorschema.background}`;
            }
        }
    }

    render() {
        // this doesnt do anything.
        // this component is just scaffolding to hold the child views
    }
}
