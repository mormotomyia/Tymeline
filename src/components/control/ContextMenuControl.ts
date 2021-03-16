import { IContextMenuControl } from '../../interfaces/IContentMenuControl';
import { IObserver, Observer } from '../../observer/Observer';
import { CustomButton, CustomSubMenuButton } from '../custom-components/customButton';
import { ContextMenuView, IContextMenuView } from '../view/miscView/ContextMenuView';
import { ISharedState } from './MainControl';

export class ContextMenuControl implements IContextMenuControl {
    contextMenuView: IContextMenuView;
    menuLocation: HTMLElement | undefined;
    sharedState: ISharedState;
    viewOptions: { name: string; kind: typeof CustomButton }[];

    constructor(rootElement: HTMLElement, sharedState: ISharedState) {
        this.sharedState = sharedState;
        this.contextMenuView = new ContextMenuView(rootElement);
        this.viewOptions = [
            { name: 'Info', kind: CustomButton },
            { name: 'Modify', kind: CustomButton },
            { name: 'Delete', kind: CustomButton },
            { name: 'Align', kind: CustomSubMenuButton },
        ];

        this.contextMenuView.subscribe(this);
    }

    public setContextMenu(event: MouseEvent) {
        this.menuLocation = <HTMLElement>event.target;
        this.contextMenuView.setMenu(event.pageX - 5, event.pageY - 5, this.viewOptions);
        // this.contextMenuView.toggleMenu('show');
        // this.contextMenuView.hideDialog();
    }

    hide() {
        this.contextMenuView.hide();
    }

    emit(keyword: string, event: MouseEvent) {
        switch (keyword) {
            case 'tapInfo':
                if (this.menuLocation)
                    this.contextMenuView.renderDialog('Info', this.menuLocation.id);
                break;
            case 'tapModify':
                if (this.menuLocation)
                    this.contextMenuView.renderDialog('Modify', this.menuLocation.id);
                break;
            case 'tapDelete':
                if (this.menuLocation)
                    this.contextMenuView.renderDialog('Delete', this.menuLocation.id);
                break;
            case 'tapAlign':
                if (this.menuLocation)
                    this.contextMenuView.renderSubMenu('Align', this.menuLocation.id);
                // this.contextMenuView.renderDialog('Align', this.menuLocation.id);
                break;

            default:
                break;
        }
    }
}
