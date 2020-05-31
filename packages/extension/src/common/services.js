import {
  AuthServiceImpl, ContentServiceImpl, MonetizationServiceImpl, ProfileServiceImpl,
} from '@daily/services';

const app = 'extension';
// eslint-disable-next-line import/prefer-default-export
export const contentService = new ContentServiceImpl(process.env.VUE_APP_API_URL, app);
export const monetizationService = new MonetizationServiceImpl(process.env.VUE_APP_API_URL, app);
export const profileService = new ProfileServiceImpl(process.env.VUE_APP_API_URL, app);
export const authService = new AuthServiceImpl(process.env.VUE_APP_API_URL, app);
