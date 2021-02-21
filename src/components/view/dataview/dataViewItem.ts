import { eventNames } from "node:process";

export class DataViewItem{
    content: HTMLDivElement;
    reusedComponent: HTMLDivElement;
    // contextMenu: HTMLDivElement = document.createElement('div');
 
    
    constructor(){

        this.content = document.createElement('div');
        this.content.style.userSelect = 'none'
        this.reusedComponent = document.createElement('div');
        this.reusedComponent.appendChild(this.content);
        this.content.style.pointerEvents= 'none'
        // this.reusedComponent.oncontextmenu = (event:MouseEvent) => event.preventDefault()
    }

    get HTML(){
        return this.reusedComponent;
    }


    


}