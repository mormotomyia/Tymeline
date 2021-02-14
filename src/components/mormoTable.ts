import { IBaseTableData, ITableData, ITableDataEntry } from "../interfaces/IObject";
import { ITableOptions } from "../interfaces/ITableOptions";
import { TableData } from "./movableObject";
import { Timeline, Transform } from "./timeline/Timeline";
import Component from "./Component";
import { DomItems } from "./DomItems";

export class MormoTable extends Component{
   
    // body: HTMLElement;
    
    tableOptions: ITableOptions | undefined;
    tableData: Map<string,TableData> = new Map();
    timeline: Timeline;
    // tableData: Array<{ id: number; length: number; text: string; }> = [];
    constructor(container:HTMLElement,options:ITableOptions){

        super()
        this.root = container
        this.dom  = {domItems:new DomItems(),dom:{}};
        this.tableOptions = options;
        
        if (this.tableOptions?.dates===undefined){
            this.tableOptions.dates = {start: new Date(new Date().getTime()-(7*24*3600*1000)), end:new Date(new Date().getTime()+(7*24*3600*1000))};
        }
        this.createDom()
        // this.dom.
        // this.body = document.createElement(elementType)
  


        // propertyClasses
        this.timeline = new Timeline(this.dom,this.tableOptions.dates.start,this.tableOptions.dates?.end)
        
        
        this.styleTimeline()

        if (this.tableOptions){
            this.dom.dom.tableContainer.style.width = `${this.tableOptions.size.width}px`
            this.dom.dom.tableContainer.style.height = `${this.tableOptions.size.height}px`
            this.dom.dom.root.classList.add('mormo-timeline')
            this.dom.dom.innerContainer.classList.add('mormo-inner-container')
            // this.dom.dom.root.style.width = `${this.tableOptions.size.width}px`
            // this.dom.dom.root.style.height = `${this.tableOptions.size.height}px`
            if(this.tableOptions.colorschema){
                this.dom.dom.tableContainer.style.color = `${this.tableOptions.colorschema.text}`
                this.dom.dom.tableContainer.style.backgroundColor = `${this.tableOptions.colorschema.background}`
            }
        }



        // this.dom.tableContainer.style.borderRadius= '10px';
        this.dom.dom.tableContainer.style.padding= '0px';
        this.dom.dom.tableContainer.style.margin= '0px';
    }

    private createDom(){
        this.dom.dom.root = document.createElement('div')
        this.dom.dom.innerContainer = document.createElement('div')
        this.dom.dom.tableContainer = document.createElement('div')
        this.dom.dom.timeContainer = document.createElement('div')
        this.dom.dom.tableRows = document.createElement('div')
        this.dom.dom.timeContainer.classList.add('mormo-time')
        this.dom.dom.tableContainer.classList.add('mormo-table')
        this.dom.dom.tableRows.classList.add('mormo-table-rows')
        
        this.dom.dom.tableContainer.appendChild(this.dom.dom.timeContainer)
        this.dom.dom.tableContainer.appendChild(this.dom.dom.tableRows)
        this.dom.dom.innerContainer.appendChild(this.dom.dom.tableContainer)

        this.dom.dom.root.appendChild(this.dom.dom.innerContainer)
        this.dom.dom.root.style.backgroundColor = 'red'
        
        this.dom.dom.root.ondrag = this.drag.bind(this)
        this.dom.dom.root.ondragstart = this.drag.bind(this)
        this.dom.dom.root.onwheel = this.changeZoom.bind(this)
        this.dom.dom.root.onmousedown = this.drag.bind(this)
        this.dom.dom.root.onmousemove = this.drag.bind(this)
        this.dom.dom.root.oncontextmenu = (event:Event) => event.preventDefault();
        
        this.dom.dom.defaultButton = document.createElement('button')
        this.dom.dom.defaultButton.innerHTML='center on Now'
        this.dom.dom.defaultButton.onclick = () => this.timeline.centerOnToday()
        this.dom.dom.root.appendChild(this.dom.dom.defaultButton)
    }


    private styleTimeline(){
        // this.root.style.margin="20px";
        
        this.root?this.root.style.paddingLeft= "20px":null
        this.dom.dom.tableContainer.style.position='relative';
        this.dom.dom.timeContainer.style.position="absolute";
        this.dom.dom.timeContainer.style.bottom="0";
        this.dom.dom.timeContainer.style.left="0";
        this.dom.dom.timeContainer.style.height="50px";
        this.dom.dom.timeContainer.style.width= "-moz-available";          /* WebKit-based browsers will ignore this. */
        this.dom.dom.timeContainer.style.width="-webkit-fill-available";  /* Mozilla-based browsers will ignore this. */
        this.dom.dom.timeContainer.style.width= "fill-available";
        this.dom.dom.timeContainer.style.border="solid"
        this.dom.dom.timeContainer.style.borderWidth="thin"
        this.dom.dom.timeContainer.style.borderTopWidth="thick"
        this.dom.dom.timeContainer.style.overflow='hidden'
        // this.dom.timeContainer.style.display="inline-flex"

        if (this.tableOptions?.colorschema){
            this.dom.dom.timeContainer.style.borderColor=this.tableOptions?.colorschema?.borders;
        }


    }

    drag(event:MouseEvent){
        // console.log(event.buttons)
        if (event.buttons == 1){
            // console.log(this.timeline.timeframe)
            // console.log(event.movementX*this.timeline.timeframe*0.01)
            this.timeline.updateScale('linear',-event.movementX*this.timeline.timeframe/(1000*1000))
            this.timeline.render()
            // this.timeline.applyTransform(transform)
        }
    }

    changeZoom(event:WheelEvent){
        event.preventDefault();
        // console.log(event.deltaY)
        // // console.log(event.clientX)
        // console.log(event.offsetX)
        this.timeline.updateScale('zoom',event.deltaY,event.offsetX)
        this.timeline.render()
        // console.log(event.screenX)
    }

    updateTable(objects:{[key:number]:IBaseTableData}): void
    updateTable(objects:Array<ITableData>) : void

    updateTable(objects:{[key:number]:IBaseTableData} | Array<ITableDataEntry> ){
        if (Array.isArray(objects)){
            objects.forEach((element) => {
            // this.tableData.
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
        // if (Array.isArray(objects)){
        //     objects.forEach((element) => {
        //         if (element.length)
        //         this.tableData.set(element.id.toString(),
        //             new TableData(element.id,element.content,element.start,element.length)
        //         )
        //         if (element.end)
        //         this.tableData.set(element.id.toString(),
        //             new TableData(element.id,element.content,element.start,element.end)
        //         )
        //     })
        // }   
        // else{
        //     Object.entries(objects).forEach((e) => {
        //         const element= e[1]
        //         if (element.length)
        //         this.tableData.set(e[0],
        //             new TableData(e[0],element.content,element.start,element.length)
        //         )
        //         if (element.end)
        //         this.tableData.set(e[0],
        //             new TableData(e[0],element.content,element.start,element.end))
        //     })
        // }

        // console.log(this.tableData)
    }

    render(){
        this.initialized = true;
        this.root?.appendChild(this.dom.dom.root)
        this.timeline.updateScale('stepsize');
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