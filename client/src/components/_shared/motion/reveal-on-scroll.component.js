import { useEffect, useRef, useState } from "react";

export default function RevealOnScrollComponent({
  as = "div",
  children,
  className = "",
  variant = "up",
  delay = 0,
  duration = 900,
  threshold = 0.16,
  once = true,
  style = {},
}) {
  const Tag = as;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof window === "undefined") {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio > threshold) {
          setIsVisible(true);

          if (once) {
            observer.unobserve(node);
          }

          return;
        }

        if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: [0, threshold, 0.35, 0.6],
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <Tag
      ref={ref}
      className={`site-reveal site-reveal--${variant} ${
        isVisible ? "is-visible" : ""
      } ${className}`.trim()}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
