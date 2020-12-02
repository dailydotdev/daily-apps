// @ts-ignore
import axios, {AxiosInstance} from 'redaxios';

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
}
