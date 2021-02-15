import { DataManager } from "../control/DataManager";
import { DomManager } from "../control/DomManager";
import { Timeline } from "../view/timeline/Timeline";

export class ComponentCollection{

    dataManager: DataManager|null = null
    domManager: DomManager|null = null
    timeLine: Timeline| null = null
    constructor(){

    }
}