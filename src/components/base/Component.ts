import { IObject } from "../../interfaces/IObject";

export default abstract class Component{
    options: Object|null;
    props: Object|null;
    initialized: boolean;
    root: HTMLElement|null;
    dom: IObject = {};
    constructor(...args:any){;
        console.log(args);
        this.options = null;
        this.props = null;
        this.initialized = false;
        this.root = null;
    }
    
    // setOptions(options:object){
    //     th
    // }

    abstract destroy():void;

    abstract redraw():void;
}