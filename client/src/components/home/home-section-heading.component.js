export default function HomeSectionHeading({
  eyebrow,
  title,
  light = false,
  className = "",
  titleClassName = "",
}) {
  return (
    <div className={`mx-auto text-center ${className}`.trim()}>
      {eyebrow ? (
        <p
          className={`script-font text-[42px] leading-none tablet:text-[52px] ${
            light ? "text-[rgba(246,231,230,0.82)]" : "text-[var(--site-orange)]"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={`yeseva-one-regular mt-3 text-[46px] leading-[0.92] ${
          light ? "text-[var(--site-cream)]" : "text-[var(--site-ink)]"
        } tablet:text-[62px] ${titleClassName}`.trim()}
      >
        {title}
      </h2>

      <span
        className={`mx-auto mt-5 block h-[3px] w-16 rounded-full ${
          light ? "bg-[var(--site-cream)]" : "bg-[var(--site-orange)]"
        }`}
      />
    </div>
  );
}
