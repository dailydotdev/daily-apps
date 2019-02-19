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

export interface Tag {
    name: string;
}

export interface ContentService {
    setAccessToken(token: string): void;

    clearAccessToken(): void;

    fetchPublications(): Promise<Publication[]>;

    fetchLatestPosts(latest: Date, page: number, pubs?: string[], tags?: string[]): Promise<Post[]>;

    fetchPostsByPublication(latest: Date, page: number, pub: string): Promise<Post[]>;

    fetchPostsByTag(latest: Date, page: number, tag: string): Promise<Post[]>;

    fetchBookmarks(latest: Date, page: number): Promise<Post[]>;

    updateFeedPublications(pubs: FeedPublication[]): Promise<void>;

    fetchFeedPublications(): Promise<object>;

    addBookmarks(ids: string[]): Promise<void>;

    removeBookmark(id: string): Promise<void>;

    fetchPopularTags(): Promise<Tag[]>;
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

    private static mapQueryArray(key: string, value?: any[]): string {
        return (value && value.length) ? `&${key}=${value.join(',')}` : '';
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

    async fetchLatestPosts(latest: Date, page: number, pubs?: string[], tags?: string[]): Promise<Post[]> {
        // TODO: add tests for tags
        const res = await this.request.get(`/v1/posts/latest?latest=${latest.toISOString()}&page=${page}&pageSize=${this.pageSize}${ContentServiceImpl.mapQueryArray('pubs', pubs)}${ContentServiceImpl.mapQueryArray('tags', tags)}`);
        return res.data.map((p: any) => this.mapPost(p));
    }

    async fetchPostsByPublication(latest: Date, page: number, pub: string): Promise<Post[]> {
        const res = await this.request.get(`/v1/posts/publication?latest=${latest.toISOString()}&page=${page}&pageSize=${this.pageSize}&pub=${pub}`);
        return res.data.map((p: any) => this.mapPost(p));
    }

    async fetchPostsByTag(latest: Date, page: number, tag: string): Promise<Post[]> {
        const res = await this.request.get(`/v1/posts/tag?latest=${latest.toISOString()}&page=${page}&pageSize=${this.pageSize}&tag=${tag}`);
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

    async fetchPopularTags(): Promise<Tag[]> {
        const res = await this.request.get('/v1/tags/popular');
        return res.data.map((x: any) => reviveJSON(x, dateReviver));
    }
}
