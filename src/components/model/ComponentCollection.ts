import { DataManager } from "../control/DataManager";
import { DomManager } from "../control/DomManager";
import { TimelineControl } from "../control/TimelineControl";
import { TimelineView } from "../view/timeline/TimelineView";
import { TimelineModel } from "./timelineModel";

export class ComponentCollection{

    dataManager: DataManager|null = null
    domManager: DomManager|null = null
    timeLine: TimelineControl| null = null
    constructor(){

    }
}