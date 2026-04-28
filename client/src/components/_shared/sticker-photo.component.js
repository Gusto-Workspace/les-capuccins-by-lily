import Image from "next/image";

export default function StickerPhotoComponent({
  src,
  alt = "",
  className = "",
  imageClassName = "object-cover",
  imageSizes = "280px",
  patchClassName = "",
  rotatePatch = "-6deg",
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 hidden select-none desktop:block ${className}`.trim()}
    >
      <div className="relative h-full w-full rounded-[14px] border-[10px] border-white bg-white shadow-[0_22px_44px_rgba(71,42,34,0.22)]">
        <div className="relative h-full w-full overflow-hidden rounded-[6px]">
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
            src="/img/photos/patch.png"
            alt=""
            fill
            sizes="86px"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
