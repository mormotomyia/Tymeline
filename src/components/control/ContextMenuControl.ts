import { IObserver, Observer } from '../../observer/Observer';
import { CustomButton, CustomSubMenuButton } from '../custom-components/customButton';
import { ContextMenuView } from '../view/miscView/ContextMenuView';
import { ISharedState } from './MainControl';

export class ContextMenuControl implements IObserver {
    contextMenuView: ContextMenuView;
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
        this.contextMenuView.createContextMenu(this.viewOptions);

        this.contextMenuView.subscribe(this);

        // window.addEventListener('click', (event: MouseEvent) => {
        //     console.log('asd');
        //     if (event.target.parentElement.tagName !== 'CONTEXTMENU-VIEW') {
        //         this.contextMenuView.toggleMenu('hide');
        //     }
        // });
    }

    setContextMenu(event: Event) {
        this.menuLocation = <HTMLElement>event.target;
        this.contextMenuView.setMenu(event.pageX - 5, event.pageY - 5);
        this.contextMenuView.toggleMenu('show');
        this.contextMenuView.hideDialog();
    }

    emit(keyword: string, event: any) {
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

    toggleMenu(keyword: string) {
        this.contextMenuView.toggleMenu(keyword);
    }
}
