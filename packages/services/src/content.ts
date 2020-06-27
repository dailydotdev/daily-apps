// @ts-ignore
import axios, {AxiosInstance} from 'redaxios';
import {dateReviver, reviveJSON} from './utils';

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
  id: String;
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

export interface SearchSuggestion {
  title: string;
}

export interface SearchSuggestionResults {
  query: string;
  hits: SearchSuggestion[];
}

export interface ContentService {
  fetchPublications(): Promise<Publication[]>;

  fetchOpenPubRequests(): Promise<PubRequest[]>;

  requestPublication(source: string): Promise<void>;

  editPubRequest(id: String, obj: PubRequestEdit): Promise<void>;

  approvePubRequest(id: String): Promise<void>;

  declinePubRequest(id: String, reason: string): Promise<void>;

  publishPubRequest(id: String): Promise<void>;

  uploadPubRequestLogo(id: String, file: File): Promise<string>;

  reportPost(postId: string, reason: string): Promise<void>;

  hidePost(postId: string): Promise<void>;

  updateFeedPublications(pubs: FeedPublication[]): Promise<void>;

  fetchFeedPublications(): Promise<object>;

  fetchUserTags(): Promise<string[]>;

  addUserTags(tags: string[]): Promise<void>;

  deleteUserTag(tag: string): Promise<void>;

  fetchPopularTags(): Promise<Tag[]>;

  searchTags(query: string): Promise<TagsSearchResult>;

  searchSuggestion(query: string): Promise<SearchSuggestionResults>;
}

export class ContentServiceImpl implements ContentService {
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

  async fetchPublications(): Promise<Publication[]> {
    const res = await this.request.get(`${this.baseURL}/v1/publications`);
    return JSON.parse(res.data).map((x: any) => reviveJSON(x, dateReviver));
  }

  async requestPublication(source: string): Promise<void> {
    await this.request.post(`${this.baseURL}/v1/publications/requests`, {source});
  }

  async fetchOpenPubRequests(): Promise<PubRequest[]> {
    const res = await this.request.get(`${this.baseURL}/v1/publications/requests/open`);
    return JSON.parse(res.data).map((x: any) => reviveJSON(x, dateReviver));
  }

  async editPubRequest(id: String, obj: PubRequestEdit): Promise<void> {
    await this.request.put(`${this.baseURL}/v1/publications/requests/${id}`, obj);
  }

  async approvePubRequest(id: String): Promise<void> {
    await this.request.post(`${this.baseURL}/v1/publications/requests/${id}/approve`);
  }

  async declinePubRequest(id: String, reason: string): Promise<void> {
    await this.request.post(`${this.baseURL}/v1/publications/requests/${id}/decline`, {reason});
  }

  async publishPubRequest(id: String): Promise<void> {
    await this.request.post(`${this.baseURL}/v1/publications/requests/${id}/publish`);
  }

  async uploadPubRequestLogo(id: String, file: File): Promise<string> {
    const MUTATION = `
  mutation UploadSourceRequestLogo($file: Upload!) {
  uploadSourceRequestLogo(id: "${id}", file: $file) {
    sourceImage
  }
}`;

    const formData = new FormData();
    formData.append('operations', JSON.stringify({
      query: MUTATION,
      variables: {file: null},
    }))
    formData.append('map', JSON.stringify({'0': ['variables.file']}))
    formData.append('0', file);
    const res: any = await this.request.post(
      `${this.baseURL}/graphql`,
      formData,
      {headers: {'Content-Type': 'multipart/form-data'}},
    );
    return JSON.parse(res.data).data.uploadSourceRequestLogo.sourceImage;
  }

  async reportPost(postId: string, reason: string): Promise<void> {
    await this.request.post(`${this.baseURL}/v1/posts/${postId}/report`, {reason});
  }

  async hidePost(postId: string): Promise<void> {
    await this.request.post(`${this.baseURL}/v1/posts/${postId}/hide`);
  }

  async fetchFeedPublications(): Promise<any> {
    const res = await this.request.get(`${this.baseURL}/v1/feeds/publications`);
    return JSON.parse(res.data).reduce((acc: any, cur: FeedPublication) => Object.assign({}, acc, {[cur.publicationId]: cur.enabled}), {});
  }

  async updateFeedPublications(pubs: FeedPublication[]): Promise<void> {
    await this.request.post<void>(`${this.baseURL}/v1/feeds/publications`, pubs);
  }

  async fetchUserTags(): Promise<string[]> {
    const res = await this.request.get(`${this.baseURL}/v1/feeds/tags`);
    return JSON.parse(res.data).map((t: any) => t.tag);
  }

  async addUserTags(tags: string[]): Promise<void> {
    await this.request.post<void>(`${this.baseURL}/v1/feeds/tags`, tags.map((tag: string) => ({tag})));
  }

  async deleteUserTag(tag: string): Promise<void> {
    await this.request.delete(`${this.baseURL}/v1/feeds/tags`, {data: {tag}});
  }

  async fetchPopularTags(): Promise<Tag[]> {
    const res = await this.request.get(`${this.baseURL}/v1/tags/popular`);
    return JSON.parse(res.data).map((x: any) => reviveJSON(x, dateReviver));
  }

  async searchTags(query: string): Promise<TagsSearchResult> {
    const res = await this.request.get(`${this.baseURL}/v1/tags/search?query=${query}`);
    return reviveJSON(JSON.parse(res.data), dateReviver);
  }

  async searchSuggestion(query: string): Promise<SearchSuggestionResults> {
    const inputParams = {query};
    const {data: res} = await this.request.post(`${this.baseURL}/graphql`, {
      query: `query postsSearchSuggestions($params: PostSearchSuggestionInput) { searchSuggestion(params: $params) { query, hits { title } } }`,
      variables: {params: inputParams},
    });

    return JSON.parse(res).data.searchSuggestion;
  }
}
