import { DomItems } from "../components/DomItems";

export interface IDomItems{
    foreground : HTMLElement|null
    legendMajor: Array<HTMLElement>
    legendMinor: Array<HTMLElement>
    redundantLegendMajor: Array<HTMLElement>
    redundantLegendMinor: Array<HTMLElement>
}

export interface IObject{
    domItems:DomItems
    dom:{[key: string]: HTMLElement};
}
export interface IBaseTableData{
    length: number;
    start: number;
    content: { text: string; };
}
export interface ITableData extends IBaseTableData{
    id: string | number;
}



