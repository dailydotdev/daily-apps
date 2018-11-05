import axios from 'axios';
// @ts-ignore
import httpAdapter from 'axios/lib/adapters/http';
// @ts-ignore
import nock from 'nock';
import {Ad, MonetizationServiceImpl} from '../src';

axios.defaults.adapter = httpAdapter;

const baseURL = 'http://localhost:3000';

it('should fetch ad from server', async () => {
    nock(baseURL)
        .get('/v1/a')
        .reply(200, [{
            description: 'Rollbar Real-time error monitoring, alerting, and analytics for Ruby developers',
            image: 'https://cdn.codefund.io/44a1c0e0-15b2-474c-a37e-8be8740f076e_rollbar-512x320.jpg',
            link: 'https://codefund.io/c/4d84e196-7e61-4420-839f-4d25b0160d7e',
            source: 'CodeFund',
            company: 'CodeFund',
            pixel: ['https://codefund.io/p/4d84e196-7e61-4420-839f-4d25b0160d7e/pixel.png']
        }]);

    const service = new MonetizationServiceImpl(baseURL);
    const ads = await service.fetchAd();

    const expected: Ad[] = [{
        description: 'Rollbar Real-time error monitoring, alerting, and analytics for Ruby developers',
        image: 'https://cdn.codefund.io/44a1c0e0-15b2-474c-a37e-8be8740f076e_rollbar-512x320.jpg',
        link: 'https://codefund.io/c/4d84e196-7e61-4420-839f-4d25b0160d7e',
        source: 'CodeFund',
        company: 'CodeFund',
        pixel: ['https://codefund.io/p/4d84e196-7e61-4420-839f-4d25b0160d7e/pixel.png'],
        size: 'small',
    }];

    expect(ads).toEqual(expected);
});

it('should fetch ad with ratio from server', async () => {
    nock(baseURL)
        .get('/v1/a')
        .reply(200, [{
            description: 'Rollbar Real-time error monitoring, alerting, and analytics for Ruby developers',
            image: 'https://cdn.codefund.io/44a1c0e0-15b2-474c-a37e-8be8740f076e_rollbar-512x320.jpg',
            link: 'https://codefund.io/c/4d84e196-7e61-4420-839f-4d25b0160d7e',
            source: 'CodeFund',
            company: 'CodeFund',
            ratio: 0.75,
            backgroundColor: '#ffffff',
        }]);

    const service = new MonetizationServiceImpl(baseURL);
    const ads = await service.fetchAd();

    const expected: Ad[] = [{
        description: 'Rollbar Real-time error monitoring, alerting, and analytics for Ruby developers',
        image: 'https://cdn.codefund.io/44a1c0e0-15b2-474c-a37e-8be8740f076e_rollbar-512x320.jpg',
        link: 'https://codefund.io/c/4d84e196-7e61-4420-839f-4d25b0160d7e',
        source: 'CodeFund',
        company: 'CodeFund',
        size: 'large',
        backgroundColor: '#ffffff',
    }];

    expect(ads).toEqual(expected);
});
