export class MainView{
    tableContainer: HTMLDivElement;
    timeContainer: HTMLDivElement;
    rootElement: HTMLElement;



    constructor(root:HTMLElement,tableOptions?:any){
        if (root.nodeName!=='DIV'){
            const basediv = document.createElement('div')
            root.appendChild(basediv)
            root = basediv
        }
        //#region 
        this.rootElement =root;
        this.tableContainer = document.createElement('div');
        this.timeContainer = document.createElement('div');
        this.timeContainer.classList.add('mormo-time');
       
        this.style(tableOptions);

        // addEventListener(this.rootElement,'ondrag',console.log)
        // this.rootElement.atta
        // this.rootElement.attachEvent('ondrag',console.log)
        this.rootElement.addEventListener('click',()=>console.log('abbbb'))
    }

    private style(tableOptions?:any){

        if (tableOptions){
                    this.rootElement.style.width = `${tableOptions.size.width}px`
                    this.rootElement.style.height = `${tableOptions.size.height}px`
                    
                    // this.innerContainer.classList.add('mormo-inner-container')
                    // this.dom.dom.root.style.width = `${this.tableOptions.size.width}px`
                    // this.dom.dom.root.style.height = `${this.tableOptions.size.height}px`
                    if(tableOptions.colorschema){
                        this.rootElement.style.color = `${tableOptions.colorschema.text}`
                        this.rootElement.style.backgroundColor = `${tableOptions.colorschema.background}`
                    }
                }
        this.rootElement.classList.add('mormo-timeline')
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
        // this.dom.timeContainer.style.display="inline-flex"
    }

    render(){
        this.rootElement.appendChild(this.tableContainer);
        this.rootElement.appendChild(this.timeContainer);
    }

}