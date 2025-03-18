import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blue Loans",
  description: "System to get the consumer loan",
};

const Header = () => (
  <header className="bg-[#00246b] text-white py-6 px-6 shadow-md">
    <h1 className="text-2xl font-bold text-[#cadcfc]">Blue Loans</h1>
  </header>
);

const Footer = () => (
  <footer className="bg-[#00246b] text-white py-4 px-6 text-center mt-8">
    <p className="text-[#cadcfc]">&copy; {new Date().getFullYear()} Blue Loans. All rights reserved.</p>
  </footer>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <Header/>
        <main className="min-h-[85vh] flex justify-center items-center w-full">{children}</main>
        <Footer/>
        </body>
    </html>
  );
}
