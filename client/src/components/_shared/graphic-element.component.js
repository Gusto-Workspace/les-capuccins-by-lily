import Image from "next/image";

export default function GraphicElementComponent({
  src,
  className = "",
  imageClassName = "object-contain",
  sizes = "240px",
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 select-none ${className}`.trim()}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        className={imageClassName}
      />
    </div>
  );
}
