import { useRouter } from "next/router";
import {
  Check,
  ChevronLeft,
  LoaderCircle,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PaymentTakeAwayComponent from "./payment-form.take-away.component";
import paymentState from "@/_assets/utils/take-away-payment-state";
import draftState from "@/_assets/utils/take-away-draft";
import TakeAwayDialog from "./dialog.take-away.component";

const CART_STORAGE_KEY = "capuccins_take_away_cart_v1";
const DRAFT_STORAGE_KEY = "capuccins_take_away_draft_v1";
const ATTEMPT_STORAGE_KEY = "capuccins_take_away_attempt_v1";
const MAX_QUANTITY = 99;

function takeAwayEndpoint(apiBaseUrl, restaurantId, path) {
  const baseUrl = String(apiBaseUrl || "").replace(/\/+$/, "");
  const resolvedRestaurantId = String(restaurantId || "").trim();
  if (!baseUrl || !resolvedRestaurantId) {
    throw new Error("TAKE_AWAY_CONFIGURATION_MISSING");
  }
  return `${baseUrl}/restaurants/${resolvedRestaurantId}/take-away${path}`;
}

async function parseApiResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body?.message || "TAKE_AWAY_REQUEST_FAILED");
    error.status = response.status;
    throw error;
  }
  return body;
}

function readStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = JSON.parse(window.localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Le stockage local reste un confort : le parcours fonctionne sans lui.
  }
}

function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Le parcours reste utilisable lorsque le stockage est désactivé.
  }
}

function createAttemptValue(prefix) {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return `${prefix}_${window.crypto.randomUUID()}_${window.crypto.randomUUID()}`;
  }
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const bytes = window.crypto.getRandomValues(new Uint8Array(48));
    const token = Array.from(bytes, (value) =>
      value.toString(16).padStart(2, "0"),
    ).join("");
    return `${prefix}_${token}`;
  }
  throw new Error("BROWSER_CRYPTO_UNAVAILABLE");
}

async function fingerprintPayload(value) {
  const serialized = JSON.stringify(value);
  if (
    typeof window === "undefined" ||
    !window.crypto?.subtle ||
    typeof TextEncoder === "undefined"
  ) {
    throw new Error("BROWSER_CRYPTO_UNAVAILABLE");
  }
  const digest = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(serialized),
  );
  return Array.from(new Uint8Array(digest), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMoney(value, currency = "eur") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: String(currency || "eur").toUpperCase(),
  }).format(Number(value || 0));
}

function formatOrderDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Créneau à confirmer";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(date);
}

function publicErrorMessage(
  error,
  fallback = "Une erreur est survenue. Veuillez réessayer.",
) {
  if (error?.name === "AbortError") return "";
  if (error?.message === "TAKE_AWAY_CONFIGURATION_MISSING") {
    return "La commande en ligne n’est pas encore configurée.";
  }
  if (error?.message === "BROWSER_CRYPTO_UNAVAILABLE") {
    return "Votre navigateur ne permet pas de sécuriser cette commande. Mettez-le à jour ou utilisez un autre navigateur.";
  }

  const source = String(error?.message || "").toLowerCase();
  const known = [
    [
      "commandes en ligne sont bloquées",
      "Les commandes en ligne sont fermées pour cette date. Choisissez un autre jour.",
    ],
    [
      "catalog item unavailable",
      "Un article du panier n’est plus disponible. Votre panier a été actualisé.",
    ],
    [
      "option d'article invalide",
      "Une option choisie n’est plus disponible. Vérifiez votre panier.",
    ],
    [
      "une option est requise",
      "Choisissez une option pour chaque article concerné.",
    ],
    [
      "minimum de commande livraison",
      "Le minimum de commande pour cette zone de livraison n’est pas atteint.",
    ],
    [
      "minimum de commande retrait",
      "Le minimum de commande pour le retrait n’est pas atteint.",
    ],
    [
      "zone de livraison",
      "Cette adresse n’est pas située dans une zone de livraison disponible.",
    ],
    [
      "ce créneau est complet",
      "Ce créneau vient d’être réservé. Choisissez-en un autre.",
    ],
    [
      "créneau",
      "Le créneau choisi n’est plus disponible. Sélectionnez-en un nouveau.",
    ],
    [
      "délai de paiement expiré",
      "Le délai de paiement est dépassé. Recommencez la commande.",
    ],
    [
      "clé d'idempotence",
      "La tentative de commande a changé. Vérifiez les informations puis réessayez.",
    ],
    [
      "commande en ligne indisponible",
      "La vente à emporter est momentanément indisponible.",
    ],
    [
      "module vente à emporter",
      "La vente à emporter est momentanément indisponible.",
    ],
    [
      "take-away unavailable",
      "La vente à emporter est momentanément indisponible.",
    ],
    [
      "service est momentanément",
      "Le service est momentanément indisponible. Veuillez réessayer.",
    ],
  ];
  return known.find(([needle]) => source.includes(needle))?.[1] || fallback;
}

function cartKey(catalogItemId, optionId = "") {
  return `${catalogItemId}:${optionId}`;
}

function effectivePrice(item) {
  return Number(item.unitPrice || 0) + Number(item.optionPrice || 0);
}

