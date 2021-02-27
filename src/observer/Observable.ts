import { IObserver } from './Observer';

export interface IObservable {
    subscribe: Function;
    unsubscribe: Function;
    publish: Function;
}

export class Observable implements IObservable {
    private subscribers: Array<IObserver> = [];
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
