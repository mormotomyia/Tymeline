import { CustomHTMLElement } from "customhtmlbase";
import { TableData } from "../../model/TableData";
import dayjs from "dayjs";
import { ITableData } from "../../../interfaces/IObject";
import { IObservable } from "../../../observer/Observable";
import { IObserver } from "../../../observer/Observer";



enum ChangeType{
    move=1,
    change=2,
    idle=3
}

@CustomHTMLElement({
    selector:'data-view-item', 
    template:'<div class=content></div>',useShadow:false,style:''})
export class DataViewItem extends HTMLElement implements IObservable{
    content: HTMLDivElement;
    canMove=false
    canChangeLength=false
    hammerview: HammerManager;
    changeType: ChangeType|null;
    private subscribers: Array<IObserver> = [];
    
    constructor(rootElement:HTMLElement){
        super()
        rootElement.appendChild(this)
        this.changeType = ChangeType.idle;
        //  TODO this needs some way to distinguish between "extending the time" aka making some element longer
        // and "changing the time" aka moving the element around with fixed length.
        // there needs to be a way to support either an both at the same time

        // this needs to be dictated by some value in the model and propagated into this object.
        // set the appropriate events in here.
        // where do I even fire them to?!
        // this does need some more thought! (as of right now this is just a builder class which is reusable but also not well defined)

        this.style.display = 'block'

        this.content = <HTMLDivElement>this.getElementsByClassName('content')[0]
        this.content.style.userSelect = 'none'
        
        this.content.style.pointerEvents= 'none'
        this.className ='mormo-element'
        this.hammerview = new Hammer(this);
        // this.hammerview.on('pan',(event) => console.log(event))

        this.hammerview.on('tap', this.onSelect.bind(this))
        this.hammerview.on('hammer.input', this.onMove.bind(this))
        // this.onmousedown = this.changeStart;
        // this.onmouseup = this.changeEnd;
        this.onmousemove = this.changeMouseOnEdgeLeftRight
        // this.onmouseleave = () => {console.log('LEAVE');this.changeType = null;}
    }

    public update(element:ITableData, start:dayjs.Dayjs, end:dayjs.Dayjs){
        this.canMove = element.canMove
        this.canChangeLength = element.canChangeLength

        this.id = `${element.id}`
        this.onclick = (ev:MouseEvent) => console.log(`${ev} clicked`)
        this.content.innerHTML =  element.content.text;
        
        const offset = this.setOffset(element.start,start,end) //fuck!
        this.style.transform = `translate(${offset}px)`
        const width = this.setLength(element.start,element.end,start,end) //fuck!
        this.style.width = `${width}px`
    }

    public subscribe(observer:IObserver) {
        //we could check to see if it is already subscribed
        this.subscribers.push(observer);
        console.log(`${observer} "has been subscribed`);
    }
    public unsubscribe(observer:IObserver) {
        this.subscribers = this.subscribers.filter((el) => {
            return el !== observer;
        });
    }
    public publish(keyword:string,data:any) {
        this.subscribers.forEach((subscriber) => {
            subscriber.emit(keyword, data);
        });
    }

    get HTML(){
        return this;
    }

    onMove(event:HammerInput){
        console.log(event.isFirst)
        // console.log(event)
    }

    onSelect(event:any){
        console.log('onSelect')
        this.style.borderStyle === 'solid'? this.style.borderStyle = 'hidden':this.style.borderStyle = 'solid'
        // this.style.borderStyle === 'solid'? this.style.borderStyle = 'hidden':this.style.borderStyle = 'solid'
        this.publish('select',this.id)
    }
        
    changeMouseOnMove(){
        
    }


    private changeMouseOnEdgeLeftRight(event:MouseEvent){
        const element = <HTMLElement>event.target;
        const offsetLeft = element.getBoundingClientRect().left
        // if (event.buttons ===)
        element.style.cursor = 'default' 
        if(this.canChangeLength){
            
            if (element.clientWidth+offsetLeft-event.clientX<10){
                element.style.cursor = 'e-resize' 
            }
            else if (element.offsetWidth+offsetLeft - event.clientX > element.offsetWidth-10){
                element.style.cursor = 'W-resize' 
            }
       
        }
        if (this.canMove && event.shiftKey) {
                element.style.cursor = 'ew-resize' 
        } 
    }


    private changeStart(event:MouseEvent){
        // this.style.transform = "translate(25px)"
        console.log(event);
    }

    private changeEnd(event:MouseEvent){
        console.log(event)
    }






    private setOffset(current:dayjs.Dayjs, start:dayjs.Dayjs, end:dayjs.Dayjs){
       
        return this.parentElement.getBoundingClientRect().width*(current.diff(start)/end.diff(start))
    }

    private setLength(elementStart:dayjs.Dayjs,elementEnd:dayjs.Dayjs, start:dayjs.Dayjs, end:dayjs.Dayjs){
       
        return  Math.ceil(this.parentElement.getBoundingClientRect().width*elementEnd.diff(elementStart)/end.diff(start))
    }






    


}