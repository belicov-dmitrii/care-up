import { cookies } from 'next/headers';

export const locales = ['en', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export async function getDict(locale: Locale) {
  const mod: { default: Record<string, string> } = await import(`@/messages/${locale}.json`);

  return {
    dict: mod.default,
    t: (str: string) => mod.default[str] ?? str,
  };
}

export const getServerT = async () => {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('lang')?.value as Locale | undefined;
  const lang = langCookie && locales.includes(langCookie) ? langCookie : defaultLocale;

  const { t } = await getDict(lang);

  return t;
};
