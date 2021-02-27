import { Observable } from '../../../observer/Observable';
import { CustomButton } from '../../custom-components/customButton';

export class ContextMenuView extends Observable {
    contextMenu: HTMLDivElement = document.createElement('div');
    rootElement: HTMLElement;

    constructor(rootElement: HTMLElement) {
        super();
        this.rootElement = rootElement;
        this.createContextMenu();
        this.rootElement.oncontextmenu = (event: MouseEvent) => this.fireOnContext(event);
    }

    toggleMenu = (command: string) => {
        this.contextMenu.style.display = command === 'show' ? 'block' : 'none';
    };

    fireOnContext = (event: MouseEvent) => {
        this.publish('onContextMenu', { test: 2 });
        const classes: DOMTokenList = event.target.classList;
        event.preventDefault();
        console.log(classes);

        if (classes.contains('mormo-element')) {
            console.log(this.contextMenu);
            this.contextMenu.style.left = `${event.pageX - 5}px`;
            this.contextMenu.style.top = `${event.pageY - 5}px`;
            this.toggleMenu('show');
        }
    };

    createContextMenu() {
        this.rootElement.appendChild(this.contextMenu);
        this.contextMenu.className = 'context-menu';
        this.contextMenu.style.width = 'inherit';

        const info = new CustomButton('Info');
        const modify = new CustomButton('Change');
        const del = new CustomButton('Delete');

        info.className = 'context-button';
        modify.className = 'context-button';
        del.className = 'context-button';
        this.contextMenu.appendChild(info);
        this.contextMenu.appendChild(modify);
        this.contextMenu.appendChild(del);

        // this.contextMenu.appendChild(list)

        this.contextMenu.style.zIndex = '999';
        this.contextMenu.style.display = 'none';
        // this.contextMenu.style.height = '200px'
        this.contextMenu.style.width = '120px';
        this.contextMenu.style.backgroundColor = 'rgb(240,240,240)';
        this.contextMenu.style.borderRadius = '2px';
        this.contextMenu.style.position = 'absolute';
        this.contextMenu.style.boxShadow = '5px 5px 5px rgb(150,150,150)';
    }
}
