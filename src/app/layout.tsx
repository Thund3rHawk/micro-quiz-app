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
  title: 'Quiz Master - Test Your Knowledge Across Multiple Categories',
  description: 'Challenge yourself with quizzes in History, Science, Math, Programming and more. Choose from our comprehensive collection of quiz categories.',
  keywords: 'quiz, trivia, test, knowledge, history, science, math, programming, learning',
  openGraph: {
    title: 'Quiz Master - Test Your Knowledge',
    description: 'Challenge yourself with quizzes across multiple categories',
    type: 'website',
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
