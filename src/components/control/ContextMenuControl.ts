import { IObservable } from '../../observer/Observable';
import { IObserver, Observer } from '../../observer/Observer';
import {
    CustomButton,
    CustomButtonBase,
    CustomSubMenuButton,
} from '../custom-components/customButton';
import {
    IDialogComponent,
    DataInfoDialog,
    DataAlignDialog,
    DataDeleteDialog,
    DataModifyDialog,
    DialogComponent,
} from '../custom-components/DialogComponents';
import { IDataService } from '../services/DataService';
import { IDataService } from '../services/serviceSpec/DataServiceSpec';
import { ContextMenuView } from '../view/miscView/ContextMenuView';
import {
    IContextMenuControl,
    ISharedState,
    MainControl,
    SharedState,
} from './MainControl';

export interface IContextMenuView extends IObservable, IObserver {
    setContainer(container: HTMLElement): IContextMenuView;
    addSharedState(sharedState: ISharedState): IContextMenuView;
    addDataService(dataService: IDataService): IContextMenuView;

    visible: boolean;
    rootElement: HTMLElement;
    dataService: IDataService;
    setMenu(
        viewOptions: Map<
            string,
            { kind: typeof CustomButtonBase; dialog: typeof DialogComponent }
        >
    ): void;
    hide(): void;
    render(x: number, y: number): void;
    renderDialog(template: typeof DialogComponent, id: string): void;
    sharedstate: ISharedState;
}
export class ContextMenuControl implements IContextMenuControl {
    contextMenuView: IContextMenuView;
    targetItem: HTMLElement | undefined;
    sharedState: ISharedState;
    viewOptions: Map<
        string,
        { kind: typeof CustomButtonBase; dialog: typeof DialogComponent }
    >;
    dataService: IDataService;

    addContextMenuView(contextMenuView: IContextMenuView): IContextMenuControl {
        this.contextMenuView = contextMenuView;
        this.contextMenuView.subscribe(this);
        this.contextMenuView.setMenu(this.viewOptions);

        return this;
    }

    addDataService(dataService: IDataService) {
        this.dataService = dataService;
        return this;
    }

    addSharedState(sharedState: SharedState) {
        this.sharedState = sharedState;
        return this;
    }

    constructor() {
        this.viewOptions = new Map();
        this.viewOptions.set('info', { kind: CustomButton, dialog: DataInfoDialog });
        this.viewOptions.set('modify', { kind: CustomButton, dialog: DataModifyDialog });
        this.viewOptions.set('delete', { kind: CustomButton, dialog: DataDeleteDialog });
        this.viewOptions.set('align', { kind: CustomButton, dialog: DataAlignDialog });
    }

    setContainer(container: HTMLElement) {
        return this;
    }

    public setContextMenu(event: MouseEvent) {
        this.targetItem = <HTMLElement>event.target;
        console.warn('here!');
        console.log(event.pageX);
        console.log(event);
        this.contextMenuView.render(event.pageX - 5, event.pageY - 5);
    }

    get visible() {
        return this.contextMenuView.visible;
    }

    hide() {
        this.contextMenuView.hide();
    }

    emit(keyword: string, event: MouseEvent) {
        switch (keyword) {
            case 'tapinfo':
                this.contextMenuView.renderDialog(
                    this.viewOptions.get('info').dialog,
                    this.targetItem.id
                );
                break;
            case 'tapmodify':
                if (this.targetItem)
                    this.contextMenuView.renderDialog(
                        this.viewOptions.get('modify').dialog,
                        this.targetItem.id
                    );
                break;
            case 'tapdelete':
                if (this.targetItem)
                    this.contextMenuView.renderDialog(
                        this.viewOptions.get('delete').dialog,
                        this.targetItem.id
                    );
                break;
            case 'tapalign':
                if (this.targetItem)
                    this.contextMenuView.renderDialog(
                        this.viewOptions.get('align').dialog,
                        this.targetItem.id
                    );
                break;

            default:
                break;
        }
    }
}
