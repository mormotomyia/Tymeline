import dayjs from 'dayjs';
import { ITableDataEntry } from '../../../interfaces/IObject';

export interface IDataService {
    url: string;
    getTableEntry(): Promise<Array<ITableDataEntry>>;
    getPartialTableEntry(
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ): Promise<Array<ITableDataEntry>>;
    sendTableEntry(data: Array<ITableDataEntry>): Promise<boolean>;
    sendPartialTableEntry(
        data: Array<ITableDataEntry>,
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ): Promise<boolean>;
}
