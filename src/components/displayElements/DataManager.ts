import { IBaseTableData, ITableData, ITableDataEntry } from "../../interfaces/IObject"
import { TableData } from "./movableObject"

export class DataManager{
    tableData: Map<string,TableData> = new Map();
    dom: HTMLElement
    constructor(root:HTMLElement){
        this.dom = root
    }


    updateTable(objects:{[key:number]:IBaseTableData}): void
    updateTable(objects:Array<ITableData>) : void

    updateTable(objects:{[key:number]:IBaseTableData} | Array<ITableDataEntry> ){
        console.log(objects)
        
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

    }

    private getVisibleElements():Map<string,TableData>{
        
    }
}