import { CustomHTMLElement, CustomNoTemplateHTMLElement } from 'customhtmlbase';
import dayjs from 'dayjs';
import { stringify } from 'node:querystring';
import { ITableData } from '../../../interfaces/IObject';
import { IObservable, Observable } from '../../../observer/Observable';
import { IObserver } from '../../../observer/Observer';
import { IDraggedItem } from '../../control/DataControl';
import { CustomButton } from '../../custom-components/customButton';
import { DomItems } from '../../model/DomItems';
import { Layer } from '../../model/Layer';
import { TableData } from '../../model/TableData';
import { IDataView } from '../../model/ViewPresenter/IDataView';
import { DataViewItem } from './dataViewItem';

@CustomNoTemplateHTMLElement({
    selector: 'data-view',
    useShadow: false,
})
export class MormoDataView extends HTMLElement implements IDataView {
    rows: Array<Layer> = [];
    domItems: DomItems;
    // styleFunc?: () => void;
    subscribers: Array<IObserver> = [];

    constructor(styleFunc?: () => void) {
        super();
        this.domItems = new DomItems();
        // this.style.height = `${rootElement.getBoundingClientRect().height - 50}px`;
        this.style.overflowY = 'auto';
        this.style.overflowX = 'hidden';
        this.style.display = 'block';
        this.style.height = 'inherit';
        this.className = 'mormo-items';

        // this.styleFunc = styleFunc;
        if (styleFunc) styleFunc();
    }

    asHtmlElement() {
        return this;
    }

    emit(keyword: string, data: any) {
        switch (keyword) {
            case 'panitem':
                this.insertIntoLayer(<DataViewItem>data.target, this.rows);
                this.renderLayers();

                break;
        }
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

    private insertIntoLayer(element: DataViewItem, layers: Array<Layer>) {
        const couldNotInsert = layers.every((layer) => {
            if (layer.canInsert(element)) {
                layer.insert(element);
                return false;
            }
            return true;
        });

        if (couldNotInsert) {
            const layer = new Layer();
            layer.insert(element);
            layers.push(layer);
        }
    }

    private buildLayers(items: DataViewItem[]) {
        items
            .sort((a, b) => {
                return a.getBoundingClientRect().right - b.getBoundingClientRect().right;
            })
            .reverse();
        items.sort((a, b) => {
            return a.getBoundingClientRect().left - b.getBoundingClientRect().left;
        });

        this.rows = [];

        items.forEach((item) => this.insertIntoLayer(item, this.rows));
    }

    render(
        elements: Array<ITableData>,
        selected: Map<string, IDraggedItem>,
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ) {
        console.log('render');

        this.domItems.clear();

        const reusedComponents = elements.map((element) => {
            return this.reuseDomComponent(element, selected, start, end);
        });
        this.buildLayers(reusedComponents);
        this.renderLayers();

        this.domItems.redundantLegendMajor.forEach((element: DataViewItem) => {
            element.unsubscribeAll();
            element.parentNode?.removeChild(element);
        });
        this.domItems.redundantLegendMajor = [];
    }

    private renderLayers() {
        this.rows.forEach((row: Layer, index) => {
            row.elements.forEach((element) => {
                // console.log(element.id);
                element.style.top = `${index * 40 + 5}px`;
            });
        });
    }

    private reuseDomComponent(
        element: ITableData,
        selected: Map<string, IDraggedItem>,
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ) {
        let dataComponent: DataViewItem;
        dataComponent = <DataViewItem>this.domItems.redundantLegendMajor.shift();
        if (!dataComponent) {
            dataComponent = new DataViewItem();
            this.appendChild(dataComponent);
            dataComponent.subscribe(this);
        } else {
            dataComponent.unselect();
        }

        dataComponent.update(element, start, end);
        if (selected.has(element.id)) {
            dataComponent.select();
        }
        this.domItems.legendMajor.push(dataComponent);
        return dataComponent;
    }
}
