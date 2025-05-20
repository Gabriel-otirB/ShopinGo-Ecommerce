import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { themeInitScript } from '@/lib/theme-script';
import Footer from '@/components/footer';
import LoadingProvider from '../providers/loading-provider';
import "react-toastify/dist/ReactToastify.css";
import ToastProvider from '@/providers/toast-provider';
import { AuthProvider } from '@/providers/auth-context';
import CartSync from "@/components/cart-sync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopinGo",
  description: "ShopinGo o seu E-commerce!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}
        flex min-h-full flex-col bg-white dark:bg-neutral-800`}
      >
        <AuthProvider>
          <CartSync /> {/* <- Here is the client component with useEffect  */}
          <Navbar />
          <ToastProvider />
          <main className="flex-grow container mx-auto px-2 md:px-4 py-8 min-h-[calc(100vh-450px)]">
            <LoadingProvider>{children}</LoadingProvider>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
