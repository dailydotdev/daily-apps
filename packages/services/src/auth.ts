import axios, {AxiosInstance} from 'axios';
import {dateReviver, reviveJSON} from './utils';

export interface Expiration {
    expiresIn: Date,
}

export interface UserId {
    id: String,
}

export interface User {
    id: string,
    providers: string[],
    name: string,
    image: string,
    newUser: boolean,
}

export interface CodeChallenge {
    challenge: string,
    verifier: string,
}

export interface AuthService {
    logout(): Promise<void>;

    authenticate(code: string, verifier: string): Promise<User>;

    getAuthorizationUrl(provider: string, redirectUri: string, codeChallenge: string): string;

    getUserProfile(): Promise<UserId | User>;

    generateChallenge(): Promise<CodeChallenge>;
}

export class AuthServiceImpl implements AuthService {
    private readonly request: AxiosInstance;
    private readonly baseURL: string;

    constructor(baseURL: string, app: string | null = null) {
        this.baseURL = baseURL;
        this.request = axios.create({
            baseURL,
            withCredentials: true,
            timeout: 10000,
            headers: app ? {app} : {},
        });
    }

    async logout(): Promise<void> {
        await this.request.post<void>('/v1/users/logout');
    }

    async authenticate(code: string, verifier: string): Promise<User> {
        const res = await this.request.post<User>(`/v1/auth/authenticate`, {code, code_verifier: verifier});
        return reviveJSON(res.data, dateReviver);
    }

    getAuthorizationUrl(provider: string, redirectUri: string, codeChallenge: string): string {
        return `${this.baseURL}/v1/auth/authorize?provider=${provider}&redirect_uri=${encodeURI(redirectUri)}&code_challenge=${codeChallenge}`;
    }

    async getUserProfile(): Promise<UserId | User> {
        const res = await this.request.get('/v1/users/me');
        return res.data;
    }

    async generateChallenge(): Promise<CodeChallenge> {
        const array = new Uint32Array(32);
        window.crypto.getRandomValues(array);
        const verifier = Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');

        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const hashed = await window.crypto.subtle.digest('SHA-256', data);
        const challenge = btoa(String.fromCharCode(...new Uint8Array(hashed)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
        return {verifier, challenge};
    }
}