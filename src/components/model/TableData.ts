
import {  ITableData } from "../../interfaces/IObject";
import { } from "../../interfaces/ITableOptions";
import { } from "../view/timeline/TimelineView";
import dayjs from "dayjs";
import { type } from "node:os";






export class TableData implements ITableData {
    id: string | number;
    // length: number;

    start: dayjs.Dayjs;
    end:dayjs.Dayjs
    content: { text: string; };

    static fromLength(id:number|string,content:{text:string},start:number|string|dayjs.Dayjs,length:number):TableData{
        if (typeof(start)==='number'){
            start = dayjs(start)
        } else if (typeof(start)==='string'){
            start = dayjs(start)
        } else {
            start = start
        }
        const end = start.add(length,'second')
        return new TableData(id,content,start,end)


    } 




    // constructor(id:number|string,content:{text:string},start:number|string|dayjs.Dayjs,length:number)
    constructor(id:number|string,content:{text:string},start:number|string|dayjs.Dayjs,end:number|string|dayjs.Dayjs){

        if (typeof(start)==='number'){
            this.start = dayjs(start)
        } else if (typeof(start)==='string'){
            this.start = dayjs(start)
        } else {
            this.start = start
        }

        // console.log(length,end)
        
       
        if (typeof(end)==='number'){
            this.end = dayjs(end)
        } else if (typeof(end)==='string'){
            this.end = dayjs(end)
        } else {
            this.end = end
        } 
        

        this.id = id;
        this.content = content;
    }
}











