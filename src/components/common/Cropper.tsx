/* eslint-disable @typescript-eslint/no-namespace */
import 'cropperjs';
import { type CropperCanvas, type CropperImage } from 'cropperjs';
import { useRef } from 'react';

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'cropper-canvas': unknown;
      'cropper-image': unknown;
      'cropper-selection': unknown;
      'cropper-shade': unknown;
      'cropper-handle': unknown;
    }
  }
}

type CropperProps = {
  src: string;
  alt: string;
  ref?: React.RefObject<CropperCanvas | null>;
  onLoad?: () => void;
};

const ZOOM_SCALE_STEP = 0.3;
const MOVE_STEP = 10;

export default function Cropper({ src, alt, onLoad, ref }: CropperProps) {
  const cropperCanvasRef = useRef<CropperCanvas>(null);
  const cropperImageRef = useRef<CropperImage>(null);

  const onImageTransform = (event: CustomEvent) => {
    if (!cropperCanvasRef.current || !cropperImageRef.current) return;
    const canvasRect = cropperCanvasRef.current.getBoundingClientRect();
    const imageNode = cropperImageRef.current.cloneNode() as CropperImage;

    const eventMatrix = event.detail.matrix;
    imageNode.style.transform = `matrix(${eventMatrix.join(', ')})`;
    imageNode.style.opacity = '0';

    cropperCanvasRef.current.appendChild(imageNode);
    const imageRect = imageNode.getBoundingClientRect();
    cropperCanvasRef.current.removeChild(imageNode);

    if (
      imageRect.top > canvasRect.top ||
      imageRect.right < canvasRect.right ||
      imageRect.bottom < canvasRect.bottom ||
      imageRect.left > canvasRect.left
    ) {
      event.preventDefault();
    }
  };

  const onKeyDown = async (event: KeyboardEvent) => {
    if (!cropperCanvasRef.current || !cropperImageRef.current) return;
    switch (event.key) {
      case '+':
        event.preventDefault();
        cropperImageRef.current.$zoom(ZOOM_SCALE_STEP);
        break;
      case '-':
        event.preventDefault();
        cropperImageRef.current.$center().$zoom(-ZOOM_SCALE_STEP);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        cropperImageRef.current.$move(MOVE_STEP, 0);
        break;
      case 'ArrowRight':
        event.preventDefault();
        cropperImageRef.current.$move(-MOVE_STEP, 0);
        break;
      case 'ArrowUp':
        event.preventDefault();
        cropperImageRef.current.$move(0, MOVE_STEP);
        break;
      case 'ArrowDown':
        event.preventDefault();
        cropperImageRef.current.$move(0, -MOVE_STEP);
        break;
    }
  };

  return (
    <cropper-canvas
      ref={(node: unknown) => {
        if (node) {
          cropperCanvasRef.current = node as CropperCanvas;
          if (ref) ref.current = node as CropperCanvas;
        }
      }}
      background
      scale-step={ZOOM_SCALE_STEP}
      style={{ width: 300, height: 300 }}
    >
      <cropper-image
        ref={cropperImageRef}
        scalable
        translatable
        tabindex="0"
        src={src}
        alt={alt}
        ontransform={onImageTransform}
        onkeydown={onKeyDown}
        onload={onLoad}
      ></cropper-image>
      <cropper-shade
        theme-color="rgba(0, 0, 0, 0.4)"
        style={{ borderRadius: '50%' }}
      ></cropper-shade>
      <cropper-selection
        outlined
        initial-coverage="1"
        style={{
          borderRadius: '50%',
          outlineColor: '#fff',
          outlineWidth: '3px',
          outlineOffset: '-3px',
        }}
      ></cropper-selection>
      <cropper-handle plain action="move"></cropper-handle>
    </cropper-canvas>
  );
}
