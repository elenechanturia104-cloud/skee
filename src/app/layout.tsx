import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';

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
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
