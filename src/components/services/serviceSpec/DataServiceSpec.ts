import dayjs from 'dayjs';
import { ITableDataEntry } from '../../../interfaces/IObject';

export interface IDataService {
    url: string;
    getTableEntry(): Promise<Array<ITableDataEntry>>;

    getTableEntryById(id: string): Promise<ITableDataEntry>;

    getPartialTableEntry(
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ): Promise<Array<ITableDataEntry>>;

    sendTableEntry(data: Array<ITableDataEntry>): Promise<boolean>;

    updateSingleTableEntry(data: ITableDataEntry): Promise<boolean>;
    createSingleTableEntry(data: ITableDataEntry): Promise<boolean>;
}
