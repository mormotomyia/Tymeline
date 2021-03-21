export interface IAuthService {
    token: string;
    getNewToken(): Promise<string>;
}
