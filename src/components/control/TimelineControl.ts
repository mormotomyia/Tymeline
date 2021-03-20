import dayjs from 'dayjs';
import { ITimelineView } from '../model/ViewPresenter/ITimelineView';
import { TimelineView } from '../view/timeline/TimelineView';
import TimeStep from '../view/timeline/TimeStep';
import { ISharedState, ITimelineControl } from './MainControl';

export class TimelineControl implements ITimelineControl {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;

    timelineView: ITimelineView;
    timestep: TimeStep;
    sharedState: ISharedState;

    constructor(
        rootElement: HTMLElement,
        timelineView: ITimelineView,
        sharedState: ISharedState,
        options: { start: dayjs.Dayjs; end: dayjs.Dayjs }
    ) {
        this.timelineView = timelineView;
        this.sharedState = sharedState;
        this.timestep = this.sharedState.timestep;

        const arg = document.createElement('div');

        rootElement.appendChild(this.timelineView.node);
        this.start = options.start;
        this.end = options.end;
        this.timelineView.on('contextmenu', (event: Event) => event.preventDefault());
    }

    get timeframe(): number {
        return this.end.diff(this.start);
    }

    private centerOnToday() {
        const now = dayjs();
        const left = now.subtract(this.timeframe / (1000 * 2), 'second');
        const right = now.add(this.timeframe / (1000 * 2), 'second');

        this.updateScale('linear', left, right);
        this.timelineView.render(left, right);
    }

    updateScale(type: 'absolute'): void;
    updateScale(type: 'stepsize'): void;
    updateScale(type: 'linear', a: number): void;
    updateScale(type: 'zoom', a: number, b: number): void;
    updateScale(type: 'linear', a: dayjs.Dayjs, b: dayjs.Dayjs): void;
    updateScale(type: string, a?: dayjs.Dayjs | number, b?: dayjs.Dayjs | number): void {
        switch (type) {
            case 'absolute':
                break;
            case 'linear':
                if (a && b) {
                    this.start = <dayjs.Dayjs>a;
                    this.end = <dayjs.Dayjs>b;
                } else if (a) {
                    this.start = this.start.add(<number>a, 'second');
                    this.end = this.end.add(<number>a, 'second');
                }
                break;
            case 'zoom':
                // zoom in = negative!

                if (a !== undefined && b !== undefined) {
                    const zoom = this.timeframe / (1000 * 10);

                    const factor =
                        <number>b / this.timelineView.getBoundingClientRect().width;
                    a = a > 0 ? 1 : -1;

                    // console.log(zoom);
                    // console.log(factor);
                    // console.log(-a * zoom * factor);
                    // console.log(a * zoom * (1 - factor));

                    this.start = this.start.add(-a * zoom * factor, 'second');

                    this.end = this.end.add(a * zoom * (1 - factor), 'second');
                }
                break;
            case 'stepsize':
                break;
            default:
                break;
        }
    }

    render() {
        this.timelineView.render(this.start, this.end);
    }

    // start(){
    //     this.initialized = true;
    //     this.root?.appendChild(this.props.dom.root)
    //     this.timeline.updateScale('stepsize');
    //     this.render()
    // }
}
