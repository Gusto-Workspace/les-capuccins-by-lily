# Les Capucins by Lily — audit frontend du 26 octobre 2026

## Bilan

| Portée npm | Avant | Après |
| --- | --- | --- |
| Complet | 22 : 3 critiques, 15 hautes, 4 modérées | 1 critique (`next`) |
| Production | 13 : 3 critiques, 8 hautes, 2 modérées | 1 critique (`next`) |

Les alertes npm agrègent plusieurs avis par paquet et incluent les effets transitifs. Les preuves avant/après, chaînes depuis les dépendances directes et versions exhaustives sont dans [security-audit/2026-10-26](security-audit/2026-10-26/). Le regroupement commun par identifiant GHSA et la qualification des 25 avis Next.js sont dans le [rapport commun](../../../docs/AUDIT_FRONTEND_CLIENTS_2026-10-26.md) et son [inventaire de 102 avis uniques](../../../docs/security-audit/2026-10-26/grouped-advisories.json).

## Versions corrigées

| Paquet / chemin principal | Avant → après |
| --- | --- |
| Axios | 1.13.6 → 1.20.0 |
| Axios → follow-redirects | 1.15.11 → 1.16.2 |
| Axios → form-data | 4.0.5 → 4.0.6 |
| Brevo → superagent → form-data | 2.5.5 → 2.5.6 |
| Express | 4.22.1 → 4.22.3 |
| Express → body-parser | 1.20.4 → 1.20.9 |
| Express → proxy-addr | 2.0.7 → 2.0.8 |
| Express → path-to-regexp | 0.1.12 → 0.1.13 |
| Express → qs | 6.14.2 → 6.16.1 |
| next-i18next → i18next-fs-backend | 2.6.1 → 2.6.9 |
| PostCSS direct / Next → PostCSS | 8.5.8 / 8.4.31 → 8.5.31 |
| PostCSS → source-map-js | 1.2.1 → 1.2.2 |
| PostCSS → nanoid | 3.3.11 → 3.3.20 |
| eslint-config-next → @next/eslint-plugin-next → glob | 10.3.10 → 10.5.0 |
| postcss-selector-parser (toutes copies) | 6.1.2 / 7.1.1 → 7.1.7 |
| brace-expansion (majeures conservées) | 1.1.12 / 2.0.2 / 5.0.4 → 1.1.21 / 2.1.7 / 5.0.12 |
| picomatch (majeures conservées) | 2.3.1 / 4.0.3 → 2.3.2 / 4.0.7 |
| js-yaml | 4.1.1 → 4.3.2 |
| Sass → immutable | 5.1.5 → 5.1.9 |
| browserslist / baseline-browser-mapping | 4.28.1 / 2.10.8 → 4.29.4 / 2.11.33 |

Les dépendances auxiliaires exigées par ces versions sont détaillées dans [version-changes.json](security-audit/2026-10-26/version-changes.json). Next reste 14.2.35, React 18, Tailwind 3, Stripe et Brevo inchangés. Les overrides PostCSS/glob/parseur sont expliqués dans le rapport commun.

## Exposition

Vercel confirmé par le propriétaire. Les avis App Router, Windows, rewrites externes, middleware/proxy d'autorisation et auto-hébergement ne satisfont pas les préconditions de ce site. Les images locales restent optimisées ; les images distantes d'actualités restent sur leur chemin existant. Aucune configuration image ou CSP Gusto Print n'est modifiée.

Les correctifs i18n suppriment les primitives de traversal et de pollution de prototype ; le site expose seulement la locale `fr` et aucun endpoint d'écriture de traductions. Express est une dépendance déclarée sans serveur Express applicatif identifié. Les appels Axios ont des destinations configurées, côté navigateur et SEO au build. Les dépendances Brevo/form-data sont corrigées sans modifier le contrat de la route de contact.

## Validation

- `npm ci --no-audit --no-fund` réussi sur le lockfile final ; `npm ls --all --json` valide.
- `npm run build` réussi sous Node 24.22.1/npm 11.19.1 avec API locale de test ; aucune modification des `.env`.
- `node --test tests/*.test.cjs` : 23 tests réussis, zéro échec. Signature brute du webhook Stripe, transfert signé à Gusto, statuts de paiement/remboursement et reprise de brouillon couverts par les tests existants.
- Chrome desktop/mobile, données et mutations API simulées : contrôles détaillés dans les preuves navigateur archivées et le rapport commun. Ces tests ne réalisent aucune transaction Stripe ni réservation réelle.
- Réservation soumise à l'API simulée, erreur de préparation d'empreinte bancaire gérée, impression automatique unique, catalogue/panier/checkout mobile validés. La validation Stripe réelle/3DS et Safari/Firefox restent à effectuer en recette.
- Débordement horizontal observé à 390 px sur `/reservations` : comparaison avec un build isolé du lockfile initial ; les deux fichiers CSS générés ont les mêmes SHA-256 avant/après. Aucune correction de design n'est introduite ici. Voir `responsive-comparison.json` pour les mesures navigateur.

## Risque résiduel et périmètre préservé

L'alerte critique du paquet Next est conservée. En particulier, [GHSA-2464-fhr4-w9xw](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw) n'exclut pas Vercel : demander la confirmation que son service d'images utilise une bibliothèque corrigée (`sharp >=0.35.5`). Aucune preuve de cette version interne n'est disponible dans le dépôt. Les protections AVIF annoncées par Vercel ne prouvent pas la correction SVG. Une migration séparée vers Next 15.5.x corrigé au moins 15.5.28, réaudité à cette date, est nécessaire pour supprimer l'alerte du paquet sans contournement.

Les composants vente à emporter et styles déjà modifiés localement sont conservés. Aucun code métier, design, configuration de restaurant, endpoint Gusto Manager, composant Stripe ou Gusto Print n'a été édité par cette mission. Aucun commit, push ou déploiement. Les builds `.next` créés pour les tests pointent vers une API simulée et doivent être reconstruits avec la configuration de recette avant toute livraison.
