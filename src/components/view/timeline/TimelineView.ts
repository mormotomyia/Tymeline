
import TimeStep from "./TimeStep";
import { IProps } from "../../../interfaces/IObject";
import dayjs, { Dayjs } from "dayjs";
import { ComponentCollection } from "../../model/ComponentCollection";
import { TimelineDomItems } from "../../model/DomItems";

const MAX = 1000;
const print = (...args:any) => console.log(args)



// Date.prototype.getWeek = function() {
//     var date = new Date(this.getTime());
//     date.setHours(0, 0, 0, 0);
//     // Thursday in current week decides the year.
//     date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
//     // January 4 is always in week 1.
//     var week1 = new Date(date.getFullYear(), 0, 4);
//     // Adjust to Thursday in week 1 and count number of weeks from date to week1.
//     return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
//                           - 3 + (week1.getDay() + 6) % 7) / 7);
//   }
  
//   // Returns the four-digit year corresponding to the ISO week of the date.
//   Date.prototype.getWeekYear = function() {
//     var date = new Date(this.getTime());
//     date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
//     return date.getFullYear();
//   }




export class Transform{
    deltaX:number;
    deltaY:number;
    scale:number;

    constructor(x:number=0,y:number=0,scale:number=1){
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

export class TimelineView {
    // timelineModel: TimelineModel;
    timestep:TimeStep
    // rootElement:HTMLElement;
    timeContainer: HTMLDivElement;
    domItems: TimelineDomItems;


   
    constructor(timeContainer:HTMLDivElement){
        this.timestep = new TimeStep(dayjs().subtract(7,'day'),dayjs().add(7,'day'),1000*3600*24)
        this.timeContainer =timeContainer;

        this.domItems = new TimelineDomItems()

    }


    updateScale(start:dayjs.Dayjs,end:dayjs.Dayjs){
                // console.log(this.timeframe)
                const minStep = end.diff(start) / (this.timeContainer.getBoundingClientRect().width / 80)
                // console.log(minStep/1000/3600)
                this.timestep.updateScale(start,end, minStep)
    }


    render(start:dayjs.Dayjs,end:dayjs.Dayjs): void{
    
        let count = 0;
        this.timestep.start();
     
        this.updateScale(start,end)
        this.domItems.clearLegend()
        console.log('___')
       
      
        while (this.timestep.hasNext()&& count < MAX){
            this.timestep.next()
            const isMajor = this.timestep.isMajor()
            const className = this.timestep.getClassName();
            let current = this.timestep.getCurrent()
            // console.log(className)
            this.reuseDomComponent(isMajor,className,current,this.timestep.getLabel(current,isMajor),start,end)
        }
        
        this.domItems.redundantLegendMajor.forEach(element => {
            element.parentNode?.removeChild(element)
        });
        this.domItems.redundantLegendMinor.forEach(element => {
            element.parentNode?.removeChild(element)
        });
        this.domItems.redundantLegendMajor = []
        this.domItems.redundantLegendMajor = []
        
        

        // kill all redundant items

    }


    private reuseDomComponent(isMajor:boolean, classname:string,current: dayjs.Dayjs, content:string, start:dayjs.Dayjs,end:dayjs.Dayjs) {
        let reusedComponent
        if (isMajor){
            reusedComponent = this.domItems.redundantLegendMajor.shift();
        } else {
            reusedComponent = this.domItems.redundantLegendMinor.shift();
        }

        if (!reusedComponent){
            const content =document.createElement('div');
            reusedComponent = document.createElement('div');
            reusedComponent.appendChild(content);
            this.timeContainer.appendChild(reusedComponent) 
        }

        // TODO this needs some more handling, there could be some scripts in here
        reusedComponent.childNodes[0].innerHTML = `${content}`
        reusedComponent.className = `${classname}`
        reusedComponent.classList.add(`${isMajor?'mormo-time-label':'mormo-time-label'}`)
        reusedComponent.classList.add("mormo-time-element")
        const offset = this.setOffset(current,start,end) //fuck!
        reusedComponent.style.transform = `translate(${offset}px)`
        if(isMajor){
            this.domItems.legendMajor.push(reusedComponent);
        }
        else{
            this.domItems.legendMinor.push(reusedComponent);
        }

        return reusedComponent;
    }

    private setOffset(current:dayjs.Dayjs, start:dayjs.Dayjs, end:dayjs.Dayjs){
       
        return this.timeContainer.getBoundingClientRect().width*(current.diff(start)/end.diff(start))


    }
    


}

