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
    counter = 0
    deltaX = 0




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
        
        
        
        const hammerview = new Hammer(this.mainView.rootElement)


        // hammerview.on('pan', (event:any) => console.log(event))
        hammerview.on('pan', this.drag.bind(this))
        hammerview.on('panstart',this.dragStart.bind(this))
        hammerview.on('panend', this.dragEnd.bind(this))
        // hammerview.onpan = (event) => console.log(event) 
        // this.mainView.rootElement.onclick = () => console.log('fuck you')
        // this.mainView.rootElement.ondrag = this.drag.bind(this)
        // this.mainView.rootElement.ondragstart = this.drag.bind(this)
        this.mainView.rootElement.onwheel = this.changeZoom.bind(this)
        // this.mainView.rootElement.onmousedown = this.drag.bind(this)
        // this.mainView.rootElement.onmousemove = this.drag.bind(this)
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
        this.timeline.updateScale('linear',-deltaX *this.timeline.timeframe/(1000*1000)*0.7)
        // this.timeline.updateScale('linear',move *this.timeline.timeframe/(1000*1000)*10)
        this.render()
        this.deltaX += deltaX;

  
    }

    changeZoom(event:WheelEvent){
        event.preventDefault();
        this.timeline.updateScale('zoom',event.deltaY,event.offsetX)
        this.render() 
    }

    render(){
        this.mainView.render();
        this.timeline.render();
        this.datacontrol.render(this.timeline.start,this.timeline.end);
    }





}