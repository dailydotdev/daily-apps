/* eslint-disable no-underscore-dangle, no-param-reassign */
import DaTooltip from '../components/DaTooltip.vue';

export default function (Vue) {
  const DaTooltipClass = Vue.extend(DaTooltip);
  let vnode = null;
  let appendedTo = null;
  let targetElement = null;
  let scrollableParent = null;
  let overTimeout = null;
  let outTimeout = null;

  const getScrollParent = (element) => {
    if (!element) {
      return document.body;
    }

    switch (element.nodeName) {
      case 'HTML':
      case 'BODY':
        return element.ownerDocument.body;
      case '#document':
        return element.body;
      case 'DIALOG':
        return element;
      default: {
        const getStyleComputedProp = getComputedStyle(element);
        const { overflow, overflowX, overflowY } = getStyleComputedProp;

        if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
          return element;
        }

        return getScrollParent(element.parentNode);
      }
    }
  };

  const getPlacement = (modifiers) => {
    const keys = Object.keys(modifiers);
    if (keys.length) {
      return keys[0];
    }
    return 'top';
  };

  const positionTooltip = (target, tooltip, placement, scrollY) => {
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    tooltip.removeAttribute('style');
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${targetRect.left + (targetRect.width - tooltipRect.width) / 2}px`;
    if (placement === 'top') {
      tooltip.style.top = `${targetRect.top + scrollY - tooltipRect.height - 5}px`;
    } else {
      tooltip.style.top = `${targetRect.bottom + scrollY + 5}px`;
    }
  };

  const repositionTooltipToElement = () => {
    const scrollY = scrollableParent === document.body
      ? window.scrollY : scrollableParent.scrollTop;
    positionTooltip(targetElement, vnode.$el, vnode.placement, scrollY);
  };

  const createTooltip = () => {
    vnode = new DaTooltipClass();
    vnode.$mount();
  };

  const showTooltip = async (el, value, modifiers) => {
    const appendTo = getScrollParent(el.parentNode);
    scrollableParent = appendTo;
    if (appendedTo !== appendTo) {
      appendTo.appendChild(vnode.$el);
      appendedTo = appendTo;
    }

    targetElement = el;
    el.setAttribute('aria-describedby', 'toolip');
    vnode.content = value;
    vnode.placement = getPlacement(modifiers);
    vnode.show = true;
    await vnode.$nextTick();
    repositionTooltipToElement();
  };

  const hideTooltip = (el) => {
    targetElement = null;
    el.removeAttribute('aria-describedby');
    vnode.show = false;
    appendedTo.removeChild(vnode.$el);
    appendedTo = false;
  };

  const removeEvents = (el, modifiers) => {
    if (el._tooltip.overHandler) {
      el.removeEventListener('mouseover', el._tooltip.overHandler, false);
      el.removeEventListener('mouseout', el._tooltip.outHandler, false);
      if (!modifiers.ignoreClick) {
        el.removeEventListener('click', el._tooltip.outHandler, false);
      }
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
    if (!modifiers.ignoreClick) {
      el.addEventListener('click', el._tooltip.outHandler, false);
    }
  };

  const directive = {
    options: {
      delay: { show: 400, hide: 100 },
    },
    bind(el, { value, modifiers }) {
      if (!vnode) {
        createTooltip();
      }
      el._tooltip = {};
      registerEvents(el, value, modifiers, directive.options);
    },
    async update(el, { value, modifiers }) {
      if (targetElement === el && modifiers.ignoreClick) {
        vnode.content = value;
        await vnode.$nextTick();
        repositionTooltipToElement();
      } else {
        removeEvents(el, modifiers);
        registerEvents(el, value, modifiers, directive.options);
      }
    },
    unbind(el, { modifiers }) {
      if (overTimeout) {
        clearTimeout(overTimeout);
        overTimeout = null;
      }
      if (targetElement === el) {
        hideTooltip(el);
      }
      removeEvents(el, modifiers);
    },
  };

  return directive;
}
