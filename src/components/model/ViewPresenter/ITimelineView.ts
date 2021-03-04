import dayjs from 'dayjs';
import { IObservable } from '../../../observer/Observable';

export interface ITimelineView extends IObservable {
    node: Node;
    getBoundingClientRect(): DOMRect;
    on(key: string, callback: (event: Event) => void): void;
    render(start: dayjs.Dayjs, end: dayjs.Dayjs): void;
    updateScale(start: dayjs.Dayjs, end: dayjs.Dayjs): void;
}
