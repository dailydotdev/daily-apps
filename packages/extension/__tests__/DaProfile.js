import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import icons from '@daily/components/src/icons';
import DaModal from '@daily/components/src/components/DaModal.vue';
import DaTextField from '@daily/components/src/components/DaTextField.vue';
import DaProfile from '../src/components/DaProfile.vue';

let store;
let user;

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(icons);
localVue.component('da-modal', DaModal);
localVue.component('da-text-field', DaTextField);
localVue.filter('provider', value => value);

beforeEach(() => {
  window.ga = () => {
  };

  user = {
    namespaced: true,
    state: {
      profile: null,
    },
    getters: {
      isLoggedIn: () => true,
    },
    actions: {
      updateProfile: jest.fn(),
      logout: jest.fn(),
    },
  };

  store = new Vuex.Store({
    modules: { user },
  });
});

it('should prepopulate user information', () => {
  store.state.user.profile = { name: 'Ido', email: 'ido@acme.com', company: 'ACME', image: 'https://image.com/', providers: ['github'] };
  const wrapper = mount(DaProfile, { store, localVue });
  expect(wrapper.find('input[name="name"]').element.value).toEqual('Ido');
  expect(wrapper.find('input[name="email"]').element.value).toEqual('ido@acme.com');
  expect(wrapper.find('input[name="company"]').element.value).toEqual('ACME');
  expect(wrapper.find('img').element.src).toEqual('https://image.com/');
  expect(wrapper.find('button[type="submit"]').element.disabled).toEqual(false);
});

it('should disable submit when required fields are empty', () => {
  store.state.user.profile = { email: 'ido@acme.com', company: 'ACME', image: 'https://image.com/', providers: ['github'] };
  const wrapper = mount(DaProfile, { store, localVue });
  expect(wrapper.find('button[type="submit"]').element.disabled).toEqual(true);
});

it('should show email hint when email is invalid', () => {
  store.state.user.profile = { email: 'ido', company: 'ACME', image: 'https://image.com/', providers: ['github'] };
  const wrapper = mount(DaProfile, { store, localVue });
  wrapper.find('.profile__email').vm.$emit('validity', false);
  expect(wrapper.vm.emailHint).toEqual('Please enter a valid email');
});

it('should logout on button click', () => {
  store.state.user.profile = { email: 'ido@acme.com', company: 'ACME', image: 'https://image.com/', providers: ['github'] };
  const wrapper = mount(DaProfile, { store, localVue });
  wrapper.find('.profile__nav .profile__link button').trigger('click');
  expect(user.actions.logout).toBeCalledTimes(1);
});

it('should close popup on x click', () => {
  store.state.user.profile = { email: 'ido@acme.com', company: 'ACME', image: 'https://image.com/', providers: ['github'] };
  const wrapper = mount(DaProfile, { store, localVue });
  wrapper.find('.profile__close').trigger('click');
  expect(wrapper.emitted().close[0]).toEqual([]);
});

it('should update profile and close dialog', (done) => {
  store.state.user.profile = { name: 'Ido', email: 'ido@acme.com', company: 'ACME', image: 'https://image.com/', providers: ['github'] };
  user.actions.updateProfile.mockResolvedValue();
  const wrapper = mount(DaProfile, { store, localVue });
  wrapper.find('button[type="submit"]').trigger('click');
  setTimeout(() => {
    expect(user.actions.updateProfile).toBeCalledWith(expect.anything(), { name: 'Ido', email: 'ido@acme.com', company: 'ACME', title: null });
    expect(wrapper.emitted().close[0]).toEqual([]);
    done();
  });
});

it('should show email exists error', (done) => {
  store.state.user.profile = { name: 'Ido', email: 'ido@acme.com', company: 'ACME', image: 'https://image.com/', providers: ['github'] };
  user.actions.updateProfile.mockRejectedValue({ response: { data: { code: 1, message: 'email already exists' } } });
  const wrapper = mount(DaProfile, { store, localVue });
  wrapper.find('button[type="submit"]').trigger('click');
  setTimeout(() => {
    expect(wrapper.vm.emailHint).toEqual('This email already exists');
    done();
  });
});