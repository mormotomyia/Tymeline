import dayjs from 'dayjs';
import { ITableData } from '../../interfaces/IObject';
import { IObserver, Observer } from '../../observer/Observer';
import { TableData } from '../model/TableData';
import { MormoDataView } from '../view/dataView/dataView';
import { MainView } from '../view/mainView';
import { TimelineView } from '../view/timeline/TimelineView';
import { TimeStep } from '../view/timeline/TimeStep';
import { ContextMenuControl } from './ContextMenuControl';
import { DataControl } from './DataControl';
import { TimelineControl } from './TimelineControl';

export interface ISharedState {
    timestep: TimeStep;
    visibleElements: Array<ITableData>;
}

export class MainControl implements IObserver {
    mainView: MainView;
    timelineControl: TimelineControl;
    dataControl: DataControl;
    contextMenuControl: ContextMenuControl;
    deltaX = 0;
    draggable = true;
    sharedState: ISharedState;

    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor(root: HTMLElement, options: Object) {
        const dataOptions = {};
        const timelineOptions = {
            ...options,
            start: dayjs().subtract(7, 'day'),
            end: dayjs().add(7, 'day'),
        };

        this.sharedState = {
            timestep: new TimeStep(dayjs(), dayjs(), 1),
            visibleElements: [],
        };

        this.mainView = new MainView(root, options);
        this.mainView.subscribe(this);

        // this needs to be moved to the respective control points?

        this.timelineControl = new TimelineControl(
            this.mainView,
            this.sharedState,
            timelineOptions
        );
        this.dataControl = new DataControl(this.mainView, this.sharedState);
        this.contextMenuControl = new ContextMenuControl(this.mainView, this.sharedState);

        this.dataControl.subscribe(this);
        // this.timelineControl
    }

    emit(keyword: string, data: HammerInput | Event): void {
        switch (keyword) {
            case 'panstartitem':
                console.log('here!');
                this.draggable = false;
                break;
            case 'panitem':
                break;
            case 'panenditem':
                console.log('here?');
                this.draggable = true;
                break;
            case 'pan':
                if (this.draggable) this.drag(<HammerInput>data);
                break;
            case 'panstart':
                if (this.draggable) this.dragStart(<HammerInput>data);
                break;
            case 'panend':
                if (this.draggable) this.dragEnd(<HammerInput>data);
                break;
            case 'onwheel':
                this.changeZoom(<WheelEvent>data);
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

    drag(event: HammerInput) {
        const target = <HTMLElement>event.srcEvent.target;
        if (target.classList.contains('mormo-items')) {
            let deltaX = event.deltaX;
            deltaX -= this.deltaX;
            this.timelineControl.updateScale(
                'linear',
                ((-deltaX * this.timelineControl.timeframe) / (1000 * 1000)) * 0.7
            );
            // this.timeline.updateScale('linear',move *this.timeline.timeframe/(1000*1000)*10)
            this.render();
            this.deltaX += deltaX;
        }
    }

    changeZoom(event: WheelEvent) {
        event.preventDefault();
        this.timelineControl.updateScale('zoom', event.deltaY, event.offsetX);
        this.render();
    }

    render() {
        this.mainView.render();
        this.timelineControl.render();
        this.dataControl.render(this.timelineControl.start, this.timelineControl.end);
    }
}
