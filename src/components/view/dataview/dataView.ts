import dayjs from "dayjs";
import { DomItems } from "../../model/DomItems";
import { TableData } from "../../model/TableData";

export class MormoDataView{
    rootElement: HTMLDivElement;
    domItems: DomItems;
    constructor(rootElement:HTMLDivElement){
        this.rootElement =rootElement
        this.domItems = new DomItems()
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
            const content =document.createElement('div');
            content.style.userSelect = 'none'
            reusedComponent = document.createElement('div');
            reusedComponent.appendChild(content);
            this.rootElement.appendChild(reusedComponent) 
        }
        reusedComponent.onclick = (ev:MouseEvent) => console.log('clicked')
        

        reusedComponent.style.border ='solid'
        reusedComponent.style.borderColor ='red'
        reusedComponent.className ='mormo-element'
        reusedComponent.childNodes[0].innerHTML =  element.content.text;

        reusedComponent.style.margin = "2px 2px"
        reusedComponent.style.minHeight = "20px"
        reusedComponent.style.maxHeight = "50px"


        const offset = this.setOffset(element.start,start,end) //fuck!
        reusedComponent.style.transform = `translate(${offset}px)`
        const width = this.setLength(element.start,element.end,start,end) //fuck!
        reusedComponent.style.width = `${width}px`
        this.domItems.legendMajor.push(reusedComponent);
    
    }

    private setOffset(current:dayjs.Dayjs, start:dayjs.Dayjs, end:dayjs.Dayjs){
       
        return this.rootElement.getBoundingClientRect().width*(current.diff(start)/end.diff(start))
    }

    private setLength(elementStart:dayjs.Dayjs,elementEnd:dayjs.Dayjs, start:dayjs.Dayjs, end:dayjs.Dayjs){
       
        return  Math.ceil(this.rootElement.getBoundingClientRect().width*elementEnd.diff(elementStart)/end.diff(start))
        
        
    }


}