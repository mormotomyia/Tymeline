import { IBaseTableData, IProps, ITableData, ITableDataEntry } from "../../interfaces/IObject"
import { TableData } from "../model/TableData"
import dayjs from "dayjs";
import { MormoDataView } from "../view/dataView/dataView";

export class DataControl{
    tableData: Map<string,TableData> = new Map();
    dataView: MormoDataView;
    


    constructor(dataview:MormoDataView){
        this.dataView = dataview;
    }


    updateTable(objects:{[key:number]:IBaseTableData}): void
    updateTable(objects:Array<ITableData>) : void

    updateTable(objects:{[key:number]:IBaseTableData} | Array<ITableDataEntry> ){
        console.log(objects)
        if (Array.isArray(objects)){
            objects.forEach((element) => {
            if (element.length)
            this.tableData.set(element.id.toString(),
                TableData.fromLength(element.id,element.content,element.start,element.length)
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
                TableData.fromLength(e[0],element.content,element.start,element.length)
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


    render(start:dayjs.Dayjs,end:dayjs.Dayjs):void{
        const elements = this.getVisibleElements(start,end)
        this.dataView.render(elements,start,end);
    }

    private getVisibleElements(start:dayjs.Dayjs,end:dayjs.Dayjs):Array<TableData>{
        // console.log(start.format(),end.format())

        const visibleData:Array<TableData> = []
        this.tableData.forEach((value) => {
            if (value.end < start || value.start > end){
                
            }
            else{
                visibleData.push(value)
                
            }

        })
        return visibleData;
    }
}

