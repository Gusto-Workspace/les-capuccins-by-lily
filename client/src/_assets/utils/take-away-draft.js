const MAX_QUANTITY = 99;
const CUSTOMER_FIELDS = {
  firstName: 80,
  lastName: 80,
  phone: 32,
  email: 254,
  note: 500,
  line1: 250,
  line2: 250,
  zipCode: 20,
  city: 120,
  instructions: 500,
};

function emptyCustomer() {
  return Object.fromEntries(
    Object.keys(CUSTOMER_FIELDS).map((key) => [key, ""]),
  );
}

function hasDraftContent(draft) {
  return Boolean(
    draft?.cart?.length ||
    Object.values(draft?.customer || {}).some(
      (value) => typeof value === "string" && value.trim(),
    ),
  );
}

function readDraft(value, legacyCart, restaurantId) {
  if (
    value?.version === 1 &&
    String(value.restaurantId) === String(restaurantId)
  ) {
    return hasDraftContent(value) ? value : null;
  }
  // Les anciens paniers ne contenaient ni coordonnées ni étape.
  if (value == null && Array.isArray(legacyCart) && legacyCart.length) {
    return { version: 1, restaurantId, cart: legacyCart, step: "catalog" };
  }
  return null;
}

function reconcileCart(cart, catalog) {
  const reconciled = new Map();
  for (const entry of Array.isArray(cart) ? cart : []) {
    if (!entry || typeof entry !== "object") continue;
    const item = catalog.find(
      (candidate) => String(candidate._id) === String(entry.catalogItemId),
    );
    if (!item || item.visible === false || item.available === false) continue;
    const options = item.options || [];
    const option = options.find((candidate) =>
      entry.optionId
        ? String(candidate._id) === String(entry.optionId)
        : candidate.name === entry.optionName,
    );
    // Ne jamais remplacer silencieusement une option disparue.
    if ((options.length || entry.optionId || entry.optionName) && !option)
      continue;
    const price = Number(item.price || 0) + Number(option?.price || 0);
    if (!Number.isFinite(price) || price <= 0) continue;
    const quantity = Number(entry.quantity);
    if (!Number.isFinite(quantity) || quantity < 1) continue;
    const key = `${item._id}:${option?._id || ""}`;
    const previous = reconciled.get(key);
    reconciled.set(key, {
      key,
      catalogItemId: String(item._id),
      name: item.name,
      categoryName: item.categoryName || "À emporter",
      unitPrice: Number(item.price || 0),
      optionId: option ? String(option._id) : "",
      optionName: option?.name || "",
      optionPrice: Number(option?.price || 0),
      quantity: Math.min(
        MAX_QUANTITY,
        (previous?.quantity || 0) + Math.floor(quantity),
      ),
    });
  }
  return [...reconciled.values()];
}

function restoreDraft(draft, catalog, settings, today) {
  const cart = reconcileCart(draft.cart, catalog);
  const customer = Object.fromEntries(
    Object.entries(CUSTOMER_FIELDS).map(([key, limit]) => [
      key,
      typeof draft.customer?.[key] === "string"
        ? draft.customer[key].slice(0, limit)
        : "",
    ]),
  );
  const mode =
    draft.mode === "delivery" && settings.deliveryEnabled
      ? "delivery"
      : settings.pickupEnabled
        ? "pickup"
        : "delivery";
  const paymentMethod =
    mode === "delivery" || settings.paymentPolicy === "online_required"
      ? "online"
      : settings.paymentPolicy === "on_site"
        ? "on_site"
        : draft.paymentMethod === "online"
          ? "online"
          : "on_site";
  const date = typeof draft.dateKey === "string" ? draft.dateKey : "";
  const parsedDate = new Date(`${date}T12:00:00Z`);
  const validDate =
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date &&
    date >= today;
  const optionSelections = Object.fromEntries(
    catalog.flatMap((item) => {
      const selected = draft.optionSelections?.[item._id];
      return (item.options || []).some(
        (option) => String(option._id) === selected,
      )
        ? [[item._id, selected]]
        : [];
    }),
  );
  const changed =
    JSON.stringify(cart) !== JSON.stringify(draft.cart || []) ||
    (date && !validDate) ||
    (draft.mode && mode !== draft.mode) ||
    (draft.paymentMethod && paymentMethod !== draft.paymentMethod);
  return {
    cart,
    customer,
    mode,
    paymentMethod,
    optionSelections,
    dateKey: validDate ? date : today,
    slotId:
      validDate && mode === draft.mode && typeof draft.slotId === "string"
        ? draft.slotId
        : "",
    step: draft.step === "checkout" && cart.length ? "checkout" : "catalog",
    notice: changed
      ? "Votre brouillon a été actualisé selon la carte et les conditions disponibles. Vérifiez votre panier et votre créneau."
      : "",
  };
}

module.exports = {
  emptyCustomer,
  hasDraftContent,
  readDraft,
  reconcileCart,
  restoreDraft,
};
