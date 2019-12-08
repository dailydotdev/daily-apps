import store from '../../store';

export default async (to, from, next) => {
  if (!store.getters['user/isLoggedIn']) {
    return next({ path: '/login' });
  }

  return next();
};
