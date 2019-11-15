import axios from 'axios';
// @ts-ignore
import httpAdapter from 'axios/lib/adapters/http';
// @ts-ignore
import nock from 'nock';
import {ContentServiceImpl, FeedPublication, Publication, Tag, PubRequest, PubRequestEdit} from '../src';
import {expected as latestExpected, response as latestResponse} from './fixtures/latest';
import {expected as bookExpected, response as bookResponse} from './fixtures/bookmarks';
import {expected as feedPubsExpected, response as feedPubsResponse} from './fixtures/feedPubs';

axios.defaults.adapter = httpAdapter;

const baseURL = 'http://localhost:3000';
const service = new ContentServiceImpl(baseURL, 5);

const postFields = 'id,title,url,publishedAt,createdAt,image,ratio,placeholder,views,readTime,publication { id, name, image },tags';
const fetchLatestQuery = `query fetchLatest($params: QueryPostInput) { latest(params: $params) { ${postFields} } }`;
const fetchPersonalLatestQuery = `query fetchLatest($params: QueryPostInput) { latest(params: $params) { ${postFields},bookmarked,read } }`;
const fetchPostsByPublicationQuery = `query fetchPostsByPublication($params: PostByPublicationInput) { postsByPublication(params: $params) { ${postFields} } }`;
const fetchPostsByTagQuery = `query fetchPostsByTag($params: PostByTagInput) { postsByTag(params: $params) { ${postFields} } }`;
const fetchBookmarksQuery = `query fetchBookmarks($params: QueryPostInput) { bookmarks(params: $params) { ${postFields},bookmarked,read } }`;

