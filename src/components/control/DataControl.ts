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

export interface DraggedItem {
    dom: DataViewItem;
    data: ITableData;
    tempStart: dayjs.Dayjs;
    tempEnd: dayjs.Dayjs;
}
export class DataControl implements IObservable, IObserver {
    tableData: Map<string, TableData> = new Map();
    dataView: MormoDataView;
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

    get timeframe() {
        if (this.start && this.end) {
            return this.end.diff(this.start);
        }
        return 0;
    }

    public emit(keyword: string, data: any) {
        this.publish(keyword, data);
        switch (keyword) {
            case 'onSelect':
                this.onSelect(<HammerInput>data);
                break;
            // case 'select':
            //     this.addSelection(<HammerInput>data);
            //     break;
            // case 'unselect':
            //     this.removeSelection(<HammerInput>data);
            //     break;
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

    onSelect(event: HammerInput) {
        const data = <TableData>this.tableData.get(event.target.id);
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
    removeSelection() {
        this.selected.forEach((value) => value.dom.unselect());
        this.selected.clear();
    }

    dragItemStart(event: HammerInput) {
        this.deltaX = 0;
        const target = <DataViewItem>event.target;
        if (!target.selected) {
            target.select();
        }
        console.log('GRABBING');
    }

    dragItem(event: HammerInput) {
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
            (value) => value.data?.canMove === true
        );
        // console.log(arr);
        arr.forEach((value) => this.moveItem(value, delta));
    }

    resizeLeft(delta: number) {
        Array.from(this.selected.values())
            .filter((value) => value.data?.canChangeLength === true)
            .forEach((value) => this.resizeItemLeft(value, delta));
    }
    resizeRight(delta: number) {
        Array.from(this.selected.values())
            .filter((value) => value.data?.canChangeLength === true)
            .forEach((value) => this.resizeItemRight(value, delta));
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

    dragItemEnd(event: HammerInput) {
        this.selected.forEach((value: DraggedItem) => {
            if (
                value.data?.canMove &&
                (event.target.style.cursor === 'grab' ||
                    event.target.style.cursor === 'grabbing')
            ) {
                const snappedStart = snap(
                    value.tempStart,
                    this.timestep.scale,
                    this.timestep.step
                );

                const offset = value.data.start.diff(snappedStart, 'seconds');
                console.log(offset);
                value.dom.updateTime(
                    snappedStart,
                    snappedStart.add(value.data.length, 'second'),
                    this.start,
                    this.end
                );
                value.data?.move(-offset);
                value.tempStart = value.data.start;
                value.tempEnd = value.data.end;
            } else if (
                value.data?.canChangeLength &&
                event.target.style.cursor === 'e-resize'
            ) {
                // right
                const snappedEnd = snap(
                    value.tempEnd,
                    this.timestep.scale,
                    this.timestep.step
                );

                if (snappedEnd.diff(value.tempStart, 'second') > 0) {
                    console.log('ASD');
                    value.dom.updateTime(
                        value.tempStart,
                        snappedEnd,
                        this.start,
                        this.end
                    );
                    value.data.changeLength(
                        snappedEnd.diff(value.tempStart, 'second'),
                        false
                    );
                }
            } else if (
                value.data?.canChangeLength &&
                event.target.style.cursor === 'w-resize'
            ) {
                // left
                const snappedStart = snap(
                    value.tempStart,
                    this.timestep.scale,
                    this.timestep.step
                );

                if (value.tempEnd.diff(snappedStart, 'second') > 0) {
                    console.log('aaasda');
                    value.dom.updateTime(
                        snappedStart,
                        value.tempEnd,
                        this.start,
                        this.end
                    );
                    value.data.changeLength(
                        value.tempEnd.diff(snappedStart, 'second'),
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

    updateTable(objects: { [key: number]: IBaseTableData }): void;
    updateTable(objects: Array<ITableDataEntry>): void;

    updateTable(objects: { [key: number]: IBaseTableData } | Array<ITableDataEntry>) {
        console.log(objects);
        if (Array.isArray(objects)) {
            objects.forEach((element) => {
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
            });
        } else {
            Object.entries(objects).forEach((e) => {
                const element = e[1];
                if (element.length)
                    this.tableData.set(
                        e[0],
                        TableData.fromLength(
                            e[0],
                            element.content,
                            element.start,
                            element.length,
                            element.canMove,
                            element.canChangeLength
                        )
                    );
                if (element.end)
                    this.tableData.set(
                        e[0],
                        new TableData(
                            e[0],
                            element.content,
                            element.start,
                            element.end,
                            element.canMove,
                            element.canChangeLength
                        )
                    );
            });
        }

        console.log(this.tableData);
    }

    setTable(objects: { [key: number]: IBaseTableData }): void;
    setTable(objects: Array<ITableDataEntry>): void;

    setTable(objects: { [key: number]: IBaseTableData } | Array<ITableDataEntry>) {
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
