import { Observable } from "../../observer/Observable";
import { CustomButton } from "../custom-components/customButton";

export class MainView {
    tableContainer: HTMLDivElement;
    timeContainer: HTMLDivElement;
    rootElement: HTMLElement;
    


    constructor(root:HTMLElement,tableOptions?:any){
        if (root.nodeName!=='DIV'){
            const basediv = document.createElement('div')
            root.appendChild(basediv)
            root = basediv
        }
        
        this.rootElement =root;
        // this.rootElement.appendChild(this.contextMenu)
        this.tableContainer = document.createElement('div');
        this.timeContainer = document.createElement('div');
        this.timeContainer.classList.add('mormo-time');
        this.style(tableOptions);

        this.rootElement.appendChild(this.tableContainer);
        this.rootElement.appendChild(this.timeContainer);
        
    
    
    }



    


    private style(tableOptions?:any){

        
        this.rootElement.classList.add('mormo-timeline')
        this.tableContainer.style.overflowY = 'auto'
        this.tableContainer.style.overflowX = 'hidden'




        this.timeContainer.style.position="absolute";
        this.timeContainer.style.bottom="0";
        this.timeContainer.style.left="0";
        this.timeContainer.style.height="50px";
        this.timeContainer.style.width= "-moz-available";          /* WebKit-based browsers will ignore this. */
        this.timeContainer.style.width="-webkit-fill-available";  /* Mozilla-based browsers will ignore this. */
        this.timeContainer.style.width= "fill-available";
        this.timeContainer.style.border="solid"
        this.timeContainer.style.borderWidth="thin"
        this.timeContainer.style.borderTopWidth="thick"
        this.timeContainer.style.overflow='hidden'



        if (tableOptions){
            this.rootElement.style.width = `${tableOptions.size.width}px`
            this.rootElement.style.height = `${tableOptions.size.height}px`
            this.tableContainer.style.height=`${tableOptions.size.height-50}px`
            this.tableContainer.style.width=`${tableOptions.size.width}px`
         
            if(tableOptions.colorschema){
                this.rootElement.style.color = `${tableOptions.colorschema.text}`
                this.rootElement.style.backgroundColor = `${tableOptions.colorschema.background}`
                this.timeContainer.style.borderColor=`${tableOptions.colorschema.borders}`;
            }
        }
        
    }

    render(){
        // this doesnt do anything.
        // this component is just scaffolding to hold the child views
    }

}