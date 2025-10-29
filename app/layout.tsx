import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"
import Header from "@/components/layout/header";

const lora = Lora({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "Task Management App",
  description: "Manage your tasks efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={lora.className}>
      <body className="min-h-screen bg-background antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
