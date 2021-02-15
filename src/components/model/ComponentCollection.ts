import { DataManager } from "../control/DataManager";
import { DomManager } from "../control/DomManager";
import { TimelineView } from "../view/timeline/Timeline";
import { TimelineModel } from "./timelineModel";

export class ComponentCollection{

    dataManager: DataManager|null = null
    domManager: DomManager|null = null
    timeLine: TimelineModel| null = null
    constructor(){

    }
}