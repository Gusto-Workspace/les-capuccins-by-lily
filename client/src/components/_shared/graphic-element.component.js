import Image from "next/image";
import ParallaxLayerComponent from "./motion/parallax-layer.component";

export default function GraphicElementComponent({
  src,
  className = "",
  imageClassName = "object-contain",
  sizes = "240px",
  parallaxRange = 52,
  parallaxSpeed = 0.24,
  floatClassName = "",
  disableMotion = false,
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 select-none ${className}`.trim()}
    >
      {disableMotion ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          className={imageClassName}
        />
      ) : (
        <ParallaxLayerComponent
          className="h-full w-full"
          innerClassName={floatClassName}
          range={parallaxRange}
          speed={parallaxSpeed}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes={sizes}
            className={imageClassName}
          />
        </ParallaxLayerComponent>
      )}
    </div>
  );
}
