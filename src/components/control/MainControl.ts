import dayjs from "dayjs";
import { MormoDataView } from "../view/dataview/dataView";
import { MainView } from "../view/mainView";
import { TimelineView } from "../view/timeline/TimelineView";
import { DataManager } from "./DataManager";
import { TimelineControl } from "./TimelineControl";

export class MainControl{
    mainView: MainView;
    timeline: TimelineControl;
    datacontrol: DataManager;




    constructor(root:HTMLElement, options:Object){
        
        
        this.mainView =  new MainView(root,options);
        const timelineOptions = { ...options,start:dayjs().subtract(7,"day"), end:dayjs().add(7,"day")}
        const timelineView = new TimelineView(this.mainView.timeContainer);

        this.timeline = new TimelineControl(timelineView,timelineOptions)
        
        
        const dataOptions = {}
        const dataView = new MormoDataView(this.mainView.tableContainer);
        this.datacontrol = new DataManager(dataView)
  
        this.addEvents()
    }


    addEvents(){
        this.mainView.rootElement.onclick = () => console.log('fuck you')
        this.mainView.rootElement.ondrag = this.drag.bind(this)
        this.mainView.rootElement.ondragstart = this.drag.bind(this)
        this.mainView.rootElement.onwheel = this.changeZoom.bind(this)
        this.mainView.rootElement.onmousedown = this.drag.bind(this)
        this.mainView.rootElement.onmousemove = this.drag.bind(this)
    }



    drag(event:MouseEvent){
        if (event.buttons == 1){
            this.timeline.updateScale('linear',-event.movementX*this.timeline.timeframe/(1000*1000))
            this.render()  
        }
    }

    changeZoom(event:WheelEvent){
        event.preventDefault();
        this.timeline.updateScale('zoom',event.deltaY,event.offsetX)
        this.render() 
    }

    render(){
        this.datacontrol.render(this.timeline.start,this.timeline.end);
        this.mainView.render();
        this.timeline.render();
    }





}