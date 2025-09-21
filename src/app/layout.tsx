import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import { AppWrapper } from '@/components/layout/app-wrapper';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SMART CONNECTION',
  description: 'An integrated platform for survey analysis, student-project matching, and comparative insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthProvider>
          <AppWrapper>{children}</AppWrapper>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
