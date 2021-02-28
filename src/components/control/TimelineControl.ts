import dayjs from 'dayjs';
import { TimelineView } from '../view/timeline/TimelineView';
import TimeStep from '../view/timeline/TimeStep';
import { ISharedState } from './MainControl';

export class TimelineControl {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;

    timelineView: TimelineView;
    timestep: TimeStep;
    sharedState: ISharedState;

    constructor(
        rootElement: HTMLElement,
        sharedState: ISharedState,
        options: { start: dayjs.Dayjs; end: dayjs.Dayjs }
    ) {
        this.sharedState = sharedState;
        this.timestep = this.sharedState.timestep;
        // this.timestep = new TimeStep(dayjs(), dayjs(), 1); // this may not be the optimal default value, please verify if this is ever accessable, even only by accident
        const arg = document.createElement('div');
        const timelineView = new TimelineView(arg, this.timestep);
        rootElement.appendChild(timelineView);
        console.log(timelineView);

        this.start = options.start;
        this.end = options.end;

        timelineView.render(this.start, this.end);

        this.timelineView.oncontextmenu = (event: Event) => event.preventDefault();
    }

    get timeframe() {
        return this.end.diff(this.start);
    }

    centerOnToday() {
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
                console.log(this.timelineView.getBoundingClientRect().width);
                if (a !== undefined && b !== undefined) {
                    const zoom = this.timeframe / (1000 * 10);
                    const factor =
                        <number>b / this.timelineView.getBoundingClientRect().width;
                    a = a > 0 ? 1 : -1;
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
