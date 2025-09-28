
import { createI18n } from 'vue-i18n';
import { Locale } from 'vant'

import enUS from 'vant/lib/locale/lang/en-US'
import zhCN from 'vant/lib/locale/lang/zh-CN'
import twCN from 'vant/lib/locale/lang/zh-TW'
import en from './modules/en'; 
import zh from './modules/zh'; 
import tw from './modules/tw'; 
const messages = {
  en: {
    ...enUS,
    ...en,
  },
  tw: {
    ...twCN,
    ...tw,
  },
  zh: {
    ...zhCN,
    ...zh,
  },
};
export const i18n = new createI18n({ // 创建i18n实例
  globalInjection: true,
  locale: localStorage.lang || 'zh',
  legacy: false,
  messages: messages
});

export const setLocales = (lang) => {
  if (lang === 'en') {
    Locale.use(lang, enUS)
  } else if (lang === 'zh') {
    Locale.use('zh', zhCN) 
  } else if (lang === 'tw') {
    Locale.use('tw', twCN)
  }
  localStorage.setItem('lang', lang)
}