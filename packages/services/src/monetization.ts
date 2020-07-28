// @ts-ignore
import axios, {AxiosInstance} from 'redaxios';

export interface Ad {
  link: string;
  description: string;
  image: string;
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
      headers: app ? {app} : {},
    });
  }

  async fetchAd(): Promise<Ad[]> {
    const res = await this.request.get(`${this.baseURL}/v1/a`);
    return res.data;
  }
}
