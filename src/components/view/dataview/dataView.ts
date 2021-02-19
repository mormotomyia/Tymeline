import { TableData } from "../../model/TableData";

export class MormoDataView{
    rootElement: HTMLDivElement;
    constructor(rootElement:HTMLDivElement){
        this.rootElement =rootElement
    }


    render(elements:Array<TableData>){
        console.log(elements)
    }
}