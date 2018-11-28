import axios, {AxiosInstance} from 'axios';
import {dateReviver, reviveJSON} from './utils';

export interface AccessToken {
    token: string,
    expiresIn: Date,
}

export interface User {
    id: string,
    providers: string[],
    name: string,
    image: string,
    newUser: boolean,
    accessToken: string,
    expiresIn: Date,
    refreshToken: string,
}

export interface AuthService {
    refreshToken(token: string): Promise<AccessToken>;

    logout(): Promise<void>;

    authenticate(provider: string, code: string): Promise<User>;

    getAuthorizationUrl(provider: string, redirectUri: string): string;

    getUserId(): Promise<string>;
}

export class AuthServiceImpl implements AuthService {
    private readonly request: AxiosInstance;
    private readonly baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.request = axios.create({
            baseURL,
            withCredentials: true,
            timeout: 2000,
        });
    }

    async refreshToken(token: string): Promise<AccessToken> {
        const res = await this.request.post('/v1/auth/refresh', {refreshToken: token});
        return reviveJSON(res.data, dateReviver);
    }

    async logout(): Promise<void> {
        await this.request.post<void>('/v1/users/logout');
    }

    async authenticate(provider: string, code: string): Promise<User> {
        const res = await this.request.post<User>(`/v1/auth/${provider}/authenticate`, {code});
        return reviveJSON(res.data, dateReviver);
    }

    getAuthorizationUrl(provider: string, redirectUri: string): string {
        return `${this.baseURL}/v1/auth/${provider}/authorize?redirect_uri=${encodeURI(redirectUri)}`;
    }

    async getUserId(): Promise<string> {
        const res = await this.request.get('/v1/users/me');
        return res.data.id;
    }
}