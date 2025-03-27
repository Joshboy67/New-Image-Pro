import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { AuthProvider } from "@/contexts/auth-context";
import ClientLayout from '@/components/layouts/client-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ImagePro - AI Image Processing',
  description: 'Advanced AI-powered image editing tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  );
}
