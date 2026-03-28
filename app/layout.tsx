import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GaskeunNIP - Pejuang NIP", // Saya update sedikit biar lebih keren
  description: "Platform Tryout Online Terpercaya untuk Pejuang NIP",
  icons: {
    icon: "/icon.png", // Ini kunci agar logo tab berubah
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}