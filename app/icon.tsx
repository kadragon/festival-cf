import { ImageResponse } from 'next/og'
import { loadKoreanFont } from '@/lib/ogFont'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const font = await loadKoreanFont()
  const fonts = font
    ? [{ name: 'NotoSansKR', data: font, style: 'normal' as const, weight: 900 as const }]
    : []

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#c23218',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* paper texture suggestion — thin inner border */}
        <div
          style={{
            position: 'absolute',
            inset: 2,
            borderRadius: 4,
            border: '1px solid rgba(241,231,211,0.25)',
            display: 'flex',
          }}
        />
        <span
          style={{
            color: '#f1e7d3',
            fontSize: 19,
            fontWeight: 900,
            lineHeight: 1,
            fontFamily: 'NotoSansKR, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          축
        </span>
      </div>
    ),
    { ...size, fonts },
  )
}
