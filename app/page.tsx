"use client"

import dynamic from 'next/dynamic'
import Navbar from "@/comporents/navbar";

// SSR kapalı, FullCalendar client-only
const Calendar = dynamic(() => import('@/components/Calendar'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center text-gray-400">
      Yükleniyor...
    </div>
  ),
})

export default function Page() {
  return (<> 
    <Navbar/>
    <div className="h-screen p-4 bg-white text-gray-900">
      <Calendar />
    </div>
  </>)
  
}
