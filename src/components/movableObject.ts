import Component from "./Component";
import {  ITableData } from "../interfaces/IObject";
import { } from "../interfaces/ITableOptions";
import { } from "./Timeline";






export class TableData implements ITableData {
    id: string | number;
    length: number;
    start: number;
    content: { text: string; };
    constructor(id:number|string,length:number,start:number,content:{text:string}){
        this.id = id;
        this.length = length
        this.start = start;
        this.content = content;
    }
}

export class MovableObject extends Component{
    constructor(){
        super()
    }

    destroy(){

    }
    redraw(){
        
    }
}










