import { useEffect, useState } from "react";
import { X } from "lucide-react";
import SectionHeadingComponent from "../_shared/section-heading.component";
import { formatNewsDate, getVisibleNews } from "../../_assets/utils/news.utils";

const richTextClass =
  "[&_p]:mt-4 [&_p:first-child]:mt-0 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-2 [&_li>p]:mt-0 [&_strong]:font-semibold [&_em]:italic [&_a]:text-[var(--site-orange-deep)] [&_a]:underline [&_a]:underline-offset-4";

function NewsImage({ item, className = "" }) {
  if (item?.image) {
    return (
      <img
        src={item.image}
        alt={item?.title || "Actualité"}
        className={`h-full w-full object-cover ${className}`.trim()}
      />
    );
  }

  return (
    <div
      className={`flex h-full min-h-[240px] w-full items-center justify-center bg-[rgba(246,229,218,0.92)] text-center text-[var(--site-ink-soft)] ${className}`.trim()}
    >
      <div className="px-8">
        <p className="script-font text-[42px] leading-none text-[var(--site-orange-deep)]">
          Actualité
        </p>
        <p className="yeseva-one-regular mt-2 text-[34px] leading-[0.92] text-[var(--site-ink)]">
          À venir
        </p>
      </div>
    </div>
  );
}

function LoadingSection() {
  return (
    <div className="mt-14 grid grid-cols-1 gap-6 desktop:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`news-skeleton-${index}`}
          className="site-card overflow-hidden rounded-[32px]"
        >
          <div className="h-[240px] animate-pulse bg-[rgba(223,160,132,0.18)]" />
          <div className="px-6 py-6">
            <div className="h-4 w-24 animate-pulse rounded bg-[rgba(223,160,132,0.28)]" />
            <div className="mt-5 h-12 w-[72%] animate-pulse rounded bg-black/8" />
            <div className="mt-5 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-black/6" />
              <div className="h-4 w-[92%] animate-pulse rounded bg-black/6" />
              <div className="h-4 w-[66%] animate-pulse rounded bg-black/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NewsCard({ item, onOpen }) {
  return (
    <article className="site-card flex h-full flex-col overflow-hidden rounded-[32px] transition-transform duration-300 hover:-translate-y-[2px]">
      <div className="relative h-[260px] overflow-hidden">
        <NewsImage item={item} />
      </div>

      <div className="flex flex-1 flex-col px-6 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)]">
          {formatNewsDate(item?.published_at) || "Actualité"}
        </p>

        <h3 className="yeseva-one-regular mt-4 text-[40px] leading-[0.9] text-[var(--site-ink)]">
          {item?.title}
        </h3>

        {item?.description ? (
          <div
            className={`mt-5 flex-1 text-[16px] leading-[1.8] text-[var(--site-ink-soft)] ${richTextClass}`}
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        ) : null}

        <button
          type="button"
          onClick={() => onOpen(item)}
          className="mt-6 inline-flex w-fit text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--site-orange-deep)] transition hover:opacity-70"
        >
          En savoir plus
        </button>
      </div>
    </article>
  );
}

function NewsModal({ item, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(39,20,12,0.55)] px-4 py-8"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="site-card flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-[34px]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--site-line)] px-6 py-5 tablet:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)]">
              {formatNewsDate(item?.published_at) || "Actualité"}
            </p>
            <h2 className="yeseva-one-regular mt-3 text-[46px] leading-[0.9] text-[var(--site-ink)] tablet:text-[58px]">
              {item?.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--site-line)] bg-white/75 text-[var(--site-ink)] transition hover:text-[var(--site-orange-deep)]"
            aria-label="Fermer l’actualité"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 tablet:px-8">
          <div className="overflow-hidden rounded-[26px]">
            <NewsImage item={item} className="max-h-[420px]" />
          </div>

          {item?.description ? (
            <div
              className={`mt-8 text-[17px] leading-[1.9] text-[var(--site-ink-soft)] ${richTextClass} [&_h1]:yeseva-one-regular [&_h1]:text-[42px] [&_h1]:leading-[0.95] [&_h1]:text-[var(--site-ink)] [&_h2]:yeseva-one-regular [&_h2]:text-[34px] [&_h2]:leading-[0.95] [&_h2]:text-[var(--site-ink)] [&_h3]:yeseva-one-regular [&_h3]:text-[28px] [&_h3]:leading-[0.98] [&_h3]:text-[var(--site-ink)]`}
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ListNewsComponent({
  restaurantData,
  dataLoading = false,
}) {
  const [selectedNews, setSelectedNews] = useState(null);
  const visibleNews = getVisibleNews(restaurantData);

  useEffect(() => {
    if (!selectedNews) {
      document.body.style.overflow = "";
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedNews]);

  return (
    <>
      <section className="site-shell px-5 py-20 tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]">
        <div className="mx-auto max-w-[1500px]">
          <SectionHeadingComponent
            eyebrow="Actualités"
            title="Nouveautés & événements"
            description="Retrouvez ici les temps forts du restaurant, les nouveautés de la carte et les rendez-vous à venir."
          />

          {dataLoading && !restaurantData ? (
            <LoadingSection />
          ) : !visibleNews.length ? (
            <div className="site-card mx-auto mt-14 max-w-[760px] rounded-[32px] px-8 py-12 text-center">
              <p className="script-font text-[38px] leading-none text-[var(--site-orange-deep)]">
                Bientôt
              </p>
              <p className="mt-4 text-[17px] leading-[1.85] text-[var(--site-ink-soft)]">
                Aucune actualité n’est publiée pour le moment. Revenez bientôt
                pour découvrir les prochains temps forts du restaurant.
              </p>
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-6 desktop:grid-cols-3">
              {visibleNews.map((item, index) => (
                <NewsCard
                  key={item?._id || `news-${index}`}
                  item={item}
                  onOpen={setSelectedNews}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedNews ? (
        <NewsModal item={selectedNews} onClose={() => setSelectedNews(null)} />
      ) : null}
    </>
  );
}
