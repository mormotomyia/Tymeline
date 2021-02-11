import Component from "./Component";
import { IBaseTableData, ITableData } from "./IObject";






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


export interface TableOptions{
    size:{height:number,width:number};
    colorschema?:{background:string,text:string,borders:string}
}


export class TableElement extends Component{
    content: { text: string; };
    id: string | number;
    length: number;

    constructor(id:string|number,length:number,start:number,content:{text:string}){
        super();
        // this.root = container
        this.id = id;
        this.length = length;
        this.content = content;
        this.dom.root = document.createElement('div');

        this.dom.root.onmousemove = this.changeMouseOnEdgeLeftRight
    }
    destroy(){

    }
    redraw(){
        if(this.initialized){
            // do something
        }

    }

    changeMouseOnEdgeLeftRight(event:MouseEvent){
            
        // console.log(<HTMLElement>event.target?.)
        const element = <HTMLElement>event.target;
        const offsetLeft = element.getBoundingClientRect().left
        
        
        if (element.clientWidth+offsetLeft-event.clientX<10){
            element.style.cursor = 'e-resize' 
        }
        else if (element.offsetWidth+offsetLeft - event.clientX > element.offsetWidth-10){
            element.style.cursor = 'W-resize' 
        }
    
        else {
            element.style.cursor = 'default' 
        }

        // console.log(event.clientX)
        // console.log(event.clientY)
        // console.log(<HTMLElement>event.target.clientWidth)
        // console.log(<HTMLElement>event.target.clientWidth)

    }
}


export class MormoTable extends Component{
   
    // body: HTMLElement;
    
    tableOptions: TableOptions | undefined;
    tableData: Map<string,TableData> = new Map();
    // tableData: Array<{ id: number; length: number; text: string; }> = [];
    constructor(container:HTMLElement,options?:TableOptions){
        super()
        this.root = container
        this.dom  = {};
        this.tableOptions = options;
        
        // this.dom.
        // this.body = document.createElement(elementType)
        this.dom.root = document.createElement('div')
        this.dom.innerContainer = document.createElement('div')
        this.dom.tableContainer = document.createElement('div')
        this.dom.timeContainer = document.createElement('div')
        this.dom.tableRows = document.createElement('div')
        this.dom.timeContainer.classList.add('mormo-time')
        this.dom.tableContainer.classList.add('mormo-table')
        this.dom.tableRows.classList.add('mormo-table-rows')

        this.dom.tableContainer.appendChild(this.dom.timeContainer)
        this.dom.tableContainer.appendChild(this.dom.tableRows)
        this.dom.innerContainer.appendChild(this.dom.tableContainer)
        this.dom.root.appendChild(this.dom.innerContainer)


        this.dom.root.onwheel = this.changeZoom

        
        // this.dom.root.addEventListener('wheel',this.changeZoom)
        this.styleTimeline()

        if (this.tableOptions){
            this.dom.tableContainer.style.width = `${this.tableOptions.size.width}px`
            this.dom.tableContainer.style.height = `${this.tableOptions.size.height}px`
            if(this.tableOptions.colorschema){
                this.dom.tableContainer.style.color = `${this.tableOptions.colorschema.text}`
                this.dom.tableContainer.style.backgroundColor = `${this.tableOptions.colorschema.background}`
            }
        }



        // this.dom.tableContainer.style.borderRadius= '10px';
        this.dom.tableContainer.style.padding= '0px';
        this.dom.tableContainer.style.margin= '0px';
    }


    styleTimeline(){
        // this.root.style.margin="20px";
        
        this.root?this.root.style.paddingLeft= "20px":null
        this.dom.tableContainer.style.position='relative';
        this.dom.timeContainer.style.position="absolute";
        this.dom.timeContainer.style.bottom="0";
        this.dom.timeContainer.style.left="0";
        this.dom.timeContainer.style.height="50px";
        this.dom.timeContainer.style.width= "-moz-available";          /* WebKit-based browsers will ignore this. */
        this.dom.timeContainer.style.width="-webkit-fill-available";  /* Mozilla-based browsers will ignore this. */
        this.dom.timeContainer.style.width= "fill-available";
        this.dom.timeContainer.style.border="solid"
        this.dom.timeContainer.style.borderWidth="thin"
        this.dom.timeContainer.style.borderTopWidth="thick"

        if (this.tableOptions?.colorschema){
            this.dom.timeContainer.style.borderColor=this.tableOptions?.colorschema?.borders;
        }


    }

    changeZoom(event:WheelEvent){
        event.preventDefault();
        console.log(event.deltaY)
    }

    updateTable(objects:{[key:number]:IBaseTableData}): void
    updateTable(objects:Array<ITableData>) : void

    updateTable(objects:{[key:number]:IBaseTableData} | Array<ITableData> ){
        if (Array.isArray(objects)){
            objects.forEach((element) => {
            // this.tableData.
            this.tableData.set(element.id.toString(),
                new TableData(element.id,element.length,element.start,element.content)
            )
            })
        }   
        else{
            Object.entries(objects).forEach((e) => {
                const element= e[1]
                this.tableData.set(e[0],
                new TableData(e[0],element.length,element.start,element.content)
                )
            })
        }

        console.log(this.tableData)
    }

    setTable(objects:{[key:number]:IBaseTableData}): void
    setTable(objects:Array<ITableData>) : void

    setTable(objects:{[key:number]:IBaseTableData} | Array<ITableData> ){
        this.tableData.clear()
        if (Array.isArray(objects)){
            objects.forEach((element) => {
            this.tableData.set(element.id.toString(),
                new TableData(element.id,element.length,element.start,element.content)
            )
            })
        }   
        else{
            Object.entries(objects).forEach((e) => {
                const element= e[1]
                this.tableData.set(e[0],
                new TableData(e[0],element.length,element.start,element.content)
                )
            })
        }

        console.log(this.tableData)
    }

    draw(){
        this.initialized = true;
       
        this.root?.appendChild(this.dom.root)
        // this.dom.tableContainer.appendChild(new TableElement())
    }


    destroy(){

    }
    redraw(){
        if(this.initialized){
            
            // do something
        }

    }


}



