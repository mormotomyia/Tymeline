import { IProps } from "../interfaces/IObject";
import { ITableOptions } from "../interfaces/ITableOptions";

import { TimelineView, Transform } from "./view/timeline/TimelineView";

import { TimelineDomItems } from "./model/DomItems";
import { DataManager } from "./control/DataManager";
import { ComponentCollection } from "./model/ComponentCollection";

import { TimelineControl } from "./control/TimelineControl";
import dayjs from "dayjs";
import { MainView } from "./view/mainView";
import { MainControl } from "./control/MainControl";

export class MormoTable{
   
    
    tableOptions: ITableOptions;
    dataManager: DataManager;
    // domManager: DomManager;
    props: IProps;
    root: HTMLElement;
    initialized: boolean = false;
    componentCollection: ComponentCollection;
    mainControl: MainControl;
    

    constructor(container:HTMLElement,options:ITableOptions){
        this.componentCollection = new ComponentCollection()
        
        this.root = container
        this.props  = {domItems:new TimelineDomItems(),dom:{}};
        this.tableOptions = options;
        
        if (this.tableOptions?.dates===undefined){
            this.tableOptions.dates = {start: new Date(new Date().getTime()-(7*24*3600*1000)), end:new Date(new Date().getTime()+(7*24*3600*1000))};
        }
        this.dataManager = new DataManager()
        this.mainControl = new MainControl(container, this.dataManager,options)
        this.mainControl.render();
        // this.domManager = new DomManager(this.props);
        // const timelineDiv = document.createElement('div')
        // this.root.appendChild(timelineDiv)
        



        
        // this.dataManager = new DataManager(this.props, this.componentCollection);
        

        // this.props.dom.tableContainer.style.padding= '0px';
        // this.props.dom.tableContainer.style.margin= '0px';
    }
    setTable = (argument:any) => this.dataManager.setTable(argument);
    updateTable = (argument:any) => this.dataManager.updateTable(argument)



    render(){
        this.dataManager.render();
    }

    start(){

    }




}