import dayjs, { Dayjs } from 'dayjs';

import { ITableData } from '../../interfaces/IObject';
import { IObservable, Observable } from '../../observer/Observable';
import { IObserver, Observer } from '../../observer/Observer';
import { CustomButton } from '../custom-components/customButton';
import { TableData } from '../model/TableData';
import { IDataView } from '../model/ViewPresenter/IDataView';
import { ITimelineView } from '../model/ViewPresenter/ITimelineView';
import { IMainControl } from '../mormoTable';
import { DataService } from '../services/DataService';
import { IDataService } from '../services/serviceSpec/DataServiceSpec';
import { MormoDataView } from '../view/dataView/dataView';
import { MainView } from '../view/mainView';
import { TimelineView } from '../view/timelineView/TimelineView';
import { TimeStep } from '../view/timelineView/TimeStep';
import { ContextMenuControl, IContextMenuView } from './ContextMenuControl';
import { DataControl } from './DataControl';
import { TimelineControl } from './TimelineControl';

export interface ISharedState {
    timestep: TimeStep;
    visibleElements: Array<ITableData>;
}

export class SharedState implements ISharedState {
    timestep: TimeStep;
    visibleElements: Array<ITableData>;
    constructor() {
        this.timestep = new TimeStep(dayjs(), dayjs(), 1);
        this.visibleElements = [];
    }
}

export interface IMainView extends IObservable, HTMLElement {
    render(): void;
    setContainer(container: HTMLElement): IMainView;
    addOptions(tableOptions?: any): IMainView;
    addDataView(dataView: IDataView): IMainView;
    addTimelineView(timelineView: ITimelineView): IMainView;
}

export interface ITimelineControl {
    AddTimelineView(timelineView: ITimelineView): ITimelineControl;
    AddSharedState(sharedState: SharedState): ITimelineControl;

    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    timeframe: number;
    updateScale(type: 'absolute'): void;
    updateScale(type: 'stepsize'): void;
    updateScale(type: 'linear', a: number): void;
    updateScale(type: 'zoom', a: number, b: number): void;
    updateScale(type: 'linear', a: dayjs.Dayjs, b: dayjs.Dayjs): void;
    render(): void;
}

export interface IDataControl extends IObservable, IObserver {
    setTable(arg: Array<ITableData>): void;
    updateTable(arg: Array<ITableData>): void;
    render(start: dayjs.Dayjs, end: dayjs.Dayjs): void;
    addDataView(dataView: IDataView): IDataControl;
    addSharedState(sharedState: ISharedState): IDataControl;
}

export interface IContextMenuControl extends IObserver {
    addContextMenuView(contextMenuView: IContextMenuView): IContextMenuControl;
    addDataService(dataService: IDataService): IContextMenuControl;
    addSharedState(sharedState: ISharedState): IContextMenuControl;
    setContainer(container: HTMLElement): IContextMenuControl;

    dataService: IDataService;
    visible: boolean;
    contextMenuView: IContextMenuView;
    targetItem: HTMLElement | undefined;
    sharedState: ISharedState;
    setContextMenu(
        event: MouseEvent,
        args?: Array<{ name: string; kind: typeof CustomButton }>
    ): void;
    hide(): void;
}

export class MainControl implements IMainControl {
    mainView: IMainView;
    timelineControl: ITimelineControl;
    dataControl: IDataControl;
    contextMenuControl: IContextMenuControl;
    deltaX = 0;
    draggable = true;

    constructor() {}

    start() {
        this.render();
    }

    addMainView(mainView: IMainView) {
        this.mainView = mainView;
        this.mainView.subscribe(this);
        return this;
    }

    addContextMenuControl(contextMenuControl: IContextMenuControl) {
        this.contextMenuControl = contextMenuControl;
        return this;
    }

    addDataControl(dataControl: IDataControl) {
        this.dataControl = dataControl;
        this.dataControl.subscribe(this);
        return this;
    }

    addTimelineControl(timelineControl: ITimelineControl) {
        this.timelineControl = timelineControl;
        return this;
    }

    public setTable(argument: Array<ITableData>) {
        this.dataControl.setTable(argument);
        this.render();
    }

    public updateTable(argument: Array<ITableData>) {
        this.dataControl.updateTable(argument);
        this.render();
    }

    public emit(keyword: string, event: HammerInput | Event): void {
        switch (keyword) {
            case 'tap':
                this.hideContextMenuOnClick(event);
                break;
            case 'contextMenu':
                event.preventDefault();
                this.contextMenuControl.setContextMenu(<MouseEvent>event);
                break;
            case 'panstartitem':
                this.draggable = false;
                break;
            case 'panitem':
                break;
            case 'panenditem':
                this.draggable = true;
                break;
            case 'pan':
                if (this.draggable) this.drag(<HammerInput>event);
                break;
            case 'panstart':
                if (this.draggable) this.dragStart(<HammerInput>event);
                break;
            case 'panend':
                if (this.draggable) this.dragEnd(<HammerInput>event);
                break;
            case 'onwheel':
                this.changeZoom(<WheelEvent>event);
                break;
            default:
                break;
        }
    }

    private hideContextMenuOnClick(event: HammerInput | Event) {
        if (event.target != null) {
            const target = <HTMLElement>event.target;

            if (target.tagName == 'DATA-VIEW') {
                if (this.contextMenuControl.visible) {
                    this.contextMenuControl.hide();
                }
                this.dataControl.emit('removeSelection', null);
            }
        }
    }

    private dragStart(event: HammerInput) {
        this.deltaX = 0;
    }

    private dragEnd(_: any) {}

    private drag(event: HammerInput) {
        const target = <HTMLElement>event.srcEvent.target;
        if (target.classList.contains('mormo-items')) {
            let deltaX = event.deltaX;
            deltaX -= this.deltaX;
            this.timelineControl.updateScale(
                'linear',
                ((-deltaX * this.timelineControl.timeframe) / (1000 * 1000)) * 0.7
            );
            this.render();
            this.deltaX += deltaX;
        }
    }

    private changeZoom(event: WheelEvent) {
        event.preventDefault();
        this.timelineControl.updateScale('zoom', event.deltaY, event.offsetX);
        this.render();
    }

    private render() {
        console.log(this.timelineControl);
        this.mainView.render();
        this.timelineControl.render();
        this.dataControl.render(this.timelineControl.start, this.timelineControl.end);
    }
}
