import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
            fontFamily: 'sans-serif',
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
            fontFamily: 'sans-serif',
            marginTop: 6,
            textTransform: 'uppercase',
          }}
        >
          FESTIVAL
        </span>
      </div>
    ),
    { ...size },
  )
}