function Field({ label, required = false, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--site-ink-soft)]">
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function QuantityControl({ quantity, onChange, compact = false }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-[var(--site-line)] bg-white/80 p-1">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        className={`${compact ? "h-8 w-8" : "h-9 w-9"} flex items-center justify-center rounded-full transition hover:bg-[var(--site-peach)]`}
        aria-label="Diminuer la quantité"
      >
        <Minus size={15} />
      </button>
      <span className="min-w-7 text-center text-sm font-bold">{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= MAX_QUANTITY}
        className={`${compact ? "h-8 w-8" : "h-9 w-9"} flex items-center justify-center rounded-full transition hover:bg-[var(--site-peach)] disabled:opacity-40`}
        aria-label="Augmenter la quantité"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

function CartSummary({
  cart,
  subtotal,
  deliveryFee = 0,
  onQuantity,
  onCheckout,
  checkoutDisabled = false,
  checkoutLabel = "Continuer ma commande",
  editable = true,
}) {
  const total = subtotal + Number(deliveryFee || 0);
  return (
    <div className="site-card rounded-[28px] p-5 tablet:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="yeseva-one-regular text-[30px]">Votre panier</h2>
        <span className="rounded-full bg-[var(--site-peach)] px-3 py-1 text-xs font-bold">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} article(s)
        </span>
      </div>

      {cart.length ? (
        <div className="mt-5 space-y-4">
          {cart.map((item) => (
            <div
              key={item.key}
              className="border-b border-[var(--site-line)] pb-4 last:border-0"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-semibold leading-6">{item.name}</p>
                  {item.optionName ? (
                    <p className="mt-0.5 text-xs text-[var(--site-ink-soft)]">
                      {item.optionName}
                    </p>
                  ) : null}
                </div>
                <p className="whitespace-nowrap text-sm font-bold">
                  {formatMoney(effectivePrice(item) * item.quantity)}
                </p>
              </div>
              {editable ? (
                <div className="mt-3 flex items-center justify-between">
                  <QuantityControl
                    compact
                    quantity={item.quantity}
                    onChange={(quantity) => onQuantity(item.key, quantity)}
                  />
                  <button
                    type="button"
                    onClick={() => onQuantity(item.key, 0)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--site-ink-soft)] transition hover:text-[var(--site-orange-deep)]"
                  >
                    <Trash2 size={14} /> Retirer
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-[var(--site-ink-soft)]">
          Ajoutez vos plats préférés pour commencer.
        </p>
      )}

      <div className="mt-5 space-y-2 border-t border-[var(--site-line)] pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <span>Sous-total</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        {deliveryFee > 0 ? (
          <div className="flex justify-between gap-4">
            <span>Livraison</span>
            <span>{formatMoney(deliveryFee)}</span>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 pt-2 text-lg font-bold">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>

      {onCheckout ? (
        <button
          type="button"
          onClick={onCheckout}
          disabled={!cart.length || checkoutDisabled}
          className="site-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {checkoutLabel}
        </button>
      ) : null}
    </div>
  );
}

function CatalogCard({ item, selection, onSelection, onAdd, onDescription }) {
  const descriptionRef = useRef(null);
  const [descriptionTruncated, setDescriptionTruncated] = useState(false);
  useEffect(() => {
    const element = descriptionRef.current;
    if (!element) return;
    const measure = () =>
      setDescriptionTruncated(element.scrollHeight > element.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [item.description]);
  const options = item.options || [];
  const selectedOption = options.find(
    (option) => String(option._id) === String(selection),
  );
  const shownPrice =
    Number(item.price || 0) + Number(selectedOption?.price || 0);
  const startingPrice = options.length
    ? Math.min(
        ...options.map(
          (option) => Number(item.price || 0) + Number(option.price || 0),
        ),
      )
    : Number(item.price || 0);

  return (
    <article className="site-card flex h-full flex-col overflow-hidden rounded-[28px]">
      {item.image ? (
        <div
          role="img"
          aria-label={item.name}
          className="aspect-[16/9] bg-[var(--site-peach)] bg-cover bg-center"
          style={{ backgroundImage: `url(${JSON.stringify(item.image)})` }}
        />
      ) : null}
      <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto] items-stretch gap-x-4 p-4 tablet:gap-x-5 tablet:p-5">
        <div className="min-w-0 pr-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--site-orange-deep)] tablet:text-[11px]">
            {item.categoryName || "À emporter"}
          </p>
          <h3 className="yeseva-one-regular mt-1.5 line-clamp-2 text-[22px] leading-[1.12] tablet:text-[25px]">
            {item.name}
          </h3>

          {item.description ? (
            <p
              ref={descriptionRef}
              className="mt-2 line-clamp-2 text-[13px] leading-5 text-[var(--site-ink-soft)]"
            >
              {item.description}
            </p>
          ) : null}
          {descriptionTruncated ? (
            <button
              type="button"
              onClick={() => onDescription(item)}
              aria-label={`Voir plus sur ${item.name}`}
              aria-haspopup="dialog"
              className="mt-1 min-h-11 text-[13px] font-semibold text-[var(--site-orange-deep)] underline underline-offset-4"
            >
              Voir plus
            </button>
          ) : null}

          {options.length ? (
            <div className="mt-3">
              <select
                value={selection || ""}
                onChange={(event) => onSelection(event.target.value)}
                className="site-select min-h-10 min-w-0 px-3 text-[13px]"
                aria-label={`Option requise pour ${item.name}`}
                required
              >
                <option value="">Sélectionner une option…</option>
                {options.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name} —{" "}
                    {formatMoney(
                      Number(item.price || 0) + Number(option.price || 0),
                    )}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>

        <div className="flex min-h-full shrink-0 flex-col items-end justify-between gap-4">
          <p className="whitespace-nowrap text-sm font-bold tablet:text-base">
            {selectedOption
              ? formatMoney(shownPrice)
              : options.length
                ? `Dès ${formatMoney(startingPrice)}`
                : formatMoney(shownPrice)}
          </p>

          <button
            type="button"
            disabled={
              (options.length > 0 && !selectedOption) || shownPrice <= 0
            }
            onClick={() => onAdd(selectedOption)}
            className="site-button inline-flex !min-h-11 w-auto items-center justify-center !px-2.5 !text-[10px] !tracking-[0.04em] !shadow-none tablet:!px-3.5 tablet:!text-[11px] tablet:!tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Plus size={15} className="mr-1" /> Ajouter
          </button>
        </div>
      </div>
    </article>
  );
}

function Confirmation({ order, onNewOrder }) {
  const outcome = paymentState.orderOutcomeContent(order);
  const modeLabel =
    order?.fulfillmentMode === "delivery"
      ? "Livraison"
      : "Retrait au restaurant";
  return (
    <section className="mx-auto max-w-[860px] px-5 py-16 tablet:px-8 tablet:py-24">
      <div className="site-card rounded-[34px] p-6 text-center tablet:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(223,160,132,0.2)] text-[var(--site-orange-deep)]">
          <PackageCheck size={32} />
        </span>
        <p className="script-font mt-5 text-[40px] leading-none text-[var(--site-orange-deep)]">
          Merci
        </p>
        <h2 className="yeseva-one-regular mt-2 text-[40px] leading-tight tablet:text-[50px]">
          {outcome.title}
        </h2>
        <p className="mx-auto mt-5 max-w-[650px] leading-7 text-[var(--site-ink-soft)]">
          {outcome.description}
        </p>

        <div className="mx-auto mt-8 max-w-[620px] rounded-[24px] bg-[var(--site-peach)] p-5 text-left tablet:p-7">
          <div className="flex flex-col gap-2 border-b border-[var(--site-line)] pb-5 tablet:flex-row tablet:items-center tablet:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--site-ink-soft)]">
                Commande
              </p>
              <p className="mt-1 text-xl font-bold">{order?.orderNumber}</p>
            </div>
            <div className="tablet:text-right">
              <p className="font-semibold">{modeLabel}</p>
              <p className="mt-1 text-sm text-[var(--site-ink-soft)]">
                {formatOrderDate(order?.scheduledFor)}
              </p>
            </div>
          </div>

          <div className="space-y-3 py-5">
            {(order?.items || []).map((item, index) => (
              <div
                key={`${item.catalogItemId}-${index}`}
                className="flex justify-between gap-4 text-sm"
              >
                <span>
                  {item.quantity} × {item.name}
                  {item.options?.length ? (
                    <small className="block text-[var(--site-ink-soft)]">
                      {item.options.map((option) => option.name).join(", ")}
                    </small>
                  ) : null}
                </span>
                <strong className="whitespace-nowrap">
                  {formatMoney(item.lineTotal, order.currency)}
                </strong>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t border-[var(--site-line)] pt-5 text-lg font-bold">
            <span>{order.adjustments?.length ? "Total initial" : "Total"}</span>
            <span>{formatMoney(order?.total, order?.currency)}</span>
          </div>
          {order.adjustments?.length ? (
            <div className="mt-3 flex justify-between gap-4 text-sm">
              <span>Montant de la commande après ajustements</span>
              <span>
                {formatMoney(
                  Number(order.remainingAmountCents) / 100,
                  order.currency,
                )}
              </span>
            </div>
          ) : null}
          {Number(order.refundedAmountCents) > 0 ? (
            <div className="mt-3 flex justify-between gap-4 text-sm">
              <span>Montant remboursé</span>
              <span>
                {formatMoney(
                  Number(order.refundedAmountCents) / 100,
                  order.currency,
                )}
              </span>
            </div>
          ) : null}
          <p className="mt-3 text-sm text-[var(--site-ink-soft)]">
            {outcome.paymentLabel}
          </p>
          {order?.fulfillmentMode === "delivery" && order?.deliveryAddress ? (
            <p className="mt-4 text-sm leading-6">
              <strong>Adresse :</strong> {order.deliveryAddress.line1}
              {order.deliveryAddress.line2
                ? `, ${order.deliveryAddress.line2}`
                : ""}
              , {order.deliveryAddress.zipCode} {order.deliveryAddress.city}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onNewOrder}
          className="site-button site-button--outline mt-8"
        >
          Nouvelle commande
        </button>
      </div>
    </section>
  );
}

export default function TakeAwayComponent({ apiBaseUrl, restaurantId }) {
  const router = useRouter();
  const [catalogState, setCatalogState] = useState({
    loading: true,
    error: "",
    data: null,
  });
  const [cart, setCart] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  const [pendingDraft, setPendingDraft] = useState(null);
  const [draftNotice, setDraftNotice] = useState("");
  const [descriptionItem, setDescriptionItem] = useState(null);
  const [recoveringAttempt, setRecoveringAttempt] = useState(true);
  const [recoveryError, setRecoveryError] = useState("");
  const [optionSelections, setOptionSelections] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState("catalog");
  const [mode, setMode] = useState("pickup");
  const [dateKey, setDateKey] = useState(localDateKey());
  const [slotsState, setSlotsState] = useState({
    loading: false,
    error: "",
    slots: [],
  });
  const [slotsReload, setSlotsReload] = useState(0);
  const [slotId, setSlotId] = useState("");
  const slotIdRef = useRef(slotId);
  slotIdRef.current = slotId;
  const [paymentMethod, setPaymentMethod] = useState("on_site");
  const [customer, setCustomer] = useState(draftState.emptyCustomer);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [attempt, setAttempt] = useState(null);
  const attemptRef = useRef(null);
  const [clientSecret, setClientSecret] = useState("");
  const [order, setOrder] = useState(null);
  const [reconciling, setReconciling] = useState(false);

  const settings = catalogState.data?.settings || null;
  const catalog = catalogState.data?.catalog || [];

  useEffect(() => {
    setPendingDraft(
      draftState.readDraft(
        readStorage(DRAFT_STORAGE_KEY, null),
        readStorage(CART_STORAGE_KEY, []),
        restaurantId,
      ),
    );
    const savedAttempt = readStorage(ATTEMPT_STORAGE_KEY, null);
    setAttempt(savedAttempt);
    attemptRef.current = savedAttempt;
    setRecoveringAttempt(
      Boolean(savedAttempt?.idempotencyKey && savedAttempt?.publicAccessToken),
    );
    if (
      savedAttempt?.orderId &&
      (!savedAttempt.idempotencyKey || !savedAttempt.publicAccessToken)
    ) {
      setRecoveryError(
        "Les informations de votre commande sont incomplètes. Contactez le restaurant pour vérifier son état avant de recommander.",
      );
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let catalogUrl;
    try {
      catalogUrl = takeAwayEndpoint(
        apiBaseUrl,
        restaurantId,
        "/public/catalog",
      );
    } catch (error) {
      setCatalogState({
        loading: false,
        error: publicErrorMessage(error),
        data: null,
      });
      return () => controller.abort();
    }
    fetch(catalogUrl, {
      signal: controller.signal,
    })
      .then(parseApiResponse)
      .then((data) => setCatalogState({ loading: false, error: "", data }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setCatalogState({
            loading: false,
            error: publicErrorMessage(
              error,
              "La vente à emporter est momentanément indisponible.",
            ),
            data: null,
          });
        }
      });
    return () => controller.abort();
  }, [apiBaseUrl, restaurantId]);

  useEffect(() => {
    if (!storageReady || !catalogState.data) return;
    setCart((current) => draftState.reconcileCart(current, catalog));
  }, [catalog, catalogState.data, storageReady]);

  useEffect(() => {
    // Une commande serveur conserve son écran de récupération et ses informations.
    if (!order || !pendingDraft || !settings || step === "confirmation") return;
    const restored = draftState.restoreDraft(
      pendingDraft,
      catalog,
      settings,
      localDateKey(),
    );
    setCart(restored.cart);
    setCustomer(restored.customer);
    setOptionSelections(restored.optionSelections);
    setMode(restored.mode);
    setDateKey(restored.dateKey);
    setSlotId(restored.slotId);
    setPaymentMethod(restored.paymentMethod);
    setPendingDraft(null);
  }, [order, pendingDraft, settings, catalog, step]);

  useEffect(() => {
    // Le brouillon reste intact tant que le client n'a pas fait son choix.
    if (!storageReady || pendingDraft || recoveringAttempt || recoveryError)
      return;
    if (["payment", "confirmation"].includes(step)) return;
    const draft = {
      version: 1,
      restaurantId,
      cart,
      customer,
      optionSelections,
      step,
      mode,
      dateKey,
      slotId,
      paymentMethod,
    };
    if (draftState.hasDraftContent(draft)) {
      writeStorage(DRAFT_STORAGE_KEY, draft);
      writeStorage(CART_STORAGE_KEY, cart);
    } else {
      removeStorage(DRAFT_STORAGE_KEY);
      removeStorage(CART_STORAGE_KEY);
    }
  }, [
    cart,
    customer,
    dateKey,
    mode,
    optionSelections,
    paymentMethod,
    pendingDraft,
    recoveringAttempt,
    recoveryError,
    restaurantId,
    slotId,
    step,
    storageReady,
  ]);

  useEffect(() => {
    if (!cart.length && cartOpen) setCartOpen(false);
  }, [cart.length, cartOpen]);

  useEffect(() => {
    attemptRef.current = attempt;
    if (storageReady) {
      if (attempt) writeStorage(ATTEMPT_STORAGE_KEY, attempt);
      else removeStorage(ATTEMPT_STORAGE_KEY);
    }
  }, [attempt, storageReady]);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const desktopMedia = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = (event) => {
      if (event.matches) setCartOpen(false);
    };

    if (desktopMedia.matches) {
      setCartOpen(false);
      return undefined;
    }

    document.body.style.overflow = "hidden";
    desktopMedia.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktopMedia.removeEventListener("change", closeOnDesktop);
    };
  }, [cartOpen]);

  useEffect(() => {
    if (!settings) return;
    setMode((current) => {
      if (current === "pickup" && !settings.pickupEnabled) return "delivery";
      if (current === "delivery" && !settings.deliveryEnabled) return "pickup";
      return current;
    });
    if (mode === "delivery") setPaymentMethod("online");
    else if (settings.paymentPolicy === "online_required")
      setPaymentMethod("online");
    else if (settings.paymentPolicy === "on_site") setPaymentMethod("on_site");
  }, [mode, settings]);

  useEffect(() => {
    if (!settings || step !== "checkout" || !dateKey) return;
    const controller = new AbortController();
    setSlotsState({ loading: true, error: "", slots: [] });
    const query = new URLSearchParams({ date: dateKey, mode });
    fetch(
      `${takeAwayEndpoint(apiBaseUrl, restaurantId, "/public/slots")}?${query}`,
      { signal: controller.signal },
    )
      .then(parseApiResponse)
      .then(({ slots }) => {
        if (controller.signal.aborted) return;
        const now = Date.now();
        const futureSlots = (slots || []).filter(
          (slot) => new Date(slot.scheduledFor).getTime() > now,
        );
        setSlotsState({ loading: false, error: "", slots: futureSlots });
        const current = slotIdRef.current;
        if (
          current &&
          !futureSlots.some((slot) => slot.slotId === current && slot.available)
        ) {
          setSlotId("");
          setDraftNotice(
            "Le créneau choisi n’est plus disponible. Choisissez un nouveau créneau ; les autres informations sont conservées.",
          );
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setSlotsState({
            loading: false,
            error: publicErrorMessage(
              error,
              "Les créneaux ne peuvent pas être chargés.",
            ),
            slots: [],
          });
        }
      });
    return () => controller.abort();
  }, [apiBaseUrl, dateKey, mode, restaurantId, settings, slotsReload, step]);

  const subtotal = useMemo(
    () =>
      Math.round(
        cart.reduce(
          (sum, item) => sum + effectivePrice(item) * item.quantity,
          0,
        ) * 100,
      ) / 100,
    [cart],
  );
  const hasCompleteDeliveryPostalCode = /^\d{5}$/.test(
    String(customer.zipCode || "").trim(),
  );
  const deliveryZone = useMemo(() => {
    if (mode !== "delivery" || !settings || !hasCompleteDeliveryPostalCode) {
      return null;
    }
    return (settings.deliveryZones || []).find((zone) =>
      (zone.zipCodes || [])
        .map(String)
        .includes(String(customer.zipCode || "").trim()),
    );
  }, [customer.zipCode, hasCompleteDeliveryPostalCode, mode, settings]);
  const deliveryFee = mode === "delivery" ? Number(deliveryZone?.fee || 0) : 0;
  const minimum =
    mode === "delivery"
      ? Number(deliveryZone?.minimumOrder || 0)
      : Number(settings?.minimumPickupOrder || 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const orderCart = useMemo(
    () =>
      (order?.items || []).map((item, index) => ({
        key: `${item.catalogItemId || index}:${index}`,
        name: item.name,
        optionName: (item.options || [])
          .map((option) => option.name)
          .join(", "),
        unitPrice:
          Number(item.lineTotal || 0) / Math.max(1, Number(item.quantity || 1)),
        optionPrice: 0,
        quantity: Number(item.quantity || 1),
      })),
    [order],
  );

  const finishOrder = useCallback((resolvedOrder) => {
    removeStorage(DRAFT_STORAGE_KEY);
    removeStorage(CART_STORAGE_KEY);
    setPendingDraft(null);
    setOrder(resolvedOrder);
    setCart([]);
    setClientSecret("");
    setReconciling(false);
    setStep("confirmation");
    setAttempt((current) => {
      const safeAttempt = { ...(current || {}) };
      delete safeAttempt.order;
      delete safeAttempt.payloadSignature;
      return { ...safeAttempt, completed: true };
    });
  }, []);

  const pollOrder = useCallback(
    async (activeAttempt) => {
      setReconciling(true);
      setSubmitError("");
      for (let index = 0; index < 12; index += 1) {
        try {
          const result = await fetch(
            takeAwayEndpoint(
              apiBaseUrl,
              restaurantId,
              `/public/orders/${encodeURIComponent(activeAttempt.orderId)}/status`,
            ),
            {
              headers: { "X-Take-Away-Token": activeAttempt.publicAccessToken },
            },
          ).then(parseApiResponse);
          if (paymentState.hasFinalOrderOutcome(result.order)) {
            finishOrder(result.order);
            return;
          }
        } catch (error) {
          if (error?.status === 404) break;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 1500));
      }
      setReconciling(false);
      setSubmitError(
        "La vérification du paiement n’est pas terminée. Vérifiez son statut dans quelques instants avant de tenter un nouveau paiement. Votre commande ne sera pas recréée.",
      );
    },
    [apiBaseUrl, finishOrder, restaurantId],
  );

  const reconcilePayment = useCallback(
    async (activeAttempt, paymentIntentId) => {
      if (!activeAttempt?.orderId || !activeAttempt?.publicAccessToken) {
        setSubmitError(
          "La tentative de paiement est introuvable. Rechargez la page pour vérifier votre commande.",
        );
        setReconciling(false);
        return;
      }
      setReconciling(true);
      setSubmitError("");
      try {
        const result = await fetch(
          takeAwayEndpoint(
            apiBaseUrl,
            restaurantId,
            `/public/orders/${encodeURIComponent(activeAttempt.orderId)}/confirm-payment`,
          ),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Take-Away-Token": activeAttempt.publicAccessToken,
            },
            body: JSON.stringify({ paymentIntentId }),
          },
        ).then(parseApiResponse);
        finishOrder(result.order);
      } catch {
        await pollOrder(activeAttempt);
      }
    },
    [apiBaseUrl, finishOrder, pollOrder, restaurantId],
  );

  useEffect(() => {
    if (!router.isReady || !storageReady) return;
    const savedAttempt = attemptRef.current;
    if (!savedAttempt?.idempotencyKey || !savedAttempt?.publicAccessToken) {
      return;
    }

    let canceled = false;
    const controller = new AbortController();
    async function resume() {
      let activeAttempt = savedAttempt;
      if (!activeAttempt.orderId) {
        try {
          const recovered = await fetch(
            takeAwayEndpoint(
              apiBaseUrl,
              restaurantId,
              "/public/orders/recover",
            ),
            {
              signal: controller.signal,
              headers: {
                "Idempotency-Key": activeAttempt.idempotencyKey,
                "X-Take-Away-Token": activeAttempt.publicAccessToken,
              },
            },
          ).then(parseApiResponse);
          if (canceled) return;
          if (!recovered.order?._id)
            throw new Error("TAKE_AWAY_REQUEST_FAILED");
          activeAttempt = {
            ...activeAttempt,
            orderId: recovered.order._id,
          };
          setAttempt(activeAttempt);
          attemptRef.current = activeAttempt;
          writeStorage(ATTEMPT_STORAGE_KEY, activeAttempt);
        } catch (error) {
          if (!canceled && error?.status === 404) {
            setAttempt(null);
            attemptRef.current = null;
          }
          if (
            !canceled &&
            error?.name !== "AbortError" &&
            error?.status !== 404
          ) {
            setSubmitError(publicErrorMessage(error));
            setRecoveryError(publicErrorMessage(error));
          }
          return;
        }
      }

      const returnedPaymentIntent = String(router.query.payment_intent || "");
      if (router.query.payment === "return" && returnedPaymentIntent) {
        await reconcilePayment(activeAttempt, returnedPaymentIntent);
        if (!canceled)
          router.replace("/take-away", undefined, { shallow: true });
        return;
      }

      try {
        const statusResult = await fetch(
          takeAwayEndpoint(
            apiBaseUrl,
            restaurantId,
            `/public/orders/${encodeURIComponent(activeAttempt.orderId)}/status`,
          ),
          {
            signal: controller.signal,
            headers: { "X-Take-Away-Token": activeAttempt.publicAccessToken },
          },
        ).then(parseApiResponse);
        if (canceled) return;
        if (!statusResult.order?._id)
          throw new Error("TAKE_AWAY_REQUEST_FAILED");
        if (paymentState.hasFinalOrderOutcome(statusResult.order)) {
          finishOrder(statusResult.order);
          return;
        }
        if (statusResult.order?.paymentMethod === "online") {
          // Keep a visible recovery screen even if resuming the PaymentIntent
          // fails (expiry, response lost, or a concurrent confirmation).
          setOrder(statusResult.order);
          setClientSecret("");
          setStep("payment");
          const paymentResult = await fetch(
            takeAwayEndpoint(
              apiBaseUrl,
              restaurantId,
              `/public/orders/${encodeURIComponent(activeAttempt.orderId)}/payment-intent`,
            ),
            {
              method: "POST",
              signal: controller.signal,
              headers: { "X-Take-Away-Token": activeAttempt.publicAccessToken },
            },
          ).then(parseApiResponse);
          if (!canceled) {
            if (paymentState.hasFinalOrderOutcome(paymentResult.order)) {
              finishOrder(paymentResult.order);
            } else {
              setClientSecret(paymentResult.clientSecret);
              setOrder(paymentResult.order);
              setStep("payment");
            }
          }
        }
      } catch (error) {
        if (
          !canceled &&
          error?.name !== "AbortError" &&
          error?.status === 404
        ) {
          // Un identifiant de commande existe : ne pas la transformer en brouillon.
          setRecoveryError(
            "La commande enregistrée ne peut pas être vérifiée. Réessayez ou contactez le restaurant avant de recommander.",
          );
        } else if (!canceled && error?.name !== "AbortError") {
          setSubmitError(publicErrorMessage(error));
          setRecoveryError(publicErrorMessage(error));
          if (error?.status === 409) await reconcilePayment(activeAttempt);
        }
      }
    }
    resume().finally(() => {
      if (!canceled) setRecoveringAttempt(false);
    });
    return () => {
      canceled = true;
      controller.abort();
    };
  }, [
    apiBaseUrl,
    finishOrder,
    reconcilePayment,
    restaurantId,
    router,
    router.isReady,
    router.query.payment,
    router.query.payment_intent,
    storageReady,
  ]);

  function changeQuantity(key, quantity) {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.key !== key) return [item];
        if (quantity <= 0) return [];
        return [{ ...item, quantity: Math.min(MAX_QUANTITY, quantity) }];
      }),
    );
  }

  function addItem(item, option) {
    const key = cartKey(item._id, option?._id);
    setCart((current) => {
      const existing = current.find((entry) => entry.key === key);
      if (existing) {
        return current.map((entry) =>
          entry.key === key
            ? { ...entry, quantity: Math.min(MAX_QUANTITY, entry.quantity + 1) }
            : entry,
        );
      }
      return [
        ...current,
        {
          key,
          catalogItemId: String(item._id),
          name: item.name,
          categoryName: item.categoryName || "À emporter",
          unitPrice: Number(item.price || 0),
          optionId: option ? String(option._id) : "",
          optionName: option?.name || "",
          optionPrice: Number(option?.price || 0),
          quantity: 1,
        },
      ];
    });
  }

  function updateCustomer(field, value) {
    setCustomer((current) => ({ ...current, [field]: value }));
    setSubmitError("");
  }

  function checkoutValidation() {
    if (!cart.length) return "Votre panier est vide.";
    if (
      slotsState.loading ||
      slotsState.error ||
      !slotsState.slots.some(
        (slot) =>
          slot.slotId === slotId &&
          slot.available &&
          new Date(slot.scheduledFor).getTime() > Date.now(),
      )
    )
      return "Choisissez un créneau disponible.";
    if (!customer.firstName.trim() || !customer.lastName.trim())
      return "Indiquez votre prénom et votre nom.";
    if (customer.phone.replace(/\D/g, "").length < 6)
      return "Indiquez un numéro de téléphone valide.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()))
      return "Indiquez une adresse email valide.";
    if (mode === "delivery") {
      if (
        !customer.line1.trim() ||
        !customer.zipCode.trim() ||
        !customer.city.trim()
      ) {
        return "Complétez l’adresse de livraison.";
      }
      if (!deliveryZone)
        return "Ce code postal n’est pas desservi actuellement.";
    }
    if (subtotal < minimum)
      return `Le minimum de commande est de ${formatMoney(minimum)}.`;
    return "";
  }

  function buildPayload() {
    return {
      customerFirstName: customer.firstName.trim(),
      customerLastName: customer.lastName.trim(),
      customerPhone: customer.phone.trim(),
      customerEmail: customer.email.trim(),
      customerNote: customer.note.trim(),
      fulfillmentMode: mode,
      paymentMethod: mode === "delivery" ? "online" : paymentMethod,
      slotId,
      items: cart.map((item) => ({
        catalogItemId: item.catalogItemId,
        quantity: item.quantity,
        optionIds: item.optionId ? [item.optionId] : [],
      })),
      ...(mode === "delivery"
        ? {
            deliveryZoneId: String(deliveryZone?._id || ""),
            deliveryAddress: {
              line1: customer.line1.trim(),
              line2: customer.line2.trim(),
              zipCode: customer.zipCode.trim(),
              city: customer.city.trim(),
              country: "France",
              instructions: customer.instructions.trim(),
            },
          }
        : {}),
    };
  }

  async function submitOrder() {
    if (submitting) return;
    const validationError = checkoutValidation();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const basePayload = buildPayload();
      const payloadFingerprint = await fingerprintPayload(basePayload);
      let activeAttempt = attemptRef.current;
      if (
        !activeAttempt ||
        activeAttempt.payloadFingerprint !== payloadFingerprint ||
        activeAttempt.completed
      ) {
        activeAttempt = {
          idempotencyKey: createAttemptValue("order"),
          publicAccessToken: createAttemptValue("access"),
          payloadFingerprint,
        };
        setAttempt(activeAttempt);
        attemptRef.current = activeAttempt;
        writeStorage(ATTEMPT_STORAGE_KEY, activeAttempt);
      }

      const createResult =
        activeAttempt.orderId && order
          ? { order }
          : await fetch(
              takeAwayEndpoint(apiBaseUrl, restaurantId, "/public/orders"),
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Idempotency-Key": activeAttempt.idempotencyKey,
                },
                body: JSON.stringify({
                  ...basePayload,
                  idempotencyKey: activeAttempt.idempotencyKey,
                  publicAccessToken: activeAttempt.publicAccessToken,
                }),
              },
            ).then(parseApiResponse);
      const createdOrder = createResult.order;
      activeAttempt = {
        ...activeAttempt,
        orderId: createdOrder._id,
      };
      setAttempt(activeAttempt);
      attemptRef.current = activeAttempt;
      writeStorage(ATTEMPT_STORAGE_KEY, activeAttempt);
      setOrder(createdOrder);

      if (paymentState.hasFinalOrderOutcome(createdOrder)) {
        finishOrder(createdOrder);
        return;
      }

      const paymentResult = await fetch(
        takeAwayEndpoint(
          apiBaseUrl,
          restaurantId,
          `/public/orders/${encodeURIComponent(createdOrder._id)}/payment-intent`,
        ),
        {
          method: "POST",
          headers: { "X-Take-Away-Token": activeAttempt.publicAccessToken },
        },
      ).then(parseApiResponse);
      if (paymentState.hasFinalOrderOutcome(paymentResult.order)) {
        finishOrder(paymentResult.order);
        return;
      }
      setClientSecret(paymentResult.clientSecret);
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(publicErrorMessage(error));
      const errorSource = String(error?.message || "").toLowerCase();
      if (errorSource.includes("créneau")) {
        setSlotId("");
        setSlotsReload((current) => current + 1);
      }
      if (
        [
          "catalog item",
          "option d'article",
          "une option est requise",
          "minimum de commande",
          "zone de livraison",
          "livraison indisponible",
          "retrait indisponible",
        ].some((needle) => errorSource.includes(needle))
      ) {
        try {
          const refreshedCatalog = await fetch(
            takeAwayEndpoint(apiBaseUrl, restaurantId, "/public/catalog"),
          ).then(parseApiResponse);
          setCatalogState({
            loading: false,
            error: "",
            data: refreshedCatalog,
          });
        } catch {
          // Le message métier initial reste plus utile que l'échec du refresh.
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  function startNewOrder() {
    setAttempt(null);
    attemptRef.current = null;
    setOrder(null);
    cancelDraft();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resumeDraft() {
    const restored = draftState.restoreDraft(
      pendingDraft,
      catalog,
      settings,
      localDateKey(),
    );
    setCart(restored.cart);
    setCustomer(restored.customer);
    setOptionSelections(restored.optionSelections);
    setMode(restored.mode);
    setDateKey(restored.dateKey);
    setSlotId(restored.slotId);
    setPaymentMethod(restored.paymentMethod);
    setStep(restored.step);
    setDraftNotice(restored.notice);
    setPendingDraft(null);
  }

  function cancelDraft() {
    // Brouillon local uniquement : aucune requête d'annulation de commande.
    removeStorage(DRAFT_STORAGE_KEY);
    removeStorage(CART_STORAGE_KEY);
    setPendingDraft(null);
    setCart([]);
    setCustomer(draftState.emptyCustomer());
    setOptionSelections({});
    setSlotId("");
    setDateKey(localDateKey());
    setDraftNotice("");
    setSubmitError("");
    setStep("catalog");
  }

  if (catalogState.loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center px-5 py-20">
        <p className="flex items-center gap-3 text-[var(--site-ink-soft)]">
          <LoaderCircle className="animate-spin" size={22} /> Chargement de la
          carte…
        </p>
      </div>
    );
  }

  if (
    catalogState.error ||
    (!settings?.pickupEnabled && !settings?.deliveryEnabled)
  ) {
    return (
      <section className="mx-auto max-w-[860px] px-5 py-20 text-center tablet:px-8 tablet:py-28">
        <div className="site-card rounded-[34px] p-8 tablet:p-12">
          <p className="script-font text-[42px] text-[var(--site-orange-deep)]">
            À bientôt
          </p>
          <h2 className="yeseva-one-regular mt-2 break-words text-[34px] leading-tight tablet:text-[40px]">
            Commande en ligne indisponible
          </h2>
          <p className="mx-auto mt-5 max-w-[580px] leading-7 text-[var(--site-ink-soft)]">
            {catalogState.error ||
              "Le retrait et la livraison ne sont pas proposés actuellement."}
          </p>
        </div>
      </section>
    );
  }

  if (step === "confirmation" && order) {
    return <Confirmation order={order} onNewOrder={startNewOrder} />;
  }

  if (step === "payment" && order) {
    return (
      <section className="mx-auto max-w-[1080px] px-5 py-14 tablet:px-8 tablet:py-20">
        <button
          type="button"
          onClick={() => setStep("checkout")}
          disabled={reconciling}
          className="mb-7 flex items-center gap-2 text-sm font-semibold text-[var(--site-ink-soft)] disabled:opacity-40"
        >
          <ChevronLeft size={17} /> Retour aux informations
        </button>
        <div className="grid gap-8 desktop:grid-cols-[1fr_380px] desktop:items-start">
          <div className="site-card rounded-[30px] p-6 tablet:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--site-orange-deep)]">
              Dernière étape
            </p>
            <h2 className="yeseva-one-regular mt-2 text-[38px]">
              Paiement en ligne
            </h2>
            <p className="mt-3 leading-7 text-[var(--site-ink-soft)]">
              Réglez {formatMoney(order.total, order.currency)} pour finaliser
              la commande {order.orderNumber}.
            </p>
            {reconciling ? (
              <div className="mt-6 rounded-[20px] bg-[var(--site-peach)] p-5">
                <p className="flex items-center gap-3 font-semibold">
                  <LoaderCircle className="animate-spin" size={20} />{" "}
                  Vérification du paiement et de votre commande en cours…
                </p>
              </div>
            ) : clientSecret ? (
              <PaymentTakeAwayComponent
                clientSecret={clientSecret}
                busy={reconciling}
                onPaymentConfirmed={(paymentIntentId) =>
                  reconcilePayment(attemptRef.current, paymentIntentId)
                }
              />
            ) : (
              <p className="mt-6 flex items-center gap-3 text-[var(--site-ink-soft)]">
                <LoaderCircle className="animate-spin" size={20} /> Préparation
                du paiement…
              </p>
            )}
            {submitError ? (
              <p
                role="alert"
                className="mt-5 rounded-2xl bg-red/10 px-4 py-3 text-sm leading-6"
              >
                {submitError}
              </p>
            ) : null}
            {submitError && !reconciling ? (
              <button
                type="button"
                className="site-button site-button--outline mt-4"
                onClick={() => reconcilePayment(attemptRef.current)}
              >
                Vérifier le statut du paiement
              </button>
            ) : null}
          </div>
          <CartSummary
            cart={orderCart}
            subtotal={order.subtotal}
            deliveryFee={order.deliveryFee}
            editable={false}
          />
        </div>
      </section>
    );
  }

  if (recoveringAttempt || recoveryError) {
    return (
      <section className="mx-auto max-w-[760px] px-5 py-14">
        <div className="site-card rounded-[30px] p-6 tablet:p-8" role="status">
          <h2 className="yeseva-one-regular text-[32px]">
            Votre commande en cours
          </h2>
          <p className="mt-4 leading-7">
            {recoveryError || "Vérification de votre commande en cours…"}
          </p>
          {recoveryError ? (
            <button
              type="button"
              className="site-button mt-6"
              onClick={() => window.location.reload()}
            >
              Réessayer la vérification
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  const categories = Array.from(
    new Set(catalog.map((item) => item.categoryName || "À emporter")),
  );

  return (
    <section className="relative mx-auto max-w-[1500px] px-5 py-14 tablet:px-8 tablet:py-20 desktop:px-[60px]">
      {pendingDraft && !order ? (
        <TakeAwayDialog title="Une commande est en cours">
          <p className="mt-4 leading-7 text-[var(--site-ink-soft)]">
            Vous avez commencé une commande. Souhaitez-vous la reprendre ou
            annuler ce brouillon pour en commencer une nouvelle ?
          </p>
          <div className="mt-7 flex flex-col gap-3 tablet:flex-row tablet:justify-end">
            <button
              type="button"
              onClick={cancelDraft}
              className="site-button site-button--outline"
            >
              Annuler
            </button>
            <button type="button" onClick={resumeDraft} className="site-button">
              Reprendre
            </button>
          </div>
        </TakeAwayDialog>
      ) : null}
      {descriptionItem ? (
        <TakeAwayDialog
          title={descriptionItem.name}
          onClose={() => setDescriptionItem(null)}
        >
          <p className="mt-5 whitespace-pre-wrap break-words text-[15px] leading-7 text-[var(--site-ink-soft)]">
            {descriptionItem.description}
          </p>
        </TakeAwayDialog>
      ) : null}
      {draftNotice ? (
        <p
          role="status"
          className="mb-7 rounded-[20px] bg-[var(--site-peach)] p-5 text-sm leading-6"
        >
          {draftNotice}
        </p>
      ) : null}
      {step === "catalog" ? (
        <>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="script-font text-[42px] leading-none text-[var(--site-orange-deep)]">
              La cuisine chez vous
            </p>
            <h2 className="yeseva-one-regular mt-2 text-[44px] leading-tight tablet:text-[58px]">
              Composez votre commande
            </h2>
            <p className="mt-5 leading-7 text-[var(--site-ink-soft)]">
              Choisissez vos plats, puis votre mode et votre heure de commande.
              Les disponibilités et le montant final seront vérifiés par le
              restaurant.
            </p>
          </div>

          {!catalog.length ? (
            <div className="site-card mx-auto mt-12 max-w-[760px] rounded-[30px] p-8 text-center">
              <h3 className="yeseva-one-regular text-[34px]">
                La carte arrive bientôt
              </h3>
              <p className="mt-4 text-[var(--site-ink-soft)]">
                Aucun article n’est disponible à la commande pour le moment.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 desktop:grid-cols-[minmax(0,1fr)_360px] desktop:items-start">
              <div className="space-y-14">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="yeseva-one-regular mb-6 text-[36px]">
                      {category}
                    </h3>
                    <div className="grid gap-4 tablet:grid-cols-2 tablet:items-stretch">
                      {catalog
                        .filter(
                          (item) =>
                            (item.categoryName || "À emporter") === category,
                        )
                        .map((item) => (
                          <CatalogCard
                            key={item._id}
                            item={item}
                            selection={optionSelections[item._id]}
                            onSelection={(value) =>
                              setOptionSelections((current) => ({
                                ...current,
                                [item._id]: value,
                              }))
                            }
                            onAdd={(option) => addItem(item, option)}
                            onDescription={setDescriptionItem}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              <aside className="sticky top-[112px] hidden desktop:block">
                <CartSummary
                  cart={cart}
                  subtotal={subtotal}
                  onQuantity={changeQuantity}
                  onCheckout={() => {
                    setStep("checkout");
                    setCartOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </aside>
            </div>
          )}
        </>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setStep("catalog")}
            className="mb-7 flex items-center gap-2 text-sm font-semibold text-[var(--site-ink-soft)]"
          >
            <ChevronLeft size={17} /> Modifier mon panier
          </button>
          <div className="grid gap-8 desktop:grid-cols-[minmax(0,1fr)_380px] desktop:items-start">
            <div className="min-w-0 space-y-7">
              <div className="desktop:hidden">
                <CartSummary
                  cart={cart}
                  subtotal={subtotal}
                  onQuantity={changeQuantity}
                />
              </div>
              <div className="site-card rounded-[30px] p-6 tablet:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--site-orange-deep)]">
                  1 · Votre commande
                </p>
                <h2 className="yeseva-one-regular mt-2 text-[36px]">
                  Retrait ou livraison
                </h2>
                {settings.pickupEnabled && settings.deliveryEnabled ? (
                  <div className="mt-6 grid gap-3 tablet:grid-cols-2">
                    {[
                      {
                        value: "pickup",
                        label: "Retrait",
                        detail: "Aux Capuccins",
                        Icon: ShoppingBag,
                      },
                      {
                        value: "delivery",
                        label: "Livraison",
                        detail: "Selon votre code postal",
                        Icon: Truck,
                      },
                    ].map(({ value, label, detail, Icon }) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => {
                          setMode(value);
                          setSlotId("");
                          setSubmitError("");
                        }}
                        className={`rounded-[20px] border p-5 text-left transition ${mode === value ? "border-[var(--site-orange-deep)] bg-[rgba(223,160,132,0.16)]" : "border-[var(--site-line)] bg-white/60"}`}
                      >
                        <Icon size={22} />
                        <strong className="mt-3 block">{label}</strong>
                        <span className="mt-1 block text-sm text-[var(--site-ink-soft)]">
                          {detail}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 flex items-center gap-3 rounded-[20px] bg-[var(--site-peach)] p-5 font-semibold">
                    {mode === "delivery" ? (
                      <Truck size={21} />
                    ) : (
                      <ShoppingBag size={21} />
                    )}
                    {mode === "delivery"
                      ? "Livraison à votre adresse"
                      : "Retrait au restaurant"}
                  </p>
                )}
              </div>

              {mode === "delivery" ? (
                <div className="site-card rounded-[30px] p-6 tablet:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--site-orange-deep)]">
                    2 · Livraison
                  </p>
                  <h2 className="yeseva-one-regular mt-2 text-[36px]">
                    Votre adresse
                  </h2>
                  <div className="mt-6 grid gap-5 tablet:grid-cols-2">
                    <Field label="Adresse" required>
                      <input
                        className="site-input min-h-12 px-4"
                        value={customer.line1}
                        onChange={(event) =>
                          updateCustomer("line1", event.target.value)
                        }
                        autoComplete="street-address"
                      />
                    </Field>
                    <Field label="Complément">
                      <input
                        className="site-input min-h-12 px-4"
                        value={customer.line2}
                        onChange={(event) =>
                          updateCustomer("line2", event.target.value)
                        }
                      />
                    </Field>
                    <Field label="Code postal" required>
                      <input
                        className="site-input min-h-12 px-4"
                        value={customer.zipCode}
                        onChange={(event) =>
                          updateCustomer("zipCode", event.target.value)
                        }
                        inputMode="numeric"
                        autoComplete="postal-code"
                      />
                    </Field>
                    <Field label="Ville" required>
                      <input
                        className="site-input min-h-12 px-4"
                        value={customer.city}
                        onChange={(event) =>
                          updateCustomer("city", event.target.value)
                        }
                        autoComplete="address-level2"
                      />
                    </Field>
                    <div className="tablet:col-span-2">
                      <Field label="Instructions de livraison">
                        <textarea
                          className="site-textarea min-h-24 px-4 py-3"
                          value={customer.instructions}
                          onChange={(event) =>
                            updateCustomer("instructions", event.target.value)
                          }
                          maxLength={500}
                        />
                      </Field>
                    </div>
                  </div>
                  {hasCompleteDeliveryPostalCode ? (
                    deliveryZone ? (
                      <p className="mt-5 rounded-2xl bg-green/10 px-4 py-3 text-sm leading-6">
                        <Check className="mr-2 inline" size={17} /> Livraison
                        disponible · frais {formatMoney(deliveryZone.fee)} ·
                        environ {deliveryZone.estimatedMinutes} min
                      </p>
                    ) : (
                      <p
                        role="alert"
                        className="mt-5 rounded-2xl bg-red/10 px-4 py-3 text-sm leading-6"
                      >
                        Ce code postal n’est pas desservi.
                        {settings.pickupEnabled
                          ? " Vous pouvez choisir le retrait au restaurant."
                          : ""}
                      </p>
                    )
                  ) : null}
                </div>
              ) : null}

              <div className="site-card rounded-[30px] p-6 tablet:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--site-orange-deep)]">
                  {mode === "delivery" ? "3" : "2"} · Créneau
                </p>
                <h2 className="yeseva-one-regular mt-2 text-[36px]">
                  Quand souhaitez-vous votre commande ?
                </h2>
                <div className="mt-6 w-full min-w-0 max-w-[320px]">
                  <Field label="Date" required>
                    <input
                      type="date"
                      min={localDateKey()}
                      value={dateKey}
                      onChange={(event) => {
                        setDateKey(event.target.value);
                        setSlotId("");
                      }}
                      className="site-input take-away-date min-h-12 px-4"
                    />
                  </Field>
                </div>
                <div className="mt-6">
                  {slotsState.loading ? (
                    <p className="flex items-center gap-2 text-sm text-[var(--site-ink-soft)]">
                      <LoaderCircle className="animate-spin" size={18} />{" "}
                      Recherche des créneaux…
                    </p>
                  ) : slotsState.error ? (
                    <p
                      role="alert"
                      className="rounded-2xl bg-red/10 px-4 py-3 text-sm"
                    >
                      {slotsState.error}
                    </p>
                  ) : slotsState.slots.length ? (
                    <div className="grid grid-cols-3 gap-2 tablet:grid-cols-5">
                      {slotsState.slots.map((slot) => (
                        <button
                          type="button"
                          key={slot.slotId}
                          disabled={!slot.available}
                          onClick={() => {
                            setSlotId(slot.slotId);
                            setSubmitError("");
                          }}
                          className={`min-h-12 rounded-[14px] border px-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-35 ${slotId === slot.slotId ? "border-[var(--site-orange-deep)] bg-[var(--site-orange)] text-white" : "border-[var(--site-line)] bg-white/70"}`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-2xl bg-[var(--site-peach)] px-4 py-4 text-sm leading-6">
                      Le restaurant est fermé ou aucun créneau n’est disponible
                      à cette date.
                    </p>
                  )}
                </div>
              </div>

              <div className="site-card rounded-[30px] p-6 tablet:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--site-orange-deep)]">
                  {mode === "delivery" ? "4" : "3"} · Coordonnées
                </p>
                <h2 className="yeseva-one-regular mt-2 text-[36px]">
                  Pour vous prévenir
                </h2>
                <div className="mt-6 grid gap-5 tablet:grid-cols-2">
                  <Field label="Prénom" required>
                    <input
                      className="site-input min-h-12 px-4"
                      value={customer.firstName}
                      onChange={(event) =>
                        updateCustomer("firstName", event.target.value)
                      }
                      autoComplete="given-name"
                      maxLength={80}
                    />
                  </Field>
                  <Field label="Nom" required>
                    <input
                      className="site-input min-h-12 px-4"
                      value={customer.lastName}
                      onChange={(event) =>
                        updateCustomer("lastName", event.target.value)
                      }
                      autoComplete="family-name"
                      maxLength={80}
                    />
                  </Field>
                  <Field label="Téléphone" required>
                    <input
                      type="tel"
                      className="site-input min-h-12 px-4"
                      value={customer.phone}
                      onChange={(event) =>
                        updateCustomer("phone", event.target.value)
                      }
                      autoComplete="tel"
                      maxLength={32}
                    />
                  </Field>
                  <Field label="Email" required>
                    <input
                      type="email"
                      className="site-input min-h-12 px-4"
                      value={customer.email}
                      onChange={(event) =>
                        updateCustomer("email", event.target.value)
                      }
                      autoComplete="email"
                      maxLength={254}
                    />
                  </Field>
                  <div className="tablet:col-span-2">
                    <Field label="Note pour le restaurant">
                      <textarea
                        className="site-textarea min-h-24 px-4 py-3"
                        value={customer.note}
                        onChange={(event) =>
                          updateCustomer("note", event.target.value)
                        }
                        maxLength={500}
                        placeholder="Allergie, précision utile…"
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="site-card rounded-[30px] p-6 tablet:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--site-orange-deep)]">
                  {mode === "delivery" ? "5" : "4"} · Paiement
                </p>
                <h2 className="yeseva-one-regular mt-2 text-[36px]">
                  Comment souhaitez-vous régler ?
                </h2>
                {mode === "pickup" &&
                settings.paymentPolicy === "customer_choice" ? (
                  <div className="mt-6 grid gap-3 tablet:grid-cols-2">
                    {[
                      {
                        value: "online",
                        label: "Payer en ligne",
                        detail: "Paiement sécurisé en ligne",
                      },
                      {
                        value: "on_site",
                        label: "Au retrait",
                        detail: "Règlement directement au restaurant",
                      },
                    ].map((choice) => (
                      <button
                        type="button"
                        key={choice.value}
                        onClick={() => setPaymentMethod(choice.value)}
                        className={`rounded-[20px] border p-5 text-left transition ${paymentMethod === choice.value ? "border-[var(--site-orange-deep)] bg-[rgba(223,160,132,0.16)]" : "border-[var(--site-line)] bg-white/60"}`}
                      >
                        <strong>{choice.label}</strong>
                        <span className="mt-1 block text-sm text-[var(--site-ink-soft)]">
                          {choice.detail}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 rounded-[20px] bg-[var(--site-peach)] p-5 font-semibold">
                    {mode === "delivery"
                      ? "Paiement en ligne"
                      : settings.paymentPolicy === "online_required"
                        ? "Paiement en ligne sécurisé"
                        : "Paiement au retrait"}
                  </p>
                )}
              </div>

              {submitError ? (
                <p
                  role="alert"
                  className="rounded-[20px] bg-red/10 px-5 py-4 text-sm leading-6"
                >
                  {submitError}
                </p>
              ) : null}
              <button
                type="button"
                onClick={submitOrder}
                disabled={submitting}
                className="site-button w-full disabled:cursor-not-allowed disabled:opacity-50 desktop:hidden"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="mr-2 animate-spin" size={18} />{" "}
                    Envoi en cours…
                  </>
                ) : paymentMethod === "online" ? (
                  `Passer au paiement · ${formatMoney(subtotal + deliveryFee)}`
                ) : (
                  `Confirmer · ${formatMoney(subtotal + deliveryFee)}`
                )}
              </button>
            </div>
            <aside className="sticky top-[112px] hidden desktop:block">
              <CartSummary
                cart={cart}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                onQuantity={changeQuantity}
                onCheckout={submitOrder}
                checkoutDisabled={submitting}
                checkoutLabel={
                  submitting
                    ? "Envoi en cours…"
                    : paymentMethod === "online"
                      ? "Passer au paiement"
                      : "Confirmer la commande"
                }
              />
              {minimum > 0 ? (
                <p
                  className={`mt-3 text-center text-xs ${subtotal < minimum ? "text-[var(--site-orange-deep)]" : "text-[var(--site-ink-soft)]"}`}
                >
                  Minimum {formatMoney(minimum)}{" "}
                  {subtotal >= minimum ? "· atteint" : ""}
                </p>
              ) : null}
            </aside>
          </div>
        </div>
      )}

      {step === "catalog" && cart.length ? (
        <>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="site-button fixed bottom-[max(18px,env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-32px)] -translate-x-1/2 shadow-[0_18px_50px_rgba(71,42,34,0.3)] desktop:hidden"
          >
            Voir mon panier · {itemCount} · {formatMoney(subtotal)}
          </button>
          {cartOpen ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-[70] bg-[rgba(41,22,15,0.42)] desktop:hidden"
                onClick={() => setCartOpen(false)}
                aria-label="Fermer le panier"
              />
              <aside className="fixed inset-x-0 bottom-0 z-[71] max-h-[86vh] overflow-y-auto rounded-t-[30px] bg-[var(--site-cream)] p-5 pb-[max(24px,env(safe-area-inset-bottom))] shadow-[0_-20px_60px_rgba(71,42,34,0.2)] desktop:hidden">
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-[var(--site-line)]"
                  aria-label="Fermer le panier"
                >
                  <X size={20} />
                </button>
                <CartSummary
                  cart={cart}
                  subtotal={subtotal}
                  onQuantity={changeQuantity}
                  onCheckout={() => {
                    setStep("checkout");
                    setCartOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </aside>
            </>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
