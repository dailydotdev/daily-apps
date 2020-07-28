// @ts-ignore
import axios, {AxiosInstance} from 'redaxios';
import {dateReviver, reviveJSON} from './utils';

export interface Expiration {
  expiresIn: Date,
}

export interface UserId {
  id: String,
}

export interface UserProfile {
  name: string,
  image: string,
  company?: string,
  title?: string,
}

export interface User extends UserProfile {
  id: string,
  providers?: string[],
  infoConfirmed?: boolean,
  newUser?: boolean,
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

  updateUserProfile(profile: UserProfile): Promise<User>;

  generateChallenge(): Promise<CodeChallenge>;
}

export class AuthServiceImpl implements AuthService {
  private readonly request: AxiosInstance;
  private readonly baseURL: string;

  constructor(baseURL: string, app: string | null = null) {
    this.baseURL = baseURL;
    this.request = axios.create({
      withCredentials: true,
      headers: app ? {app} : {},
    });
  }

  async logout(): Promise<void> {
    await this.request.post<void>(`${this.baseURL}/v1/users/logout`);
  }

  async authenticate(code: string, verifier: string): Promise<User> {
    const res = await this.request.post<User>(`${this.baseURL}/v1/auth/authenticate`, {code, code_verifier: verifier});
    return reviveJSON(JSON.parse(res.data), dateReviver);
  }

  getAuthorizationUrl(provider: string, redirectUri: string, codeChallenge: string): string {
    return `${this.baseURL}/v1/auth/authorize?provider=${provider}&redirect_uri=${encodeURI(redirectUri)}&code_challenge=${codeChallenge}`;
  }

  async getUserProfile(): Promise<UserId | User> {
    const res = await this.request.get(`${this.baseURL}/v1/users/me`);
    return JSON.parse(res.data);
  }

  async updateUserProfile(profile: UserProfile): Promise<User> {
    const res = await this.request.put(`${this.baseURL}/v1/users/me`, profile);
    return JSON.parse(res.data);
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