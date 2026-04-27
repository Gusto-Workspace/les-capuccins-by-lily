import { useContext } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { GlobalContext } from "@/contexts/global.context";
import SectionHeadingComponent from "../_shared/section-heading.component";
import {
  buildContactInfos,
  getMapEmbedSrc,
} from "../../_assets/utils/contact.utils";

export default function MapContactComponent() {
  const { restaurantContext } = useContext(GlobalContext);
  const restaurantData = restaurantContext?.restaurantData;
  const dataLoading = restaurantContext?.dataLoading;
  const infos = buildContactInfos(restaurantData);
  const mapSrc = getMapEmbedSrc(restaurantData);
  const iconByKey = {
    address: MapPin,
    phone: Phone,
    email: Mail,
  };

  return (
    <section className="site-shell px-5 py-20 tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeadingComponent
          eyebrow="Venir"
          title="Nous trouver facilement"
          description="Adresse, téléphone, email et localisation : toutes les informations utiles pour organiser votre venue."
        />

        <div className="mt-14 grid gap-6 desktop:grid-cols-[0.86fr_1.14fr]">
          <div className="site-card rounded-[34px] p-6 tablet:p-8 desktop:p-10">
            <div className="space-y-5">
              {dataLoading
                ? ["Adresse", "Téléphone", "Email"].map((label) => (
                    <div
                      key={label}
                      className="rounded-[22px] border border-[var(--site-line)] bg-white/70 px-5 py-5"
                    >
                      <div className="h-4 w-28 animate-pulse rounded bg-[rgba(223,160,132,0.24)]" />
                      <div className="mt-4 h-6 w-full animate-pulse rounded bg-black/6" />
                    </div>
                  ))
                : infos.map((item) => {
                    const Icon = iconByKey[item.key] || MapPin;

                    return (
                      <div
                        key={item.label}
                        className="rounded-[22px] border border-[var(--site-line)] bg-white/70 px-5 py-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--site-line)] bg-white text-[var(--site-orange-deep)]">
                            <Icon size={18} strokeWidth={1.6} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--site-orange-deep)]">
                              {item.label}
                            </p>

                            {item.href ? (
                              <a
                                href={item.href}
                                className="mt-3 inline-block break-words text-[18px] leading-[1.7] text-[var(--site-ink)] transition hover:text-[var(--site-orange-deep)]"
                              >
                                {item.value}
                              </a>
                            ) : (
                              <p className="mt-3 break-words text-[18px] leading-[1.7] text-[var(--site-ink)]">
                                {item.value}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>

          <div className="site-card overflow-hidden rounded-[34px] p-3 tablet:p-4">
            <div className="h-[340px] overflow-hidden rounded-[28px] tablet:h-[420px] desktop:h-full desktop:min-h-[560px]">
              {dataLoading ? (
                <div className="h-full animate-pulse bg-[rgba(223,160,132,0.18)]" />
              ) : mapSrc ? (
                <iframe
                  title="map"
                  src={mapSrc}
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[rgba(223,160,132,0.12)] px-6 text-center text-[15px] text-[var(--site-ink-soft)]">
                  Carte indisponible pour le moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
