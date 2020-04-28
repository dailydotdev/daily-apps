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
    views: number;
    readTime?: number;
}

export interface FeedPublication {
    publicationId: string,
    enabled: boolean,
}

export interface Tag {
    name: string;
}

export interface TagsSearchResult {
    query: string;
    hits: Tag[];
}

export interface PubRequest {
    id: Number;
    createdAt: Date;
    url: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    approved?: boolean;
    reason?: string;
    pubId?: string;
    pubName?: string;
    pubImage?: string;
    pubTwitter?: string;
    pubRss?: string;
    closed: boolean;
}

export interface PubRequestEdit {
    url?: string;
    pubId?: string;
    pubName?: string;
    pubImage?: string;
    pubTwitter?: string;
    pubRss?: string;
}

export interface PostsSearchResult {
    query: string;
    hits: Post[];
}

export interface SearchSuggestion {
    title: string;
}

export interface SearchSuggestionResults {
    query: string;
    hits: SearchSuggestion[];
}

export interface ContentService {
    setIsLoggedIn(isLogged: boolean): void;

    fetchPublications(): Promise<Publication[]>;

    requestPublication(source: string): Promise<void>;

    fetchOpenPubRequests(): Promise<PubRequest[]>;

    editPubRequest(id: Number, obj: PubRequestEdit): Promise<void>;

    approvePubRequest(id: Number): Promise<void>;

    declinePubRequest(id: Number, reason: string): Promise<void>;

    publishPubRequest(id: Number): Promise<void>;

    uploadPubRequestLogo(id: Number, file: File): Promise<string>;

    reportPost(postId: string, reason: string): Promise<void>;

    hidePost(postId: string): Promise<void>;

    fetchLatestPosts(latest: Date, page: number, pubs?: string[], tags?: string[]): Promise<Post[]>;

    fetchPostsByPublication(latest: Date, page: number, pub: string): Promise<Post[]>;

    fetchPostsByTag(latest: Date, page: number, tag: string): Promise<Post[]>;

    fetchBookmarks(latest: Date, page: number): Promise<Post[]>;

    updateFeedPublications(pubs: FeedPublication[]): Promise<void>;

    fetchFeedPublications(): Promise<object>;

    fetchUserTags(): Promise<string[]>;

    addUserTags(tags: string[]): Promise<void>;

    deleteUserTag(tag: string): Promise<void>;

    addBookmarks(ids: string[]): Promise<void>;

    removeBookmark(id: string): Promise<void>;

    fetchPopularTags(): Promise<Tag[]>;

    searchTags(query: string): Promise<TagsSearchResult>;

    searchPosts(latest: Date, page: number, query: string): Promise<PostsSearchResult>;

    searchSuggestion(query: string): Promise<SearchSuggestionResults>;
}

export class ContentServiceImpl implements ContentService {
    private readonly request: AxiosInstance;
    private readonly baseURL: string;
    private readonly pageSize: number;
    private isLogged: boolean = false;

