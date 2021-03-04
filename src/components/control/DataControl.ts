import {
    IBaseTableData,
    IProps,
    ITableData,
    ITableDataEntry,
} from '../../interfaces/IObject';
import { TableData } from '../model/TableData';
import dayjs from 'dayjs';
import { MormoDataView } from '../view/dataView/dataView';
import { IObservable } from '../../observer/Observable';
import { IObserver } from '../../observer/Observer';
import { DataViewItem } from '../view/dataView/dataViewItem';
import { snap } from '../../util/snap';
import { ISharedState } from './MainControl';
import TimeStep from '../view/timeline/TimeStep';
import { IDataView } from '../model/ViewPresenter/IDataView';
import { completeAssign } from '../../util/assign';

export interface DraggedItem {
    dom: DataViewItem;
    data: ITableData;
    tempStart: dayjs.Dayjs;
    tempEnd: dayjs.Dayjs;
}

export class DraggedItemm {
    dom: DataViewItem;
    id: string;
    tempStart: dayjs.Dayjs;
    tempEnd: dayjs.Dayjs;

    constructor(
        dom: DataViewItem,
        id: string,
        tempStart: dayjs.Dayjs,
        tempEnd: dayjs.Dayjs
    ) {
        this.dom = dom;
        this.id = id;
        this.tempStart = tempStart;
        this.tempEnd = tempEnd;
    }
}

export interface IDataControl extends IObservable, IObserver {
    render(start: dayjs.Dayjs, end: dayjs.Dayjs): void;
}
export class DataControl implements IDataControl {
    tableData: Map<string, TableData> = new Map();
    dataView: IDataView;
    subscribers: Array<IObserver> = [];
    deltaX = 0;

    selected: Map<string, DraggedItem> = new Map();

    start: dayjs.Dayjs = dayjs();
    end: dayjs.Dayjs = dayjs();
    sharedState: ISharedState;
    timestep: TimeStep;

    constructor(rootElement: HTMLElement, sharedState: ISharedState) {
        this.sharedState = sharedState;
        this.timestep = this.sharedState.timestep;
        this.dataView = new MormoDataView(rootElement);
        this.dataView.subscribe(this);
    }

