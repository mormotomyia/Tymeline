import { Observable } from '../../observer/Observable';
import { CustomButton } from '../custom-components/customButton';

export class MainView extends Observable {
    // tableContainer: HTMLDivElement;
    // timeContainer: HTMLDivElement;
    rootElement: HTMLElement;

    constructor(root: HTMLElement, tableOptions?: any) {
        super();
        if (root.nodeName !== 'DIV') {
            const basediv = document.createElement('div');
            root.appendChild(basediv);
            root = basediv;
        }

        this.rootElement = root;
        // this.rootElement.appendChild(this.contextMenu)
        // this.tableContainer = document.createElement('div');
        // this.timeContainer = document.createElement('div');
        // this.timeContainer.classList.add('mormo-time');
        this.style(tableOptions);

        // this.rootElement.appendChild(this.tableContainer);
        // this.rootElement.appendChild(this.timeContainer);
        this.addEvents();
    }

    addEvents() {
        // FIXME THESE EVENTS NEED TO BE IN THE MAINVIEW AND NEED TO BE BUBBLED UP TO THIS COMPONENT VIA THE OBSERVABLE!

        const hammerview = new Hammer(this.rootElement);
        hammerview.on('pan', (event) => this.publish('pan', event));
        hammerview.on('panstart', (event) => this.publish('panstart', event));
        hammerview.on('panend', (event) => this.publish('panend', event));
        this.rootElement.onwheel = (event) => this.publish('onwheel', event);
    }

    private style(tableOptions?: any) {
        this.rootElement.classList.add('mormo-timeline');

        // this.timeContainer.style.position = 'absolute';
        // this.timeContainer.style.bottom = '0';
        // this.timeContainer.style.left = '0';
        // this.timeContainer.style.height = '50px';
        // this.timeContainer.style.width =
        //     '-moz-available'; /* WebKit-based browsers will ignore this. */
        // this.timeContainer.style.width =
        //     '-webkit-fill-available'; /* Mozilla-based browsers will ignore this. */
        // this.timeContainer.style.width = 'fill-available';
        // this.timeContainer.style.border = 'solid';
        // this.timeContainer.style.borderWidth = 'thin';
        // this.timeContainer.style.borderTopWidth = 'thick';
        // this.timeContainer.style.overflow = 'hidden';

        if (tableOptions) {
            this.rootElement.style.width = `${tableOptions.size.width}px`;
            this.rootElement.style.height = `${tableOptions.size.height}px`;

            if (tableOptions.colorschema) {
                this.rootElement.style.color = `${tableOptions.colorschema.text}`;
                this.rootElement.style.backgroundColor = `${tableOptions.colorschema.background}`;
                // this.timeContainer.style.borderColor = `${tableOptions.colorschema.borders}`;
            }
        }
    }

    render() {
        // this doesnt do anything.
        // this component is just scaffolding to hold the child views
    }
}
