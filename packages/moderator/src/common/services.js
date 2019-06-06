import {
  AuthServiceImpl, ContentServiceImpl,
} from '@daily/services';

export const contentService = new ContentServiceImpl(process.env.VUE_APP_API_URL, 30);
export const authService = new AuthServiceImpl(process.env.VUE_APP_API_URL);
