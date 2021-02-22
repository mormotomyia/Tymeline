
import {  ITableData } from "../../interfaces/IObject";
import { } from "../../interfaces/ITableOptions";
import { } from "../view/timeline/TimelineView";
import dayjs from "dayjs";
import { type } from "node:os";

function log(ev:any) {
    console.log(ev);
   }

// export function createComponentFromItableData(data:ITableData, rootitem: HTMLElement){
//     rootitem.

// }


export class TableData implements ITableData {
    id: string;
    canMove:boolean
    canChangeLength:boolean

    start: dayjs.Dayjs;
    end:dayjs.Dayjs
    content: { text: string; };

    static fromLength(id:number|string,content:{text:string},start:number|string|dayjs.Dayjs,length:number, canMove:boolean, canChangeLength:boolean):TableData{
        if (typeof(start)==='number'){
            start = dayjs(start)
        } else if (typeof(start)==='string'){
            start = dayjs(start)
        }
        const end = start.add(length,'second')
        return new TableData(id,content,start,end,canMove,canChangeLength)
    } 


    // constructor(id:number|string,content:{text:string},start:number|string|dayjs.Dayjs,length:number)
    constructor(id:number|string,content:{text:string},start:number|string|dayjs.Dayjs,end:number|string|dayjs.Dayjs, canMove:boolean, canChangeLength:boolean){

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
        

        this.id = id.toString();
        this.content = content;
        this.canChangeLength = canChangeLength
        this.canMove = canMove
    }
}











