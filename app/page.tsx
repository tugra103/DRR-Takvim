"use client"

import dynamic from 'next/dynamic'

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
  return <Calendar />
}