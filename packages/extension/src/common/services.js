import {
  AuthServiceImpl, ContentServiceImpl, MonetizationServiceImpl, ProfileServiceImpl,
} from '@daily/services';

// eslint-disable-next-line import/prefer-default-export
export const contentService = new ContentServiceImpl(process.env.VUE_APP_API_URL, 30);
export const monetizationService = new MonetizationServiceImpl(process.env.VUE_APP_API_URL);
export const profileService = new ProfileServiceImpl(process.env.VUE_APP_API_URL);
export const authService = new AuthServiceImpl(process.env.VUE_APP_API_URL);
