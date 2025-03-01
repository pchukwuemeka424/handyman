import React from 'react';
import Topnav from '@/components/topnav';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: process.env.APP_NAME || 'Default App Name',
  description: process.env.APP_DESCRIPTION || 'Default App Description',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
  
      <div className="mx-auto max-w-7xl" >
        <Topnav />
        <div>{children}</div>
      </div>
    </>
  );
}
