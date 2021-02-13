import { IBaseTableData, ITableData } from "../interfaces/IObject";
import { ITableOptions } from "../interfaces/ITableOptions";
import { TableData } from "./movableObject";
import { Timeline, Transform } from "../Timeline";
import Component from "./Component";

export class MormoTable extends Component{
   
    // body: HTMLElement;
    
    tableOptions: ITableOptions | undefined;
    tableData: Map<string,TableData> = new Map();
    timeline: Timeline;
    // tableData: Array<{ id: number; length: number; text: string; }> = [];
    constructor(container:HTMLElement,options:ITableOptions){

        super()
        this.root = container
        this.dom  = {};
        this.tableOptions = options;
        
        if (this.tableOptions?.dates===undefined){
            this.tableOptions.dates = {start: new Date(new Date().getTime()-(7*24*3600*1000)), end:new Date(new Date().getTime()+(7*24*3600*1000))};
        }

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
        
        this.dom.root.ondrag = this.drag.bind(this)
        this.dom.root.ondragstart = this.drag.bind(this)
        this.dom.root.onwheel = this.changeZoom.bind(this)
        this.dom.root.onmousedown = this.drag.bind(this)
        this.dom.root.onmousemove = this.drag.bind(this)
        this.dom.root.oncontextmenu = (event:Event) => event.preventDefault();
        
        // propertyClasses
        this.timeline = new Timeline(this.dom,this.tableOptions.dates.start,this.tableOptions.dates?.end)
        
        
        console.log(this.timeline.left)
        console.log(this.timeline.right)


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
        this.dom.timeContainer.style.overflow='hidden'
        // this.dom.timeContainer.style.display="inline-flex"

        if (this.tableOptions?.colorschema){
            this.dom.timeContainer.style.borderColor=this.tableOptions?.colorschema?.borders;
        }


    }

    drag(event:MouseEvent){
        console.log(event.buttons)
        if (event.buttons == 1){
            // console.log(this.timeline.timeframe)
            console.log(event.movementX)
            // const transform = new Transform(this.timeline.timeframe*event.movementX,0,1)
            // this.timeline.applyTransform(transform)
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

    render(){
        this.initialized = true;
        this.root?.appendChild(this.dom.root)
        this.timeline.render();
        // this.dom.tableContainer.appendChild(new TableElement())
    }


    destroy(){

    }

    redraw(){
        if(this.initialized){
            this.timeline.render();
            // do something
        }

    }


}