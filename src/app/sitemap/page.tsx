// /pages/sitemap/page.tsx
import { NextPage } from 'next';

const Sitemap: NextPage = () => {
  const pages = [
    '/', 
    '/contact', 
    '/login', 
    '/register', 
    '/vendor', 
    '/product', 
    '/store',
  ];

  const generateSitemap = (pages: string[]) => {
    return pages
      .map((page) => {
        return `
          <url>
            <loc>${`https://afrivendor.ng${page}`}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.7</priority>
          </url>
        `;
      })
      .join('');
  };

  return (
    <>
      {`<?xml version="1.0" encoding="UTF-8"?>  
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${generateSitemap(pages)}
        </urlset>`}
    </>
  );
};

export default Sitemap;
