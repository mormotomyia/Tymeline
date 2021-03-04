import { CustomHTMLElement, CustomNoTemplateHTMLElement } from 'customhtmlbase';
import dayjs from 'dayjs';
import { stringify } from 'node:querystring';
import { ITableData } from '../../../interfaces/IObject';
import { IObservable, Observable } from '../../../observer/Observable';
import { IObserver } from '../../../observer/Observer';
import { DraggedItem } from '../../control/DataControl';
import { CustomButton } from '../../custom-components/customButton';
import { DomItems } from '../../model/DomItems';
import { TableData } from '../../model/TableData';
import { IDataView } from '../../model/ViewPresenter/IDataView';
import { DataViewItem } from './dataViewItem';

@CustomNoTemplateHTMLElement({
    selector: 'data-view',
    useShadow: false,
})
export class MormoDataView extends HTMLElement implements IDataView {
    rows: Array<Array<DataViewItem>> = [[]];
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

    private buildLayers(reusedComponent: DataViewItem) {
        const res = this.rows.some((row: Array<DataViewItem>) => {
            if (
                row.every((value: DataViewItem) => {
                    return value.notOverlap(reusedComponent);
                })
            ) {
                row.push(reusedComponent);
                return true;
            } else {
                return false;
            }
        });

        if (!res) {
            this.rows.push([]);
            this.buildLayers(reusedComponent);
            // console.log(reusedComponent.id);
        }
    }

    render(
        elements: Array<ITableData>,
        selected: Map<string, DraggedItem>,
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ) {
        const heightlevels = 45;

        // console.trace('rendering data');
        this.domItems.clear();

        this.rows = [[]];
        elements.forEach((element) => {
            const reusedComponent = this.reuseDomComponent(element, selected, start, end);
            this.buildLayers(reusedComponent);
        });
        this.rows.forEach((row: Array<DataViewItem>, index) => {
            // console.log(index);
            row.forEach((element) => {
                // console.log(element);
                // console.log(index);
                element.style.top = `${index * 40 + 5}px`;
            });
        });

        // console.log(this.rows);

        // this.domItems.legendMajor.forEach((element: DataViewItem) => {
        //     console.log(elements.find((item) => item.id === element.id));

        // });

        this.domItems.redundantLegendMajor.forEach((element: DataViewItem) => {
            element.unsubscribeAll();
            element.parentNode?.removeChild(element);
        });
        this.domItems.redundantLegendMajor = [];
    }

    private reuseDomComponent(
        element: ITableData,
        selected: Map<string, DraggedItem>,
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ) {
        let reusedComponent: DataViewItem;
        reusedComponent = <DataViewItem>this.domItems.redundantLegendMajor.shift();
        if (!reusedComponent) {
            reusedComponent = new DataViewItem();
            this.appendChild(reusedComponent);
            reusedComponent.subscribe(this);
            // setDefaultStyle(reusedComponent);
        } else {
            reusedComponent.unselect();
        }

        reusedComponent.update(element, start, end);
        if (selected.has(element.id)) {
            reusedComponent.select();
        }
        this.domItems.legendMajor.push(reusedComponent);
        return reusedComponent;
    }
}
