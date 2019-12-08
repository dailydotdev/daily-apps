import store from '../../store';
import anonymousGuard from './anonymous';

export default function (to, from, next) {
  return anonymousGuard(to, from, async () => {
    await store.dispatch('user/generateChallenge');
    return next();
  });
}
