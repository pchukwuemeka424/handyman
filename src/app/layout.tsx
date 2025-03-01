import type { Metadata } from "next";
import "./globals.css";
import TawkToScript from "@/components/TawkToScript"; // Import the Tawk.to script component

export const metadata: Metadata = {
  title: `${process.env.APP_NAME}`,
  description: `${process.env.APP_DESCRIPTION}`,
  keywords: "Afrivendor, Nigeria vendor, afrivendor.ng, online marketplace, Nigeria businesses,wigs hair online vendors, Nigeria e-commerce, vendor platform, buy from Africa, shop Nigeria products, Nigeria goods, local Nigeria businesses, online vendors",
  author: "Acehub Technologies",
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
  openGraph: {
    title: `${process.env.APP_NAME}`,
    description: `${process.env.APP_DESCRIPTION}`,
    url: process.env.APP_URL || "default-url.com",
    images: [{ url: "https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/logos/White-and-Blue-Shopping-Cart-Logo-DesignEvo-Logo-Maker-02-14-2025_08_47_PM.png" }],
  },
  twitter: {
    card: "Afrivendor",
    title: `${process.env.APP_NAME}`,
    description: `${process.env.APP_DESCRIPTION}`,
    images: ["https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/logos/White-and-Blue-Shopping-Cart-Logo-DesignEvo-Logo-Maker-02-14-2025_08_47_PM.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Other meta tags can go here */}
      </head>
      <body>
        {children}
        <TawkToScript /> {/* Load the Tawk.to script dynamically */}
      </body>
    </html>
  );
}
