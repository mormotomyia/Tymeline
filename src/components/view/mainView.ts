import { Observable } from "../../observer/Observable";
import { CustomButton } from "../custom-components/customButton";

export class MainView extends Observable{
    tableContainer: HTMLDivElement;
    timeContainer: HTMLDivElement;
    rootElement: HTMLElement;
    contextMenu: HTMLDivElement = document.createElement('div');


    constructor(root:HTMLElement,tableOptions?:any){
        super();
        if (root.nodeName!=='DIV'){
            const basediv = document.createElement('div')
            root.appendChild(basediv)
            root = basediv
        }
        this.createContextMenu()
        this.rootElement =root;
        this.rootElement.appendChild(this.contextMenu)
        this.tableContainer = document.createElement('div');
        this.timeContainer = document.createElement('div');
        this.timeContainer.classList.add('mormo-time');
        this.style(tableOptions);

        // addEventListener(this.rootElement,'ondrag',console.log)
        // this.rootElement.atta
        // this.rootElement.attachEvent('ondrag',console.log)
        // this.rootElement.addEventListener('click',()=>console.log('abbbb'))
        this.rootElement.appendChild(this.tableContainer);
        this.rootElement.appendChild(this.timeContainer);
        this.rootElement.oncontextmenu = (event:MouseEvent) => this.fireOnContext(event)
    
    
    }




    toggleMenu = (command:string) => {
        this.contextMenu.style.display = command === "show" ? "block" : "none";
      };
    
    fireOnContext = (event:MouseEvent) => {
        this.publish('onContextMenu', {"test":2})
        const classes:DOMTokenList = event.target.classList;
        event.preventDefault();

        if (classes.contains('mormo-element')){
            console.log(event)
    
            this.contextMenu.style.left = `${event.pageX-5}px`;
            this.contextMenu.style.top = `${event.pageY-5}px`;
            this.toggleMenu("show");
        }
      };


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