    public subscribe(observer: IObserver) {
        //we could check to see if it is already subscribed
        this.subscribers.push(observer);
        console.log(`${observer} "has been subscribed`);
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

    public emit(keyword: string, data: any) {
        this.publish(keyword, data);
        switch (keyword) {
            case 'removeSelection':
                this.removeSelection();
                break;
            case 'onSelect':
                this.onSelect(<HammerInput>data);
                break;
            case 'panstartitem':
                this.dragItemStart(<HammerInput>data);
                break;
            case 'panitem':
                this.dragItem(<HammerInput>data);
                break;
            case 'panenditem':
                this.dragItemEnd(<HammerInput>data);
                break;
        }
    }

    get timeframe() {
        if (this.start && this.end) {
            return this.end.diff(this.start);
        }
        return 0;
    }

    private onSelect(event: HammerInput) {
        console.log(this.tableData);
        const data = <ITableData>this.tableData.get(event.target.id);

        const target = <DataViewItem>event.srcEvent.target;
        if (this.selected.has(event.target.id)) {
            // pass
            target.unselect();
            this.selected.delete(event.target.id);
        } else {
            this.selected.set(event.target.id, {
                dom: <DataViewItem>event.target,
                data: data,
                tempStart: data.start,
                tempEnd: data.end,
            });
            target.select();
        }
        console.log(`selected ${event.target.id}`);
        console.log(this.selected);
    }
    public removeSelection() {
        this.selected.forEach((value) => value.dom.unselect());
        this.selected.clear();
    }

    private dragItemStart(event: HammerInput) {
        this.deltaX = 0;
        const target = <DataViewItem>event.target;
        if (!target.selected) {
            target.select();
        }
        console.log('GRABBING');
    }

    private dragItem(event: HammerInput) {
        let deltaX = event.deltaX;
        deltaX -= this.deltaX;
        // console.log(deltaX)

        // console.log(event.target.style.cursor);
        const delta = ((deltaX * this.timeframe) / (1000 * 1000)) * 0.7; // this is the total offset time!
        console.log(event.target.style.cursor);
        // console.log(this.selected);
        switch (event.target.style.cursor) {
            case 'grab':
                // console.log('a');
                this.move(delta);
                break;
            case 'grabbing':
                // console.log('a');
                this.move(delta);
                break;
            case 'e-resize':
                // console.log('a');
                this.resizeRight(delta);
                break;
            case 'w-resize':
                console.log('a');
                this.resizeLeft(delta);
                break;
            default:
                break;
        }

        this.deltaX += deltaX;
    }

    private move(delta: number) {
        const arr = Array.from(this.selected.values()).filter(
            (draggedItem) => draggedItem.data?.canMove === true
        );
        arr.forEach((draggedItem) => this.moveItem(draggedItem, delta));
    }

    private resizeLeft(delta: number) {
        Array.from(this.selected.values())
            .filter((draggedItem) => draggedItem.data?.canChangeLength === true)
            .forEach((draggedItem) => this.resizeItemLeft(draggedItem, delta));
    }
    private resizeRight(delta: number) {
        Array.from(this.selected.values())
            .filter((draggedItem) => draggedItem.data?.canChangeLength === true)
            .forEach((draggedItem) => this.resizeItemRight(draggedItem, delta));
    }

    private resizeItemLeft(value: DraggedItem, delta: number) {
        value.tempStart = value.tempStart.add(delta, 'second');
        const snappedStart = snap(
            value.tempStart,
            this.timestep.scale,
            this.timestep.step
        );
        value.dom.updateTime(snappedStart, value.tempEnd, this.start, this.end);
    }
    private resizeItemRight(value: DraggedItem, delta: number) {
        value.tempEnd = value.tempEnd.add(delta, 'second');
        const snappedEnd = snap(value.tempEnd, this.timestep.scale, this.timestep.step);
        value.dom.updateTime(value.tempStart, snappedEnd, this.start, this.end);
    }

    private moveItem(value: DraggedItem, delta: number) {
        // console.log(value.tempStart);
        value.tempStart = value.tempStart.add(delta, 'second');
        value.tempEnd = value.tempEnd.add(delta, 'second');

        const snappedStart = snap(
            value.tempStart,
            this.timestep.scale,
            this.timestep.step
        );

        value.dom.updateTime(
            snappedStart,
            snappedStart.add(value.data.length, 'second'),
            this.start,
            this.end
        );
    }

    private grab(event: HammerInput, draggedItem: DraggedItem): boolean {
        return (
            draggedItem.data?.canMove &&
            (event.target.style.cursor === 'grab' ||
                event.target.style.cursor === 'grabbing')
        );
    }

    private moveRight(event: HammerInput, draggedItem: DraggedItem): boolean {
        return (
            draggedItem.data?.canChangeLength && event.target.style.cursor === 'e-resize'
        );
    }
    private moveLeft(event: HammerInput, draggedItem: DraggedItem): boolean {
        return (
            draggedItem.data?.canChangeLength && event.target.style.cursor === 'w-resize'
        );
    }

    private dragItemEnd(event: HammerInput) {
        this.selected.forEach((draggedItem: DraggedItem) => {
            if (this.grab(event, draggedItem)) {
                const snappedStart = snap(
                    draggedItem.tempStart,
                    this.timestep.scale,
                    this.timestep.step
                );

                const offset = draggedItem.data.start.diff(snappedStart, 'seconds');

                draggedItem.dom.updateTime(
                    snappedStart,
                    snappedStart.add(draggedItem.data.length, 'second'),
                    this.start,
                    this.end
                );
                draggedItem.data?.move(-offset);
                draggedItem.tempStart = draggedItem.data.start;
                draggedItem.tempEnd = draggedItem.data.end;
            } else if (this.moveRight(event, draggedItem)) {
                // right
                const snappedEnd = snap(
                    draggedItem.tempEnd,
                    this.timestep.scale,
                    this.timestep.step
                );

                if (snappedEnd.diff(draggedItem.tempStart, 'second') > 0) {
                    console.log('ASD');
                    draggedItem.dom.updateTime(
                        draggedItem.tempStart,
                        snappedEnd,
                        this.start,
                        this.end
                    );
                    draggedItem.data.changeLength(
                        snappedEnd.diff(draggedItem.tempStart, 'second'),
                        false
                    );
                }
            } else if (this.moveLeft(event, draggedItem)) {
                // left
                const snappedStart = snap(
                    draggedItem.tempStart,
                    this.timestep.scale,
                    this.timestep.step
                );

                if (draggedItem.tempEnd.diff(snappedStart, 'second') > 0) {
                    console.log('aaasda');
                    draggedItem.dom.updateTime(
                        snappedStart,
                        draggedItem.tempEnd,
                        this.start,
                        this.end
                    );
                    draggedItem.data.changeLength(
                        draggedItem.tempEnd.diff(snappedStart, 'second'),
                        true
                    );
                }
            }
            this.selected.forEach((value: DraggedItem) => this.publish('changed', value));
        });
        this.render(this.start, this.end);
        this.selected.forEach((value: DraggedItem) => {
            value.dom.style.cursor = 'grab';
        });
    }

    private updateTableItem(element: ITableData) {
        if (element.length)
            this.tableData.set(
                element.id.toString(),
                TableData.fromLength(
                    element.id,
                    element.content,
                    element.start,
                    element.length,
                    element.canMove,
                    element.canChangeLength
                )
            );
        if (element.end)
            this.tableData.set(
                element.id.toString(),
                new TableData(
                    element.id,
                    element.content,
                    element.start,
                    element.end,
                    element.canMove,
                    element.canChangeLength
                )
            );
    }

    private updateTable(objects: Array<ITableData>) {
        objects.forEach((element) => {
            this.updateTableItem(element);
        });

        console.log(this.tableData);
    }

    private setTable(objects: Array<ITableData>) {
        this.tableData.clear();

        this.updateTable(objects);
    }

    render(start: dayjs.Dayjs, end: dayjs.Dayjs): void {
        this.sharedState.visibleElements = this.getVisibleElements(start, end);
        this.dataView.render(this.sharedState.visibleElements, this.selected, start, end);
    }

    private getVisibleElements(start: dayjs.Dayjs, end: dayjs.Dayjs): Array<ITableData> {
        this.start = start;
        this.end = end;

        const visibleData: Array<ITableData> = [];
        this.tableData.forEach((value) => {
            // eslint-disable-next-line no-empty
            if (value.end < start || value.start > end) {
            } else {
                visibleData.push(value);
            }
        });

        return visibleData;
    }
}
