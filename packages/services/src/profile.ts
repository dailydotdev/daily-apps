// @ts-ignore
import axios, {AxiosInstance} from 'redaxios';
import {dateReviver, reviveJSON} from './utils';

export interface Settings {
  appInsaneMode: boolean;
  enableCardAnimations: boolean;
  insaneMode: boolean;
  showTopSites: boolean;
  theme: string;
  spaciness: string;
  showOnlyNotReadPosts: boolean;
  openNewTab: boolean;
}

export interface Notification {
  html: string;
  timestamp: Date;
}

export interface ProfileService {
  fetchSettings(): Promise<Settings>;

  updateSettings(settings: Settings): Promise<void>;

  fetchNotifications(since: Date): Promise<Notification[]>;
}

export class ProfileServiceImpl implements ProfileService {
  private readonly request: AxiosInstance;
  private readonly baseURL: string;

  constructor(baseURL: string, app: string | null = null) {
    this.baseURL = baseURL;
    this.request = axios.create({
      withCredentials: true,
      headers: app ? {app} : {},
    });
  }

  async fetchSettings(): Promise<Settings> {
    const res = await this.request.get(`${this.baseURL}/v1/settings`);
    return res.data;
  }

  async updateSettings(settings: Settings): Promise<void> {
    await this.request.post(`${this.baseURL}/v1/settings`, settings);
  }

  async fetchNotifications(since: Date): Promise<Notification[]> {
    const res = await this.request.get(`${this.baseURL}/v1/notifications${since ? `?since=${since.toISOString()}` : ''}`);
    return res.data.map((x: any) => reviveJSON(x, dateReviver));
  }

}
