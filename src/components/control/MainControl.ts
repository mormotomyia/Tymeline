import dayjs, { Dayjs } from 'dayjs';

import { ITableData } from '../../interfaces/IObject';
import { IObservable, Observable } from '../../observer/Observable';
import { IObserver, Observer } from '../../observer/Observer';
import { CustomButton } from '../custom-components/customButton';
import { TableData } from '../model/TableData';
import { IMainControl } from '../mormoTable';
import { IDataService } from '../services/DataService';
import { MormoDataView } from '../view/dataView/dataView';
import { MainView } from '../view/mainView';
import { TimelineView } from '../view/timeline/TimelineView';
import { TimeStep } from '../view/timeline/TimeStep';
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
}

export interface ITimelineControl {
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
}

export interface IContextMenuControl extends IObserver {
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

    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor(
        mainView: IMainView,
        contextMenuControl: IContextMenuControl,
        timelineControl: ITimelineControl,
        dataControl: IDataControl
    ) {
        this.mainView = mainView;
        this.mainView.subscribe(this);

        // this needs to be moved to the respective control points?

        this.timelineControl = timelineControl;
        this.dataControl = dataControl;

        this.contextMenuControl = contextMenuControl;

        this.dataControl.subscribe(this);
        // this.timelineControl
    }

    emit(keyword: string, event: HammerInput | Event): void {
        switch (keyword) {
            case 'tap':
                if (event.target != null) {
                    const target = <HTMLElement>event.target;

                    if (target.tagName == 'DATA-VIEW') {
                        if (this.contextMenuControl.visible) {
                            this.contextMenuControl.hide();
                        }
                        this.dataControl.emit('removeSelection', null);
                    }
                }
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
            case 'contextMenu':
                event.preventDefault();
                // console.log('open Contextmenu');
                this.contextMenuControl.setContextMenu(<MouseEvent>event);
                break;
            default:
                break;
        }
    }

    dragStart(event: HammerInput) {
        console.log(event.isFirst);
        this.deltaX = 0;
    }

    dragEnd(_: any) {}

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
        // console.log(event.offsetX);
        // console.log(event.deltaY);
        this.timelineControl.updateScale('zoom', event.deltaY, event.offsetX);
        this.render();
    }

    render() {
        this.mainView.render();
        this.timelineControl.render();
        this.dataControl.render(this.timelineControl.start, this.timelineControl.end);
    }

    setTable(argument: Array<ITableData>) {
        this.dataControl.setTable(argument);
    }

    updateTable(argument: Array<ITableData>) {
        this.dataControl.updateTable(argument);
    }
}
