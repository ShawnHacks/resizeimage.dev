import {defineRouting} from 'next-intl/routing';
 
export const EN = 'en';
export const ZH = 'zh';
export const ZH_TW = 'zh-TW';
export const FR = 'fr';
export const DE = 'de';
export const JA = 'ja';
export const CS = 'cs';
export const ES = 'es';
export const IT = 'it';
export const KO = 'ko';
export const NL = 'nl';
export const PT_BR = 'pt-BR';
export const RU = 'ru';
export const UK = 'uk';
export const VI = 'vi';
export const PT = 'pt';
export const DA = 'da';
export const EL = 'el';
export const NO = 'no';
export const FI = 'fi';
export const SV = 'sv';
export const TH = 'th';
export const ID = 'id';
export const HI = 'hi';
export const BN = 'bn';
export const MS = 'ms';
export const TR = 'tr';
export const AR = 'ar';
export const BG = 'bg';
export const ET = 'et';
export const HE = 'he';
export const HR = 'hr';
export const HU = 'hu';
export const LT = 'lt';
export const LV = 'lv';
export const PL = 'pl';
export const RO = 'ro';
export const SK = 'sk';
export const SL = 'sl';

export const localeNames = {
  [EN]: '🇬🇧 English', // 英语
  [ZH]: '🇨🇳 简体中文',
  [ZH_TW]: '🇨🇳 繁体中文', // 繁体中文
  [KO]: '🇰🇷 한국어', // 韩语
  [JA]: '🇯🇵 日本語', // 日语
  [PT]: '🇵🇹 Português', // 葡萄牙语
  [ES]: '🇪🇸 Español', // 西班牙语
  [DE]: '🇩🇪 Deutsch', // 德语
  [FR]: '🇫🇷 Français', // 法语
  [IT]: '🇮🇹 Italiano', // 意大利语
  [AR]: '🇸🇦 العربية', // 阿拉伯语
  [RU]: '🇷🇺 Русский', // 俄语
  [UK]: '🇺🇦 Українська', // 乌克兰语
  [TR]: '🇹🇷 Türkçe', // 土耳其语
  [VI]: '🇻🇳 Tiếng Việt', // 越南语
  [TH]: '🇹🇭 ไทย (Thai)', // 泰语
  [ID]: '🇮🇩 Bahasa Indonesia', // 印度尼西亚语
  [BN]: '🇧🇩 বাংলা (Bangla)', // 孟加拉语
  [PT_BR]: '🇧🇷 Português do Brasil', // 巴西葡萄牙语
} as Record<string, string>;

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [EN, ZH, ZH_TW, KO, JA, PT, ES, DE, FR, IT, AR,RU, UK, VI, TH, TR, ID, PT_BR, BN],
 
  // Used when no locale matches
  defaultLocale: EN,

  localePrefix: 'as-needed',

  // If you want to rely entirely on the URL to resolve the locale, you can set the localeDetection property to false. This will disable locale detection based on the accept-language header and a potentially existing cookie value from a previous visit.
  localeDetection: true
});