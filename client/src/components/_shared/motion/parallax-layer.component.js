import { useEffect, useRef } from "react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

const registry = new Set();
let observer = null;
let frame = 0;
let listenersBound = false;

function isMotionDisabled() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true;
  }

  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.innerWidth < 1024
  );
}

function ensureObserver() {
  if (observer || typeof window === "undefined") {
    return observer;
  }

  if (!("IntersectionObserver" in window)) {
    return null;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const targetEntry = entry.target.__siteParallaxEntry;

        if (!targetEntry) {
          return;
        }

        targetEntry.isActive = entry.isIntersecting;

        if (!entry.isIntersecting) {
          entry.target.style.transform = "";
        }
      });

      queueUpdate();
    },
    {
      rootMargin: "220px 0px 220px 0px",
      threshold: 0,
    },
  );

  return observer;
}

function updateParallax() {
  frame = 0;

  if (typeof window === "undefined") {
    return;
  }

  if (isMotionDisabled()) {
    registry.forEach((entry) => {
      if (entry.node) {
        entry.node.style.transform = "";
      }
    });

    return;
  }

  const viewportHeight = window.innerHeight || 1;

  registry.forEach((entry) => {
    const { node, axis, range, speed, isActive } = entry;

    if (!node || !isActive) {
      return;
    }

    const rect = node.getBoundingClientRect();

    if (rect.bottom < -220 || rect.top > viewportHeight + 220) {
      return;
    }

    const progress =
      (viewportHeight - rect.top) / (viewportHeight + rect.height);
    const centeredProgress = clamp((progress - 0.5) * 2, -1.1, 1.1);
    const travel = centeredProgress * range * speed;
    const offsetX = axis === "x" ? travel : 0;
    const offsetY = axis === "x" ? 0 : travel;

    node.style.transform = `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0)`;
  });
}

function queueUpdate() {
  if (typeof window === "undefined" || frame) {
    return;
  }

  frame = window.requestAnimationFrame(updateParallax);
}

function bindListeners() {
  if (listenersBound || typeof window === "undefined") {
    return;
  }

  listenersBound = true;
  window.addEventListener("scroll", queueUpdate, { passive: true });
  window.addEventListener("resize", queueUpdate);
}

function unbindListenersIfIdle() {
  if (!listenersBound || registry.size) {
    return;
  }

  listenersBound = false;

  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", queueUpdate);
    window.removeEventListener("resize", queueUpdate);
  }
}

export default function ParallaxLayerComponent({
  children,
  className = "",
  innerClassName = "",
  axis = "y",
  range = 46,
  speed = 0.3,
  disabled = false,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;

    if (!node || disabled || typeof window === "undefined") {
      return undefined;
    }

    const entry = {
      node,
      axis,
      range,
      speed,
      isActive: !("IntersectionObserver" in window),
    };

    node.__siteParallaxEntry = entry;
    registry.add(entry);
    bindListeners();

    const nextObserver = ensureObserver();
    nextObserver?.observe(node);
    queueUpdate();

    return () => {
      nextObserver?.unobserve(node);
      registry.delete(entry);
      delete node.__siteParallaxEntry;
      node.style.transform = "";
      unbindListenersIfIdle();
    };
  }, [axis, disabled, range, speed]);

  return (
    <div ref={ref} className={`h-full w-full ${className}`.trim()}>
      <div className={`h-full w-full ${innerClassName}`.trim()}>{children}</div>
    </div>
  );
}
