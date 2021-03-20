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
import { ContextMenuView } from '../view/miscView/ContextMenuView';
import { IContextMenuControl, ISharedState, MainControl } from './MainControl';

export interface IContextMenuView extends IObservable, IObserver {
    visible: boolean;
    rootElement: HTMLElement;
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

    constructor(rootElement: HTMLElement, sharedState: ISharedState) {
        this.sharedState = sharedState;
        // this needs to be an interface
        this.contextMenuView = new ContextMenuView(rootElement, this.sharedState);

        this.viewOptions = new Map();
        this.viewOptions.set('info', { kind: CustomButton, dialog: DataInfoDialog });
        this.viewOptions.set('modify', { kind: CustomButton, dialog: DataModifyDialog });
        this.viewOptions.set('delete', { kind: CustomButton, dialog: DataDeleteDialog });
        this.viewOptions.set('align', { kind: CustomButton, dialog: DataAlignDialog });
        this.contextMenuView.subscribe(this);
        this.contextMenuView.setMenu(this.viewOptions);
    }
    public setContextMenu(event: MouseEvent) {
        this.targetItem = <HTMLElement>event.target;
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
                // this.contextMenuView.renderDialog('Align', this.menuLocation.id);
                break;

            default:
                break;
        }
    }
}