// See https://github.com/axios/axios/blob/master/lib/helpers/buildURL.js
function encode(val: string) {
    return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

beforeEach(() => {
    service.clearAccessToken();
});

it('should fetch publications from server', async () => {
    const expected: Publication[] = require('./fixtures/pubs.json');
    nock(baseURL)
        .get('/v1/publications')
        .reply(200, expected);

    const actual = await service.fetchPublications();

    expect(actual).toEqual(expected);
});

it('should send publication request', async () => {
    const body = {source: 'https://www.dailynow.co'};
    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .post('/v1/publications/requests', body)
        .reply(204);

    service.setAccessToken('token');

    await service.requestPublication(body.source);
});

it('should report post', async () => {
    const reason = 'nsfw';
    const postId = '12345';
    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .post(`/v1/posts/${postId}/report`, {reason})
        .reply(204);

    service.setAccessToken('token');

    await service.reportPost(postId, reason);
});

it('should hide post', async () => {
    const postId = '12345';
    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .post(`/v1/posts/${postId}/hide`)
        .reply(204);

    service.setAccessToken('token');

    await service.hidePost(postId);
});

it('should fetch open pub requests from server', async () => {
    const response = require('./fixtures/pubRequests.json');
    const expected: PubRequest[] = response.map((x: any) => ({...x, createdAt: new Date(x.createdAt)}));

    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .get('/v1/publications/requests/open')
        .reply(200, response);

    service.setAccessToken('token');

    const actual = await service.fetchOpenPubRequests();
    expect(actual).toEqual(expected);
});

it('should edit an existing pub request', async () => {
    const payload: PubRequestEdit = {url: 'https://dailynow.co'};

    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .put('/v1/publications/requests/1', payload)
        .reply(204);

    service.setAccessToken('token');

    await service.editPubRequest(1, payload);
});

it('should approve an existing pub request', async () => {
    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .post('/v1/publications/requests/1/approve')
        .reply(204);

    service.setAccessToken('token');

    await service.approvePubRequest(1);
});

it('should decline an existing pub request', async () => {
    const reason: string = 'exists';

    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .post('/v1/publications/requests/1/decline', {reason})
        .reply(204);

    service.setAccessToken('token');

    await service.declinePubRequest(1, reason);
});

it('should publish an existing pub request', async () => {
    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .post('/v1/publications/requests/1/publish')
        .reply(204);

    service.setAccessToken('token');

    await service.publishPubRequest(1);
});

it('should fetch latest posts from server', async () => {
    const inputParams = {
        latest: '2018-11-28T08:27:45.612Z',
        page: 0,
        pageSize: 5,
        pubs: 'airbnb,alligator,angular',
        tags: 'angular,vue,webdev',
        sortBy: 'popularity',
    };

    const query = `${encode(fetchLatestQuery)}&variables=${encode(JSON.stringify({params: inputParams}))}`;

    nock(baseURL)
        .get(`/graphql?query=${query}`)
        .reply(200, {data: {latest: latestResponse}});

    const actual = await service.fetchLatestPosts(
        new Date('2018-11-28T08:27:45.612Z'),
        0,
        ['airbnb', 'alligator', 'angular'],
        ['angular', 'vue', 'webdev'],
    );

    expect(actual).toEqual(latestExpected);
});

it('should fetch personal latest posts from server', async () => {
    const inputParams = {
        latest: '2018-11-28T08:27:45.612Z',
        page: 0,
        pageSize: 5,
        sortBy: 'popularity',
    };

    const query = `${encode(fetchPersonalLatestQuery)}&variables=${encode(JSON.stringify({params: inputParams}))}`;

    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .get(`/graphql?query=${query}`)
        .reply(200, {data: {latest: latestResponse}});

    service.setAccessToken('token');

    const actual = await service.fetchLatestPosts(
        new Date('2018-11-28T08:27:45.612Z'),
        0,
    );

    expect(actual).toEqual(latestExpected);
});

it('should fetch posts by publication from server', async () => {
    const inputParams = {
        latest: '2018-11-28T08:27:45.612Z',
        page: 0,
        pageSize: 5,
        pub: 'airbnb',
    };

    const query = `${encode(fetchPostsByPublicationQuery)}&variables=${encode(JSON.stringify({params: inputParams}))}`;

    nock(baseURL)
        .get(`/graphql?query=${query}`)
        .reply(200, {data: {postsByPublication: latestResponse}});

    const actual = await service.fetchPostsByPublication(
        new Date('2018-11-28T08:27:45.612Z'),
        0,
        'airbnb',
    );

    expect(actual).toEqual(latestExpected);
});

it('should fetch posts by tag from server', async () => {
    const inputParams = {
        latest: '2018-11-28T09:27:45.612Z',
        page: 0,
        pageSize: 5,
        tag: 'webdev',
    };

    const query = `${encode(fetchPostsByTagQuery)}&variables=${encode(JSON.stringify({params: inputParams}))}`;

    nock(baseURL)
        .get(`/graphql?query=${query}`)
        .reply(200, {data: {postsByTag: latestResponse}});

    const actual = await service.fetchPostsByTag(
        new Date('2018-11-28T09:27:45.612Z'),
        0,
        'webdev',
    );

    expect(actual).toEqual(latestExpected);
});

it('should clear access token', async () => {
    const inputParams = {
        latest: '2018-11-28T08:27:45.612Z',
        page: 0,
        pageSize: 5,
        sortBy: 'popularity',
    };

    const query1 = `${encode(fetchPersonalLatestQuery)}&variables=${encode(JSON.stringify({params: inputParams}))}`;
    const query2 = `${encode(fetchLatestQuery)}&variables=${encode(JSON.stringify({params: inputParams}))}`;

    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .get(`/graphql?query=${query1}`)
        .reply(200, {data: {latest: latestResponse}});

    service.setAccessToken('token');

    await service.fetchLatestPosts(
        new Date('2018-11-28T08:27:45.612Z'),
        0,
    );

    nock(baseURL)
        .matchHeader('authorization', (val: string) => !val)
        .get(`/graphql?query=${query2}`)
        .reply(200, {data: {latest: latestResponse}});

    service.clearAccessToken();

    await service.fetchLatestPosts(
        new Date('2018-11-28T08:27:45.612Z'),
        0,
    );
});

it('should fetch bookmarks from server', async () => {
    const inputParams = {
        latest: '2018-11-28T08:27:45.612Z',
        page: 0,
        pageSize: 5,
    };

    const query = `${encode(fetchBookmarksQuery)}&variables=${encode(JSON.stringify({params: inputParams}))}`;

    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .get(`/graphql?query=${query}`)
        .reply(200, {data: {bookmarks: bookResponse}});

    service.setAccessToken('token');

    const actual = await service.fetchBookmarks(
        new Date('2018-11-28T08:27:45.612Z'),
        0,
    );

    expect(actual).toEqual(bookExpected);
});

it('should fetch feed pubs from server', async () => {
    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .get('/v1/feeds/publications')
        .reply(200, feedPubsResponse);

    service.setAccessToken('token');

    const actual = await service.fetchFeedPublications();

    expect(actual).toEqual(feedPubsExpected);
});

it('should update feed pubs', async () => {
    const body: FeedPublication[] = [{
        publicationId: 'angular',
        enabled: false,
    }];

    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .post('/v1/feeds/publications', body)
        .reply(204);

    service.setAccessToken('token');

    await service.updateFeedPublications(body);
});

it('should fetch user tags from server', async () => {
    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .get('/v1/feeds/tags')
        .reply(200, [{tag: 'javascript'}, {tag: 'golang'}]);

    service.setAccessToken('token');

    const actual = await service.fetchUserTags();

    expect(actual).toEqual(['javascript', 'golang']);
});

it('should add user tags', async () => {
    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .post('/v1/feeds/tags', [{tag: 'javascript'}])
        .reply(204);

    service.setAccessToken('token');

    await service.addUserTags(['javascript']);
});

it('should delete user tags', async () => {
    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .delete('/v1/feeds/tags', {tag: 'javascript'})
        .reply(204);

    service.setAccessToken('token');

    await service.deleteUserTag('javascript');
});

it('should add bookmarks', async () => {
    const body: string[] = ['id'];

    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .post('/v1/posts/bookmarks', body)
        .reply(204);

    service.setAccessToken('token');

    await service.addBookmarks(body);
});

it('should remove bookmark', async () => {
    const id = 'id';

    nock(baseURL)
        .matchHeader('authorization', 'Bearer token')
        .delete(`/v1/posts/${id}/bookmark`)
        .reply(204);

    service.setAccessToken('token');

    await service.removeBookmark(id);
});

it('should fetch popular tags from server', async () => {
    const expected: Tag[] = require('./fixtures/tags.json');

    nock(baseURL)
        .get('/v1/tags/popular')
        .reply(200, expected);

    const actual = await service.fetchPopularTags();

    expect(actual).toEqual(expected);
});

it('should send search tags request to server', async () => {
    const tags: Tag[] = require('./fixtures/tags.json');
    const expected = {
        query: 'dev',
        hits: tags,
    };

    nock(baseURL)
        .get('/v1/tags/search')
        .query({query: 'dev'})
        .reply(200, expected);

    const actual = await service.searchTags('dev');

    expect(actual).toEqual(expected);
});