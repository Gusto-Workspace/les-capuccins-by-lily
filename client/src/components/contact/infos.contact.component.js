import { useContext } from "react";
import { Clock3 } from "lucide-react";
import { GlobalContext } from "@/contexts/global.context";
import RevealOnScrollComponent from "../_shared/motion/reveal-on-scroll.component";
import SectionHeadingComponent from "../_shared/section-heading.component";
import FormContactCompnent from "./form.contact.component";
import { buildContactSchedules } from "../../_assets/utils/contact.utils";

export default function InfosContactComponent() {
  const { restaurantContext } = useContext(GlobalContext);
  const restaurantData = restaurantContext?.restaurantData;
  const dataLoading = restaurantContext?.dataLoading;
  const schedules = buildContactSchedules(restaurantData);

  return (
    <section className="bg-[var(--site-cream)] px-5 py-20 tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeadingComponent
          eyebrow="Échanger"
          title="Horaires & demandes"
          description="Pour une question sur le restaurant, une réservation de groupe ou une demande particulière à Turenne, contactez directement l’équipe."
        />

        <div className="mt-14 grid gap-6 desktop:grid-cols-[1.1fr_0.9fr]">
          <RevealOnScrollComponent variant="left">
            <FormContactCompnent />
          </RevealOnScrollComponent>

          <RevealOnScrollComponent
            delay={120}
            variant="right"
            className="site-card rounded-[34px] p-6 tablet:p-8 desktop:p-10"
          >
            <div className="flex flex-col items-center gap-3 text-center desktop:flex-row desktop:items-center desktop:text-left">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--site-line)] bg-white text-[var(--site-orange-deep)]">
                <Clock3 size={18} strokeWidth={1.6} />
              </div>
              <div>
                <p className="script-font text-[34px] leading-none text-[var(--site-orange-deep)]">
                  Horaires
                </p>
                <h3 className="yeseva-one-regular -mt-1 text-[42px] leading-[0.92] text-[var(--site-ink)]">
                  Ouverture
                </h3>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {dataLoading
                ? Array.from({ length: 7 }).map((_, index) => (
                    <div
                      key={`schedule-skeleton-${index}`}
                      className="rounded-[18px] border border-[var(--site-line)] bg-white/70 px-5 py-4"
                    >
                      <div className="flex flex-col items-center gap-3 text-center desktop:flex-row desktop:justify-between desktop:gap-6 desktop:text-left">
                        <div className="h-4 w-24 animate-pulse rounded bg-[rgba(223,160,132,0.24)]" />
                        <div className="h-4 w-40 animate-pulse rounded bg-black/6" />
                      </div>
                    </div>
                  ))
                : schedules.map((item) => (
                    <div
                      key={item.day}
                      className="rounded-[18px] border border-[var(--site-line)] bg-white/70 px-5 py-4"
                    >
                      <div className="flex flex-col items-center gap-1 text-center desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-6 desktop:text-left">
                        <p className="text-[17px] font-medium text-[var(--site-ink)]">
                          {item.day}
                        </p>
                        <p
                          className={`text-[15px] leading-[1.7] ${
                            item.hours === "Fermé" || item.hours === "-"
                              ? "text-[var(--site-ink-soft)]"
                              : "text-[var(--site-ink)]"
                          }`}
                        >
                          {item.hours}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>

            <div className="mt-8 rounded-[22px] border border-[var(--site-line)] bg-[rgba(223,160,132,0.12)] px-5 py-5 text-center desktop:text-left">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)]">
                Réservations de groupe
              </p>
              <p className="mt-3 text-[15px] leading-[1.8] text-[var(--site-ink-soft)]">
                Pour une privatisation, un groupe ou une demande spécifique,
                privilégiez le téléphone ou le formulaire pour obtenir une
                réponse adaptée.
              </p>
            </div>
          </RevealOnScrollComponent>
        </div>
      </div>
    </section>
  );
}
