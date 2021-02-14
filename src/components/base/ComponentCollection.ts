import { DataManager } from "../displayElements/DataManager";
import { DomManager } from "../displayElements/DomManager";
import { Timeline } from "../timeline/Timeline";

export class ComponentCollection{

    dataManager: DataManager|null = null
    domManager: DomManager|null = null
    timeLine: Timeline| null = null
    constructor(){

    }
}