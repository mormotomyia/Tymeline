import { IProps } from "../interfaces/IObject";
import { ITableOptions } from "../interfaces/ITableOptions";

import { TimelineView, Transform } from "./view/timeline/TimelineView";

import { DomItems } from "./model/DomItems";
import { DataManager } from "./control/DataManager";


import { MainControl } from "./control/MainControl";
import dayjs from "dayjs";

export class MormoTable{
   
    
    tableOptions: ITableOptions;

    props: IProps;
    root: HTMLElement;
    initialized: boolean = false;
    
    mainControl: MainControl;
    

    constructor(container:HTMLElement,options:ITableOptions){
        
        this.root = container
        this.props  = {domItems:new DomItems(),dom:{}};
        this.tableOptions = options;
        
        if (this.tableOptions?.dates===undefined){
            this.tableOptions.dates = {start: new Date(new Date().getTime()-(7*24*3600*1000)), end:new Date(new Date().getTime()+(7*24*3600*1000))};
        }
        
        this.mainControl = new MainControl(container, options)
        this.render();
        // this.dataManager = new DataManager(this.props, this.componentCollection);
        

        // this.props.dom.tableContainer.style.padding= '0px';
        // this.props.dom.tableContainer.style.margin= '0px';

        
    }

    render() {
        
        this.mainControl.render();
    }

 
    setTable(argument:any){
        this.mainControl.dataControl.setTable(argument);
        this.render()
    }
    updateTable(argument:any) {
        this.mainControl.dataControl.updateTable(argument);
        this.render()
    } 
        


    

    

    // render(){
    //     this.dataManager.render();
    // }

    start(){

    }




}