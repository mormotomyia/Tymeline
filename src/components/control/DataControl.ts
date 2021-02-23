import { IBaseTableData, IProps, ITableData, ITableDataEntry } from "../../interfaces/IObject"
import { TableData } from "../model/TableData"
import dayjs from "dayjs";
import { MormoDataView } from "../view/dataView/dataView";
import { IObservable } from "../../observer/Observable";
import { IObserver } from "../../observer/Observer";
import { DataViewItem } from "../view/dataView/dataViewItem";
import { off } from "hammerjs";

export class DataControl implements IObservable,IObserver{
    tableData: Map<string,TableData> = new Map();
    dataView: MormoDataView;
    subscribers: Array<IObserver> = [];
    draggedItem: {dom:DataViewItem, data:ITableData|undefined} | undefined;
    deltaX = 0;
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    tempStart:dayjs.Dayjs;
    tempEnd:dayjs.Dayjs;


    constructor(rootElement:HTMLElement){
        this.dataView = new MormoDataView(rootElement);
        this.dataView.subscribe(this)
    }


    get timeframe(){
        if(this.start&&this.end){
            return this.end.diff(this.start)
        }
        return 0;
    }

    public emit(keyword:string, data:any){
        this.publish(keyword, data);
        switch (keyword) {
            case "panstartitem":
                this.dragItemStart(<HammerInput>data)
                break;
            case "panitem":
                this.dragItem(<HammerInput>data)
                break;
            case "panenditem":
                this.dragItemEnd(<HammerInput>data);
                break;
    }
}



    dragItemStart(event:HammerInput){
        this.deltaX = 0;

        if(!event.target.selected){
            event.target.select(event)
        }
        
        this.draggedItem = {dom:<DataViewItem>event.target,data: this.tableData.get(event.target.id)}
        this.tempStart = this.draggedItem.data.start
        this.tempEnd = this.draggedItem.data.end
        
    }

    dragItem(event:HammerInput){
        
        let deltaX = event.deltaX;
        deltaX -= this.deltaX;
        // console.log(deltaX)
        
        if (this.draggedItem?.data!.canMove && this.draggedItem?.dom.style.cursor=== 'ew-resize' ){
            const delta = deltaX * this.timeframe/(1000*1000)*0.7 // this is the total offset time!
            
            this.tempStart = this.tempStart.add(delta,"second")
            this.tempEnd = this.tempEnd.add(delta,"second")
            this.draggedItem.dom.updateTime(this.tempStart,this.tempEnd,this.start,this.end)
            this.deltaX += deltaX;


    }
}

    dragItemEnd(event:HammerInput){
        (this.draggedItem?.data!.canMove && this.draggedItem?.dom.style.cursor=== 'ew-resize' ){
            const offset = this.tempStart.diff(this.draggedItem!.data!.start,'seconds')
            console.log(offset)
            this.draggedItem?.data?.move(offset)
        }
        this.publish('changed',this.draggedItem)
        delete this.draggedItem


    }

    
    public subscribe(observer:IObserver) {
        //we could check to see if it is already subscribed
        this.subscribers.push(observer);
        console.log(`${observer} "has been subscribed`);
    }
    public unsubscribe(observer:IObserver) {
        this.subscribers = this.subscribers.filter((el) => {
            return el !== observer;
        });
    }
    public publish(keyword:string,data:any) {
        this.subscribers.forEach((subscriber) => {
            subscriber.emit(keyword, data);
        });
    }


    updateTable(objects:{[key:number]:IBaseTableData}): void
    updateTable(objects:Array<ITableDataEntry>) : void

    updateTable(objects:{[key:number]:IBaseTableData} | Array<ITableDataEntry> ){
        console.log(objects)
        if (Array.isArray(objects)){
            objects.forEach((element) => {
            if (element.length)
            this.tableData.set(element.id.toString(),
                TableData.fromLength(element.id,element.content,element.start,element.length,element.canMove,element.canChangeLength)
            )
            if (element.end)
            this.tableData.set(element.id.toString(),
                new TableData(element.id,element.content,element.start,element.end,element.canMove,element.canChangeLength)
                )
            })
        }   
        else{
            Object.entries(objects).forEach((e) => {
                const element= e[1]
                if (element.length)
                this.tableData.set(e[0],
                TableData.fromLength(e[0],element.content,element.start,element.length,element.canMove,element.canChangeLength)
                )
                if (element.end)
                this.tableData.set(e[0],
                    new TableData(e[0],element.content,element.start,element.end,element.canMove,element.canChangeLength))
            })
        }

        console.log(this.tableData)
    }

    setTable(objects:{[key:number]:IBaseTableData}): void
    setTable(objects:Array<ITableDataEntry>) : void

    setTable(objects:{[key:number]:IBaseTableData} | Array<ITableDataEntry> ){
        this.tableData.clear()
        this.updateTable(objects)
    }


    render(start:dayjs.Dayjs,end:dayjs.Dayjs):void{
        const elements:Array<ITableData> = this.getVisibleElements(start,end)
        this.dataView.render(elements,start,end);
    }

    private getVisibleElements(start:dayjs.Dayjs,end:dayjs.Dayjs):Array<ITableData>{
        this.start = start;
        this.end = end;

        const visibleData:Array<ITableData> = []
        this.tableData.forEach((value) => {
            // eslint-disable-next-line no-empty
            if (value.end < start || value.start > end){
                
            }
            else{
                visibleData.push(value)
                
            }

        })
        return visibleData;
    }
}

