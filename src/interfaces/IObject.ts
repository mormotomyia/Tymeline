import dayjs from 'dayjs';
import { DomItems } from '../components/model/DomItems';

export interface IDomItems {
    legendMajor: Array<HTMLElement>;
    // legendMinor: Array<HTMLElement>
    redundantLegendMajor: Array<HTMLElement>;
    // redundantLegendMinor: Array<HTMLElement>
}

export interface IProps {
    domItems: DomItems;
    dom: { [key: string]: HTMLElement };
}
export interface IBaseTableData {
    start: dayjs.Dayjs;
    end?: dayjs.Dayjs;
    length?: number;
    content: { text: string };
    canMove: boolean;
    canChangeLength: boolean;
}
export interface ITableDataEntry extends IBaseTableData {
    id: string | number;
}

export interface ITableData {
    canMove: boolean;
    canChangeLength: boolean;
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    id: string | number;
    content: { text: string };
    length: number;

    move(delta: number): void;
    changeLength(delta: number, start: boolean): void;
}
