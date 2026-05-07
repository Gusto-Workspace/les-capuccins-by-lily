import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Check, Mail, Phone, User, MessageSquare } from "lucide-react";
import { GlobalContext } from "@/contexts/global.context";

function InputIcon({ children }) {
  return (
    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(184,121,93,0.7)]">
      {children}
    </span>
  );
}

export default function FormContactCompnent() {
  const { restaurantContext } = useContext(GlobalContext);
  const restaurantData = restaurantContext?.restaurantData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function onSubmit(data) {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact-form-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          restaurantName: restaurantData?.name || "",
          restaurantEmail: restaurantData?.email || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du formulaire.");
      }

      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      setSubmitError(
        "Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full">
      <div className="site-card h-full rounded-[34px] p-6 tablet:p-8 desktop:p-10">
        {isSubmitted ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--site-line)] bg-white/70 text-[var(--site-orange-deep)]">
              <Check size={28} strokeWidth={1.7} />
            </div>

            <p className="script-font mt-6 text-[42px] leading-none text-[var(--site-orange-deep)]">
              Merci
            </p>
            <h3 className="yeseva-one-regular mt-2 text-[46px] leading-[0.92] text-[var(--site-ink)]">
              Message envoyé
            </h3>

            <p className="mt-5 max-w-[520px] text-[16px] leading-[1.85] text-[var(--site-ink-soft)]">
              Nous reviendrons vers vous dès que possible.
            </p>

            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="site-button mt-8"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <p className="script-font text-[38px] leading-none text-[var(--site-orange-deep)]">
                Nous écrire
              </p>
              <h3 className="yeseva-one-regular -mt-1 text-[46px] leading-[0.92] text-[var(--site-ink)]">
                Formulaire de contact
              </h3>
            </div>

            {submitError ? (
              <div className="rounded-[18px] border border-[#a14646]/20 bg-[#fff1ef] px-4 py-3 text-[14px] leading-[1.7] text-[#8f3939]">
                {submitError}
              </div>
            ) : null}

            <div className="grid gap-5 desktop:grid-cols-2">
              <Field
                label="Nom complet *"
                fieldId="contact-full-name"
                error={errors.fullName?.message}
              >
                <div className="relative">
                  <InputIcon>
                    <User size={17} strokeWidth={1.5} />
                  </InputIcon>
                  <input
                    id="contact-full-name"
                    type="text"
                    placeholder="Votre nom"
                    className="site-input h-[56px] px-11 text-[15px] tablet:text-[16px]"
                    {...register("fullName", {
                      required: "Veuillez renseigner votre nom.",
                    })}
                  />
                </div>
              </Field>

              <Field
                label="Email *"
                fieldId="contact-email"
                error={errors.email?.message}
              >
                <div className="relative">
                  <InputIcon>
                    <Mail size={17} strokeWidth={1.5} />
                  </InputIcon>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="Votre email"
                    className="site-input h-[56px] px-11 text-[15px] tablet:text-[16px]"
                    {...register("email", {
                      required: "Veuillez renseigner votre email.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Veuillez saisir un email valide.",
                      },
                    })}
                  />
                </div>
              </Field>
            </div>

            <div className="grid gap-5 desktop:grid-cols-2">
              <Field
                label="Téléphone"
                fieldId="contact-phone"
                error={errors.phone?.message}
              >
                <div className="relative">
                  <InputIcon>
                    <Phone size={17} strokeWidth={1.5} />
                  </InputIcon>
                  <input
                    id="contact-phone"
                    type="text"
                    placeholder="Votre téléphone"
                    className="site-input h-[56px] px-11 text-[15px] tablet:text-[16px]"
                    {...register("phone")}
                  />
                </div>
              </Field>

              <Field
                label="Sujet *"
                fieldId="contact-subject"
                error={errors.subject?.message}
              >
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="Objet de votre message"
                  className="site-input h-[56px] px-4 text-[15px] tablet:text-[16px]"
                  {...register("subject", {
                    required: "Veuillez renseigner un sujet.",
                  })}
                />
              </Field>
            </div>

            <Field
              label="Message *"
              fieldId="contact-message"
              error={errors.message?.message}
            >
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-5 text-[rgba(184,121,93,0.7)]">
                  <MessageSquare size={17} strokeWidth={1.5} />
                </span>
                <textarea
                  id="contact-message"
                  rows={8}
                  placeholder="Votre message..."
                  className="site-textarea w-full resize-none px-11 py-4 text-[15px] leading-[1.8] tablet:text-[16px]"
                  {...register("message", {
                    required: "Veuillez écrire votre message.",
                  })}
                />
              </div>
            </Field>

            <div className="flex flex-col gap-4 pt-1">
              <p className="max-w-[520px] text-[13px] leading-[1.8] text-[var(--site-ink-soft)]">
                En envoyant ce formulaire, vous acceptez d’être recontacté dans
                le cadre de votre demande.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="site-button w-full gap-3 disabled:cursor-not-allowed disabled:opacity-70 tablet:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Envoi...
                  </>
                ) : (
                  "Envoyer"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, fieldId, error, children }) {
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)]"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-2 text-[13px] text-[#a14646] tablet:text-[14px]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
