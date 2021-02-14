import moment from "moment";
import TimeStep from "./TimeStep";
import { IObject } from "../interfaces/IObject";
import dayjs, { Dayjs } from "dayjs";

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

export class Timeline {
    private left: dayjs.Dayjs;
    private right: dayjs.Dayjs;
    domElement: IObject;

    private topScale: ScaleOptions;
    private bottomScale: ScaleOptions;
    private timestep: TimeStep;
    constructor(dom:IObject,start:Date,end:Date){
        //stupid initializer!
        this.topScale = ScaleOptions.months
        this.bottomScale = ScaleOptions.weeks
       
        this.left = dayjs(start);
        this.right = dayjs(end);
        this.domElement = dom;
        

        this.timestep = new TimeStep(this.left,this.right,1000*3600*24)
        console.log(this.timestep.scale)
        console.log(this.timestep.step)
        console.log(this.timestep.isMajor())
        
    }

    get timeframe(){
        return this.right.diff(this.left);
    }



    updateScale(type:'stepsize'): void
    updateScale(type:'linear', a: number): void
    updateScale(type:'zoom', a: number,b: number): void
    updateScale(type:'linear', a: dayjs.Dayjs, b: dayjs.Dayjs): void
    updateScale(type:string, a?: dayjs.Dayjs | number, b?: dayjs.Dayjs|number): void {
        switch (type) {
            case 'linear':
                if (a&&b){
                    this.left = <dayjs.Dayjs>a
                    this.right =  <dayjs.Dayjs>b
                } else if (a){
                    this.left = this.left.add( <number>a, 'second')
                    this.right = this.right.add( <number>a, 'second')
                }
                break;
            case 'zoom':
                // zoom in = negative!
                console.log(this.domElement.dom.timeContainer.getBoundingClientRect().width)
                if (a !== undefined && b!== undefined){

                    const zoom = this.timeframe/(1000 * 10)
                    const factor =  <number>b/this.domElement.dom.timeContainer.getBoundingClientRect().width
                    
                    a =a>0?1:-1
                    console.log(a)
                    // console.log(factor)
                    // console.log(this.left)
                    this.left = this.left.add(-a*zoom*factor,'second') 
                    // console.log(this.left)
                    this.right = this.right.add(a*zoom*(1-factor),'second') 
                    // console.log(factor)
                    // console.log(a)
                    // console.log(b)
                }
                break;
            case 'stepsize':
                break
            default:
                break;
        }
        console.log(this.timeframe)
        const minStep = this.timeframe / (this.domElement.dom.timeContainer.getBoundingClientRect().width / 80)
        // console.log(minStep/1000/3600)
        this.timestep.updateScale(this.left, this.right, minStep)
        
    }


    render(): void{
     

        let count = 0;
        this.timestep.start();
        // const minStep = this.right.diff(this.left)/(this.domElement.dom.timeContainer.getBoundingClientRect().width/40)
        // console.log(minStep/1000/3600)
        // this.timestep.updateScale(this.left,this.right,minStep)
        this.domElement.domItems.clearLegend()
        console.log('___')
       
      
        while (this.timestep.hasNext()&& count < MAX){
            this.timestep.next()
            const isMajor = this.timestep.isMajor()
            const className = this.timestep.getClassName();
            let current = this.timestep.getCurrent()
            // console.log(className)
            this.reuseDomComponent(isMajor,className,current,this.timestep.getLabel(current,isMajor))
        }
        
        this.domElement.domItems.redundantLegendMajor.forEach(element => {
            element.parentNode?.removeChild(element)
        });
        this.domElement.domItems.redundantLegendMinor.forEach(element => {
            element.parentNode?.removeChild(element)
        });
        this.domElement.domItems.redundantLegendMajor = []
        this.domElement.domItems.redundantLegendMajor = []
        
        

        // kill all redundant items

    }


    private reuseDomComponent(isMajor:boolean, classname:string,current: dayjs.Dayjs, content:string) {
        let reusedComponent
        if (isMajor){
            reusedComponent = this.domElement.domItems.redundantLegendMajor.shift();
        } else {
            reusedComponent = this.domElement.domItems.redundantLegendMinor.shift();
        }

        if (!reusedComponent){
            const content =document.createElement('div');
            reusedComponent = document.createElement('div');
            reusedComponent.appendChild(content);
            this.domElement.dom.timeContainer.appendChild(reusedComponent) 
        }

        // TODO this needs some more handling, there could be some scripts in here
        reusedComponent.childNodes[0].innerHTML = `${content}`
        reusedComponent.className = `${classname}`
        reusedComponent.classList.add(`${isMajor?'mormo-time-label':'mormo-time-label'}`)
        reusedComponent.classList.add("mormo-time-element")
        const offset = this.setOffset(current) //fuck!
        reusedComponent.style.transform = `translate(${offset}px)`
        if(isMajor){
            this.domElement.domItems.legendMajor.push(reusedComponent);
        }
        else{
            this.domElement.domItems.legendMinor.push(reusedComponent);
        }

        return reusedComponent;
    }

    private setOffset(current:dayjs.Dayjs){
        // console.log(current)
        // console.log(this.left)
        // console.log(this.right)
        // console.log(this.right.diff(this.left)) // span
        // console.log(current.diff(this.left))
        
        return this.domElement.dom.timeContainer.getBoundingClientRect().width*(current.diff(this.left)/this.timeframe)
        // console.log(offset)

        // console.log(this.domElement.dom.timeContainer.getBoundingClientRect())
        // console.log('')


    }
    


}

