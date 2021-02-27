import { CustomHTMLElement } from 'customhtmlbase';
import dayjs from 'dayjs';
import { stringify } from 'node:querystring';
import { ITableData } from '../../../interfaces/IObject';
import { IObservable, Observable } from '../../../observer/Observable';
import { IObserver } from '../../../observer/Observer';
import { CustomButton } from '../../custom-components/customButton';
import { DomItems } from '../../model/DomItems';
import { TableData } from '../../model/TableData';
import { DataViewItem } from './dataViewItem';

export function setDefaultStyle(reusedComponent: HTMLElement) {
    // reusedComponent.style.border ='solid'
    // reusedComponent.style.borderColor ='yellow'

    reusedComponent.style.margin = '5px 2px';
    reusedComponent.style.minHeight = '25px';
    reusedComponent.style.maxHeight = '50px';
    reusedComponent.style.backgroundColor = 'rgba(240,240,240,0.9)';
    reusedComponent.style.color = 'rgb(55,55,55)';
    reusedComponent.style.boxShadow = '2px 2px 2px rgb(55,55,55)';
}

@CustomHTMLElement({
    selector: 'data-view',
    template: '<div>',
    useShadow: false,
    style: '',
})
export class MormoDataView extends HTMLElement implements IObservable, IObserver {
    // rootElement: HTMLElement;
    domItems: DomItems;
    styleFunc?: () => void;
    subscribers: Array<IObserver> = [];

    constructor(rootElement: HTMLElement, styleFunc?: () => void) {
        super();
        this.domItems = new DomItems();
        this.style.height = `${rootElement.getBoundingClientRect().height - 50}px`;
        this.style.overflowY = 'auto';
        this.style.overflowX = 'hidden';
        this.style.display = 'block';
        this.className = 'mormo-items';
        this.styleFunc = styleFunc;
        rootElement.prepend(this);
        // this.rootElement = rootElement
        if (this.styleFunc) this.styleFunc();
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

    render(elements: Array<ITableData>, start: dayjs.Dayjs, end: dayjs.Dayjs) {
        this.domItems.clearLegend();

        elements
            .sort((a, b) => a.end.diff(b.end))
            .sort((a, b) => a.start.diff(b.start))
            .forEach((element) => {
                this.reuseDomComponent(element, start, end);
            });
        this.domItems.redundantLegendMajor.forEach((element) => {
            element.parentNode?.removeChild(element);
        });
        this.domItems.redundantLegendMajor = [];
    }

    reuseDomComponent(element: ITableData, start: dayjs.Dayjs, end: dayjs.Dayjs) {
        let reusedComponent: DataViewItem;
        reusedComponent = <DataViewItem>this.domItems.redundantLegendMajor.shift();
        if (!reusedComponent) {
            reusedComponent = new DataViewItem(this); //FIXME THIS NEEDS TO BE DONE IN SOME BETTER WAY TO ENABLE EVENTS ON THESE OBJECTS TO PROPAGATE.
            reusedComponent.subscribe(this);
            setDefaultStyle(reusedComponent);
        }
        reusedComponent.update(element, start, end);

        // reusedComponent.style.boxShadow = '5px 5px 5px grey;'
        this.domItems.legendMajor.push(reusedComponent);
    }
}
