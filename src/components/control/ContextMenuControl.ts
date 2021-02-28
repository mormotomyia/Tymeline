import { IObserver, Observer } from '../../observer/Observer';
import { ContextMenuView } from '../view/miscView/ContextMenuView';
import { ISharedState } from './MainControl';

export class ContextMenuControl implements IObserver {
    contextMenuView: ContextMenuView;
    menuLocation: HTMLElement | undefined;
    sharedState: ISharedState;

    constructor(rootElement: HTMLElement, sharedState: ISharedState) {
        this.sharedState = sharedState;
        this.contextMenuView = new ContextMenuView(rootElement);

        this.contextMenuView.createContextMenu();
        this.contextMenuView.subscribe(this);

        // window.addEventListener('click', (event: MouseEvent) => {
        //     console.log('asd');
        //     if (event.target.parentElement.tagName !== 'CONTEXTMENU-VIEW') {
        //         this.contextMenuView.toggleMenu('hide');
        //     }
        // });
    }
    emit(keyword: string, event: any) {
        switch (keyword) {
            case 'contextMenu':
                event.preventDefault();
                // const classes: DOMTokenList = event.target.classList;
                if (event.target.classList.contains('mormo-element')) {
                    this.menuLocation = event.target;
                    this.contextMenuView.setMenu(event.pageX - 5, event.pageY - 5);
                    this.contextMenuView.toggleMenu('show');
                    this.contextMenuView.hideDialog();
                }
                break;
            case 'tapInfo':
                if (this.menuLocation)
                    this.contextMenuView.renderDialog('Info', this.menuLocation.id);
                break;
            case 'tapModify':
                if (this.menuLocation)
                    this.contextMenuView.renderDialog('Modify', this.menuLocation.id);
                break;
            case 'tapDel':
                if (this.menuLocation)
                    this.contextMenuView.renderDialog('Delete', this.menuLocation.id);
                break;
            case 'tapAlign':
                if (this.menuLocation)
                    this.contextMenuView.renderDialog('Align', this.menuLocation.id);
                break;

            default:
                break;
        }
    }

    toggleMenu(keyword: string) {
        this.contextMenuView.toggleMenu(keyword);
    }

    // info.onclick = () => {
    //     dialog.innerHTML = 'info';
    //     this.appendChild(dialog);
    //     console.log(dialog.getAttribute('open'));
    //     dialog.setAttribute('open', 'open');
    // };
    // modify.onclick = () => {
    //     dialog.innerHTML = 'modify';
    //     this.appendChild(dialog);
    //     console.log(dialog.getAttribute('open'));
    //     dialog.setAttribute('open', 'open');
    // };
    // del.onclick = () => {
    //     dialog.innerHTML = 'del';
    //     this.appendChild(dialog);
    //     console.log(dialog.getAttribute('open'));
    //     dialog.setAttribute('open', 'open');
    // };
}
