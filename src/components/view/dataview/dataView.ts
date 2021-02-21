import dayjs from "dayjs";
import { CustomButton } from "../../custom-components/customButton";
import { DomItems } from "../../model/DomItems";
import { TableData } from "../../model/TableData";
import { DataViewItem } from "./dataViewItem";





export function setDefaultStyle(reusedComponent:HTMLElement){
    // reusedComponent.style.border ='solid'
    // reusedComponent.style.borderColor ='yellow'
    reusedComponent.className ='mormo-element'
    reusedComponent.style.margin = "5px 2px"
    reusedComponent.style.minHeight = "25px"
    reusedComponent.style.maxHeight = "50px"
    reusedComponent.style.backgroundColor =  'rgba(240,240,240,0.9)'
    reusedComponent.style.color =  'rgb(55,55,55)'
    reusedComponent.style.boxShadow = '2px 2px 2px rgb(55,55,55)'
}
export class MormoDataView{
    rootElement: HTMLDivElement;
    domItems: DomItems;
    styleFunc: Function;
    contextMenu: HTMLDivElement = document.createElement('div');
    constructor(rootElement:HTMLDivElement, styleFunc: Function){
        this.createContextMenu()
        this.styleFunc = styleFunc
        this.rootElement =rootElement
        this.domItems = new DomItems()
        this.rootElement.appendChild(this.contextMenu)
        this.rootElement.oncontextmenu = (event:MouseEvent) => this.setPosition(event)
        
        window.addEventListener("click", (e:MouseEvent) => {
            console.log(e.target)
            this.toggleMenu("hide");
          });
    }


    render(elements:Array<TableData>,start:dayjs.Dayjs,end:dayjs.Dayjs){
        // console.log(elements.length)

        this.domItems.clearLegend();

        elements.forEach(element => {
            this.reuseDomComponent(element,start,end);
        });
        this.domItems.redundantLegendMajor.forEach(element => {
            element.parentNode?.removeChild(element)
        });
        this.domItems.redundantLegendMajor = []


    }


    reuseDomComponent(element:TableData,start:dayjs.Dayjs,end:dayjs.Dayjs){
        let reusedComponent
        reusedComponent = this.domItems.redundantLegendMajor.shift();
        if (!reusedComponent){

            const compoonent = new DataViewItem()
            reusedComponent = compoonent.HTML;
            this.rootElement.appendChild(reusedComponent)
            setDefaultStyle(reusedComponent)
           
            
        }

        reusedComponent.id = `${element.id}`
        reusedComponent.onclick = (ev:MouseEvent) => console.log(`${ev} clicked`)
        reusedComponent.children[0].innerHTML =  element.content.text;
        const offset = this.setOffset(element.start,start,end) //fuck!
        reusedComponent.style.transform = `translate(${offset}px)`
        const width = this.setLength(element.start,element.end,start,end) //fuck!
        reusedComponent.style.width = `${width}px`
        


        // reusedComponent.style.boxShadow = '5px 5px 5px grey;'
        this.domItems.legendMajor.push(reusedComponent);
    
    }

    private setOffset(current:dayjs.Dayjs, start:dayjs.Dayjs, end:dayjs.Dayjs){
       
        return this.rootElement.getBoundingClientRect().width*(current.diff(start)/end.diff(start))
    }

    private setLength(elementStart:dayjs.Dayjs,elementEnd:dayjs.Dayjs, start:dayjs.Dayjs, end:dayjs.Dayjs){
       
        return  Math.ceil(this.rootElement.getBoundingClientRect().width*elementEnd.diff(elementStart)/end.diff(start))
        
        
    }

    createContextMenu(){
        const list = document.createElement('div')
        list.className = 'contextMenu'
        this.contextMenu.style.width = 'inherit'

        const info = new CustomButton('Info')
        const modify = new CustomButton('Change')
        const del = new CustomButton('Delete')
        
        
        info.className = 'context-button'
        modify.className = 'context-button'
        del.className = 'context-button'
        this.contextMenu.appendChild(info)
        this.contextMenu.appendChild(modify)
        this.contextMenu.appendChild(del)

        // this.contextMenu.appendChild(list)



        this.contextMenu.style.zIndex = "999"
        this.contextMenu.style.display = 'none'
        // this.contextMenu.style.height = '200px'
        this.contextMenu.style.width = '120px'
        this.contextMenu.style.backgroundColor = 'rgb(240,240,240)'
        this.contextMenu.style.borderRadius = '2px'
        this.contextMenu.style.position = 'absolute'
        this.contextMenu.style.boxShadow = '5px 5px 5px rgb(150,150,150)'
    
    }
    
    toggleMenu = (command:string) => {
        this.contextMenu.style.display = command === "show" ? "block" : "none";
      };
    
    setPosition = (event:MouseEvent) => {
        event.preventDefault();
        console.log(event)

        this.contextMenu.style.left = `${event.pageX-5}px`;
        this.contextMenu.style.top = `${event.pageY-5}px`;
        this.toggleMenu("show");
      };


}