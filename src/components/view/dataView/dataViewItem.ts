import { CustomHTMLElement, CustomNoTemplateHTMLElement } from 'customhtmlbase';
import { TableData } from '../../model/TableData';
import dayjs from 'dayjs';
import { ITableData } from '../../../interfaces/IObject';
import { IObservable } from '../../../observer/Observable';
import { IObserver } from '../../../observer/Observer';
import { timeStamp } from 'node:console';

enum ChangeType {
    move = 1,
    change = 2,
    idle = 3,
}

@CustomNoTemplateHTMLElement({
    selector: 'data-view-item',
    useShadow: false,
})
export class DataViewItem extends HTMLElement implements IObservable {
    content: HTMLDivElement;
    canMove = false;
    canChangeLength = false;
    hammerview: HammerManager;
    pullWidth = 30;
    selected = false;
    pristine = true;

    subscribers: Array<IObserver> = [];

    constructor() {
        super();

        this.oncontextmenu = (event) => this.publish('contextMenu', event);
        this.hammerview = new Hammer(this);
        this.onmouseup = (event) => this.mouseDownEvent(<DataViewItem>event.target);
        this.hammerview.on('panstart', (event) => this.publish('panstartitem', event));
        this.hammerview.on('pan', (event) => this.publish('panitem', event));
        this.hammerview.on('panend', (event) => this.publish('panenditem', event));

        //  TODO this needs some way to distinguish between "extending the time" aka making some element longer
        // and "changing the time" aka moving the element around with fixed length.
        // there needs to be a way to support either an both at the same time

        // this needs to be dictated by some value in the model and propagated into this object.
        // set the appropriate events in here.
        // where do I even fire them to?!
        // this does need some more thought! (as of right now this is just a builder class which is reusable but also not well defined)
        this.className = 'mormo-element';
        this.content = document.createElement('div');
        this.content.style.userSelect = 'none';
        this.content.style.pointerEvents = 'none';

        this.onmousemove = this.changeMouseOnEdgeLeftRight;
        this.appendChild(this.content);
    }

    private mouseDownEvent(element: DataViewItem) {
        if (element.classList.contains('selected')) {
            this.publish('onUnselect', element);
        } else {
            this.publish('onSelect', element);
        }
    }

    public update(element: ITableData, start: dayjs.Dayjs, end: dayjs.Dayjs) {
        this.canMove = element.canMove;
        this.canChangeLength = element.canChangeLength;
        this.id = `${element.id}`;
        this.content.innerHTML = element.content.text;

        this.updateTime(element.start, element.end, start, end);
    }

    public updateTime(
        elementStart: dayjs.Dayjs,
        elementEnd: dayjs.Dayjs,
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ) {
        const offset = this.setOffset(elementStart, start, end); //fuck!
        this.style.transform = `translate(${offset}px)`;
        const width = this.setLength(elementStart, elementEnd, start, end); //fuck!
        this.style.width = `${width}px`;
    }

    public subscribe(observer: IObserver) {
        this.subscribers.push(observer);
    }
    public unsubscribe(observer: IObserver) {
        this.subscribers = this.subscribers.filter((el) => {
            return el !== observer;
        });
    }

    public unsubscribeAll() {
        this.subscribers = [];
    }

    public publish(keyword: string, data: any) {
        this.subscribers.forEach((subscriber) => {
            subscriber.emit(keyword, data);
        });
    }

    get HTML() {
        return this;
    }

    select() {
        this.selected = true;
        this.style.borderStyle = 'solid';
        this.classList.add('selected');
        // this.publish('select', this.id);
    }

    unselect() {
        this.selected = false;
        this.style.borderStyle = 'hidden';
        this.classList.remove('selected');
        // this.publish('unselect', this.id);
    }

    private changeMouseOnEdgeLeftRight(event: MouseEvent) {
        const element = <HTMLElement>event.target;
        const offsetLeft = element.getBoundingClientRect().left;
        // if (event.buttons ===)

        if (event.buttons !== 1) {
            element.style.cursor = 'default';

            if (this.canMove) {
                // element.style.cursor = 'grab'
                element.style.cursor = 'grab';
            }
            if (this.canChangeLength) {
                if (element.clientWidth + offsetLeft - event.clientX < this.pullWidth) {
                    element.style.cursor = 'e-resize';
                } else if (
                    element.offsetWidth + offsetLeft - event.clientX >
                    element.offsetWidth - this.pullWidth
                ) {
                    element.style.cursor = 'w-resize';
                }
            }
        }
    }

    private changeStart(event: MouseEvent) {
        console.log(event);
    }

    private changeEnd(event: MouseEvent) {
        console.log(event);
    }

    setOffset(current: dayjs.Dayjs, start: dayjs.Dayjs, end: dayjs.Dayjs) {
        return (
            this.parentElement.getBoundingClientRect().width *
            (current.diff(start) / end.diff(start))
        );
    }

    setLength(
        elementStart: dayjs.Dayjs,
        elementEnd: dayjs.Dayjs,
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ) {
        return Math.ceil(
            (this.parentElement.getBoundingClientRect().width *
                elementEnd.diff(elementStart)) /
                end.diff(start)
        );
    }
}
