'use client';

import { useLayoutEffect, useState } from 'react';
import NextImage, { ImageProps } from 'next/image'
import ImagePreview from './ImagePreview'
const basePath = process.env.BASE_PATH

const Image = ({ src, ...rest }: ImageProps) => {
  const baseSrc = `${basePath || ''}${src}`;
  const [isPreview, setIsPreview] = useState(false);

  function scrollHandler(e: Event) {
    e.preventDefault();
  }

  useLayoutEffect(() => {
    if (isPreview) {
      window.addEventListener('wheel', scrollHandler, { passive: false });
    }
    return () => {
      window.removeEventListener('wheel', scrollHandler);
    }
  }, [isPreview]);

  return <div className='relative'>
    <NextImage
      style={{ cursor: 'zoom-in' }}
      src={baseSrc}
      onClick={() => {
        setIsPreview(true);
      }}
      {...rest}
    />
    <ImagePreview
      style={{ opacity: isPreview ? 1 : 0, zIndex: isPreview ? 100 : -1 }} 
      src={baseSrc} 
      onClose={() => {
        setIsPreview(false);
        window.removeEventListener('wheel', scrollHandler);
      }} 
    />
  </div>
};

export default Image
