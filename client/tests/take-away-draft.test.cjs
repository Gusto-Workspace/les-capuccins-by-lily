const test = require("node:test");
const assert = require("node:assert/strict");
const {
  readDraft,
  restoreDraft,
  reconcileCart,
  hasDraftContent,
} = require("../src/_assets/utils/take-away-draft");

const catalog = [
  {
    _id: "dish",
    name: "Plat maison",
    price: 14,
    options: [{ _id: "large", name: "Grande portion", price: 3 }],
  },
  { _id: "drink", name: "Jus", price: 4 },
];
const settings = {
  pickupEnabled: true,
  deliveryEnabled: true,
  paymentPolicy: "customer_choice",
};
const cart = reconcileCart(
  [
    { catalogItemId: "dish", optionId: "large", quantity: 3 },
    { catalogItemId: "drink", quantity: 2 },
  ],
  catalog,
);
const draft = {
  version: 1,
  restaurantId: "capucins",
  cart,
  step: "checkout",
  mode: "delivery",
  dateKey: "2030-05-11",
  slotId: "slot-12",
  paymentMethod: "online",
  optionSelections: { dish: "large" },
  customer: {
    firstName: "Lily",
    lastName: "Test",
    phone: "0612345678",
    email: "lily@example.test",
    note: "Allergie aux noix",
    line1: "1 rue du Test",
    line2: "Étage 2",
    zipCode: "19500",
    city: "Turenne",
    instructions: "Sonner deux fois",
  },
};

test("absence de brouillon, panier historique et isolation du restaurant", () => {
  assert.equal(readDraft(null, [], "capucins"), null);
  assert.equal(
    readDraft(
      { version: 1, restaurantId: "capucins", cart: [] },
      [],
      "capucins",
    ),
    null,
  );
  assert.equal(readDraft(draft, cart, "autre"), null);
  assert.equal(readDraft(null, cart, "capucins").step, "catalog");
  assert.equal(readDraft(draft, [], "capucins"), draft);
});

test("la reprise conserve quantités, options, étape, créneau et tous les renseignements", () => {
  const restored = restoreDraft(draft, catalog, settings, "2030-05-10");
  assert.deepEqual(restored.customer, draft.customer);
  assert.deepEqual(restored.cart, cart);
  assert.deepEqual(restored.optionSelections, { dish: "large" });
  for (const field of ["step", "mode", "dateKey", "slotId", "paymentMethod"]) {
    assert.equal(restored[field], draft[field]);
  }
  assert.equal(restored.notice, "");
  assert.equal(hasDraftContent({ customer: draft.customer, cart: [] }), true);
});

test("date passée, impossible ou corrompue : nouveau choix sans perdre les coordonnées", () => {
  for (const dateKey of ["2029-01-01", "2030-02-30", "n'importe quoi", null]) {
    const restored = restoreDraft(
      { ...draft, dateKey },
      catalog,
      settings,
      "2030-05-10",
    );
    assert.equal(restored.dateKey, "2030-05-10");
    assert.equal(restored.slotId, "");
    assert.deepEqual(restored.customer, draft.customer);
    assert.deepEqual(restored.cart, cart);
  }
});

test("produit supprimé, option retirée et changement de prix : panier recalculé et signalé", () => {
  const updatedCatalog = [{ ...catalog[1], price: 5 }];
  const restored = restoreDraft(draft, updatedCatalog, settings, "2030-05-10");
  assert.equal(restored.cart.length, 1);
  assert.equal(restored.cart[0].quantity, 2);
  assert.equal(restored.cart[0].unitPrice, 5);
  assert.ok(restored.notice);
  assert.deepEqual(restored.customer, draft.customer);
  assert.equal(reconcileCart(cart, [{ ...catalog[0], options: [] }]).length, 0);
  assert.equal(
    reconcileCart(cart, [
      { ...catalog[0], options: [{ _id: "new-id", name: "Grande portion" }] },
    ]).length,
    0,
  );
});

test("brouillon corrompu : quantités entières bornées, doublons regroupés, champs assainis", () => {
  const restored = restoreDraft(
    {
      ...draft,
      cart: [
        null,
        {},
        { catalogItemId: "drink", quantity: "NaN" },
        { catalogItemId: "drink", quantity: 2.8 },
        { catalogItemId: "drink", quantity: 150 },
      ],
      customer: { firstName: {}, email: null, note: "x".repeat(600) },
      optionSelections: { dish: "deleted-option" },
    },
    catalog,
    settings,
    "2030-05-10",
  );
  assert.equal(restored.cart.length, 1);
  assert.equal(restored.cart[0].quantity, 99);
  assert.equal(restored.customer.firstName, "");
  assert.equal(restored.customer.email, "");
  assert.equal(restored.customer.note.length, 500);
  assert.deepEqual(restored.optionSelections, {});
});

test("mode retiré et nouvelle politique de paiement imposent une nouvelle validation", () => {
  const restored = restoreDraft(
    draft,
    catalog,
    { ...settings, deliveryEnabled: false, paymentPolicy: "on_site" },
    "2030-05-10",
  );
  assert.equal(restored.mode, "pickup");
  assert.equal(restored.paymentMethod, "on_site");
  assert.equal(restored.slotId, "");
  assert.ok(restored.notice);
  assert.equal(
    restoreDraft({ ...draft, cart: [] }, [], settings, "2030-05-10").step,
    "catalog",
  );
});
