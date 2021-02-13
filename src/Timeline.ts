import moment from "moment";
import TimeStep from "./components/TimeStep";
import { IObject } from "./interfaces/IObject";

const MAX = 1000;
const print = (...args:any) => console.log(args)

Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }
  
  // Returns the four-digit year corresponding to the ISO week of the date.
  Date.prototype.getWeekYear = function() {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
  }





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

export class Timeline {
    left: Date;
    right: Date;
    domElement: IObject;
    topScale: ScaleOptions;
    bottomScale: ScaleOptions;
    timestep: TimeStep;
    constructor(dom:IObject,start:Date,end:Date){
        //stupid initializer!
        this.topScale = ScaleOptions.months
        this.bottomScale = ScaleOptions.weeks
       
        this.left = start;
        this.right = end;
        this.domElement = dom;
        

        this.timestep = new TimeStep(this.left,this.right,1000*3600*24)
        console.log(this.timestep.scale)
        console.log(this.timestep.step)
        console.log(this.timestep.isMajor())
        
    }


    render():void
    render(start:moment.Moment,end:moment.Moment,minStep:number):void
    render(start?:moment.Moment,end?:moment.Moment,minStep?:number): void{
        console.log(this.domElement.timeContainer)
        let count = 0;
        if (start&&end&&minStep){
        this.timestep.updateScale(start,end,minStep)
        this.timestep.start();
        while (this.timestep.hasNext()&& count < MAX){
            this.timestep.next()
            console.log(this.timestep.isMajor())
            console.log(this.timestep.getCurrent())
            // className = this.timestep.getClassName();
        }
    }
        else {
            this.timestep.start();
            while (this.timestep.hasNext()&& count < MAX){
                this.timestep.next()
                console.log(this.timestep.isMajor())
                console.log(this.timestep.getCurrent())
                // className = this.timestep.getClassName();
            }
        }
        
    }
}

