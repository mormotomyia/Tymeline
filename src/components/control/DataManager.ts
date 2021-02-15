import { IBaseTableData, IProps, ITableData, ITableDataEntry } from "../../interfaces/IObject"
import { ComponentCollection } from "../model/ComponentCollection";
import { TimelineView } from "../view/timeline/Timeline";
import { TableData } from "../model/TableData"

export class DataManager{
    tableData: Map<string,TableData> = new Map();
    props: IProps;
    components : ComponentCollection


    constructor(props:IProps,components:ComponentCollection){
        this.components = components
        this.props = props
        this.props.dom.root.appendChild(document.createElement('h3'))
    }


    updateTable(objects:{[key:number]:IBaseTableData}): void
    updateTable(objects:Array<ITableData>) : void

    updateTable(objects:{[key:number]:IBaseTableData} | Array<ITableDataEntry> ){
        console.log(objects)
        this.getVisibleElements()
        if (Array.isArray(objects)){
            objects.forEach((element) => {
            if (element.length)
            this.tableData.set(element.id.toString(),
            new TableData(element.id,element.content,element.start,element.length)
            )
            if (element.end)
            this.tableData.set(element.id.toString(),
                    new TableData(element.id,element.content,element.start,element.end)
                )
            })
        }   
        else{
            Object.entries(objects).forEach((e) => {
                const element= e[1]
                if (element.length)
                this.tableData.set(e[0],
                new TableData(e[0],element.content,element.start,element.length)
                )
                if (element.end)
                this.tableData.set(e[0],
                    new TableData(e[0],element.content,element.start,element.end))
            })
        }

        console.log(this.tableData)
    }

    setTable(objects:{[key:number]:IBaseTableData}): void
    setTable(objects:Array<ITableData>) : void

    setTable(objects:{[key:number]:IBaseTableData} | Array<ITableDataEntry> ){
        this.tableData.clear()
        this.updateTable(objects)
    }


    render():void{
        this.getVisibleElements()
    }

    private getVisibleElements():Map<string,TableData>{
        this.tableData.forEach((value,key,map) => {
            // console.log(value)
            // console.log(this.components.timeLine!.start)
            // console.log( value.start > this.components.timeLine!.end)
            // console.log(value.end < this.components.timeLine!.start)
            
            // console.log(this.components.timeLine?.range)
            if (value.end < this.components.timeLine!.start || value.start > this.components.timeLine!.end){
                // this item is not visible!
                console.log(value)
            }

        })
        return this.tableData;
    }
}