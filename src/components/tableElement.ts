import Component from "./Component";

export class TableElement extends Component{
    content: { text: string; };
    id: string | number;
    length: number;

    constructor(id:string|number,length:number,start:number,content:{text:string}){
        super();
        // this.root = container
        this.id = id;
        this.length = length;
        this.content = content;
        this.dom.root = document.createElement('div');

        this.dom.root.onmousemove = this.changeMouseOnEdgeLeftRight
    }
    destroy(){

    }
    redraw(){
        if(this.initialized){
            // do something
        }

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

        // console.log(event.clientX)
        // console.log(event.clientY)
        // console.log(<HTMLElement>event.target.clientWidth)
        // console.log(<HTMLElement>event.target.clientWidth)

    }
}
