import { ITableData } from '../../interfaces/IObject';
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

export interface IDraggedItem {
    dom: DataViewItem;
    id: string;
    canMove: boolean;
    canChangeLength: boolean;
    tempStart: dayjs.Dayjs;
    tempEnd: dayjs.Dayjs;
    originalEnd: dayjs.Dayjs;
    originalStart: dayjs.Dayjs;
    length: number;
}

export class DraggedItem implements IDraggedItem {
    dom: DataViewItem;
    id: string;
    tempStart: dayjs.Dayjs;
    tempEnd: dayjs.Dayjs;
    canMove: boolean;
    canChangeLength: boolean;
    originalEnd: dayjs.Dayjs;
    originalStart: dayjs.Dayjs;

    constructor(
        dom: DataViewItem,
        id: string,
        canMove: boolean,
        canChangeLength: boolean,
        tempStart: dayjs.Dayjs,
        tempEnd: dayjs.Dayjs
    ) {
        this.dom = dom;
        this.id = id;
        this.tempStart = tempStart;
        this.tempEnd = tempEnd;
        this.canMove = canMove;
        this.canChangeLength = canChangeLength;
        this.originalEnd = tempEnd;
        this.originalStart = tempStart;
    }

    get length(): number {
        return this.originalEnd.diff(this.originalStart, 'seconds');
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

    selected: Map<string, IDraggedItem> = new Map();

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
            this.selected.set(
                event.target.id,
                new DraggedItem(
                    <DataViewItem>event.target,
                    data.id,
                    data.canMove,
                    data.canChangeLength,
                    data.start,
                    data.end
                )
            );
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
        const delta = ((deltaX * this.timeframe) / (1000 * 1000)) * 0.7; // this is the total offset time!

        switch (event.target.style.cursor) {
            case 'grab':
                this.move(delta);
                break;
            case 'grabbing':
                this.move(delta);
                break;
            case 'e-resize':
                this.resizeRight(delta);
                break;
            case 'w-resize':
                this.resizeLeft(delta);
                break;
            default:
                break;
        }

        this.deltaX += deltaX;
    }

    private move(delta: number) {
        console.log(this.selected);

        const arr = Array.from(this.selected.values()).filter(
            (draggedItem) => draggedItem.canMove === true
        );
        arr.forEach((draggedItem) => this.moveItem(draggedItem, delta));
    }

    private resizeLeft(delta: number) {
        Array.from(this.selected.values())
            .filter((draggedItem) => draggedItem.canChangeLength === true)
            .forEach((draggedItem) => this.resizeItemLeft(draggedItem, delta));
    }
    private resizeRight(delta: number) {
        Array.from(this.selected.values())
            .filter((draggedItem) => draggedItem.canChangeLength === true)
            .forEach((draggedItem) => this.resizeItemRight(draggedItem, delta));
    }

    private resizeItemLeft(value: IDraggedItem, delta: number) {
        value.tempStart = value.tempStart.add(delta, 'second');
        const snappedStart = snap(
            value.tempStart,
            this.timestep.scale,
            this.timestep.step
        );
        value.dom.updateTime(snappedStart, value.tempEnd, this.start, this.end);
    }
    private resizeItemRight(value: IDraggedItem, delta: number) {
        value.tempEnd = value.tempEnd.add(delta, 'second');
        const snappedEnd = snap(value.tempEnd, this.timestep.scale, this.timestep.step);
        value.dom.updateTime(value.tempStart, snappedEnd, this.start, this.end);
    }

    private moveItem(value: IDraggedItem, delta: number) {
        value.tempStart = value.tempStart.add(delta, 'second');
        value.tempEnd = value.tempEnd.add(delta, 'second');

        const snappedStart = snap(
            value.tempStart,
            this.timestep.scale,
            this.timestep.step
        );

        value.dom.updateTime(
            snappedStart,
            snappedStart.add(
                value.originalEnd.diff(value.originalStart, 'seconds'),
                'second'
            ),
            this.start,
            this.end
        );
    }

    private grab(event: HammerInput, draggedItem: IDraggedItem): boolean {
        return (
            draggedItem.canMove &&
            (event.target.style.cursor === 'grab' ||
                event.target.style.cursor === 'grabbing')
        );
    }

    private moveRight(event: HammerInput, draggedItem: IDraggedItem): boolean {
        return draggedItem.canChangeLength && event.target.style.cursor === 'e-resize';
    }
    private moveLeft(event: HammerInput, draggedItem: IDraggedItem): boolean {
        return draggedItem.canChangeLength && event.target.style.cursor === 'w-resize';
    }

    private dragItemEnd(event: HammerInput) {
        this.selected.forEach((draggedItem: IDraggedItem) => {
            if (this.grab(event, draggedItem)) {
                const snappedStart = snap(
                    draggedItem.tempStart,
                    this.timestep.scale,
                    this.timestep.step
                );

                const offset = draggedItem.originalStart.diff(snappedStart, 'seconds');

                // draggedItem.dom.updateTime(
                //     snappedStart,
                //     snappedStart.add(draggedItem.length, 'second'),
                //     this.start,
                //     this.end
                // );
                this.tableData.get(draggedItem.id)?.move(-offset);
                // draggedItem.tempStart = draggedItem.start;
                // draggedItem.tempEnd = draggedItem.end;
            } else if (this.moveRight(event, draggedItem)) {
                // right
                const snappedEnd = snap(
                    draggedItem.tempEnd,
                    this.timestep.scale,
                    this.timestep.step
                );

                if (snappedEnd.diff(draggedItem.tempStart, 'second') > 0) {
                    console.log('ASD');
                    // draggedItem.dom.updateTime(
                    //     draggedItem.tempStart,
                    //     snappedEnd,
                    //     this.start,
                    //     this.end
                    // );
                    this.tableData
                        .get(draggedItem.id)
                        ?.changeLength(
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
                    // draggedItem.dom.updateTime(
                    //     snappedStart,
                    //     draggedItem.tempEnd,
                    //     this.start,
                    //     this.end
                    // );
                    this.tableData
                        .get(draggedItem.id)
                        ?.changeLength(
                            draggedItem.tempEnd.diff(snappedStart, 'second'),
                            true
                        );
                    console.log(this.tableData.get(draggedItem.id)?.start.format());
                    console.log(this.tableData.get(draggedItem.id)?.end.format());
                }
            }

            // const selection = new Map();
            // this.selected.forEach((data: IDraggedItem, key: string) => {
            //     selection.set(
            //         event.target.id,
            //         new DraggedItemm(
            //             <DataViewItem>event.target,
            //             data.id,
            //             data.canMove,
            //             data.canChangeLength,
            //             data.tempStart,
            //             data.tempEnd
            //         )
            //     );
            // });
            // this.selected = selection;
        });
        this.selected.forEach((value: IDraggedItem) => this.publish('changed', value));
        const sel: Array<string> = [];
        this.selected.forEach((_, key) => sel.push(key));
        this.removeSelection();
        sel.forEach((key: string) => {
            const data = <ITableData>this.tableData.get(event.target.id);
            console.log('AAA');
            this.selected.set(
                key,
                new DraggedItem(
                    <DataViewItem>event.target,
                    data.id,
                    data.canMove,
                    data.canChangeLength,
                    data.start,
                    data.end
                )
            );
        });
        this.render(this.start, this.end);
        this.selected.forEach((value: IDraggedItem) => {
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
