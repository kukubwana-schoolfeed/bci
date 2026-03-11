import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { AppContext } from "@/context/AppContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brian Chanda Innovations — Fashion. Tech. Innovation.",
  description: "Premium fashion and technology. One destination. Society Business Park, Lusaka, Zambia.",
  keywords: "fashion, tech, Lusaka, Zambia, Brian Chanda, smartphones, clothing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-[#0A0A0A] text-[#F5F0E8] antialiased">
        <AppContext>
          {children}
        </AppContext>
      </body>
    </html>
  );
}
