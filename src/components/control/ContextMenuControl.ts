import { Observer } from '../../observer/Observer';
import { ContextMenuView } from '../view/miscView/ContextMenuView';

export class ContextMenuControl extends Observer {
    contextMenuView: ContextMenuView;

    constructor(rootElement: HTMLElement) {
        super();
        this.contextMenuView = new ContextMenuView(rootElement);

        this.contextMenuView.createContextMenu();
        this.contextMenuView.subscribe(this);
        window.addEventListener('click', (_: MouseEvent) => {
            this.contextMenuView.toggleMenu('hide');
        });
    }
}
