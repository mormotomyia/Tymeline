import dayjs from "dayjs";
import { Observable } from "../../../observer/Observable";
import { CustomButton } from "../../custom-components/customButton";
import { DomItems } from "../../model/DomItems";
import { TableData } from "../../model/TableData";
import { DataViewItem } from "./dataViewItem";





export function setDefaultStyle(reusedComponent:HTMLElement){
    // reusedComponent.style.border ='solid'
    // reusedComponent.style.borderColor ='yellow'
    
    reusedComponent.style.margin = "5px 2px"
    reusedComponent.style.minHeight = "25px"
    reusedComponent.style.maxHeight = "50px"
    reusedComponent.style.backgroundColor =  'rgba(240,240,240,0.9)'
    reusedComponent.style.color =  'rgb(55,55,55)'
    reusedComponent.style.boxShadow = '2px 2px 2px rgb(55,55,55)'
}
export class MormoDataView extends Observable{
    rootElement: HTMLElement;
    domItems: DomItems;
    styleFunc?: () => void;
    
    constructor(rootElement:HTMLElement, styleFunc?: () => void){
        super();
        this.styleFunc = styleFunc
        this.rootElement =rootElement
        this.rootElement.className = 'mormo-items'
        this.domItems = new DomItems()
        if(this.styleFunc) this.styleFunc()
        
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

            reusedComponent = new DataViewItem(this.rootElement) //FIXME THIS NEEDS TO BE DONE IN SOME BETTER WAY TO ENABLE EVENTS ON THESE OBJECTS TO PROPAGATE.
            
            // alternative idea is that the components dont act, but just serve as a reference for lookup in the model!
            // reusedComponent = compoonent.HTML;
            // this.rootElement.appendChild(reusedComponent)
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

   


}