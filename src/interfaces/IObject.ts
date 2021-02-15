import dayjs from "dayjs";
import { TimelineDomItems } from "../components/model/DomItems";

export interface IDomItems{
    foreground : HTMLElement|null
    legendMajor: Array<HTMLElement>
    legendMinor: Array<HTMLElement>
    redundantLegendMajor: Array<HTMLElement>
    redundantLegendMinor: Array<HTMLElement>
}

export interface IProps{
    domItems:TimelineDomItems
    dom:{[key: string]: HTMLElement};
}
export interface IBaseTableData{
    start: dayjs.Dayjs;
    end?: dayjs.Dayjs;
    length?: number;
    content: { text: string; };
}
export interface ITableDataEntry extends IBaseTableData{
    id: string | number;
}


export interface  ITableData{
    start: dayjs.Dayjs;
    end : dayjs.Dayjs;
    id: string | number;
    content: { text: string; };
}



