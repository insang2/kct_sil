import 'server-only';

const dictionaries = {
  ko: () => import('../dictionaries/ko.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  ja: () => import('../dictionaries/ja.json').then((module) => module.default),
  'zh-TW': () => import('../dictionaries/tw.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'ko' | 'en' | 'ja' | 'zh-TW') => {
  if (typeof dictionaries[locale] !== 'function') {
    return dictionaries['ko']();
  }
  return dictionaries[locale]();
};
