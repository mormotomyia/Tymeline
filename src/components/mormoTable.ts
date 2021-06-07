import { IProps, ITableData, ITableDataEntry } from '../interfaces/IObject';
import { ITableOptions } from '../interfaces/ITableOptions';

import { TimelineView, Transform } from './view/timelineView/TimelineView';

import { DomItems } from './model/DomItems';
import { DataControl } from './control/DataControl';

import {
    IContextMenuControl,
    IDataControl,
    IMainView,
    ITimelineControl,
    MainControl,
} from './control/MainControl';
import dayjs from 'dayjs';
import { IObserver } from '../observer/Observer';
export interface IMainControl extends IObserver {
    start(): void;
    addMainView(mainView: IMainView): IMainControl;
    addContextMenuControl(contextMenuControl: IContextMenuControl): IMainControl;
    addTimelineControl(timelineControl: ITimelineControl): IMainControl;
    addDataControl(dataControl: IDataControl): IMainControl;
    setTable(argument: Array<ITableData>): void;
    updateTable(argument: Array<ITableData>): void;
}
export class MormoTable {
    tableOptions: ITableOptions;

    props: IProps;
    root: HTMLElement;
    initialized = false;

    mainControl: IMainControl;

    constructor(options: ITableOptions) {
        this.props = { domItems: new DomItems(), dom: {} };
        this.tableOptions = options;

        if (this.tableOptions?.dates === undefined) {
            this.tableOptions.dates = {
                start: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
                end: new Date(new Date().getTime() + 7 * 24 * 3600 * 1000),
            };
        }
    }

    setContainer(container: HTMLElement): MormoTable {
        this.root = container;
        return this;
    }

    setMainControl(mainControl: IMainControl): MormoTable {
        this.mainControl = mainControl;
        return this;
    }

    public setTable(argument: Array<any>) {
        this.mainControl.setTable(argument);
    }
    public updateTable(argument: Array<any>) {
        this.mainControl.updateTable(argument);
    }

    start() {
        this.mainControl.start();
    }
}
