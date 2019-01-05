import { ContentServiceImpl } from '@daily/services';

// eslint-disable-next-line import/prefer-default-export
export const contentService = new ContentServiceImpl(process.env.VUE_APP_API_URL, 30);
