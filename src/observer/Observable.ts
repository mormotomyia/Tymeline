import { IObserver } from './Observer';

export interface IObservable {
    subscribers: Array<IObserver>;
    subscribe(observer: IObserver): void;
    unsubscribe(observer: IObserver): void;
    publish(keyword: string, data: any): void;
}

export class Observable implements IObservable {
    subscribers: Array<IObserver> = [];

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
}
