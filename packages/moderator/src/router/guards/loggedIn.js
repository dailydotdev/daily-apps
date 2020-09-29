import store from '../../store';

export default async (to, from, next) => {
  await store.dispatch('user/validateAuth');
  if (!store.getters['user/isLoggedIn']) {
    return next({ path: '/login' });
  }

  return next();
};
