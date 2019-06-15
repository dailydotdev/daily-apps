import { create } from '@storybook/theming';

export default create({
  base: 'dark',

  // UI
  appBg: '#303237',
  appContentBg: '#1C1E21',
  appBorderColor: '#4C5057',
  appBorderRadius: 4,

  // Typography
  fontBase: '\'DejaVuSansMono\', monospace, sans-serif',

  // Text colors
  textColor: '#FFFFFF',
  textInverseColor: '#151618',

  // Toolbar default and active colors
  barTextColor: '#A9ABB3',
  barSelectedColor: '#FFFFFF',
  barBg: '#303237',

  // Form colors
  inputBg: '#303237',
  inputBorder: '#4C5057',
  inputTextColor: '#FFFFFF',
  inputBorderRadius: 4,
});
