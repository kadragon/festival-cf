let cache: ArrayBuffer | null = null

export async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  if (cache) return cache
  try {
    // No User-Agent → Google Fonts returns TTF (truetype), which Satori/fontkit supports.
    // WOFF2 (returned for modern UAs) throws "Unsupported OpenType signature wOF2".
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@900&text=%EC%B6%95',
    ).then((r) => r.text())
    const url = css.match(/url\((.+?)\) format\('truetype'\)/)?.[1]
    if (!url) return null
    cache = await fetch(url).then((r) => r.arrayBuffer())
    return cache
  } catch {
    return null
  }
}
