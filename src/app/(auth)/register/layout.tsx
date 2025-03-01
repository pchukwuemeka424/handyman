import React from 'react'
import { Metadata } from 'next'


export const metadata: Metadata = {
    title: `${process.env.APP_NAME} - Open Account`,
    description: `${process.env.APP_DESCRIPTION}`,
}

export default function layout({ children }) {
  return (
    <div>
        
      {children}
    </div>
  )
}
