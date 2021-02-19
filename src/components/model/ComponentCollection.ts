import { DataManager } from "../control/DataManager";
import { DomManager } from "../control/DomManager";
import { TimelineControl } from "../control/timelineControl";
import { TimelineView } from "../view/timeline/Timeline";
import { TimelineModel } from "./timelineModel";

export class ComponentCollection{

    dataManager: DataManager|null = null
    domManager: DomManager|null = null
    timeLine: TimelineControl| null = null
    constructor(){

    }
}