import Image from "next/image";
import ParallaxLayerComponent from "./motion/parallax-layer.component";
import RevealOnScrollComponent from "./motion/reveal-on-scroll.component";

export default function StickerPhotoComponent({
  src,
  alt = "",
  className = "",
  layerClassName = "z-20",
  imageClassName = "object-cover",
  imageSizes = "280px",
  patchClassName = "",
  rotatePatch = "-6deg",
  revealVariant = "zoom",
  revealDelay = 0,
  parallaxRange = 58,
  parallaxSpeed = 0.34,
  floatClassName = "",
  disableMotion = false,
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute hidden select-none desktop:block ${layerClassName} ${className}`.trim()}
    >
      <RevealOnScrollComponent
        variant={revealVariant}
        delay={revealDelay}
        className="h-full w-full"
      >
        {disableMotion ? (
          <div className="site-hover-lift relative h-full w-full rounded-[14px] border-[10px] border-white bg-white shadow-[0_22px_44px_rgba(71,42,34,0.22)]">
            <div className="relative h-full w-full overflow-hidden rounded-[6px] site-media-zoom">
              <Image
                src={src}
                alt={alt}
                fill
                sizes={imageSizes}
                className={imageClassName}
              />
            </div>

            <div
              className={`absolute left-1/2 top-[-21px] h-[26px] w-[86px] -translate-x-1/2 opacity-92 ${patchClassName}`.trim()}
              style={{ transform: `translateX(-50%) rotate(${rotatePatch})` }}
            >
              <Image
                src="/img/photos/patch.webp"
                alt=""
                fill
                sizes="86px"
                className="object-contain"
              />
            </div>
          </div>
        ) : (
          <ParallaxLayerComponent
            className="h-full w-full"
            innerClassName={floatClassName}
            range={parallaxRange}
            speed={parallaxSpeed}
          >
            <div className="site-hover-lift relative h-full w-full rounded-[14px] border-[10px] border-white bg-white shadow-[0_22px_44px_rgba(71,42,34,0.22)]">
              <div className="relative h-full w-full overflow-hidden rounded-[6px] site-media-zoom">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes={imageSizes}
                  className={imageClassName}
                />
              </div>

              <div
                className={`absolute left-1/2 top-[-21px] h-[26px] w-[86px] -translate-x-1/2 opacity-92 ${patchClassName}`.trim()}
                style={{ transform: `translateX(-50%) rotate(${rotatePatch})` }}
              >
                <Image
                  src="/img/photos/patch.webp"
                  alt=""
                  fill
                  sizes="86px"
                  className="object-contain"
                />
              </div>
            </div>
          </ParallaxLayerComponent>
        )}
      </RevealOnScrollComponent>
    </div>
  );
}
