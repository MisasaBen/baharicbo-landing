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
  title: {
    default: "Bahari CBO Network | Blue Empowerment Project",
    template: "%s | Bahari CBO Network",
  },
  description:
    "Bahari CBO Network’s Blue Empowerment Project delivers climate-smart Integrated Multi-Trophic Aquaculture (IMTA) and community-owned environmental monitoring systems for coastal resilience and sustainable livelihoods in Kenya.",
  keywords: [
    "Bahari CBO Network",
    "Blue Empowerment Project",
    "IMTA",
    "Integrated Multi-Trophic Aquaculture",
    "Aquaculture Kenya",
    "Coastal resilience",
    "IoT monitoring",
    "Environmental data",
    "Seaweed farming",
    "Sustainable fisheries",
  ],
  authors: [{ name: "Bahari CBO Network" }],
  creator: "Bahari CBO Network",
  metadataBase: new URL("https://yourdomain.com"), // Replace after domain purchase
  openGraph: {
    title: "Bahari CBO Network | Blue Empowerment Project",
    description:
      "Community-owned environmental monitoring and climate-smart aquaculture solutions for coastal communities in Kenya.",
    url: "https://yourdomain.com", // Replace later
    siteName: "Bahari CBO Network",
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bahari CBO Network | Blue Empowerment",
    description:
      "Climate-smart IMTA and real-time environmental monitoring for coastal resilience.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