    constructor(baseURL: string, pageSize: number, app: string | null = null) {
        this.baseURL = baseURL;
        this.pageSize = pageSize;
        this.request = axios.create({
            baseURL,
            withCredentials: true,
            timeout: 10000,
            headers: app ? {app} : {},
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

    private getPostFields(): string {
        const base = 'id,title,url,publishedAt,createdAt,image,ratio,placeholder,views,readTime,publication { id, name, image },tags';
        if (this.isLogged) {
            return `${base},bookmarked,read`;
        }

        return base;
    }

    setIsLoggedIn(isLogged: boolean): void {
        this.isLogged = isLogged;
    }

    async fetchPublications(): Promise<Publication[]> {
        const res = await this.request.get('/v1/publications');
        return res.data.map((x: any) => reviveJSON(x, dateReviver));
    }

    async requestPublication(source: string): Promise<void> {
        await this.request.post('/v1/publications/requests', {source});
    }

    async fetchOpenPubRequests(): Promise<PubRequest[]> {
        const res = await this.request.get('/v1/publications/requests/open');
        return res.data.map((x: any) => reviveJSON(x, dateReviver));
    }

    async editPubRequest(id: Number, obj: PubRequestEdit): Promise<void> {
        await this.request.put(`/v1/publications/requests/${id}`, obj);
    }

    async approvePubRequest(id: Number): Promise<void> {
        await this.request.post(`/v1/publications/requests/${id}/approve`);
    }

    async declinePubRequest(id: Number, reason: string): Promise<void> {
        await this.request.post(`/v1/publications/requests/${id}/decline`, {reason});
    }

    async publishPubRequest(id: Number): Promise<void> {
        await this.request.post(`/v1/publications/requests/${id}/publish`);
    }

    async uploadPubRequestLogo(id: Number, file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        const res: any = await this.request.post(
            `/v1/publications/requests/${id}/logo`,
            formData,
            {headers: {'Content-Type': 'multipart/form-data'}},
        );
        return res.data.img;
    }

    async reportPost(postId: string, reason: string): Promise<void> {
        await this.request.post(`/v1/posts/${postId}/report`, {reason});
    }

    async hidePost(postId: string): Promise<void> {
        await this.request.post(`/v1/posts/${postId}/hide`);
    }

    async fetchLatestPosts(latest: Date, page: number, pubs?: string[], tags?: string[], sortBy: string = 'popularity', showOnlyNotReadPosts: boolean = false): Promise<Post[]> {
        const inputParams = {
            latest: latest.toISOString(),
            page,
            pageSize: this.pageSize,
            ...pubs && {pubs: pubs.join()},
            ...tags && {tags: tags.join()},
            sortBy,
            ...showOnlyNotReadPosts && {read: false}
        };

        const {data: res} = await this.request.get('/graphql', {
            params: {
                query: `query fetchLatest($params: QueryPostInput) { latest(params: $params) { ${this.getPostFields()} } }`,
                variables: {params: inputParams},
            },
        });

        return res.data.latest.map((p: any) => this.mapPost(p));
    }

    async fetchPostsByPublication(latest: Date, page: number, pub: string): Promise<Post[]> {
        const inputParams = {
            latest: latest.toISOString(),
            page,
            pageSize: this.pageSize,
            pub,
        };

        const {data: res} = await this.request.get('/graphql', {
            params: {
                query: `query fetchPostsByPublication($params: PostByPublicationInput) { postsByPublication(params: $params) { ${this.getPostFields()} } }`,
                variables: {params: inputParams},
            },
        });

        return res.data.postsByPublication.map((p: any) => this.mapPost(p));
    }

    async fetchPostsByTag(latest: Date, page: number, tag: string): Promise<Post[]> {
        const inputParams = {
            latest: latest.toISOString(),
            page,
            pageSize: this.pageSize,
            tag,
        };

        const {data: res} = await this.request.get('/graphql', {
            params: {
                query: `query fetchPostsByTag($params: PostByTagInput) { postsByTag(params: $params) { ${this.getPostFields()} } }`,
                variables: {params: inputParams},
            },
        });

        return res.data.postsByTag.map((p: any) => this.mapPost(p));
    }

    async fetchBookmarks(latest: Date, page: number): Promise<Post[]> {
        const inputParams = {
            latest: latest.toISOString(),
            page,
            pageSize: this.pageSize,
        };

        const {data: res} = await this.request.get('/graphql', {
            params: {
                query: `query fetchBookmarks($params: QueryPostInput) { bookmarks(params: $params) { ${this.getPostFields()} } }`,
                variables: {params: inputParams},
            },
        });

        return res.data.bookmarks.map((p: any) => this.mapPost(p));
    }

    async fetchFeedPublications(): Promise<any> {
        const res = await this.request.get('/v1/feeds/publications');
        return res.data.reduce((acc: any, cur: FeedPublication) => Object.assign({}, acc, {[cur.publicationId]: cur.enabled}), {});
    }

    async updateFeedPublications(pubs: FeedPublication[]): Promise<void> {
        await this.request.post<void>('/v1/feeds/publications', pubs);
    }

    async fetchUserTags(): Promise<string[]> {
        const res = await this.request.get('/v1/feeds/tags');
        return res.data.map((t: any) => t.tag);
    }

    async addUserTags(tags: string[]): Promise<void> {
        await this.request.post<void>('/v1/feeds/tags', tags.map((tag: string) => ({tag})));
    }

    async deleteUserTag(tag: string): Promise<void> {
        await this.request.delete('/v1/feeds/tags', {data: {tag}});
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

    async searchTags(query: string): Promise<TagsSearchResult> {
        const res = await this.request.get(`/v1/tags/search?query=${query}`);
        return reviveJSON(res.data, dateReviver);
    }

    async searchPosts(latest: Date, page: number, query: string): Promise<PostsSearchResult> {
        const inputParams = {
            latest: latest.toISOString(),
            page,
            pageSize: this.pageSize,
            query,
        };

        const {data: res} = await this.request.get('/graphql', {
            params: {
                query: `query postsSearch($params: PostSearchInput) { search(params: $params) { query, hits { ${this.getPostFields()} } } }`,
                variables: {params: inputParams},
            },
        });

        return {
            query: res.data.search.query,
            hits: res.data.search.hits.map((p: any) => this.mapPost(p)),
        };
    }

    async searchSuggestion(query: string): Promise<SearchSuggestionResults> {
        const inputParams = {query};
        const {data: res} = await this.request.get('/graphql', {
            params: {
                query: `query postsSearchSuggestions($params: PostSearchSuggestionInput) { searchSuggestion(params: $params) { query, hits { title } } }`,
                variables: {params: inputParams},
            },
        });

        return res.data.searchSuggestion;
    }
}
