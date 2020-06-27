import {JSDOM} from 'jsdom';
import {applyTheme, themes} from '../src/theme';

it('should add the theme class', () => {
  const dom = new JSDOM();
  applyTheme(dom.window.document, themes[1], null);

  const classList = (dom.window.document.documentElement as HTMLElement).classList;
  expect(classList.length).toEqual(1);
  expect(classList.contains(themes[1])).toEqual(true);
});

it('should not add the theme class when default theme is set', () => {
  const dom = new JSDOM();
  applyTheme(dom.window.document, themes[0], null);

  const classList = (dom.window.document.documentElement as HTMLElement).classList;
  expect(classList.length).toEqual(0);
});

it('should add the theme class and theming class for transition', () => {
  const dom = new JSDOM();
  applyTheme(dom.window.document, themes[0], null);
  applyTheme(dom.window.document, themes[1], themes[0]);

  const classList = (dom.window.document.documentElement as HTMLElement).classList;
  expect(classList.length).toEqual(2);
  expect(classList.contains(themes[1])).toEqual(true);
  expect(classList.contains('theming')).toEqual(true);
});