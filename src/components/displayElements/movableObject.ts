
import {  ITableData } from "../../interfaces/IObject";
import { } from "../../interfaces/ITableOptions";
import { } from "../timeline/Timeline";
import dayjs from "dayjs";
import { type } from "node:os";






export class TableData implements ITableData {
    id: string | number;
    // length: number;

    start: dayjs.Dayjs;
    end:dayjs.Dayjs
    content: { text: string; };

    
    constructor(id:number|string,content:{text:string},start:number|string|dayjs.Dayjs,length:number)
    constructor(id:number|string,content:{text:string},start:number|string|dayjs.Dayjs,end:number|string|dayjs.Dayjs)
    constructor(id:number|string,content:{text:string},start:number|string|dayjs.Dayjs,end?:number|string|dayjs.Dayjs,length?:number,){
        if (typeof(start)==='number'){
            this.start = dayjs(start)
        } else if (typeof(start)==='string'){
            this.start = dayjs(start)
        } else {
            this.start = start
        }
        
        if (length){
            this.end = this.start.add(length/1000,'second')
        } else if(end){
            if (typeof(end)==='number'){
                this.end = dayjs(end)
            } else if (typeof(end)==='string'){
                this.end = dayjs(end)
            } else {
                this.end = end
            } 
        }else{
            this.end = this.start
        }

        this.id = id;
        this.content = content;
    }
}

export class MovableObject{
    constructor(){
    }

    destroy(){

    }
    redraw(){
        
    }
}










