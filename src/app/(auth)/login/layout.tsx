import React, { ReactNode } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: `${process.env.APP_NAME} - Login`,
    description: `${process.env.APP_DESCRIPTION}`,
}

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      {children}
    </div>
  )
}
