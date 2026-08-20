# Glossary

Domain terms used in Appfigures' agent action descriptions, hints, and response data. Read this when a term appears in our output that you don't recognize. The glossary mirrors how we actually use each term — it doesn't introduce umbrella concepts our actions don't.

## Products and unified apps

- **App** — Umbrella term for both products and unified apps. In casual prose "app" can mean either; pick Product or Unified app when the distinction matters.
- **Product** — A store family's record of an app, with its own ID, metadata, ratings, downloads, and reviews. Spotify on Apple and Spotify on Google Play are two different Products. A Product can span multiple storefronts within one family, such as Apple's iOS and Mac stores.
- **Unified app** — A grouping that ties together every product representing the same underlying app across stores. The cross-platform view of Spotify is one unified app whose member products are Spotify on iOS, Spotify on Android, Spotify on Mac, and so on. Used wherever a question is about the app as a whole rather than one product.
- **Sibling Product** — A Product in another store family that represents the same underlying app.
- **Developer** — A storefront's record of who built an app. Each storefront keeps its own — Apple's notion of "Spotify Ltd" is a different developer record than Google Play's.
- **Publisher** — Our cross-storefront generalization of Developer — the same idea Unified app applies to Product. One publisher record ties together a company's developer records across stores, so all of a company's apps roll up under one publisher regardless of storefront.

## Storefronts, categories, charts

- **Storefront** — A single store, identified by a value like `apple:ios` or `google_play`. Storefronts are grouped into families by the download experience a person sees — Apple's storefronts share one family, Google's another, and stand-alone stores form their own.
- **Device type** — The kind of device a product runs on, e.g. `handheld` (phones), `tablet`, `tv`. A single product can support multiple.
- **Category** — A store-defined classification (Games, Productivity, Health & Fitness). Categories serve two roles: listing (the browsable taxonomy on the store) and ranks (pullable as a top chart, with category subtypes naming the chart variants). Most categories do both, but some are rank-only — "Top Apps" is a chart that doesn't exist as a browsable section.
- **Category subtype** — A chart variant within a category: `free` (top free downloads), `paid` (top paid downloads), `topgrossing` (revenue, including IAP).
- **Top chart** — The ranked list of products in a storefront, category, device type, country, category subtype, date, and hour combination. "Top Free Games on iPhone in the US App Store at 14:00 on 2026-04-26" is one top chart.
- **Category rank** — A rank on a top chart. What people usually mean by "App Store rank".
- **Keyword rank** — A product's position in a store's search results for a specific keyword. Different from a category rank — an app can rank #1 for the keyword "meditation" while ranking #47 in the Health & Fitness top chart.
- **Featured placement** (or just "featured") — An app's appearance on a store's editorially curated list — Today tab, Editor's Choice, curated collections. A placement has a rank within the list and is scoped by storefront, category, device type, country, and day.
- **App listing / Store listing** — The data you'd see on a product's store page — screenshots, description, metadata. Each product has a separate listing in every language the publisher provided.

## Explorer

- **Explorer** (also called the **Explorer catalog** or **Catalog**) — Appfigures' Product-discovery system. Indexes millions of products across Apple, Google Play, Amazon, and other major stores, with public metadata, performance metrics (ranks, ratings), and proprietary datasets (downloads, revenue, SDKs, demographics).
- **Explorer query** — A JSON grammar for filtering and aggregating the Explorer. Predicates include `match`, `and`/`or`/`not`, `nested`, range, and existence checks. Used to ask things like "iOS games released in 2024 with a 4+ rating and over 100k monthly downloads".

## Keywords

- **Keyword** — A search term users type into the App Store or Google Play.
- **Organic keyword** — A keyword a product ranks for through organic store search, not sponsored ad slots.
- **Apple Ads (formerly Apple Search Ads, ASA)** — Apple's paid-advertising product. Developers bid on keywords; their app appears in sponsored slots when their bid wins. Apple-side only.
- **Paid keyword** — A keyword a product appears for through an Apple Ads bid, not through organic ranking.

## Reviews

- **Rating** — A user's 1–5 star score for a product. Can stand alone or be paired with a comment to form a review.
- **Review** — A user-written comment paired with a rating (1–5). Apple scopes reviews by country, Google by language.

## Data access

- **Private data** — Data that comes from a store account's own reports (e.g. sales, revenue, subscriptions, usage, ad spend), so it's available only for apps you own or that were shared with you. Ratings, reviews, and estimates are _not_ private — ratings and reviews are public store data, estimates are Appfigures' own modeled numbers, and all three work for any app. Two paths to access private data: link the store account to your own Appfigures account, or have another Appfigures account share its access with you.
- **Metric** — A numeric dataset (downloads, revenue, ratings, etc.).
- **SDKs** — Third-party software development kits we detect inside an app (analytics tools, ad networks, frameworks). Tracked per app with first-seen and removal dates.
- **Cross usage** — Audience overlap between apps — what other apps the users of a given app also use, useful for competitive intelligence.

## Competitors

- **Tracked competitor** — A product added to your account for monitoring (account-level, not per-app). Two tiers: basic (e.g. ratings, ranks) and premium (e.g. performance estimates, SDKs).

## Acronyms

- **ASO** — App Store Optimization
- **ASA** — Apple Ads (formerly Apple Search Ads)
- **IAP** — In-App Purchase
