import { ITableData } from '../../interfaces/IObject';
import dayjs from 'dayjs';

function log(ev: any) {
    console.log(ev);
}

export class TableData implements ITableData {
    id: string;
    canMove: boolean;
    canChangeLength: boolean;

    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    content: { text: string };

    get length() {
        return this.end.diff(this.start, 'second');
    }

    static fromLength(
        id: number | string,
        content: { text: string },
        start: number | string | dayjs.Dayjs,
        length: number,
        canMove: boolean,
        canChangeLength: boolean
    ): TableData {
        if (typeof start === 'number') {
            start = dayjs(start);
        } else if (typeof start === 'string') {
            start = dayjs(start);
        }
        const end = start.add(length, 'second');
        return new TableData(id, content, start, end, canMove, canChangeLength);
    }

    constructor(
        id: number | string,
        content: { text: string },
        start: number | string | dayjs.Dayjs,
        end: number | string | dayjs.Dayjs,
        canMove: boolean,
        canChangeLength: boolean
    ) {
        if (typeof start === 'number') {
            this.start = dayjs(start);
        } else if (typeof start === 'string') {
            this.start = dayjs(start);
        } else {
            this.start = start;
        }

        if (typeof end === 'number') {
            this.end = dayjs(end);
        } else if (typeof end === 'string') {
            this.end = dayjs(end);
        } else {
            this.end = end;
        }

        this.id = id.toString();
        this.content = content;
        this.canChangeLength = canChangeLength;
        this.canMove = canMove;
    }

    changeLength(delta: number, start: boolean): void {
        if (start) {
            this.start = this.end.subtract(delta, 'seconds');
        } else {
            this.end = this.start.add(delta, 'seconds');
        }
    }

    move(delta: number): void {
        this.start = this.start.add(delta, 'second');
        this.end = this.end.add(delta, 'second');
    }
}
