/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['fbpdbcxjavianaboavoo.supabase.co', 'placehold.co'], // Fixed trailing slash
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fbpdbcxjavianaboavoo.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**', // Adjusted for Supabase path
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // // Add redirect rule for sitemap
  // async redirects() {
  //   return [
  //     {
  //       source: '/sitemap',      // The URL path to be redirected
  //       destination: '/sitemap.xml', // The destination URL (sitemap.xml)
  //       permanent: true,        // This will make it a permanent redirect (HTTP 301)
  //     },
  //   ];
  // },

  // Add next-sitemap configuration
  sitemap: {
    siteUrl: 'https://afrivendor.ng', // Update with your actual site URL
    generateRobotsTxt: true, // Optional: generates a robots.txt file
    changefreq: 'daily', // Optional: set the change frequency
    priority: 0.7, // Optional: set the priority for all pages
  },
};

module.exports = nextConfig;
