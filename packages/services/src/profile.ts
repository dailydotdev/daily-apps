import axios, {AxiosInstance} from 'axios';
import {dateReviver, reviveJSON} from './utils';

export interface Settings {
    appInsaneMode: boolean;
    enableCardAnimations: boolean;
    insaneMode: boolean;
    showTopSites: boolean;
    theme: string;
    spaciness: string;
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

    constructor(baseURL: string, app: string | null = null) {
        this.request = axios.create({
            baseURL,
            withCredentials: true,
            timeout: 10000,
            headers: app ? {app} : {},
        });
    }

    async fetchSettings(): Promise<Settings> {
        const res = await this.request.get('/v1/settings');
        return res.data;
    }

    async updateSettings(settings: Settings): Promise<void> {
        await this.request.post<void>('/v1/settings', settings);
    }

    async fetchNotifications(since: Date): Promise<Notification[]> {
        const res = await this.request.get(`/v1/notifications${since ? `?since=${since.toISOString()}` : ''}`);
        return res.data.map((x: any) => reviveJSON(x, dateReviver));
    }

}
