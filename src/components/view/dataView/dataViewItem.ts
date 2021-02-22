export class DataViewItem{
    content: HTMLDivElement;
    reusedComponent: HTMLDivElement;
    // contextMenu: HTMLDivElement = document.createElement('div');
 
    
    constructor(){
        //  TODO this needs some way to distinguish between "extending the time" aka making some element longer
        // and "changing the time" aka moving the element around with fixed length.
        // there needs to be a way to support either an both at the same time

        // this needs to be dictated by some value in the model and propagated into this object.
        // set the appropriate events in here.
        // where do I even fire them to?!
        // this does need some more thought! (as of right now this is just a builder class which is reusable but also not well defined)

        this.content = document.createElement('div');
        this.content.style.userSelect = 'none'
        this.reusedComponent = document.createElement('div');
        this.reusedComponent.appendChild(this.content);
        this.content.style.pointerEvents= 'none'
        this.reusedComponent.className ='mormo-element'
        const hammerview = new Hammer(this.reusedComponent);
        this.reusedComponent.onmousemove = this.changeMouseOnEdgeLeftRight
        // this.reusedComponent.oncontextmenu = (event:MouseEvent) => event.preventDefault()
    }

    get HTML(){
        return this.reusedComponent;
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