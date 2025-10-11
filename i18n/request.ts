import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
import {cookies} from 'next/headers';
 
const COOKIE_NAME = 'NEXT_LOCALE';

export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  let candidate = await requestLocale;

  if (!candidate) {
    // Read from cookie if the user is logged in
    const store = await cookies();
    candidate = store.get(COOKIE_NAME)?.value;
  }

  let locale = hasLocale(routing.locales, candidate) ? candidate : routing.defaultLocale;
  let messages = {};
  try {
    messages = (await import(`../messages/${locale}.json`)).default 
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    messages = (await import(`../messages/${routing.defaultLocale}.json`)).default 
  }
 
  return {
    locale,
    messages,
  };
});