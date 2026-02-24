'use client';
import React, { createContext, useContext, useMemo } from 'react';

type Ctx = {
  t: (key: string, vars?: Record<string, string | number>) => string;
  lang: string;
};
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({
  dict,
  lang,
  children,
}: {
  dict: Record<string, string>;
  lang: string;
  children: React.ReactNode;
}) {
  const value = useMemo<Ctx>(
    () => ({
      lang,
      t: (key, vars) => {
        let s = dict[key] ?? key;

        if (vars)
          for (const [k, v] of Object.entries(vars))
            s = s.replace(new RegExp(`{${k}}`, 'g'), String(v));
        return s;
      },
    }),
    [dict, lang]
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}
export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
