import Image from 'next/image'
import { type DetailImage } from '@/lib/tourApi'

interface Props {
  images: DetailImage[]
}

export default function DetailGallery({ images }: Props) {
  if (images.length === 0) return null

  return (
    <div>
      <h2 className="mb-3 border-b-2 border-ink pb-2 font-display text-lg text-ink">갤러리</h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {images.slice(0, 9).map((img, i) => (
          <a
            key={img.serialnum ?? i}
            href={img.originimgurl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block aspect-square overflow-hidden rounded-md border-2 border-ink/15 bg-paper-2"
          >
            <Image
              src={img.smallimageurl || img.originimgurl}
              alt={img.imgname ?? `이미지 ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-200 hover:scale-105"
            />
          </a>
        ))}
      </div>
    </div>
  )
}
