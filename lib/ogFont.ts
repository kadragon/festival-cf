let cache: ArrayBuffer | null = null

export async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  if (cache) return cache
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@900&text=%EC%B6%95',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      },
    ).then((r) => r.text())
    const url = css.match(/url\((.+?)\) format\('woff2'\)/)?.[1]
    if (!url) return null
    cache = await fetch(url).then((r) => r.arrayBuffer())
    return cache
  } catch {
    return null
  }
}
