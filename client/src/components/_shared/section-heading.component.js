import RevealOnScrollComponent from "./motion/reveal-on-scroll.component";

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
        <RevealOnScrollComponent
          as="p"
          variant={align === "left" ? "left" : "up"}
          className="script-font text-[40px] leading-none text-[var(--site-orange)] tablet:text-[48px]"
        >
          {eyebrow}
        </RevealOnScrollComponent>
      ) : null}

      <RevealOnScrollComponent
        as="h2"
        delay={90}
        variant={align === "left" ? "left" : "up"}
        className={`yeseva-one-regular mt-3 text-balance text-[42px] leading-[0.95] ${titleColorClass} tablet:text-[58px] ${titleClassName}`.trim()}
      >
        {title}
      </RevealOnScrollComponent>

      <RevealOnScrollComponent delay={180} variant="soft" className="mt-5">
        <span
          className={`block h-[3px] w-16 rounded-full ${
            light ? "bg-[var(--site-cream)]" : "bg-[var(--site-orange)]"
          }`}
        />
      </RevealOnScrollComponent>

      {description ? (
        <RevealOnScrollComponent
          as="p"
          delay={240}
          variant="soft"
          className={`mt-6 max-w-[680px] text-[18px] leading-[1.85] ${descriptionColorClass} ${descriptionClassName}`.trim()}
        >
          {description}
        </RevealOnScrollComponent>
      ) : null}
    </div>
  );
}
