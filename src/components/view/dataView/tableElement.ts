export class TableElement {
    content: { text: string };
    id: string | number;
    length: number;
    initialized = false;
    start: number;

    constructor(
        id: string | number,
        length: number,
        start: number,
        content: { text: string }
    ) {
        // this.root = container
        this.start = start;
        this.id = id;
        this.length = length;
        this.content = content;
    }

    destroy(): void {}

    redraw() {
        if (this.initialized) {
            // do something
        }
    }
}
