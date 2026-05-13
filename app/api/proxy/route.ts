// app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  const res = await fetch(url)
  const text = await res.text()

  return new NextResponse(text, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
