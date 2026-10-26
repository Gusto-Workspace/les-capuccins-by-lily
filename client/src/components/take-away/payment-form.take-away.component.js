import { useMemo, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { LockKeyhole } from "lucide-react";

function getPaymentErrorMessage(error) {
  const code = String(error?.code || "").toLowerCase();
  if (code.includes("card_declined")) {
    return "Le paiement a été refusé. Vérifiez votre carte ou essayez-en une autre.";
  }
  if (code.includes("expired") || code.includes("incorrect")) {
    return "Les informations de carte semblent incorrectes. Veuillez les vérifier.";
  }
  return "Le résultat du paiement n’est pas confirmé. Vérifiez son statut avant de tenter un nouveau paiement.";
}

function PaymentForm({ busy, onPaymentConfirmed }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!stripe || !elements || submitting || busy) return;

    setSubmitting(true);
    setError("");
    try {
      const returnUrl = `${window.location.origin}/take-away?payment=return`;
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: returnUrl },
        redirect: "if_required",
      });
      if (result.error) {
        setError(getPaymentErrorMessage(result.error));
        return;
      }
      if (!result.paymentIntent?.id) {
        setError("La réponse de paiement est incomplète. Veuillez réessayer.");
        return;
      }
      await onPaymentConfirmed(result.paymentIntent.id);
    } catch {
      setError(
        "La connexion a été interrompue. Vérifiez votre réseau puis réessayez : votre commande ne sera pas dupliquée.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="rounded-[20px] border border-[var(--site-line)] bg-white p-4 tablet:p-5">
        <PaymentElement
          options={{
            layout: "tabs",
            wallets: { applePay: "auto", googlePay: "never", link: "never" },
          }}
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-2xl bg-red/10 px-4 py-3 text-sm leading-6 text-[var(--site-ink)]"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!stripe || !elements || submitting || busy}
        className="site-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting || busy ? "Validation en cours…" : "Payer et confirmer"}
      </button>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs leading-5 text-[var(--site-ink-soft)]">
        <LockKeyhole size={15} aria-hidden="true" /> Paiement sécurisé. Les
        données bancaires ne passent pas par Gusto.
      </p>
    </form>
  );
}

export default function PaymentTakeAwayComponent({
  clientSecret,
  busy = false,
  onPaymentConfirmed,
}) {
  const stripePromise = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    return key ? loadStripe(key) : null;
  }, []);

  if (!stripePromise) {
    return (
      <p
        role="alert"
        className="mt-6 rounded-2xl bg-red/10 px-4 py-3 text-sm leading-6"
      >
        Le paiement en ligne est momentanément indisponible. Contactez le
        restaurant avant de réessayer.
      </p>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        locale: "fr",
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#b8795d",
            colorText: "#472a22",
            colorBackground: "#fffaf8",
            borderRadius: "14px",
            fontFamily: "Manrope, sans-serif",
          },
        },
      }}
    >
      <PaymentForm busy={busy} onPaymentConfirmed={onPaymentConfirmed} />
    </Elements>
  );
}
