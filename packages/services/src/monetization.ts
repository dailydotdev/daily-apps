import {Ad} from './types';
import axios, {AxiosInstance} from 'axios';
import {attach as raxAttach} from 'retry-axios';
import {ratioToSize} from "./utils";

export interface MonetizationService {
    fetchAd(): Promise<Ad[]>;
}

export class MonetizationServiceImpl implements MonetizationService {
    request: AxiosInstance;

    constructor(baseURL: string) {
        this.request = axios.create({
            baseURL,
            withCredentials: true,
            timeout: 2000,
        });

        this.request.defaults = Object.assign({}, this.request.defaults, {
            raxConfig: {
                instance: this.request,
            }
        });
        raxAttach(this.request);
    }

    async fetchAd(): Promise<Ad[]> {
        const res = await this.request.get<any[]>('/v1/a');
        return res.data.map(x => {
            if (x.ratio) {
                x.size = ratioToSize(x.ratio);
            } else {
                x.size = 'small';
            }
            delete x.ratio;
            return x as Ad;
        });
    }
}
