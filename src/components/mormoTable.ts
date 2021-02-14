import { IBaseTableData, IProps, ITableData, ITableDataEntry } from "../interfaces/IObject";
import { ITableOptions } from "../interfaces/ITableOptions";
import { TableData } from "./displayElements/movableObject";
import { Timeline, Transform } from "./timeline/Timeline";

import { TimelineDomItems } from "./base/DomItems";
import { DataManager } from "./displayElements/DataManager";
import { DomManager } from "./displayElements/DomManager";
import { ComponentCollection } from "./base/ComponentCollection";

export class MormoTable{
   
    
    tableOptions: ITableOptions;
    
    timeline: Timeline;
    dataManager: DataManager;
    domManager: DomManager;
    props: IProps;
    root: HTMLElement;
    initialized: boolean = false;
    componentCollection: ComponentCollection;
    

    constructor(container:HTMLElement,options:ITableOptions){
        this.componentCollection = new ComponentCollection()
        
        this.root = container
        this.props  = {domItems:new TimelineDomItems(),dom:{}};
        this.tableOptions = options;
        
        if (this.tableOptions?.dates===undefined){
            this.tableOptions.dates = {start: new Date(new Date().getTime()-(7*24*3600*1000)), end:new Date(new Date().getTime()+(7*24*3600*1000))};
        }
        this.domManager = new DomManager(this.props,this.componentCollection,this.tableOptions);
        this.timeline = new Timeline(this.props,this.componentCollection,this.tableOptions.dates.start,this.tableOptions.dates?.end)
        this.dataManager = new DataManager(this.props, this.componentCollection);
        
        this.componentCollection.dataManager = this.dataManager
        this.componentCollection.timeLine = this.timeline
        this.componentCollection.domManager = this.domManager

        
        this.props.dom.root.ondrag = this.drag.bind(this)
        this.props.dom.root.ondragstart = this.drag.bind(this)
        this.props.dom.root.onwheel = this.changeZoom.bind(this)
        this.props.dom.root.onmousedown = this.drag.bind(this)
        this.props.dom.root.onmousemove = this.drag.bind(this)
        this.props.dom.root.oncontextmenu = (event:Event) => event.preventDefault();
        this.props.dom.defaultButton.onclick = () => this.timeline.centerOnToday()
        
        this.props.dom.tableContainer.style.padding= '0px';
        this.props.dom.tableContainer.style.margin= '0px';
    }
    setTable = (argument:any) => this.dataManager.setTable(argument);
    updateTable = (argument:any) => this.dataManager.updateTable(argument)

    drag(event:MouseEvent){
        if (event.buttons == 1){
            this.timeline.updateScale('linear',-event.movementX*this.timeline.timeframe/(1000*1000))
            this.render()  
        }
    }

    changeZoom(event:WheelEvent){
        event.preventDefault();
        this.timeline.updateScale('zoom',event.deltaY,event.offsetX)
        this.render()
    }


    start(){
        this.initialized = true;
        this.root?.appendChild(this.props.dom.root)
        this.timeline.updateScale('stepsize');
        this.render()
    }

    render(){
       
        this.timeline.render();
        this.dataManager.render();
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