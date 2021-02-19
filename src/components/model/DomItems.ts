import { IDomItems } from "../../interfaces/IObject"

export class TimelineDomItems implements IDomItems{
    
    legendMajor: Array<HTMLElement>
    legendMinor: Array<HTMLElement>
    redundantLegendMajor:Array<HTMLElement>
    redundantLegendMinor: Array<HTMLElement>
    
    constructor(){
        
       
        this.legendMajor= []
        this.legendMinor = []
        this.redundantLegendMajor= []
        this.redundantLegendMinor= []
    }


    clearLegend():void{
        this.redundantLegendMajor = this.legendMajor;
        this.redundantLegendMinor = this.legendMinor;
  
        this.legendMajor = []
        this.legendMinor = []
       
    }
}
