import axios, {AxiosInstance} from 'axios';
import {dateReviver, ratioToSize, reviveJSON} from './utils';

export interface Publication {
    id: string;
    name: string;
    image: string;
}

export interface Post {
    id: string;
    title: string;
    url: string;
    publishedAt?: Date;
    createdAt: Date;
    publication: Publication;
    image: string;
    size: string;
    placeholder: string;
    bookmarked?: boolean;
}

export interface FeedPublication {
    publicationId: string,
    enabled: boolean,
}

export interface ContentService {
    setAccessToken(token: string): void;

    clearAccessToken(): void;

    fetchPublications(): Promise<Publication[]>;

    fetchLatestPosts(latest: Date, page: number, pubs?: string[]): Promise<Post[]>;

    fetchBookmarks(latest: Date, page: number): Promise<Post[]>;

    updateFeedPublications(pubs: FeedPublication[]): Promise<void>;

    fetchFeedPublications(): Promise<object>;

    addBookmarks(ids: string[]): Promise<void>;

    removeBookmark(id: string): Promise<void>;
}

export class ContentServiceImpl implements ContentService {
    private readonly request: AxiosInstance;
    private readonly baseURL: string;
    private readonly pageSize: number;

    constructor(baseURL: string, pageSize: number) {
        this.baseURL = baseURL;
        this.pageSize = pageSize;
        this.request = axios.create({
            baseURL,
            withCredentials: true,
            timeout: 2000,
        });
    }

    private redirectLink(post: Post) {
        return `${this.baseURL}/r/${post.id}`;
    }

    private mapPost(data: any): Post {
        return Object.assign({},
            ratioToSize(reviveJSON(data, dateReviver)),
            {url: this.redirectLink(data)});
    }

    setAccessToken(token: string): void {
        this.request.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    clearAccessToken(): void {
        delete this.request.defaults.headers.common['Authorization'];
    }

    async fetchPublications(): Promise<Publication[]> {
        const res = await this.request.get('/v1/publications');
        return res.data.map((x: any) => reviveJSON(x, dateReviver));
    }

    async fetchLatestPosts(latest: Date, page: number, pubs?: string[]): Promise<Post[]> {
        const res = await this.request.get(`/v1/posts/latest?latest=${latest.toISOString()}&page=${page}&pageSize=${this.pageSize}${pubs ? `&pubs=${pubs.join(',')}` : ''}`);
        return res.data.map((p: any) => this.mapPost(p));
    }

    async fetchBookmarks(latest: Date, page: number): Promise<Post[]> {
        const res = await this.request.get(`/v1/posts/bookmarks?latest=${latest.toISOString()}&page=${page}&pageSize=${this.pageSize}`);
        return res.data.map((p: any) => this.mapPost(p));
    }

    async fetchFeedPublications(): Promise<any> {
        const res = await this.request.get('/v1/feeds/publications');
        return res.data.reduce((acc: any, cur: FeedPublication) => Object.assign({}, acc, {[cur.publicationId]: cur.enabled}), {});
    }

    async updateFeedPublications(pubs: FeedPublication[]): Promise<void> {
        await this.request.post<void>('/v1/feeds/publications', pubs);
    }

    async addBookmarks(ids: string[]): Promise<void> {
        await this.request.post<void>('/v1/posts/bookmarks', ids);
    }

    async removeBookmark(id: string): Promise<void> {
        await this.request.delete(`/v1/posts/${id}/bookmark`);
    }
}
