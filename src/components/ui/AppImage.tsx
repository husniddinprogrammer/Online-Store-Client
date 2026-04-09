import type { CSSProperties, ImgHTMLAttributes } from 'react'

type AppImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean
  priority?: boolean
  sizes?: string
}

export default function AppImage({
  alt,
  className,
  fill = false,
  priority = false,
  src,
  style,
  ...props
}: AppImageProps) {
  if (!src || typeof src !== 'string') {
    return null
  }

  const imageStyle: CSSProperties = fill
    ? {
        ...style,
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }
    : (style ?? {})

  return (
    <img
      alt={alt}
      className={className}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      loading={priority ? 'eager' : 'lazy'}
      src={src}
      style={imageStyle}
      {...props}
    />
  )
}
