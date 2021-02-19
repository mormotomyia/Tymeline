import dayjs from "dayjs";
import { IProps } from "../../interfaces/IObject";
import { TimelineControl } from "../control/timelineControl";
import { ScaleOptions, TimelineView } from "../view/timeline/Timeline";
import TimeStep from "../view/timeline/TimeStep";
import { ComponentCollection } from "./ComponentCollection";

export class TimelineModel{
    private left: dayjs.Dayjs;
    private right: dayjs.Dayjs;
    domElement: IProps;
    private timestep: TimeStep;
    private components: ComponentCollection;

    
    // TODO make this extensible with baseclasses for TimelineView and TimelineControl!
    // the user should be able to intercept the creation of the default classes and substitute their own classes. 
    constructor(dom:IProps,components:ComponentCollection,start:Date,end:Date){
        


        //stupid initializer!
        
        this.components = components
       
        this.left = dayjs(start);
        this.right = dayjs(end);
        this.domElement = dom;
        this.timestep = new TimeStep(this.left,this.right,1000*3600*24)
        
    }

    get step():TimeStep{
        return this.timestep
    }


    
    set start(v : dayjs.Dayjs) {
        this.left = v;
    }

    set end(v : dayjs.Dayjs) {
        this.right = v;
    }
    

    get start():dayjs.Dayjs{
        return this.left;
    }

    get end():dayjs.Dayjs{
        return this.right
    }

    get range():{start:dayjs.Dayjs,end:dayjs.Dayjs}{
        return {start:this.start,end:this.end}
    }

    get timeframe(){
        return this.right.diff(this.left);
    }
}