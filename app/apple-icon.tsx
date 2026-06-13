import { ImageResponse } from 'next/og'
import { loadKoreanFont } from '@/lib/ogFont'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const font = await loadKoreanFont()
  const fonts = font
    ? [{ name: 'NotoSansKR', data: font, style: 'normal' as const, weight: 900 as const }]
    : []

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#f1e7d3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* outer vermilion border */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '7px solid #c23218',
            display: 'flex',
          }}
        />
        {/* inner thin border */}
        <div
          style={{
            position: 'absolute',
            inset: 12,
            border: '2px solid #c23218',
            display: 'flex',
          }}
        />
        <span
          style={{
            color: '#c23218',
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1,
            fontFamily: 'NotoSansKR, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          축
        </span>
        <span
          style={{
            color: '#6f6450',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.2em',
            fontFamily: 'NotoSansKR, sans-serif',
            marginTop: 6,
            textTransform: 'uppercase',
          }}
        >
          FESTIVAL
        </span>
      </div>
    ),
    { ...size, fonts },
  )
}
