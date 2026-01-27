import type { Metadata } from 'next';
import './globals.css';
import { ChronoBoardProviders } from './providers';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'ქრონო-დაფა',
  description: 'დინამიური ინფორმაციისა და განრიგის დაფა',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.ge/css/bpg-nino-mtavruli.css" />
      </head>
      <body className="font-body antialiased">
        <ChronoBoardProviders>
          {children}
          <Toaster />
        </ChronoBoardProviders>
      </body>
    </html>
  );
}
