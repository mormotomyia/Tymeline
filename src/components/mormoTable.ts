import { IProps, ITableData } from '../interfaces/IObject';
import { ITableOptions } from '../interfaces/ITableOptions';

import { TimelineView, Transform } from './view/timeline/TimelineView';

import { DomItems } from './model/DomItems';
import { DataControl } from './control/DataControl';

import { MainControl } from './control/MainControl';
import dayjs from 'dayjs';
import { IObserver } from '../observer/Observer';

export interface IMainControl extends IObserver {
    render(): void;
    setTable(argument: Array<ITableData>): void;
    updateTable(argument: Array<ITableData>): void;
}
export class MormoTable {
    tableOptions: ITableOptions;

    props: IProps;
    root: HTMLElement;
    initialized = false;

    mainControl: IMainControl;

    constructor(
        container: HTMLElement,
        mainControl: IMainControl,
        options: ITableOptions
    ) {
        this.root = container;
        this.props = { domItems: new DomItems(), dom: {} };
        this.tableOptions = options;
        this.mainControl = mainControl;
        if (this.tableOptions?.dates === undefined) {
            this.tableOptions.dates = {
                start: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
                end: new Date(new Date().getTime() + 7 * 24 * 3600 * 1000),
            };
        }

        // this.mainControl = new MainControl(container, options);
        this.render();
        // this.dataManager = new DataManager(this.props, this.componentCollection);

        // this.props.dom.tableContainer.style.padding= '0px';
        // this.props.dom.tableContainer.style.margin= '0px';
    }

    render() {
        this.mainControl.render();
    }

    setTable(argument: any) {
        this.mainControl.setTable(argument);
        this.render();
    }
    updateTable(argument: any) {
        this.mainControl.updateTable(argument);
        this.render();
    }

    // render(){
    //     this.dataManager.render();
    // }

    start() {}
}
