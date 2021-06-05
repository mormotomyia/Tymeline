import { DataViewItem } from '../view/dataView/dataViewItem';

export class Layer {
    elements: Set<DataViewItem> = new Set();
    constructor() {}

    public start(): number {
        let start = null;
        this.elements.forEach((x) => {
            if (start === null) {
                start = x.getBoundingClientRect().left;
            } else {
                start =
                    x.getBoundingClientRect().left < start
                        ? x.getBoundingClientRect().left
                        : start;
            }
        });
        return start;
    }

    public end(): number {
        let end = null;
        this.elements.forEach((x) => {
            if (end === null) {
                end = x.getBoundingClientRect().right;
            } else {
                end =
                    x.getBoundingClientRect().right > end
                        ? x.getBoundingClientRect().right
                        : end;
            }
        });
        return end;
    }

    public canInsert(item: DataViewItem): boolean {
        if (this.elements.has(item)) return true;

        return (
            item.getBoundingClientRect().left > this.end() ||
            item.getBoundingClientRect().right < this.start()
        );
    }

    public insert(item: DataViewItem): void {
        this.elements.add(item);
    }
}
