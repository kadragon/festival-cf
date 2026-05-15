import { NextRequest, NextResponse } from 'next/server'
import { fetchDetailCommon, fetchDetailIntro, fetchDetailImages } from '@/lib/tourApi'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ contentId: string }> }
) {
  const { contentId } = await params

  try {
    const [common, intro, images] = await Promise.all([
      fetchDetailCommon(contentId),
      fetchDetailIntro(contentId),
      fetchDetailImages(contentId),
    ])
    return NextResponse.json({ common, intro, images })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
