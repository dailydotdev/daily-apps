import store from '../../store';

export default function (to, from, next) {
  if (store.getters['user/isLoggedIn']) {
    return next({ path: '/' });
  }

  return next();
}
