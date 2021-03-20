import dayjs from 'dayjs';
import { ITableDataEntry } from '../../interfaces/IObject';

export interface IAuthService {
    token: string;
}

export interface IDataService {
    url: string;
    getTableEntry(): Promise<Array<ITableDataEntry>>;
    getPartialTableEntry(
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ): Promise<Array<ITableDataEntry>>;
    sendTableEntry(data: Array<ITableDataEntry>): Promise<boolean>;
    sendPartialTableEntry(
        data: Array<ITableDataEntry>,
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ): Promise<boolean>;
}

export class DataService implements IDataService {
    url: string;
    auth: IAuthService;

    constructor(url: string, authService: IAuthService) {
        this.url = url;
        this.auth = authService;
    }

    async getTableEntry(): Promise<Array<ITableDataEntry>> {
        const response = await fetch(this.url + '/tableentry/get/all', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${this.auth.token}`,
            },
        });
        return response.json();
    }

    async getPartialTableEntry(
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ): Promise<Array<ITableDataEntry>> {
        const response = await fetch(this.url + '/tableentry/get/partial', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${this.auth.token}`,
            },
            body: JSON.stringify({ start: start.unix(), end: end.unix() }),
        });
        return response.json();
    }

    async sendTableEntry(data: Array<ITableDataEntry>): Promise<boolean> {
        const response = await fetch(this.url + '/tableentry/post/all', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${this.auth.token}`,
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async sendPartialTableEntry(
        data: Array<ITableDataEntry>,
        start: dayjs.Dayjs,
        end: dayjs.Dayjs
    ): Promise<boolean> {
        const response = await fetch(this.url + '/tableentry/post/partial', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${this.auth.token}`,
            },
            body: JSON.stringify({ data: data, start: start.unix(), end: end.unix() }),
        });
        return response.json();
    }
}
