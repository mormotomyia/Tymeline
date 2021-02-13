export interface IObject{
    [key: string]: HTMLElement;
}
export interface IBaseTableData{
    length: number;
    start: number;
    content: { text: string; };
}
export interface ITableData extends IBaseTableData{
    id: string | number;
}

