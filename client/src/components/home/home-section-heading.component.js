import RevealOnScrollComponent from "../_shared/motion/reveal-on-scroll.component";

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
        <RevealOnScrollComponent
          as="p"
          className={`script-font text-[42px] leading-none tablet:text-[52px] ${
            light ? "text-[rgba(246,231,230,0.82)]" : "text-[var(--site-orange)]"
          }`}
          variant="up"
        >
          {eyebrow}
        </RevealOnScrollComponent>
      ) : null}

      <RevealOnScrollComponent
        as="h2"
        delay={90}
        variant="up"
        className={`yeseva-one-regular mt-3 text-[46px] leading-[0.92] ${
          light ? "text-[var(--site-cream)]" : "text-[var(--site-ink)]"
        } tablet:text-[62px] ${titleClassName}`.trim()}
      >
        {title}
      </RevealOnScrollComponent>

      <RevealOnScrollComponent delay={180} variant="soft" className="mt-5">
        <span
          className={`mx-auto block h-[3px] w-16 rounded-full ${
            light ? "bg-[var(--site-cream)]" : "bg-[var(--site-orange)]"
          }`}
        />
      </RevealOnScrollComponent>
    </div>
  );
}
