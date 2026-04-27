export default function SectionHeadingComponent({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}) {
  const alignmentClass =
    align === "left" ? "items-start text-left" : "items-center text-center";
  const titleColorClass = light ? "text-[var(--site-cream)]" : "text-[var(--site-ink)]";
  const descriptionColorClass = light
    ? "text-[var(--site-cream-soft)]"
    : "text-[var(--site-ink-soft)]";

  return (
    <div
      className={`mx-auto flex max-w-[760px] flex-col ${alignmentClass} ${className}`.trim()}
    >
      {eyebrow ? (
        <p className="script-font text-[40px] leading-none text-[var(--site-orange)] tablet:text-[48px]">
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={`yeseva-one-regular mt-3 text-balance text-[42px] leading-[0.95] ${titleColorClass} tablet:text-[58px] ${titleClassName}`.trim()}
      >
        {title}
      </h2>

      <span className="mt-5 h-[3px] w-16 rounded-full bg-[var(--site-orange)]" />

      {description ? (
        <p
          className={`mt-6 max-w-[680px] text-[18px] leading-[1.85] ${descriptionColorClass} ${descriptionClassName}`.trim()}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
