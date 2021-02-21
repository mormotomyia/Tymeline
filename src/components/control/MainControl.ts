import dayjs from "dayjs";
import { Observer } from "../../observer/Observer";
import { MormoDataView } from "../view/dataview/dataView";
import { MainView } from "../view/mainView";
import { TimelineView } from "../view/timeline/TimelineView";
import { DataManager } from "./DataManager";
import { TimelineControl } from "./TimelineControl";




export class MainControl{
    mainView: MainView;
    timelineControl: TimelineControl;
    dataControl: DataManager;
    counter = 0
    deltaX = 0
    observer: Observer;




    constructor(root:HTMLElement, options:Object){
        const dataOptions = {}
        const timelineOptions = { ...options,start:dayjs().subtract(7,"day"), end:dayjs().add(7,"day")}

        this.observer = new Observer()

        this.mainView =  new MainView(root,options);

        const timelineView = new TimelineView(this.mainView.timeContainer);

        this.timelineControl = new TimelineControl(timelineView,timelineOptions);
    
        const dataView = new MormoDataView(this.mainView.tableContainer);

        this.dataControl = new DataManager(dataView)

        this.mainView.subscribe(this.observer);
  
        this.addEvents()
    }


    addEvents(){
        
        const hammerview = new Hammer(this.mainView.rootElement)
        hammerview.on('pan', this.drag.bind(this))
        hammerview.on('panstart',this.dragStart.bind(this))
        hammerview.on('panend', this.dragEnd.bind(this))
        this.mainView.rootElement.onwheel = this.changeZoom.bind(this)
        window.addEventListener("click", (_:MouseEvent) => {
            this.mainView.toggleMenu("hide");
          });
        

    }


    


    dragStart(_:any){

        this.deltaX = 0;
    }

    dragEnd(_:any){

    }


    drag(event:any){
        // console.log(event)
        var deltaX = event.deltaX;
        deltaX -= this.deltaX;
        this.timelineControl.updateScale('linear',-deltaX *this.timelineControl.timeframe/(1000*1000)*0.7)
        // this.timeline.updateScale('linear',move *this.timeline.timeframe/(1000*1000)*10)
        this.render()
        this.deltaX += deltaX;

  
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