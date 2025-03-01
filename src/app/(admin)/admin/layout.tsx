import React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SheetAdmin } from '@/components/sheetAdmin'

export default function layout({children}:{children:React.ReactNode}) {
  return (
    <div className="mx-auto max-w-7xl">
      <SheetAdmin />
      {children}

    </div>
 
  )
}
