import { CustomHTMLElement } from "customhtmlbase";

@CustomHTMLElement({
    selector:'data-view-item', 
    template:'<div class=content></div>',useShadow:false,style:''})
export class DataViewItem extends HTMLElement{
    content: HTMLDivElement;

    constructor(rootElement:HTMLElement){
        super()
        rootElement.appendChild(this)
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
        const hammerview = new Hammer(this);
        this.onmousemove = this.changeMouseOnEdgeLeftRight
        // this.reusedComponent.oncontextmenu = (event:MouseEvent) => event.preventDefault()
    }

    get HTML(){
        return this;
    }

    changeMouseOnEdgeLeftRight(event:MouseEvent){
            
        // console.log(<HTMLElement>event.target?.)
        const element = <HTMLElement>event.target;
        const offsetLeft = element.getBoundingClientRect().left
        
        
        if (element.clientWidth+offsetLeft-event.clientX<10){
            element.style.cursor = 'e-resize' 
        }
        else if (element.offsetWidth+offsetLeft - event.clientX > element.offsetWidth-10){
            element.style.cursor = 'W-resize' 
        }
    
        else {
            element.style.cursor = 'default' 
        }

    }



    


}