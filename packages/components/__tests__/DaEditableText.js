import { createLocalVue, mount } from '@vue/test-utils';
import svgicon from 'vue-svgicon';
import DaEditableText from '../src/components/DaEditableText.vue';

const localVue = createLocalVue();

localVue.use(svgicon);

const propsData = {
  icon: 'link',
  text: 'Click on me to edit',
  placeholder: 'Waiting for you',
};

it('should set non-editable text', () => {
  const wrapper = mount(DaEditableText, { localVue, propsData });
  expect(wrapper.find('.editable__non-active span').element.textContent)
    .toEqual(propsData.text);
});

it('should enable edit on click', (done) => {
  const wrapper = mount(DaEditableText, { localVue, propsData });
  expect(wrapper.find('.editable__active').element).toBeFalsy();
  wrapper.find('.editable__non-active').trigger('click');
  wrapper.vm.$nextTick(() => {
    expect(wrapper.find('.editable__active').element).toBeDefined();
    expect(wrapper.find('.editable__non-active').element).toBeFalsy();
    done();
  });
});

it('should not submit value on cancel', (done) => {
  const wrapper = mount(DaEditableText, { localVue, propsData });
  wrapper.vm.activate();
  wrapper.vm.$nextTick(() => {
    wrapper.find('.editable__input').element.value = 'my value';
    wrapper.find('.editable__cancel').trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.editable__active').element).toBeFalsy();
      expect(wrapper.emitted().submit).toBeFalsy();
      done();
    });
  });
});

it('should do nothing when input is empty and input is required', (done) => {
  const wrapper = mount(DaEditableText, {
    localVue,
    propsData: { ...propsData, required: true },
  });
  wrapper.vm.activate();
  wrapper.vm.$nextTick(() => {
    wrapper.find('.editable__submit').trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.editable__active').element).toBeDefined();
      expect(wrapper.emitted().submit).toBeFalsy();
      done();
    });
  });
});

it('should trigger submit', (done) => {
  const wrapper = mount(DaEditableText, { localVue, propsData });
  wrapper.vm.activate();
  wrapper.vm.$nextTick(() => {
    wrapper.find('.editable__input').element.value = 'my value';
    wrapper.find('.editable__input').trigger('input');
    wrapper.find('.editable__submit').trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.editable__active').element).toBeFalsy();
      expect(wrapper.emitted().submit[0]).toEqual(['my value']);
      done();
    });
  });
});

it('should set last value when reactivating', (done) => {
  const wrapper = mount(DaEditableText, { localVue, propsData });
  wrapper.vm.activate();
  wrapper.vm.$nextTick(() => {
    wrapper.find('.editable__input').element.value = 'my value';
    wrapper.find('.editable__input').trigger('input');
    wrapper.find('.editable__submit').trigger('click');
    wrapper.vm.$nextTick(() => {
      wrapper.vm.activate();
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('.editable__input').element.value).toEqual('my value');
        done();
      });
    });
  });
});

it('should reset value when reactivating', (done) => {
  const wrapper = mount(DaEditableText, {
    localVue,
    propsData: { ...propsData, resetOnSubmit: true },
  });
  wrapper.vm.activate();
  wrapper.vm.$nextTick(() => {
    wrapper.find('.editable__input').element.value = 'my value';
    wrapper.find('.editable__input').trigger('input');
    wrapper.find('.editable__submit').trigger('click');
    wrapper.vm.$nextTick(() => {
      wrapper.vm.activate();
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('.editable__input').element.value).toBeFalsy();
        done();
      });
    });
  });
});

it('should set non-editable text as value', (done) => {
  const wrapper = mount(DaEditableText, {
    localVue,
    propsData: { ...propsData, valueAsText: true },
  });
  wrapper.vm.activate();
  wrapper.vm.$nextTick(() => {
    wrapper.find('.editable__input').element.value = 'my value';
    wrapper.find('.editable__input').trigger('input');
    wrapper.find('.editable__submit').trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.editable__non-active span').element.textContent)
        .toEqual('my value');
      done();
    });
  });
});
