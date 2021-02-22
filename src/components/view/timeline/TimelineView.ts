
import TimeStep from "./TimeStep";

import dayjs from "dayjs";
import { DomItems } from "../../model/DomItems";
import { Observable } from "../../../observer/Observable";

const MAX = 1000;
const print = (...args:any) => console.log(args)



export class Transform{
    deltaX:number;
    deltaY:number;
    scale:number;

    constructor(x=0,y=0,scale=1){
        this.deltaX = x;
        this.deltaY = y;
        this.scale = scale;
    }
}


export const nextTimeScale = {"getDay":"getHours"}

export enum ScaleOptions {
    years = "getFullYear",
    months="getMonth",
    weeks="getWeek",
    days="getDay",
    hours="getHours",
    minutes="getMinutes",
    seconds="getSeconds"
}

function daysInMonth (date:Date) {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
}

export class TimelineView extends Observable{
    // timelineModel: TimelineModel;
    timestep:TimeStep
    // rootElement:HTMLElement;
    rootElement: HTMLElement;
    domItems: DomItems;

    constructor(timeContainer:HTMLElement){
        super();
        this.timestep = new TimeStep(dayjs(),dayjs(),1) // this may not be the optimal default value, please verify if this is ever accessable, even only by accident
        this.rootElement = timeContainer;
        this.domItems = new DomItems()

    }

    updateScale(start:dayjs.Dayjs,end:dayjs.Dayjs){
                // console.log(this.timeframe)
                const minStep = end.diff(start) / (this.rootElement.getBoundingClientRect().width / 80)
                // console.log(minStep/1000/3600)
                const millis =end.diff(start)
                this.timestep.updateScale(start.subtract(millis/10,"millisecond"),end.add(millis/10,"millisecond"), minStep)
    }

    render(start:dayjs.Dayjs,end:dayjs.Dayjs): void{
    
        const count = 0;
        this.timestep.start();
     
        this.updateScale(start,end)
        this.domItems.clearLegend()

      
        while (this.timestep.hasNext()&& count < MAX){
            this.timestep.next()
            const isMajor = this.timestep.isMajor()
            const className = this.timestep.getClassName();
            const current = this.timestep.getCurrent()
            // console.log(className)
            this.reuseDomComponent(isMajor,className,current,this.timestep.getLabel(current,isMajor),start,end)
        }
        
        this.domItems.redundantLegendMajor.forEach(element => {
            element.parentNode?.removeChild(element)
        });

        this.domItems.redundantLegendMajor = []
        
    }


    private reuseDomComponent(isMajor:boolean, classname:string,current: dayjs.Dayjs, content:string, start:dayjs.Dayjs,end:dayjs.Dayjs) {
        let reusedComponent
        reusedComponent = this.domItems.redundantLegendMajor.shift();
        
        if (!reusedComponent){
            const content =document.createElement('div');
            reusedComponent = document.createElement('div');
            reusedComponent.appendChild(content);
            this.rootElement.appendChild(reusedComponent) 
        }

        // TODO this needs some more handling, there could be some scripts in here
        reusedComponent.children[0].innerHTML = `${content}`
        reusedComponent.className = `${classname}`
        reusedComponent.classList.add(`${isMajor?'mormo-time-label':'mormo-time-label'}`)
        reusedComponent.classList.add("mormo-time-element")
        const offset = this.setOffset(current,start,end) //fuck!
        reusedComponent.style.transform = `translate(${offset}px)`
        this.domItems.legendMajor.push(reusedComponent);

        return reusedComponent;
    }

    private setOffset(current:dayjs.Dayjs, start:dayjs.Dayjs, end:dayjs.Dayjs){
       
        return this.rootElement.getBoundingClientRect().width*(current.diff(start)/end.diff(start))

    }
    
}
