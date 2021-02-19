import { IProps } from "../../interfaces/IObject";
import { ITableOptions } from "../../interfaces/ITableOptions";
import { ComponentCollection } from "../model/ComponentCollection";
import { TimelineDomItems } from "../model/DomItems"

export class DomManager{
    dom: IProps;
    // tableOptions: ITableOptions;

    constructor(dom:IProps){

        this.dom = dom
  
        // this.createDom();
        // this.styleTimeline();
    }




    private createDom(){
        this.dom.dom.root = document.createElement('div')
        this.dom.dom.innerContainer = document.createElement('div')
        // this.dom.dom.tableContainer = document.createElement('div')
        // this.dom.dom.timeContainer = document.createElement('div')
        // this.dom.dom.tableRows = document.createElement('div')
        // this.dom.dom.timeContainer.classList.add('mormo-time')
        // this.dom.dom.tableContainer.classList.add('mormo-table')
        // this.dom.dom.tableRows.classList.add('mormo-table-rows')
        
        // this.dom.dom.tableContainer.appendChild(this.dom.dom.timeContainer)
        // this.dom.dom.tableContainer.appendChild(this.dom.dom.tableRows)
        // this.dom.dom.innerContainer.appendChild(this.dom.dom.tableContainer)

        this.dom.dom.root.appendChild(this.dom.dom.innerContainer)
        this.dom.dom.root.style.backgroundColor = 'yellow'
        

        
        // this.dom.dom.defaultButton = document.createElement('button')
        // this.dom.dom.defaultButton.innerHTML='center on Now'
        // this.dom.dom.root.appendChild(this.dom.dom.defaultButton)
    }



    // private styleTimeline(){
    //     // this.root.style.margin="20px";
    //     if (this.tableOptions){
    //         this.dom.dom.tableContainer.style.width = `${this.tableOptions.size.width}px`
    //         this.dom.dom.tableContainer.style.height = `${this.tableOptions.size.height}px`
    //         this.dom.dom.root.classList.add('mormo-timeline')
    //         this.dom.dom.innerContainer.classList.add('mormo-inner-container')
    //         // this.dom.dom.root.style.width = `${this.tableOptions.size.width}px`
    //         // this.dom.dom.root.style.height = `${this.tableOptions.size.height}px`
    //         if(this.tableOptions.colorschema){
    //             this.dom.dom.tableContainer.style.color = `${this.tableOptions.colorschema.text}`
    //             this.dom.dom.tableContainer.style.backgroundColor = `${this.tableOptions.colorschema.background}`
    //         }
    //     }
    //     this.root?this.root.style.paddingLeft= "20px":null
    //     this.dom.dom.tableContainer.style.position='relative';
    //     this.dom.dom.timeContainer.style.position="absolute";
    //     this.dom.dom.timeContainer.style.bottom="0";
    //     this.dom.dom.timeContainer.style.left="0";
    //     this.dom.dom.timeContainer.style.height="50px";
    //     this.dom.dom.timeContainer.style.width= "-moz-available";          /* WebKit-based browsers will ignore this. */
    //     this.dom.dom.timeContainer.style.width="-webkit-fill-available";  /* Mozilla-based browsers will ignore this. */
    //     this.dom.dom.timeContainer.style.width= "fill-available";
    //     this.dom.dom.timeContainer.style.border="solid"
    //     this.dom.dom.timeContainer.style.borderWidth="thin"
    //     this.dom.dom.timeContainer.style.borderTopWidth="thick"
    //     this.dom.dom.timeContainer.style.overflow='hidden'
    //     // this.dom.timeContainer.style.display="inline-flex"

    //     if (this.tableOptions?.colorschema){
    //         this.dom.dom.timeContainer.style.borderColor=this.tableOptions?.colorschema?.borders;
    //     }
    // }
}