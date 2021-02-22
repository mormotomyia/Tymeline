
import dayjs from "dayjs";
import { IObserver, Observer } from "../../observer/Observer";
import { MormoDataView } from "../view/dataView/dataView";
import { MainView } from "../view/mainView";
import { TimelineView } from "../view/timeline/TimelineView";
import { ContextMenuControl } from "./ContextMenuControl";
import { DataControl } from "./DataControl";
import { TimelineControl } from "./TimelineControl";




export class MainControl implements IObserver{
    mainView: MainView;
    timelineControl: TimelineControl;
    dataControl: DataControl;
    counter = 0
    deltaX = 0
    contextMenuControl: ContextMenuControl;

    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor(root:HTMLElement, options:Object){
        const dataOptions = {}
        const timelineOptions = { ...options,start:dayjs().subtract(7,"day"), end:dayjs().add(7,"day")}

        

        this.mainView =  new MainView(root,options);
        this.mainView.subscribe(this)

        // this needs to be moved to the respective control points?

        this.timelineControl = new TimelineControl(this.mainView.timeContainer,timelineOptions);
        this.dataControl = new DataControl(this.mainView.tableContainer)
        this.contextMenuControl = new ContextMenuControl(this.mainView.rootElement)
        
        // this.addEvents()
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    emit(keyword:string, data:Object):void{
        switch (keyword) {
            case "pan":
                this.drag(data)
                break;
            case "panstart":
                this.dragStart(data)
                break;
            case "panend":
                this.dragEnd(data)
                break;
            case "onwheel":
                this.changeZoom(<WheelEvent>data)
                break;
            default:
                break;
        }
        // console.log(keyword)
        // console.log(data)
    }


    // addEvents(){
    //     // FIXME THESE EVENTS NEED TO BE IN THE MAINVIEW AND NEED TO BE BUBBLED UP TO THIS COMPONENT VIA THE OBSERVABLE!
    //     const hammerview = new Hammer(this.mainView.rootElement)
    //     hammerview.on('pan', this.drag.bind(this))
    //     hammerview.on('panstart',this.dragStart.bind(this))
    //     hammerview.on('panend', this.dragEnd.bind(this))
    //     this.mainView.rootElement.onwheel = this.changeZoom.bind(this)
    // }



    dragStart(_:any){
        this.deltaX = 0;
    }

    dragEnd(_:any) {
        
    }


    drag(event:HammerInput){
        console.log(event.srcEvent)
        const target = <HTMLElement>event.srcEvent.target
        console.log(target.tagName)
        if (event.srcEvent.target.classList.contains('mormo-items')){
            let deltaX = event.deltaX;
            deltaX -= this.deltaX;
            this.timelineControl.updateScale('linear',-deltaX *this.timelineControl.timeframe/(1000*1000)*0.7)
            // this.timeline.updateScale('linear',move *this.timeline.timeframe/(1000*1000)*10)
            this.render()
            this.deltaX += deltaX;
        }
        else if (event.srcEven)

  
    }

    changeZoom(event:WheelEvent){
        event.preventDefault();
        this.timelineControl.updateScale('zoom',event.deltaY,event.offsetX)
        this.render() 
    }

    render(){
        this.mainView.render();
        this.timelineControl.render();
        this.dataControl.render(this.timelineControl.start,this.timelineControl.end);
    }





}