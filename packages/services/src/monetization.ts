import axios, {AxiosInstance} from 'axios';
import {ratioToSize} from './utils';

export interface Ad {
    link: string;
    description: string;
    image: string;
    size: string;
    placeholder?: string;
    company?: string;
    pixel?: string[];
    backgroundColor?: string;
    source: string;
    referralLink?: string;
}

export interface MonetizationService {
    fetchAd(): Promise<Ad[]>;
}

export class MonetizationServiceImpl implements MonetizationService {
    private readonly request: AxiosInstance;

    constructor(baseURL: string, app: string | null = null) {
        this.request = axios.create({
            baseURL,
            withCredentials: true,
            timeout: 10000,
            headers: app ? {app} : {},
        });
    }

    async fetchAd(): Promise<Ad[]> {
        const res = await this.request.get<any[]>('/v1/a');
        return res.data.map(x => ratioToSize(x));
    }
}
