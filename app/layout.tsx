import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppToaster } from "./components/ui/app-toaster";
import { Navbar } from "./components/layout/nav-bar";
import { Footer } from "./components/layout/footer";
import { FloatingWhatsAppButton } from "./components/layout/floating-whatsapp-button";
import { contactConfig } from "./lib/contact";
import { absoluteUrl, rootMetadata, siteConfig } from "./lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = rootMetadata;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Store',
      '@id': `${siteConfig.url}/#store`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: absoluteUrl(siteConfig.appIcon),
      image: absoluteUrl(siteConfig.ogImage),
      description: siteConfig.description,
      email: contactConfig.email,
      telephone: contactConfig.whatsappDisplay,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cordoba',
        addressCountry: 'AR',
      },
      sameAs: [contactConfig.instagramUrl],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      name: siteConfig.name,
      url: siteConfig.url,
      publisher: {
        '@id': `${siteConfig.url}/#store`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteConfig.url}/productos?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <Navbar />
        {children}
        <FloatingWhatsAppButton />
        <AppToaster />
        <Footer />
      </body>
    </html>
  );
}
