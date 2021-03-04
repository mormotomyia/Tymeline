import dayjs from 'dayjs';
import { ITableData } from '../../../interfaces/IObject';
import { IObservable } from '../../../observer/Observable';
import { IObserver } from '../../../observer/Observer';
import { DraggedItem } from '../../control/DataControl';

export interface IDataView extends IObservable, IObserver {
    render(
        elements: Array<ITableData>,
        selected: Map<string, DraggedItem>,
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ): void;
}
