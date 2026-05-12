'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import 'react-quill-new/dist/quill.snow.css'

export default function Page() {
  const [value, setValue] = useState('')

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
    />
  )
}
