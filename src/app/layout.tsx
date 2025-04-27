import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google'; // Use Geist Mono
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

// Configure Geist Mono font
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Subdomain Finder', // Updated title
  description: 'Scan subdomains with a neon terminal interface',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* Apply dark class to html tag */}
      <body
        className={cn(
          geistMono.variable, // Apply Geist Mono font variable
          'font-mono antialiased' // Set font-mono globally
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
