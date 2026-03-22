import { I18nProvider } from '@/components/I18nProvider';
import ThemeRegistry from '@/components/ThemeRegistry';
import { defaultLocale, getDict, type Locale, locales } from '@/i18n';
import { Box, Typography } from '@mui/material';
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import { UserContextProvider } from '@/context/UserContext';
import { Header } from '@/components/Header/Header';
import '@/styles/imports.css';
import '@/styles/globals.scss';
import '@/styles/embla.css';
import { MenuBar } from '@/components/MenuBar/MenuBar';
import OneSignalInit from '@/components/Subscription/OneSignalInit';
import { NotificationSync } from '@/components/Subscription/NotificationSync';
import { OneSignalNavigationListener } from '@/components/OneSignalRefresh/OneSignalRefresh';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin', 'latin-ext', 'cyrillic'],
});

const plexMono = Roboto_Mono({
    variable: '--font-mono',
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
    title: 'Care Up. Take care!',
    description: 'Care Up. Take care!',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const cookieLang = cookieStore.get('lang')?.value;
    const lang = locales.includes(cookieLang as Locale) ? (cookieLang as Locale) : defaultLocale;
    const { dict } = await getDict(lang);

    return (
        <html lang="en">
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest"></link>
            </head>
            <body
                className={`${inter.className} ${inter.variable} ${plexMono.className} ${plexMono.variable}`}
            >
                <ThemeRegistry>
                    <UserContextProvider>
                        <OneSignalNavigationListener />
                        <NotificationSync />
                        <I18nProvider dict={dict} lang={lang}>
                            <Box className="main-container">
                                <Header />
                                {children}
                            </Box>
                            <Box color="text.secondary" className="footer" component="footer">
                                <Typography variant="body2">
                                    © {new Date().getFullYear()} Care Up
                                </Typography>
                            </Box>
                            <MenuBar />
                        </I18nProvider>
                    </UserContextProvider>
                </ThemeRegistry>
                <OneSignalInit />
            </body>
        </html>
    );
}
