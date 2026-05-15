import { fetchDetailCommon, fetchDetailIntro, fetchDetailImages } from '@/lib/tourApi'
import DetailHero from '@/components/DetailHero'
import DetailGallery from '@/components/DetailGallery'
import InfoTable from '@/components/InfoTable'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ contentId: string }>
}

export default async function FestivalDetail({ params }: Props) {
  const { contentId } = await params

  const [common, intro, images] = await Promise.all([
    fetchDetailCommon(contentId),
    fetchDetailIntro(contentId),
    fetchDetailImages(contentId),
  ])

  if (!common) notFound()

  const overviewText = common.overview?.replace(/<[^>]+>/g, '').trim()

  return (
    <main>
      <DetailHero common={common} intro={intro} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: overview + gallery */}
          <div className="space-y-8 lg:col-span-2">
            {overviewText && (
              <section>
                <h2 className="mb-3 text-base font-semibold text-zinc-800">행사 소개</h2>
                <p className="leading-relaxed text-sm text-zinc-600 whitespace-pre-line">
                  {overviewText}
                </p>
              </section>
            )}
            <DetailGallery images={images} />
          </div>

          {/* Right: info */}
          <div className="lg:col-span-1">
            <InfoTable common={common} intro={intro} />
          </div>
        </div>
      </div>
    </main>
  )
}
