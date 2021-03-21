import { IAuthService } from './serviceSpec/AuthServiceSpec';

export class AuthService implements IAuthService {
    token!: string;
    url: string;
    constructor(url: string) {
        this.url = url;
    }

    getNewToken(): Promise<any> {
        return fetch(this.url + '/auth', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: document.cookie }),
        })
            .then((value) => value.json())
            .catch((error) => error);
    }
}
