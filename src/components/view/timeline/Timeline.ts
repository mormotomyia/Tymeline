
import TimeStep from "./TimeStep";
import { IProps } from "../../../interfaces/IObject";
import dayjs, { Dayjs } from "dayjs";
import { ComponentCollection } from "../../model/ComponentCollection";
import { TimelineModel } from "../../model/timelineModel";

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
    timelineModel: TimelineModel;
    
    constructor(timelineModel:TimelineModel){
        this.timelineModel = timelineModel
    }



    render(): void{
    
        let count = 0;
        this.timelineModel.step.start();
        // const minStep = this.right.diff(this.left)/(this.domElement.dom.timeContainer.getBoundingClientRect().width/40)
        // console.log(minStep/1000/3600)
        // this.timestep.updateScale(this.left,this.right,minStep)
        this.timelineModel.domElement.domItems.clearLegend()
        // console.log('___')
       
      
        while (this.timelineModel.step.hasNext()&& count < MAX){
            this.timelineModel.step.next()
            const isMajor = this.timelineModel.step.isMajor()
            const className = this.timelineModel.step.getClassName();
            let current = this.timelineModel.step.getCurrent()
            // console.log(className)
            this.reuseDomComponent(isMajor,className,current,this.timelineModel.step.getLabel(current,isMajor))
        }
        
        this.timelineModel.domElement.domItems.redundantLegendMajor.forEach(element => {
            element.parentNode?.removeChild(element)
        });
        this.timelineModel.domElement.domItems.redundantLegendMinor.forEach(element => {
            element.parentNode?.removeChild(element)
        });
        this.timelineModel.domElement.domItems.redundantLegendMajor = []
        this.timelineModel.domElement.domItems.redundantLegendMajor = []
        
        

        // kill all redundant items

    }


    private reuseDomComponent(isMajor:boolean, classname:string,current: dayjs.Dayjs, content:string) {
        let reusedComponent
        if (isMajor){
            reusedComponent = this.timelineModel.domElement.domItems.redundantLegendMajor.shift();
        } else {
            reusedComponent = this.timelineModel.domElement.domItems.redundantLegendMinor.shift();
        }

        if (!reusedComponent){
            const content =document.createElement('div');
            reusedComponent = document.createElement('div');
            reusedComponent.appendChild(content);
            this.timelineModel.domElement.dom.timeContainer.appendChild(reusedComponent) 
        }

        // TODO this needs some more handling, there could be some scripts in here
        reusedComponent.childNodes[0].innerHTML = `${content}`
        reusedComponent.className = `${classname}`
        reusedComponent.classList.add(`${isMajor?'mormo-time-label':'mormo-time-label'}`)
        reusedComponent.classList.add("mormo-time-element")
        const offset = this.setOffset(current) //fuck!
        reusedComponent.style.transform = `translate(${offset}px)`
        if(isMajor){
            this.timelineModel.domElement.domItems.legendMajor.push(reusedComponent);
        }
        else{
            this.timelineModel.domElement.domItems.legendMinor.push(reusedComponent);
        }

        return reusedComponent;
    }

    private setOffset(current:dayjs.Dayjs){
        // console.log(current)
        // console.log(this.left)
        // console.log(this.right)
        // console.log(this.right.diff(this.left)) // span
        // console.log(current.diff(this.left))
        
        return this.timelineModel.domElement.dom.timeContainer.getBoundingClientRect().width*(current.diff(this.timelineModel.start)/this.timelineModel.timeframe)
        // console.log(offset)

        // console.log(this.domElement.dom.timeContainer.getBoundingClientRect())
        // console.log('')


    }
    


}

