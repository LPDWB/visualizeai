import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VisualizeAI - Data Visualization Made Easy',
  description: 'Upload your Excel or CSV files and create beautiful visualizations with AI-powered insights.',
};

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Upload', href: '/upload' },
  { name: 'Visualize', href: '/visualize' },
  { name: 'Text Visuals', href: '/text-visuals' },
  { name: 'Archive', href: '/archive' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col">
              <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                  <nav className="mt-5 flex-1 space-y-1 px-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col">
              {/* Header */}
              <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-gray-900 shadow">
                <div className="flex flex-1 justify-end px-4">
                  <div className="ml-4 flex items-center md:ml-6">
                    <ThemeToggle />
                  </div>
                </div>
              </div>

              {/* Page content */}
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
