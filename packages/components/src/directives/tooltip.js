/* eslint-disable no-underscore-dangle, no-param-reassign */
import Vue from 'vue';
import DaTooltip from '../components/DaTooltip.vue';

const DaTooltipClass = Vue.extend(DaTooltip);
let vnode = null;
let targetElement = null;
let overTimeout = null;
let outTimeout = null;

const getPlacement = (modifiers) => {
  const keys = Object.keys(modifiers);
  if (keys.length) {
    return keys[0];
  }
  return 'top';
};

const positionTooltip = (target, tooltip, placement) => {
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  tooltip.removeAttribute('style');
  tooltip.style.position = 'absolute';
  tooltip.style.left = `${targetRect.left + (targetRect.width - tooltipRect.width) / 2}px`;
  if (placement === 'top') {
    tooltip.style.top = `${targetRect.top - tooltipRect.height - 5}px`;
  } else {
    tooltip.style.top = `${targetRect.bottom + 5}px`;
  }
};

const createTooltip = () => {
  vnode = new DaTooltipClass();
  vnode.$mount();
  document.body.appendChild(vnode.$el);
};

const showTooltip = (el, value, modifiers) => {
  targetElement = el;
  el.setAttribute('aria-describedby', 'toolip');
  vnode.content = value;
  vnode.placement = getPlacement(modifiers);
  vnode.show = true;
  setTimeout(() => positionTooltip(el, vnode.$el, vnode.placement), 10);
};

const hideTooltip = (el) => {
  targetElement = null;
  el.removeAttribute('aria-describedby');
  vnode.show = false;
};

const removeEvents = (el) => {
  if (el._tooltip.overHandler) {
    el.removeEventListener('mouseover', el._tooltip.overHandler, false);
    el.removeEventListener('mouseout', el._tooltip.outHandler, false);
    el.removeEventListener('click', el._tooltip.outHandler, false);
    el._tooltip.overHandler = null;
    el._tooltip.outHandler = null;
  }
};

const registerEvents = (el, value, modifiers, options) => {
  removeEvents(el);
  el._tooltip.overHandler = () => {
    if (overTimeout) {
      clearTimeout(overTimeout);
      overTimeout = null;
    }
    if (outTimeout && targetElement === el) {
      clearTimeout(outTimeout);
      outTimeout = null;
    }
    overTimeout = setTimeout(() => showTooltip(el, value, modifiers), options.delay.show);
  };
  el._tooltip.outHandler = () => {
    if (overTimeout) {
      clearTimeout(overTimeout);
      overTimeout = null;
    }
    if (targetElement === el) {
      if (outTimeout) {
        clearTimeout(outTimeout);
        outTimeout = null;
      }
      outTimeout = setTimeout(() => hideTooltip(el), options.delay.hide);
    }
  };
  el.addEventListener('mouseover', el._tooltip.overHandler, false);
  el.addEventListener('mouseout', el._tooltip.outHandler, false);
  el.addEventListener('click', el._tooltip.outHandler, false);
};

const directive = {
  options: {
    delay: { show: 500, hide: 100 },
  },
  bind(el, { value, modifiers }) {
    if (!vnode) {
      createTooltip();
    }
    el._tooltip = {};
    registerEvents(el, value, modifiers, directive.options);
  },
  update(el, { value, modifiers }) {
    removeEvents(el);
    registerEvents(el, value, modifiers, directive.options);
  },
  unbind(el) {
    removeEvents(el);
  },
};

export default directive;
