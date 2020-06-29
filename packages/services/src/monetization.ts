// @ts-ignore
import axios, {AxiosInstance} from 'redaxios/src';
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
  private readonly baseURL: string;

  constructor(baseURL: string, app: string | null = null) {
    this.baseURL = baseURL;
    this.request = axios.create({
      withCredentials: true,
      timeout: 10000,
      headers: app ? {app} : {},
    });
  }

  async fetchAd(): Promise<Ad[]> {
    const res = await this.request.get(`${this.baseURL}/v1/a`);
    return JSON.parse(res.data).map((x: any) => ratioToSize(x));
  }
}
