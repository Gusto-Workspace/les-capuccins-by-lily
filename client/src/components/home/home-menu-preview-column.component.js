export default function HomeMenuPreviewColumn({
  title,
  items = [],
  bordered = false,
}) {
  return (
    <div
      className={`mx-auto max-w-[420px] py-2 text-center desktop:mx-0 desktop:max-w-none desktop:text-left ${
        bordered
          ? "desktop:border-r desktop:border-[var(--site-line)] desktop:pr-8"
          : ""
      }`}
    >
      <div className="mb-7 flex items-center justify-center gap-3 desktop:justify-start">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--site-line)] bg-white/55 text-[14px] font-semibold text-[var(--site-orange-deep)]">
          ●
        </span>
        <h3 className="yeseva-one-regular text-[36px] uppercase leading-[0.92] text-[var(--site-ink)]">
          {title}
        </h3>
      </div>

      <div className="space-y-5">
        {items.map((item) =>
          item.isSubCategoryHeading ? (
            <h4
              key={item.id}
              className="pt-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--site-orange-deep)]"
            >
              {item.name}
            </h4>
          ) : (
            <div key={item.id}>
              <div className="flex flex-col items-center gap-2 desktop:flex-row desktop:items-start desktop:gap-4">
                <p className="min-w-0 text-[16px] font-semibold text-[var(--site-ink)]">
                  {item.name}
                </p>
                {item.price ? (
                  <>
                    <div className="mt-[13px] hidden min-w-0 flex-1 border-b border-dotted border-[rgba(223,160,132,0.72)] desktop:block" />
                    <span className="shrink-0 text-[15px] font-semibold text-[var(--site-orange-deep)]">
                      {item.price}
                    </span>
                  </>
                ) : null}
              </div>

              {item.description ? (
                <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-[1.7] text-[var(--site-ink-soft)] desktop:mx-0">
                  {item.description}
                </p>
              ) : null}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
