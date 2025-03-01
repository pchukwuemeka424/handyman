import React from 'react';
import Topnav from '@/components/topnav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${process.env.APP_NAME}`,
  description: `${process.env.APP_DESCRIPTION}`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl">
      <Topnav />
      <div>{children}</div>
    </div>
  );
}
