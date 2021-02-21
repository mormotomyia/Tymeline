import { CustomElement,CustomHTMLElement } from "customhtmlbase";

@CustomElement({
    selector: 'custom-button',
    template: ' ',
    style: 'button{ background-color:white; border: none; }',
    useShadow:false,
    extender:'button'
})
export class CustomButton extends HTMLButtonElement{

    constructor(template:string){
        super()
        console.log(this.style)
        this.innerHTML = `${template}`
        this.style.backgroundColor ='white'
        this.style.border= 'none'
        this.style.width='inherit';
        this.style.height='2vw';
        this.style.margin= '2px 0 2px 0'


        
        
    }

    setTemplate(){
        console.log(this)
        // this.children[1].innerHTML = template
    }
}