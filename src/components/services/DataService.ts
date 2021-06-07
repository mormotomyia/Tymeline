import dayjs from 'dayjs';
import { ITableDataEntry } from '../../interfaces/IObject';
import { IAuthService } from './serviceSpec/AuthServiceSpec';
import { IDataService } from './serviceSpec/DataServiceSpec';

export class DataService implements IDataService {
    url: string;
    auth: IAuthService;

    constructor(url: string, authService: IAuthService) {
        this.url = url;
        this.auth = authService;
    }

    async getTableEntry(): Promise<Array<ITableDataEntry>> {
        const response = await fetch(this.url + '/tymeline/get', {
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

    async getTableEntryById(id: string): Promise<ITableDataEntry> {
        const response = await fetch(this.url + `/tymeline/get/${id}`, {
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
        let url = this.url + '/tymeline/partial';
        const query = { start: start.unix(), end: end.unix() };
        url += '?' + this.objectToQueryString(query);

        const response = await fetch(url, {
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

    async sendTableEntry(data: Array<ITableDataEntry>): Promise<boolean> {
        const response = await fetch(this.url + '/tymeline/create/multiple', {
            method: 'POST',
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

    async updateSingleTableEntry(data: ITableDataEntry): Promise<boolean> {
        const response = await fetch(this.url + 'tableentry/update', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${this.auth.token}`,
            },
            body: JSON.stringify({ data: data }),
        });
        return response.json();
    }

    async createSingleTableEntry(data: ITableDataEntry): Promise<boolean> {
        const response = await fetch(this.url + 'tableentry/create', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${this.auth.token}`,
            },
            body: JSON.stringify({ data: data }),
        });
        return response.json();
    }

    private objectToQueryString(obj) {
        return Object.keys(obj)
            .map((key) => key + '=' + obj[key])
            .join('&');
    }
}
