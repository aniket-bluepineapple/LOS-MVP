import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bluedreams Finance",
  description: "System to get the consumer loan",
};

const Header = () => (
  <header className="bg-[#00246b] px-6 py-6 text-white shadow-md">
    <h1 className="text-2xl font-bold text-[#cadcfc]">Bluedreams Finance</h1>
  </header>
);

const Footer = () => (
  <footer className="mt-8 bg-[#00246b] px-6 py-4 text-center text-white">
    <p className="text-[#cadcfc]">
      &copy; {new Date().getFullYear()} Bluedreams Finance. All rights reserved.
    </p>
  </footer>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-gradient-to-br from-[#0F172A] to-[#334155] text-white min-h-screen`}>
        <Header />
        <main className="flex min-h-[85vh] w-full mt-10 justify-center">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
