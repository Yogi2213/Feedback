import { useRef, useState } from 'react';

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  children
}) {
  const ref = useRef(null);
  const [transform, setTransform] = useState('');
  const [scale, setScale] = useState(1);
  const [tooltipStyle, setTooltipStyle] = useState({ opacity: 0, left: 0, top: 0 });

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    setTransform(`perspective(800px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${scale})`);
    
    if (showTooltip) {
      setTooltipStyle({
        opacity: 1,
        left: e.clientX - rect.left,
        top: e.clientY - rect.top
      });
    }
  }

  function handleMouseEnter() {
    setScale(scaleOnHover);
  }

  function handleMouseLeave() {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)');
    setScale(1);
    setTooltipStyle({ opacity: 0, left: 0, top: 0 });
  }

  return (
    <figure
      ref={ref}
      className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer"
      style={{
        height: containerHeight,
        width: containerWidth,
        perspective: '800px'
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <div
        className="relative transition-transform duration-200 ease-out"
        style={{
          width: imageWidth,
          height: imageHeight,
          transform: transform,
          transformStyle: 'preserve-3d'
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={altText}
            className="absolute top-0 left-0 object-cover rounded-[15px] w-full h-full"
            style={{
              width: imageWidth,
              height: imageHeight
            }}
          />
        ) : (
          <div
            className="absolute top-0 left-0 rounded-[15px] w-full h-full"
            style={{
              width: imageWidth,
              height: imageHeight
            }}
          >
            {children}
          </div>
        )}

        {displayOverlayContent && overlayContent && (
          <div className="absolute top-0 left-0 z-[2]" style={{ transform: 'translateZ(30px)' }}>
            {overlayContent}
          </div>
        )}
      </div>

      {showTooltip && captionText && (
        <div
          className="pointer-events-none absolute rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] z-[3] hidden sm:block transition-opacity duration-200"
          style={{
            opacity: tooltipStyle.opacity,
            left: tooltipStyle.left,
            top: tooltipStyle.top,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {captionText}
        </div>
      )}
    </figure>
  );
}
