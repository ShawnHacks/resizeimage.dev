import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'NEXT_LOCALE';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  let candidate = await requestLocale;

  if (!candidate) {
    // Read from cookie if the user is logged in
    const store = await cookies();
    candidate = store.get(COOKIE_NAME)?.value;
  }

  // let locale = hasLocale(routing.locales, candidate) ? candidate : routing.defaultLocale;
  // let messages = {};
  // try {
  //   messages = (await import(`../messages/${locale}.json`)).default 
  // } catch (error) {
  //   console.error(`Failed to load messages for locale ${locale}:`, error);
  //   messages = (await import(`../messages/${routing.defaultLocale}.json`)).default 
  // }

  // return {
  //   locale,
  //   messages,
  // };


  let locale = hasLocale(routing.locales, candidate) ? candidate : routing.defaultLocale;
  let messages = {};
  let systemMessages = (await import(`./messages/common/${routing.defaultLocale}.json`)).default;
  let bulkresizeMessages = (await import(`./messages/tool-bulkresize/${routing.defaultLocale}.json`)).default;
  let singleresizeMessages = (await import(`./messages/tool-singleresize/${routing.defaultLocale}.json`)).default;
  let compressorMessages = (await import(`./messages/tool-compressor/${routing.defaultLocale}.json`)).default;
  let converterMessages = (await import(`./messages/tool-imageconverter/${routing.defaultLocale}.json`)).default;
  let watermarkMessages = (await import(`./messages/tool-watermarkremover/${routing.defaultLocale}.json`)).default;
  let imagestitcherMessages = (await import(`./messages/tool-imagestitcher/${routing.defaultLocale}.json`)).default;
  try {
    try {
      const targetMessages = (await import(`./messages/common/${locale}.json`)).default

      systemMessages = { ...systemMessages, ...targetMessages }

    } catch (error) {
      console.error(`Failed to load system messages for locale ${locale}:`, error);
    }
    try {
      const targetMessages = (await import(`./messages/tool-bulkresize/${locale}.json`)).default
      bulkresizeMessages = { ...bulkresizeMessages, ...targetMessages }
    } catch (error) {
      console.error(`Failed to load bulkresize messages for locale ${locale}:`, error);
    }
    try {
      const targetMessages = (await import(`./messages/tool-singleresize/${locale}.json`)).default
      singleresizeMessages = { ...singleresizeMessages, ...targetMessages }
    } catch (error) {
      console.error(`Failed to load singleresize messages for locale ${locale}:`, error);
    }
    try {
      const targetMessages = (await import(`./messages/tool-compressor/${locale}.json`)).default
      compressorMessages = { ...compressorMessages, ...targetMessages }
    } catch (error) {
      console.error(`Failed to load compressor messages for locale ${locale}:`, error);
    }
    try {
      const targetMessages = (await import(`./messages/tool-imageconverter/${locale}.json`)).default
      converterMessages = { ...converterMessages, ...targetMessages }
    } catch (error) {
      console.error(`Failed to load converter messages for locale ${locale}:`, error);
    }
    try {
      const targetMessages = (await import(`./messages/tool-watermarkremover/${locale}.json`)).default
      watermarkMessages = { ...watermarkMessages, ...targetMessages }
    } catch (error) {
      console.error(`Failed to load watermark messages for locale ${locale}:`, error);
    }
    try {
      const targetMessages = (await import(`./messages/tool-imagestitcher/${locale}.json`)).default
      imagestitcherMessages = { ...imagestitcherMessages, ...targetMessages }
    } catch (error) {
      console.error(`Failed to load imagestitcher messages for locale ${locale}:`, error);
    }
    messages = { ...systemMessages, ...bulkresizeMessages, ...singleresizeMessages, ...compressorMessages, ...converterMessages, ...watermarkMessages, ...imagestitcherMessages }
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
  }

  return {
    locale,
    messages
  };
});