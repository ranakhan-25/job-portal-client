import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { Providers } from "@/providers/ThermeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "JobNest | Find Your Dream Job",
    template: "%s | JobNest",
  },
  description:
    "JobNest is a modern job portal platform where job seekers can find jobs, recruiters can post opportunities, and companies can hire top talent.",
  keywords: [
    "Job Portal",
    "Job Search",
    "Jobs",
    "Career",
    "Recruitment",
    "Hiring",
    "Next.js",
    "MERN Stack",
  ],
  authors: [
    {
      name: "Rana Khan",
    },
  ],
  creator: "Rana Khan",
  openGraph: {
    title: "JobNest | Find Your Dream Job",
    description:
      "A modern job portal built with Next.js, Express, MongoDB, and TypeScript.",
    url: "https://your-domain.com",
    siteName: "JobNest",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground"
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
