import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechCare IT Services - Dịch vụ IT tận nơi & Lắp đặt camera chuyên nghiệp",
  description: "Dịch vụ hỗ trợ IT tận nơi uy tín, chuyên nghiệp cho cá nhân và doanh nghiệp nhỏ. Chuyên cài Windows, sửa máy tính, lắp đặt camera giám sát, setup Wi-Fi/Router, thiết kế website chuẩn SEO và cấu hình VPS/Domain Cloud.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
