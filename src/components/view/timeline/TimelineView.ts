import TimeStep from './TimeStep';

import dayjs from 'dayjs';
import { DomItems } from '../../model/DomItems';
import { IObservable, Observable } from '../../../observer/Observable';
import { IObserver } from '../../../observer/Observer';
import { CustomHTMLElement, CustomNoTemplateHTMLElement } from 'customhtmlbase';
import { time } from 'node:console';

const MAX = 1000;
const print = (...args: any) => console.log(args);

export class Transform {
    deltaX: number;
    deltaY: number;
    scale: number;

    constructor(x = 0, y = 0, scale = 1) {
        this.deltaX = x;
        this.deltaY = y;
        this.scale = scale;
    }
}

export const nextTimeScale = { getDay: 'getHours' };

export enum ScaleOptions {
    years = 'getFullYear',
    months = 'getMonth',
    weeks = 'getWeek',
    days = 'getDay',
    hours = 'getHours',
    minutes = 'getMinutes',
    seconds = 'getSeconds',
}

function daysInMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
}

@CustomNoTemplateHTMLElement({
    selector: 'timeline-view',
    useShadow: false,
})
export class TimelineView extends HTMLElement implements IObservable {
    timestep: TimeStep;

    // rootElement: HTMLElement;
    domItems: DomItems;
    subscribers: Array<IObserver> = [];

    constructor(timeContainer: HTMLElement, timestep: TimeStep) {
        super();
        this.timestep = timestep;
        this.style.position = 'absolute';
        this.style.bottom = '0';
        this.style.left = '0';
        this.style.height = '50px';
        this.style.width = '-moz-available'; /* WebKit-based browsers will ignore this. */
        this.style.width =
            '-webkit-fill-available'; /* Mozilla-based browsers will ignore this. */
        this.style.width = 'fill-available';
        this.style.border = 'solid';
        this.style.borderWidth = 'thin';
        this.style.borderTopWidth = 'thick';
        this.style.overflow = 'hidden';
        // this.rootElement = this;
        timeContainer.appendChild(this);
        this.domItems = new DomItems();
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

    updateScale(start: dayjs.Dayjs, end: dayjs.Dayjs) {
        // console.log(this.timeframe)
        // console.log(this.getBoundingClientRect().width);

        const minStep = end.diff(start) / (this.getBoundingClientRect().width / 80);
        const millis = end.diff(start);
        this.timestep.updateScale(
            start.subtract(millis / 10, 'millisecond'),
            end.add(millis / 10, 'millisecond'),
            minStep
        );
    }

    render(start: dayjs.Dayjs, end: dayjs.Dayjs): void {
        let count = 0;
        this.timestep.start();

        this.updateScale(start, end);
        this.domItems.clear();

        while (this.timestep.hasNext() && count < MAX) {
            console.log('asd');
            count++;
            this.timestep.next();
            const isMajor = this.timestep.isMajor();
            const className = this.timestep.getClassName();
            const current = this.timestep.getCurrent();
            // console.log(className)
            this.reuseDomComponent(
                isMajor,
                className,
                current,
                this.timestep.getLabel(current, isMajor),
                start,
                end
            );
        }

        this.domItems.redundantLegendMajor.forEach((element) => {
            element.parentNode?.removeChild(element);
        });

        this.domItems.redundantLegendMajor = [];
    }

    private reuseDomComponent(
        isMajor: boolean,
        classname: string,
        current: dayjs.Dayjs,
        content: string,
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ) {
        let reusedComponent;
        reusedComponent = this.domItems.redundantLegendMajor.shift();

        if (!reusedComponent) {
            const content = document.createElement('div');
            reusedComponent = document.createElement('div');
            reusedComponent.appendChild(content);
            this.appendChild(reusedComponent);
        }

        // TODO this needs some more handling, there could be some scripts in here
        reusedComponent.children[0].innerHTML = `${content}`;
        reusedComponent.className = `${classname}`;
        reusedComponent.classList.add(
            `${isMajor ? 'mormo-time-label' : 'mormo-time-label'}`
        );
        reusedComponent.classList.add('mormo-time-element');
        const offset = this.setOffset(current, start, end); //fuck!
        if (isMajor) {
            reusedComponent.style.transform = `translate(${offset}px,25px)`;
        } else {
            reusedComponent.style.transform = `translate(${offset}px)`;
        }
        this.domItems.legendMajor.push(reusedComponent);

        return reusedComponent;
    }

    private setOffset(current: dayjs.Dayjs, start: dayjs.Dayjs, end: dayjs.Dayjs) {
        return (
            this.getBoundingClientRect().width * (current.diff(start) / end.diff(start))
        );
    }
}
