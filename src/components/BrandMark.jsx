import raw from '../assets/lg-mark.svg?raw'

// Фирменный знак LG Seeds (подсолнух). Перекрашивается через currentColor.
export default function BrandMark({ className = 'h-6 w-6' }) {
  return <span className={`inline-flex ${className}`} dangerouslySetInnerHTML={{ __html: raw }} />
}
