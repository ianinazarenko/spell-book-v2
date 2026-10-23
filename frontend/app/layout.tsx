import type { Metadata } from 'next';
import { Literata } from 'next/font/google';
import './globals.css';
import ServiceWorker from '@/app/ServiceWorker';

const literata = Literata({
    variable: '--font-literata',
    subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
    title: 'Spell Book',
    description: 'Casting from the Book of Spells',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'SpellBook',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' className={literata.variable}>
            <body>
                <ServiceWorker />
                {children}
            </body>
        </html>
    );
}
