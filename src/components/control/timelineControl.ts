import dayjs from "dayjs"
import { TimelineModel } from "../model/timelineModel"
import { TimelineView } from "../view/timeline/Timeline"

export class TimelineControl{


    timelineView: TimelineView;
    timelineModel : TimelineModel;

    constructor(timelineView:TimelineView,timelineModel:TimelineModel){
        this.timelineModel = timelineModel;
        this.timelineView = timelineView;
    }


    centerOnToday(){

        const now = dayjs()
        
       
        const left = now.subtract(this.timelineModel.timeframe/(1000*2),'second') 
        const right = now.add(this.timelineModel.timeframe/(1000*2),'second')
        
        // console.log(this.timeframe)
        // console.log(now)
        // // this.left = now.subtract(this.timeframe/(1000*2),'second') 
        // // this.right = now.add(this.timeframe/(1000*2),'second')
        // console.log(this.left)
        // console.log(this.right)
        this.updateScale('linear', left,right);
        this.timelineView.render()
    }

    
    updateScale(type:'absolute'): void
    updateScale(type:'stepsize'): void
    updateScale(type:'linear', a: number): void
    updateScale(type:'zoom', a: number,b: number): void
    updateScale(type:'linear', a: dayjs.Dayjs, b: dayjs.Dayjs): void
    updateScale(type:string, a?: dayjs.Dayjs | number, b?: dayjs.Dayjs|number): void {
        switch (type) {
            case 'absolute':
                break
            case 'linear':
                if (a&&b){
                    this.timelineModel.start = <dayjs.Dayjs>a
                    this.timelineModel.end =  <dayjs.Dayjs>b
                } else if (a){
                    this.timelineModel.start = this.timelineModel.start.add( <number>a, 'second')
                    this.timelineModel.end = this.timelineModel.end.add( <number>a, 'second')
                }
                break;
            case 'zoom':
                // zoom in = negative!
                console.log(this.timelineModel.domElement.dom.timeContainer.getBoundingClientRect().width)
                if (a !== undefined && b!== undefined){

                    const zoom = this.timelineModel.timeframe/(1000 * 10)
                    const factor =  <number>b/this.timelineModel.domElement.dom.timeContainer.getBoundingClientRect().width
                    a =a>0?1:-1
                    this.timelineModel.start = this.timelineModel.start.add(-a*zoom*factor,'second') 
       
                    this.timelineModel.end = this.timelineModel.end.add(a*zoom*(1-factor),'second') 
       
                }
                break;
            case 'stepsize':
                break
            default:
                break;
        }

    
        // console.log(this.timeframe)
        const minStep = this.timelineModel.timeframe / (this.timelineModel.domElement.dom.timeContainer.getBoundingClientRect().width / 80)
        // console.log(minStep/1000/3600)
        this.timelineModel.step.updateScale(this.timelineModel.start, this.timelineModel.end, minStep)
        
    }
}