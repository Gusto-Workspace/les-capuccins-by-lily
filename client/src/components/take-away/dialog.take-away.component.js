import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function TakeAwayDialog({
  title,
  children,
  onClose,
  titleClassName = "",
}) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = ref.current.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose?.();
      }}
      className="take-away-dialog site-card m-auto max-h-[85dvh] w-[calc(100%-32px)] max-w-[620px] overflow-y-auto rounded-[30px] p-6 text-[var(--site-ink)] shadow-[var(--site-shadow)] tablet:p-8"
    >
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la description"
          className="sticky top-0 z-10 float-right ml-3 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--site-line)] bg-[var(--site-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--site-orange-deep)]"
        >
          <X size={20} />
        </button>
      ) : null}
      <h2
        id={titleId}
        className={`yeseva-one-regular break-words text-[32px] leading-tight tablet:text-[40px] ${titleClassName}`}
      >
        {title}
      </h2>
      {children}
    </dialog>,
    document.querySelector(".font-root") || document.body,
  );
}
