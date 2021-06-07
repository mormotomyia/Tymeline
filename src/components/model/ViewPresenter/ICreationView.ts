import { IObservable } from '../../../observer/Observable';
import { IObserver } from '../../../observer/Observer';

export interface ICreationView extends IObservable, IObserver {
    setContainer(container: HTMLElement): ICreationView;
    render(): void;
}
