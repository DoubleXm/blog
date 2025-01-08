'use client'

interface ImagePreviewProps {
  src: string
  onClose: () => void
  style?: React.CSSProperties
}

const ImagePreview = ({ src, onClose, style }: ImagePreviewProps) => {
  return (
    <div
      className="preview-wrapper"
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
      style={style}
    >
      <div className="preview-outer">
        <img className="perview-img" src={src} />
      </div>
    </div>
  )
}

export default ImagePreview
