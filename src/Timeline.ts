import { IObject } from "./interfaces/IObject";

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
    constructor(dom:IObject,start:Date,end:Date){
        //stupid initializer!
        this.topScale = ScaleOptions.months
        this.bottomScale = ScaleOptions.weeks
       
        this.left = start;
        this.right = end;
        this.domElement = dom;
        this.applyTimescale()
    }

    private get getWeek():number{
        return (this.right.getWeek()-this.left.getWeek())
    }

    private get getDay():number{
        return this.left.getMonth()!==this.right.getMonth()?daysInMonth(this.left)-this.left.getDate()+ this.right.getDate():this.right.getDate()-this.left.getDate();
    }

    private get getHours(){
        return (this.right.getTime()-this.left.getTime())/(1000*3600)
    }

    private get getMinutes(){
        return (this.right.getTime()-this.left.getTime())/(1000*60)
    }

    private get getSeconds(){
        return (this.right.getTime()-this.left.getTime())/(1000)
    }


    createBorderRegions(): { translateFactor: number; leftOffset: number; endElement:HTMLElement }{
        const offsetfactor = new Date(2000,11,31,23,59,59).[nextTimeScale.[this.bottomScale]]()+1
        const leftOffset = this.left.[nextTimeScale.[this.bottomScale]]()/offsetfactor
        const rightOffset = this.right.[nextTimeScale.[this.bottomScale]]()/offsetfactor
        const totalOffset = -leftOffset + rightOffset
        const translateFactor = Math.floor(this.domElement.timeContainer.getBoundingClientRect().width/(this.[this.bottomScale]+totalOffset))


        const startElement = document.createElement('div')
        startElement.style.width = `${translateFactor}px`
        startElement.classList.add('mormo-time-element')
        startElement.classList.add(this.bottomScale.split('get')[1])
        startElement.innerHTML = this.left.[this.bottomScale]()
        
        console.log(new Date(2000,11,31,23,59,59).[nextTimeScale.[this.bottomScale]]())
        
        console.log(rightOffset)
        
        
        
        console.log(totalOffset);
        
        startElement.style.transform = `translate(${translateFactor* - leftOffset}px)`
        this.domElement.timeContainer.appendChild(startElement);

        
        

        // console.log(translateFactor)
        const endElement = document.createElement('div')
        endElement.style.width = `${translateFactor}px`
        endElement.classList.add('mormo-time-element')
        endElement.classList.add(this.bottomScale.split('get')[1])
        // this.domElement.timeContainer.appendChild(endElement);
        endElement.innerHTML = this.left[this.bottomScale]()+this.[this.bottomScale]
        endElement.style.transform = `translate(${translateFactor*(this.[this.bottomScale]  - rightOffset)}px)`


        return {translateFactor:translateFactor, leftOffset:leftOffset, endElement: endElement}



        // console.log(this.left.[this.topScale]())
        // timeElement.innerHTML = this.left[this.topScale]()+index

        // console.log('___')
        // console.log(this.left.[this.bottomScale]())
        // console.log(this.[this.bottomScale])

        // timeElement.style.width = `${Math.floor(this.domElement.timeContainer.getBoundingClientRect().width/this.[this.topScale]).toString()}px`



        
    }


    render(): void{
        
        const { translateFactor, leftOffset, endElement} = this.createBorderRegions();
        

        for (let index = 1; index < this.[this.bottomScale]; index++) {
            const timeElement = document.createElement('div')
            timeElement.classList.add('mormo-time-element')
            timeElement.classList.add(this.bottomScale.split('get')[1])
            timeElement.innerHTML = (<number>this.left.[this.bottomScale]()+index).toString()

         

            
            timeElement.style.width = `${translateFactor}px`
            timeElement.style.transform = `translate(${translateFactor*(index - leftOffset)}px)`
                 
            this.domElement.timeContainer.appendChild(timeElement);
        }
        this.domElement.timeContainer.appendChild(endElement);





        console.log(Math.abs(((11 - 30) % daysInMonth(this.left))))



        
    }


    applyTransform(transform:Transform)
    {
        this.domElement.timeContainer.style.transform = `matrix(${transform.scale},0,0,1,${transform.deltaX},${transform.deltaY}`
    }


    get timeframe(){
        return (this.right.getTime()-this.left.getTime())/1000;
    }

    applyTimescale(){
        console.log(this.timeframe)
        if(this.timeframe>3600*24*365*2){
            console.log('a')
            this.topScale=ScaleOptions.years
            this.bottomScale=ScaleOptions.months
            //years
        }else if(this.timeframe>3600*24*60){
            // months
            console.log('b')
            this.topScale=ScaleOptions.months
            this.bottomScale=ScaleOptions.weeks
        }else if (this.timeframe>3600*24*10){

            // days
            console.log('c')
            this.topScale=ScaleOptions.weeks
            this.bottomScale=ScaleOptions.days
        }else if (this.timeframe>3600*24*3){
            //hours
            this.topScale=ScaleOptions.days
            this.bottomScale=ScaleOptions.hours
        }else if (this.timeframe>3600*12){
            // minutes
            this.topScale=ScaleOptions.hours
            this.bottomScale=ScaleOptions.minutes
        }
        else {
            // minutes
            this.topScale=ScaleOptions.minutes
            this.bottomScale=ScaleOptions.seconds
        }
    

        this.timeframe
    }

   
}


