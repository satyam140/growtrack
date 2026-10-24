import type { Metadata } from "next";
<<<<<<< HEAD
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsCopilot } from "@/components/analytics-copilot";
=======
import { Geist, Geist_Mono } from "next/font/google";
import { AnalyticsCopilot } from "@/app/admin/dashboard/analytics-copilot";
import "./globals.css";
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrowthTrack | Student Success Platform",
  description:
    "Choose the GrowthTrack admin or student dashboard to track progress and support student success.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
<<<<<<< HEAD
        <Suspense fallback={null}>
          <AnalyticsCopilot />
        </Suspense>
=======
        <AnalyticsCopilot />
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
      </body>
    </html>
  );
}
