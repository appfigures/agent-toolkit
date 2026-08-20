# API reference



Every action in client form. The same capabilities are exposed as AI SDK tools (`apps_get`, `metrics_query`, …). Types also ship in the package, so your editor shows all of this on hover.

<a id="af-apps-search"></a>

## af.apps.search

Find apps by name or publisher. Returns one row per unified app. Default returns Apple and Google listings; pass `allStores` to include other storefronts. To filter apps by estimate values (e.g. apps with >100k downloads last month) use [`af.explorer.listProducts`](#af-explorer-listProducts). For estimates broken down by time, country, or storefront, use [`af.metrics.query`](#af-metrics-query) with datasets estimates.sales or estimates.revenue.

**Parameters**

- `q` required `string` — Search query (app name or publisher).
- `allStores` `boolean`, default `false` — Include storefronts beyond Apple and Google: Amazon, Windows, Steam, Roku, LG TV, Samsung TV, and others.
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// Find every Electronic Arts app.
await af.apps.search({ q: "electronic arts" })

// Page through long results.
await af.apps.search({ q: "electronic arts", count: 25, page: 2 })

// Find Minecraft on every storefront (e.g. Amazon, Steam, Windows, Roku; not common).
await af.apps.search({ q: "minecraft", allStores: true })
```

<a id="af-apps-tracked"></a>

## af.apps.tracked

List the apps your Appfigures account tracks.

**Parameters**

- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.
- `q` `string` — App name to filter by.
- `filterAppsById` `(number | string)[]` — Only include data about specific apps, by product ID or unified app ID. Takes precedence over the other `filterAppsBy*` keys when set. Storefront, source, or type filters are better for app sets that can be described by those criteria.
- `filterAppsByStorefront` `string[]` — Narrow the account's tracked apps to those on these storefronts (e.g. apple:ios, google_play).
- `filterAppsBySource` `("own" | "shared" | "manual")[]` — Narrow the account's tracked apps by tracking relationship.
- `filterAppsByType` `("app" | "bundle" | "inapp" | "subscription")[]` — Narrow the account's tracked apps to products of these types.

**Examples**

```ts
// List your apps with private-data access.
await af.apps.tracked({ filterAppsBySource: ["own","shared"] })

// List your tracked fitness apps.
await af.apps.tracked({ q: "fitness" })

// List just your iOS apps.
await af.apps.tracked({ filterAppsByStorefront: ["apple:ios"] })

// Page through long results.
await af.apps.tracked({ filterAppsBySource: ["own","shared"], count: 50, page: 2 })

// List tracked competitors.
await af.apps.tracked({ filterAppsBySource: ["manual"] })

// Find individual IAPs or subscriptions (not common).
await af.apps.tracked({ filterAppsByType: ["inapp","subscription"] })
```

<a id="af-apps-get"></a>

## af.apps.get

Get an app's record: basic metadata (name, developer, etc) and, if the user tracks it, what data they can access. Pass a product ID for one storefront; unified app ID for all storefronts together.

> [!NOTE]
> The app's full store listing (description, screenshots, etc.) is available through [`af.store.appListing`](#af-store-appListing).

**Parameters**

- `appId` required `number | string` — The app's unified app ID or product ID.
- `allStores` `boolean`, default `false` — For a unified app ID: include member products across all storefronts (Amazon, Steam, Windows, Roku, etc.). When false, `member_products` is restricted to storefronts with app-intelligence coverage (iOS + Google Play). Ignored for product IDs.

**Examples**

```ts
// Get Minecraft's unified-app record (iOS + Google Play by default).
await af.apps.get({ appId: "ua_X7iNgb" })

// Get Minecraft's Google Play product record.
await af.apps.get({ appId: 6938219 })
```

<a id="af-explorer-listProducts"></a>

## af.explorer.listProducts

Read catalog fields for one app or many. Fields referenced by `query` or `sort` come back automatically; pass `extraFields` for more. Use `["match","product_id",<id>]` for a single app, or combine filters for population queries (e.g. iOS apps using Firebase with $1M+ US revenue). The 120+ fields span ranks, ratings, download and revenue estimates, SDKs, demographics, and more; query grammar and field list in `docs/catalog_playbook.md`.

> [!NOTE]
> Current point-in-time values per app. Aggregates across matching apps live in [`af.explorer.aggregateProducts`](#af-explorer-aggregateProducts); changes over time live in [`af.metrics.query`](#af-metrics-query). For simple name/publisher lookup, see [`af.apps.search`](#af-apps-search), which is faster and doesn't require the query grammar.

**Parameters**

- `query` `unknown[]`, default `[]` — Explorer query in JSON array format to select matching catalog Products. Missing values and `[]` match every Product across every storefront. The full field list and query syntax are documented in `docs/catalog_playbook.md`.
- `extraFields` `string[]` — Additional fields to include beyond those your `query` or `sort` already reference. Find field paths (and which you can read) with [`af.explorer.describeFields`](#af-explorer-describeFields).
- `sort` `string` — Explorer field name. The full field list is documented in `docs/catalog_playbook.md`.
- `order` `"asc" | "desc"`, default `"desc"` — Sort direction.
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.
- `allowUnscopedNested` `boolean`, default `false` — Escape hatch for intentionally broad queries. Bypasses the default block on unscoped nested predicates that usually inflate results.

**Examples**

```ts
// Find iOS apps that have Firebase installed.
await af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","all_sdks",["and",["match","all_sdks.id","firebase"],["match","all_sdks.active",true]]]] })

// Rank the biggest US iOS games by revenue.
await af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["match","categories.all",6014]], sort: "custom_meta[country=us].revenue_estimates_sum_30_days", order: "desc", count: 25 })

// Find US iOS apps in the $100k–$1M/month revenue tier.
await af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","custom_meta",["and",["match","custom_meta.country","us"],["match","custom_meta.revenue_estimates_sum_30_days",["number_range",100000,1000000]]]]] })

// Page through results.
await af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["match","categories.all",6014]], count: 50, page: 2 })

// Pass `extraFields` for columns the query doesn't already reference. Common for single-app reads.
await af.explorer.listProducts({ query: ["match","product_id",304004187384], extraFields: ["custom_meta[country=zz].revenue_estimates_sum_365_days","all_sdks[id=firebase].active"] })
```

<a id="af-explorer-aggregateProducts"></a>

## af.explorer.aggregateProducts

Aggregate across the full catalog of millions of products across Apple, Google Play, Amazon, and other major stores: counts, averages, min/max, and histograms over any set of matching products. Uses the same query grammar as [`af.explorer.listProducts`](#af-explorer-listProducts); returns aggregates, not product records. For market sizing, benchmarking, and segment analysis.

> [!NOTE]
> Returns public catalog estimates only. Real numbers on owned apps (downloads, revenue, subscriptions) live in [`af.metrics.query`](#af-metrics-query).

**Parameters**

- `query` `unknown[]`, default `[]` — Explorer query in JSON array format to select matching catalog Products. Missing values and `[]` match every Product across every storefront. The full field list and query syntax are documented in `docs/catalog_playbook.md`.
- `fields` required `string[]` — Field+aggregation pairs (e.g. `all_rating/stats`, `storefronts/terms`). Aggregations: `stats`, `terms`, `histogram`, `date_histogram`, `cardinality`. The full field list is documented in `docs/catalog_playbook.md`.
- `allowUnscopedNested` `boolean`, default `false` — Escape hatch for intentionally broad queries. Bypasses the default block on unscoped nested predicates that usually inflate results.
- `termsCount` `number`, default `20` — Maximum buckets returned for each `terms` aggregation. Other aggregation types ignore it.
- `dateHistogramInterval` `"year" | "quarter" | "month" | "week" | "day"` — Bucket granularity for each `date_histogram` aggregation. Other aggregation types ignore it.

**Examples**

```ts
// How many monthly downloads does an average iOS app get in Japan?
await af.explorer.aggregateProducts({ fields: ["custom_meta[country=jp].download_estimates_average_30_days/stats"], query: ["and",["match","storefronts","apple:ios"],["match","countries","jp"]] })

// What's the rating, category mix, and developer concentration for US iOS apps in the $100k–$10M/mo net-revenue tier?
await af.explorer.aggregateProducts({ fields: ["all_rating/stats","categories.all/terms","developer_id/cardinality"], query: ["and",["match","storefronts","apple:ios"],["nested","custom_meta",["and",["match","custom_meta.revenue_estimates_sum_30_days",["number_range",100000,10000000]],["match","custom_meta.country","us"]]]] })

// Are new iOS games still launching at the same rate as two years ago?
await af.explorer.aggregateProducts({ fields: ["release_date/date_histogram"], query: ["and",["match","storefronts","apple:ios"],["match","categories.all",6014],["match","release_date",["range","2024-01-01","2025-12-31"]]] })

// What SDKs do apps commonly ship alongside OneSignal?
await af.explorer.aggregateProducts({ fields: ["all_sdks[*].id/terms"], query: ["nested","all_sdks",["and",["match","all_sdks.id","onesignal"],["match","all_sdks.active",true]]] })

// How do iOS app ratings distribute?
await af.explorer.aggregateProducts({ fields: ["all_rating/histogram"], query: ["match","storefronts","apple:ios"] })

// How many apps are on each storefront?
await af.explorer.aggregateProducts({ fields: ["storefronts/terms"] })
```

<a id="af-explorer-describeFields"></a>

## af.explorer.describeFields

List the catalog fields and the current user's access level for each. Search by keyword to find fields. Same field set [`af.explorer.listProducts`](#af-explorer-listProducts) and [`af.explorer.aggregateProducts`](#af-explorer-aggregateProducts) accept.

> [!NOTE]
> Each entry has two access axes: `read` (gates response columns in [`af.explorer.listProducts`](#af-explorer-listProducts)) and `query` (gates `query`, `sort`, and aggregate fields). `query: 'partial'` means restricted-but-non-empty results. For paths containing `[]` (array-of-objects members), substitute a bracket filter before use: `custom_meta[].download_estimates_sum_30_days` → `custom_meta[country=us].download_estimates_sum_30_days`. Pair with `docs/catalog_playbook.md` for query grammar.

**Parameters**

- `count` `number`, default `50` — Number of results to return.
- `page` `number`, default `1` — Page number.
- `q` `string` — Filter by `path`, `title`, `description`, `type`.

**Examples**

```ts
// Search for revenue-related fields.
await af.explorer.describeFields({ q: "revenue" })

// List every catalog field with the current user's access level.
await af.explorer.describeFields()
```

<a id="af-metrics-query"></a>

## af.metrics.query

Query any numeric dataset for one or more apps. Optionally grouped by up to two dimensions, returned as a nested partition tree, not app records. Independently filterable by country, device type, and date range. `filterAppsBy*` options narrow the app set (by ID, storefront, source, or type); without one, a query covers every app the account tracks.

> [!NOTE]
> Current point-in-time values live in [`af.explorer.listProducts`](#af-explorer-listProducts); counts/averages across the catalog live in [`af.explorer.aggregateProducts`](#af-explorer-aggregateProducts). See `docs/numeric_metrics.md` for dataset naming conventions and pitfalls.

**Parameters**

- `dataset` required `string` — Dataset to query (e.g. sales.combined_downloads). See [`af.metrics.describeDatasets`](#af-metrics-describeDatasets) for the full list and which datasets are private data (visible only for apps you own or that were shared).
- `groupBy` `("date" | "product" | "unifiedApp" | "country" | "storefront" | "network" | "device")[]` — Dimensions to group by. Max 2: the first slot becomes the outer entity type, the second the inner series. Each dimension multiplies the result size.
- `granularity` `"daily" | "weekly" | "monthly" | "quarterly" | "yearly"` — Time granularity when grouping by date
- `count` `number` — Row cap. With `groupBy`, top N of the outer entity type by value (earliest N when grouping by date). Without `groupBy`, single-page preview.
- `countries` `string[]` — Filter to one or more ISO country codes (e.g. US, JP, GB)
- `deviceType` `"watch" | "handheld" | "tablet" | "tv" | "desktop" | "headset"` — Device type
- `allTime` `boolean`, default `false` — Opt in to the entire history. Without this flag (and without `start`/`end`), the query defaults to the last 30 days. Mutually exclusive with `start` and `end`.
- `filterAppsById` `(number | string)[]` — Only include data about specific apps, by product ID or unified app ID. Takes precedence over the other `filterAppsBy*` keys when set. Storefront, source, or type filters are better for app sets that can be described by those criteria.
- `filterAppsByStorefront` `string[]` — Narrow the account's tracked apps to those on these storefronts (e.g. apple:ios, google_play).
- `filterAppsBySource` `("own" | "shared" | "manual")[]` — Narrow the account's tracked apps by tracking relationship.
- `filterAppsByType` `("app" | "bundle" | "inapp" | "subscription")[]` — Narrow the account's tracked apps to products of these types.
- `start` `string` — Start date (YYYY-MM-DD)
- `end` `string` — End date (YYYY-MM-DD, defaults to today)

**Examples**

```ts
// Get total downloads across your apps with private-data access.
await af.metrics.query({ dataset: "sales.combined_downloads", filterAppsBySource: ["own","shared"] })

// Get revenue split by storefront, plus a top-level total.
await af.metrics.query({ dataset: "sales.combined_revenue", filterAppsBySource: ["own","shared"], groupBy: ["storefront"] })

// Rank the top 5 tracked competitors by estimated monthly revenue.
await af.metrics.query({ dataset: "estimates.revenue", filterAppsBySource: ["manual"], groupBy: ["product"], count: 5 })

// Track Candy Crush Saga's daily download estimates.
await af.metrics.query({ dataset: "estimates.sales", filterAppsById: ["ua_V1Q1uX"], groupBy: ["date"], granularity: "daily" })

// Track net monthly recurring revenue per app, month over month.
await af.metrics.query({ dataset: "subscriptions.mrr", filterAppsBySource: ["own","shared"], groupBy: ["product","date"], granularity: "monthly" })

// Get Minecraft's new ratings.
await af.metrics.query({ dataset: "ratings.new_total", filterAppsById: ["ua_X7iNgb"] })

// Track daily ad spend across your apps.
await af.metrics.query({ dataset: "adspend.cost", filterAppsBySource: ["own","shared"], groupBy: ["date"], granularity: "daily" })

// Compare Candy Crush's December 2025 downloads across the US, Japan, and UK.
await af.metrics.query({ dataset: "estimates.sales", filterAppsById: ["ua_V1Q1uX"], countries: ["US","JP","GB"], groupBy: ["country"], start: "2025-12-01", end: "2025-12-31" })

// Track all-time monthly revenue across your apps with private-data access.
await af.metrics.query({ dataset: "sales.combined_revenue", filterAppsBySource: ["own","shared"], groupBy: ["date"], granularity: "monthly", allTime: true })

// Get Minecraft's review volume by country.
await af.metrics.query({ dataset: "reviews.total", filterAppsById: ["ua_X7iNgb"], groupBy: ["country"] })
```

<a id="af-metrics-describeDatasets"></a>

## af.metrics.describeDatasets

List every numeric dataset [`af.metrics.query`](#af-metrics-query) accepts, one row per dataset with its value type and whether it's limited to your own apps.

> [!NOTE]
> A dataset with `your_apps_only: true` returns data only for apps you own or that were shared with you. [`af.metrics.query`](#af-metrics-query) returns nothing for one of these on any other app. Feed any `dataset` straight into [`af.metrics.query`](#af-metrics-query). Each row's `supported_group_by` and `supported_granularities` list how that dataset can be broken down, so you can pick a valid grouping before querying. Pair with `docs/numeric_metrics.md` for dataset naming conventions and pitfalls.

**Parameters**

- `count` `number`, default `50` — Number of results to return.
- `page` `number`, default `1` — Page number.
- `q` `string` — Filter by `dataset`, `value_type`, `label`, `description`.

**Examples**

```ts
// Search by keyword (matches name, label, or description).
await af.metrics.describeDatasets({ q: "combined downloads" })

// Look up one dataset by its exact name.
await af.metrics.describeDatasets({ q: "sales.combined_downloads" })

// List every dataset with its value type and whether it's limited to your own apps.
await af.metrics.describeDatasets()
```

<a id="af-store-appRanks"></a>

## af.store.appRanks

Trace rank history for one or more apps across countries, device types, category subtypes, and categories, as time-series positions with day-over-day deltas.

> [!NOTE]
> For the inverse (e.g., "what app is at #10 in UK Games?"), see [`af.store.topCharts`](#af-store-topCharts). Keyword search positions are in [`af.keywords.organic`](#af-keywords-organic). Pass a unified app ID to cover every storefront with app-intelligence coverage, or a numeric product ID for one storefront.

**Parameters**

- `appIds` required `(number | string)[]` — App identifiers (unified app IDs or product IDs)
- `countries` `string[]` — Country codes to query. Defaults to every country with rank coverage.
- `granularity` `"daily" | "hourly"`, default `"hourly"` — Sampling rate. Hourly gives the freshest data; pass `granularity: "daily"` for compact multi-day history.
- `deviceTypes` `("watch" | "handheld" | "tablet" | "tv" | "desktop" | "headset")[]`, default `["handheld"]` — Which device types to include; each ranks in its own chart. Add more to widen the response.
- `subtypes` `("free" | "paid" | "topgrossing")[]`, default `["free"]` — Which category subtypes to include; each ranks in its own chart. Add more to widen the response.
- `categoryIds` `number[]` — Filter response rows to specific category IDs; omit for all. Category IDs come from [`af.store.categories`](#af-store-categories).
- `start` `string` — Start date (YYYY-MM-DD)
- `end` `string` — End date (YYYY-MM-DD, defaults to today)
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// Check ChatGPT's current ranks (unified app).
await af.store.appRanks({ appIds: ["ua_miTXv6"], countries: ["US"] })

// Check ChatGPT's current ranks on one storefront.
await af.store.appRanks({ appIds: [336744124021], countries: ["US"] })

// Compare ChatGPT's ranks across the US, UK, and Japan.
await af.store.appRanks({ appIds: ["ua_miTXv6"], countries: ["US","GB","JP"] })

// Check Procreate's paid iPad chart ranks.
await af.store.appRanks({ appIds: ["ua_CxA1MS"], subtypes: ["paid"], deviceTypes: ["tablet"], countries: ["US"] })

// Trace ChatGPT's chart history through December 2025.
await af.store.appRanks({ appIds: ["ua_miTXv6"], granularity: "daily", start: "2025-12-01", end: "2025-12-31", countries: ["US"] })

// Check ChatGPT's rank in one category (US iOS Productivity).
await af.store.appRanks({ appIds: [336744124021], categoryIds: [6007], countries: ["US"] })
```

<a id="af-store-topCharts"></a>

## af.store.topCharts

List the top apps in a category chart for a given country and category, with current positions and day-over-day deltas.

> [!NOTE]
> For the inverse (e.g., "where does Minecraft rank in UK Games?"), see [`af.store.appRanks`](#af-store-appRanks).

**Parameters**

- `country` required `string` — ISO country code (e.g. US, JP, GB)
- `categoryId` required `number` — Category IDs come from [`af.store.categories`](#af-store-categories).
- `subtype` `"free" | "paid" | "topgrossing"`, default `"free"` — Category subtype (chart variant within the category).
- `date` `string` — Snapshot date (YYYY-MM-DD, defaults to current).
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// Find the Games category, then pull its US chart.
await af.store.categories({ q: "games" })
await af.store.topCharts({ country: "US", categoryId: 6014 })

// List top paid apps on the US App Store.
await af.store.topCharts({ country: "US", categoryId: 25204, subtype: "paid" })

// List top free apps on the Japan App Store.
await af.store.topCharts({ country: "JP", categoryId: 25204 })

// List top free apps on Google Play in the US.
await af.store.topCharts({ country: "US", categoryId: 100 })

// List top free apps on the US App Store in December 2025.
await af.store.topCharts({ country: "US", categoryId: 25204, date: "2025-12-01" })
```

<a id="af-store-categories"></a>

## af.store.categories

List every store category with its ID. Numeric category IDs required by [`af.store.appRanks({ categoryIds })`](#af-store-appRanks) and [`af.store.topCharts({ categoryId })`](#af-store-topCharts) are available here.

**Parameters**

- `count` `number`, default `50` — Number of results to return.
- `page` `number`, default `1` — Page number.
- `q` `string` — Filter by `name`.
- `sort` `"name"` — Field to sort by. Omit to order by relevance when `q` is set, otherwise list order.
- `order` `"asc" | "desc"`, default `"desc"` — Sort direction.
- `categoryId` `number[]` — Only return these category IDs.
- `parentId` `number` — Only include subcategories of this parent category (drill-down by id).
- `storefront` `string[]` — Only include categories from these storefronts (e.g. `apple:ios`, `google_play`).
- `deviceType` `string[]` — Only include categories for these device types (e.g. `handheld`, `tablet`).
- `all` `boolean`, default `false` — Include non-rank stores (roku, vizio, etc.). These have categories but no rank data.

**Examples**

```ts
// Find the Games category.
await af.store.categories({ q: "games" })

// List every Apple iOS category.
await af.store.categories({ storefront: ["apple:ios"] })

// List subcategories of a parent category (here, Apple Games).
await af.store.categories({ parentId: 6014 })

// Include categories from non-rank-supporting stores (e.g. Roku, Vizio) (not common).
await af.store.categories({ all: true })
```

<a id="af-store-featured"></a>

## af.store.featured

List featured and editorial placements for an app or storefront product. Request 0 rows for summary stats only.

> [!NOTE]
> Today tab, stories, collections, and similar curated placements. Pass a unified app ID to cover every storefront with app-intelligence coverage, or a numeric product ID for one storefront. Without a date range, covers the last 30 days.

**Parameters**

- `appId` required `number | string` — The app's unified app ID or product ID.
- `countries` `string[]` — Countries to include. Omit to query US only, or pass multiple to compare markets. To include every country, set `allCountries` instead.
- `allCountries` `boolean`, default `false` — Include every country. Cannot be combined with `countries`.
- `includeRankTrend` `boolean`, default `false` — Include per-interval rank_trend for each placement.
- `sort` `"relevance" | "date"`, default `"relevance"` — Sort placements by relevance or date.
- `order` `"asc" | "desc"`, default `"desc"` — Sort direction.
- `start` `string` — Start date (YYYY-MM-DD)
- `end` `string` — End date (YYYY-MM-DD, defaults to today). Spans at most 31 days.
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// List Minecraft's recent featured placements (unified app).
await af.store.featured({ appId: "ua_X7iNgb" })

// List Minecraft's recent featured placements on one storefront.
await af.store.featured({ appId: 10157213 })

// Compare Minecraft's placement coverage across the US, UK, and Japan.
await af.store.featured({ appId: "ua_X7iNgb", countries: ["US","GB","JP"] })

// List Minecraft's placements during a specific month (December 2025).
await af.store.featured({ appId: "ua_X7iNgb", start: "2025-12-01", end: "2025-12-31" })

// List Minecraft's placements with rank history.
await af.store.featured({ appId: "ua_X7iNgb", includeRankTrend: true })

// List Minecraft's placements sorted by end date, newest run first.
await af.store.featured({ appId: "ua_X7iNgb", sort: "date", order: "desc" })

// Get Minecraft's placement summary only.
await af.store.featured({ appId: "ua_X7iNgb", count: 0 })
```

<a id="af-store-appListing"></a>

## af.store.appListing

Read the full store listing for one storefront: localized text (name, subtitle, description, release notes) plus screenshots, video, categories, monetization, supported devices, country availability, price, file size, and age rating. Takes a numeric product ID (one storefront at a time; a unified app has one product per storefront). One locale per request.

> [!NOTE]
> Everything visible on one app's store page, resolved to one locale. The response includes `sibling_products` (product IDs for the same app on other storefronts); one request covers one listing. Filtering or searching listings across the catalog (e.g. "apps whose description mentions X") lives in [`af.explorer.listProducts`](#af-explorer-listProducts). Identity/publisher/member-products data lives in [`af.apps.get`](#af-apps-get).

**Parameters**

- `productId` required `number` — Numeric product ID for one storefront. Not a unified app ID. Member product_id values are available from [`af.apps.get({ appId: "<unified-app-id>" })`](#af-apps-get).
- `language` `string` — Locale (e.g. en, ja, zh-Hans) for name, subtitle, description, release notes, and screenshots. Defaults to en; falls back to the first available locale when the requested one has no metadata. The response echoes the resolved language.
- `deviceType` `"watch" | "handheld" | "tablet" | "tv" | "desktop" | "headset"`, default `"handheld"` — Relevant to Apple apps. Pick handheld for iPhone-specific metadata, tablet for iPad, desktop for Mac, etc.

**Examples**

```ts
// Read Minecraft's store listing.
await af.store.appListing({ productId: 10157213 })

// Read Minecraft's Japanese-localized listing.
await af.store.appListing({ productId: 10157213, language: "ja" })

// Read Minecraft's iPad screenshots.
await af.store.appListing({ productId: 10157213, deviceType: "tablet" })
```

<a id="af-audience-demographics"></a>

## af.audience.demographics

Read an app's audience demographics: the estimated age and gender breakdown.

> [!NOTE]
> Returns who the audience is (age, gender). For what else that audience uses, see [`af.audience.crossUsage`](#af-audience-crossUsage). For the app's performance numbers (downloads, revenue, ratings), use [`af.metrics.query`](#af-metrics-query) for trends over time or [`af.explorer.listProducts`](#af-explorer-listProducts) for a current snapshot.

**Parameters**

- `appId` required `number | string` — The app's unified app ID or product ID.

**Examples**

```ts
// Read Minecraft's audience across all its storefronts (unified app ID).
await af.audience.demographics({ appId: "ua_X7iNgb" })

// Read Minecraft's audience on Google Play only (product ID).
await af.audience.demographics({ appId: 6938219 })
```

<a id="af-audience-crossUsage"></a>

## af.audience.crossUsage

Find the apps that an app's users also use.

> [!NOTE]
> Competitive and partnership intel. For that app's own audience makeup (age, gender), use [`af.audience.demographics`](#af-audience-demographics).

**Parameters**

- `appId` required `number | string` — The app's unified app ID or product ID.
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// Find the apps ChatGPT's users also use (unified app ID).
await af.audience.crossUsage({ appId: "ua_miTXv6" })

// Find the apps ChatGPT's users also use on the App Store only (product ID).
await af.audience.crossUsage({ appId: 336744124021 })
```

<a id="af-reviews-list"></a>

## af.reviews.list

Read individual reviews for one or more apps. Returns review text, star rating, country, and app version. Filterable by star rating, date range, country, version, and tracking relationship.

> [!NOTE]
> Reviews are public, so this works for any app (with the right plan), not just those the account tracks; with no app filter, results cover every tracked app. For volume counts by dimension, see [`af.reviews.breakdown`](#af-reviews-breakdown). To respond to a review, use [`af.reviews.reply`](#af-reviews-reply) (write access requires owning the app).

**Parameters**

- `stars` `(1 | 2 | 3 | 4 | 5)[]` — Filter by star rating.
- `versions` `string[]` — Filter by app version. Pass multiple to combine.
- `countries` `string[]` — Filter to one or more ISO country codes (e.g. US, JP, GB).
- `q` `string` — Search review title and body. Pass multiple keywords to match any. Case-insensitive; combines with other filters.
- `sort` `"date" | "stars"` — Sort by review date or star rating.
- `order` `"asc" | "desc"`, default `"desc"` — Sort direction.
- `filterAppsById` `(number | string)[]` — Only include data about specific apps, by product ID or unified app ID. Takes precedence over the other `filterAppsBy*` keys when set. Storefront, source, or type filters are better for app sets that can be described by those criteria.
- `filterAppsByStorefront` `string[]` — Narrow the account's tracked apps to those on these storefronts (e.g. apple:ios, google_play).
- `filterAppsBySource` `("own" | "shared" | "manual")[]` — Narrow the account's tracked apps by tracking relationship.
- `filterAppsByType` `("app" | "bundle" | "inapp" | "subscription")[]` — Narrow the account's tracked apps to products of these types.
- `start` `string` — Start date (YYYY-MM-DD)
- `end` `string` — End date (YYYY-MM-DD, defaults to today)
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number. 1-500.

**Examples**

```ts
// Read Minecraft's recent reviews.
await af.reviews.list({ filterAppsById: ["ua_X7iNgb"] })

// Read Minecraft's 5-star reviews.
await af.reviews.list({ filterAppsById: ["ua_X7iNgb"], stars: [5] })

// Compare Minecraft's reviews across the US, Japan, and the UK.
await af.reviews.list({ filterAppsById: ["ua_X7iNgb"], countries: ["US","JP","GB"] })

// Read Minecraft's December 2025 reviews.
await af.reviews.list({ filterAppsById: ["ua_X7iNgb"], start: "2025-12-01", end: "2025-12-31" })

// Page through long results across your own apps.
await af.reviews.list({ filterAppsBySource: ["own"], count: 50, page: 2 })
```

<a id="af-reviews-breakdown"></a>

## af.reviews.breakdown

Aggregate review counts for one or more apps, bucketed by dimension. Returns one count per dimension value, plus a global total across the matched set.

> [!NOTE]
> Reviews are public, so this works for any app (with the right plan), not just those the account tracks; with no app filter, counts cover every tracked app. Without a date range, covers the last 30 days. For individual review text, use [`af.reviews.list`](#af-reviews-list).

**Parameters**

- `stars` `(1 | 2 | 3 | 4 | 5)[]` — Filter by star rating.
- `versions` `string[]` — Filter by app version. Pass multiple to combine.
- `countries` `string[]` — Filter to one or more ISO country codes (e.g. US, JP, GB).
- `q` `string` — Search review title and body. Pass multiple keywords to match any. Case-insensitive; combines with other filters.
- `filterAppsById` `(number | string)[]` — Only include data about specific apps, by product ID or unified app ID. Takes precedence over the other `filterAppsBy*` keys when set. Storefront, source, or type filters are better for app sets that can be described by those criteria.
- `filterAppsByStorefront` `string[]` — Narrow the account's tracked apps to those on these storefronts (e.g. apple:ios, google_play).
- `filterAppsBySource` `("own" | "shared" | "manual")[]` — Narrow the account's tracked apps by tracking relationship.
- `filterAppsByType` `("app" | "bundle" | "inapp" | "subscription")[]` — Narrow the account's tracked apps to products of these types.
- `start` `string` — Start date (YYYY-MM-DD)
- `end` `string` — End date (YYYY-MM-DD, defaults to today)
- `by` `("stars" | "country" | "version" | "language" | "product" | "response" | "deleted" | "tag")[]` — Limit the response to these dimensions; omit to return all.
- `top` `number`, default `20` — Maximum values returned per dimension; the rest are summed under `__other__`.

**Examples**

```ts
// Break down Minecraft's recent reviews.
await af.reviews.breakdown({ filterAppsById: ["ua_X7iNgb"] })

// Where are Minecraft's biggest fans writing from?
await af.reviews.breakdown({ filterAppsById: ["ua_X7iNgb"], stars: [5] })

// Count Minecraft's December 2025 5-star reviews.
await af.reviews.breakdown({ filterAppsById: ["ua_X7iNgb"], stars: [5], start: "2025-12-01", end: "2025-12-31" })

// How many Minecraft reviewers raved?
await af.reviews.breakdown({ filterAppsById: ["ua_X7iNgb"], q: "love amazing fun great best" })

// Compare review volume across your own apps.
await af.reviews.breakdown({ filterAppsBySource: ["own"] })
```

<a id="af-reviews-reply"></a>

## af.reviews.reply

> [!WARNING]
> Mutation (create) — refuses without `confirmMutation`.

Post or withdraw a developer response on a specific review. Pass `content` to post; pass `delete: true` to withdraw a previously-posted response. Returns the resulting state (`published`/`pending` for a post, `removed`/`removal_pending` for a withdrawal) along with the submitting account.

> [!NOTE]
> Write access only: the account must own the app the review is on. Review IDs come from [`af.reviews.list`](#af-reviews-list); pass the row's `review_id`. Stores may queue the action (`pending` / `removal_pending`); re-fetch with [`af.reviews.list`](#af-reviews-list) later to confirm.

**Parameters**

- `reviewId` required `string` — Review to act on. Use `review_id` from [`af.reviews.list`](#af-reviews-list).
- `content` `string` — Response text the developer wants to publish.
- `delete` `boolean` — Withdraw the previously-posted response on this review. Mutually exclusive with `content`.

**Examples**

```ts
// Reply to a low-star review after shipping a fix.
await af.reviews.reply({ reviewId: "rev123", content: "We just shipped a fix in v2.1. Let us know if you still see this." })

// Withdraw a previously-posted response.
await af.reviews.reply({ reviewId: "rev123", delete: true })
```

<a id="af-keywords-organic"></a>

## af.keywords.organic

Check the organic keywords one or more apps rank for, with position, popularity, and competitiveness.

> [!NOTE]
> For the inverse (apps that rank for a keyword), see [`af.keywords.rankingApps`](#af-keywords-rankingApps). This works for any app (with the right plan), not just those the account tracks; with no app filter, covers every tracked app.

**Parameters**

- `productIds` `number[]` — Product identifiers (numeric, one storefront each).
- `countries` required `string[]` — One or more ISO country codes (e.g. US, JP, GB). Pass several to compare markets.
- `deviceType` `"watch" | "handheld" | "tablet" | "tv" | "desktop" | "headset"` — Device type
- `count` `number`, default `10` — Number of results to return (min 10).
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// Check ChatGPT's current US keyword rankings.
await af.keywords.organic({ productIds: [336744124021], countries: ["US"] })

// Check ChatGPT's iPad-only keyword rankings.
await af.keywords.organic({ productIds: [336744124021], countries: ["US"], deviceType: "tablet" })

// Compare ChatGPT and Gemini's US keyword rankings.
await af.keywords.organic({ productIds: [336744124021,337217072531], countries: ["US"] })
```

<a id="af-keywords-paid"></a>

## af.keywords.paid

List the paid keywords one or more apps run ads on, with impression share and organic rank.

> [!NOTE]
> Organic keyword rankings are in [`af.keywords.organic`](#af-keywords-organic).

**Parameters**

- `productIds` required `number[]` — Product identifiers (numeric, one storefront each).
- `days` `number`, default `180` — Lookback period in days. Common values: 7, 14, 30, 90, 180, 365.
- `countries` required `string[]` — One or more ISO country codes (e.g. US, JP, GB). Pass several to compare markets.
- `deviceTypes` `("watch" | "handheld" | "tablet" | "tv" | "desktop" | "headset")[]` — Filter by device type. Defaults to handheld.
- `count` `number`, default `10` — Number of results to return (min 10).
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// Find Headspace's US paid keywords.
await af.keywords.paid({ productIds: [15250929], countries: ["US"] })

// Compare Headspace's and Calm's US paid keywords.
await af.keywords.paid({ productIds: [15250929,304554144], countries: ["US"] })

// Find Headspace's paid keywords across the US, UK, and Japan.
await af.keywords.paid({ productIds: [15250929], countries: ["US","GB","JP"] })

// Find Headspace's US iPad paid keywords.
await af.keywords.paid({ productIds: [15250929], countries: ["US"], deviceTypes: ["tablet"] })

// Check Headspace's US paid keywords over the last 30 days.
await af.keywords.paid({ productIds: [15250929], countries: ["US"], days: 30 })
```

<a id="af-keywords-trackedRanks"></a>

## af.keywords.trackedRanks

View where all your tracked keywords rank for a single app+country combo, with each keyword's current position, movement since it last changed, starting position, popularity, and competitiveness.

> [!NOTE]
> To trace one keyword's rank over time for an app+country combo, use [`af.keywords.trackedTrend`](#af-keywords-trackedTrend). For a point-in-time list of every keyword any app ranks for, use [`af.keywords.organic`](#af-keywords-organic). Add more tracked keywords with [`af.keywords.track`](#af-keywords-track).

**Parameters**

- `productId` required `number` — Numeric product ID for one storefront. Not a unified app ID. Member product_id values are available from [`af.apps.get({ appId: "<unified-app-id>" })`](#af-apps-get).
- `country` required `string` — ISO country code (e.g. US, JP, GB)
- `deviceType` `"watch" | "handheld" | "tablet" | "tv" | "desktop" | "headset"` — Device to read ranks for. Omit to use the store default.
- `count` `number`, default `10` — Number of results to return (min 10).
- `page` `number`, default `1` — Page number.
- `sort` `"position" | "popularity" | "competitiveness" | "num_apps" | "keyword_term" | "delta"` — Field to order results by.
- `order` `"asc" | "desc"`, default `"desc"` — Sort direction.
- `start` `string` — Start of the window (YYYY-MM-DD). Omit the range for the last 7 days; the rank on the start date is the starting-position baseline.
- `end` `string` — End of the window (YYYY-MM-DD, defaults to today). Spans at most 31 days.
- `keywordTerm` `string` — Only include tracked keywords whose term contains this text.
- `minPosition` `number` — Best rank to include (1 = top).
- `maxPosition` `number` — Worst rank to include.
- `minPopularity` `number` — Lowest popularity to include (0-100).
- `maxPopularity` `number` — Highest popularity to include (0-100).
- `minCompetitiveness` `number` — Lowest competitiveness to include (0-100).
- `maxCompetitiveness` `number` — Highest competitiveness to include (0-100).

**Examples**

```ts
// Check how ChatGPT's tracked keywords are ranking.
await af.keywords.trackedRanks({ productId: 336744124021, country: "US" })

// List ChatGPT's best-ranking keywords first.
await af.keywords.trackedRanks({ productId: 336744124021, country: "US", sort: "position", order: "asc" })

// Show only the keywords ChatGPT ranks in the top 10.
await af.keywords.trackedRanks({ productId: 336744124021, country: "US", maxPosition: 10 })

// Find the most-searched keywords ChatGPT should prioritize.
await af.keywords.trackedRanks({ productId: 336744124021, country: "US", sort: "popularity", minPopularity: 50 })

// Trace ChatGPT's keyword movement across a custom week.
await af.keywords.trackedRanks({ productId: 336744124021, country: "US", start: "2026-01-06", end: "2026-01-12" })

// Page through a long tracked keyword set.
await af.keywords.trackedRanks({ productId: 336744124021, country: "US", page: 2 })
```

<a id="af-keywords-trackedTrend"></a>

## af.keywords.trackedTrend

Trace how one tracked keyword's rank changes over time for a single app+country combo. Each point gives the rank and how many positions it moved since the one before.

> [!NOTE]
> For all of an app's tracked keywords at once, use [`af.keywords.trackedRanks`](#af-keywords-trackedRanks).

**Parameters**

- `productId` required `number` — Numeric product ID for one storefront. Not a unified app ID. Member product_id values are available from [`af.apps.get({ appId: "<unified-app-id>" })`](#af-apps-get).
- `country` required `string` — ISO country code (e.g. US, JP, GB)
- `deviceType` `"watch" | "handheld" | "tablet" | "tv" | "desktop" | "headset"` — Device to read ranks for. Omit to use the store default.
- `keywordId` required `string` — The keyword to trace. Must be tracked for this app and country; its opaque id comes from [`af.keywords.trackedRanks`](#af-keywords-trackedRanks) or [`af.keywords.tracked`](#af-keywords-tracked).
- `granularity` `"daily" | "hourly"`, default `"daily"` — Sampling rate.
- `start` `string` — Start of the window (YYYY-MM-DD). Omit the range for the last 7 days.
- `end` `string` — End of the window (YYYY-MM-DD, defaults to today). Spans at most 14 days for hourly granularity, 31 for daily.

**Examples**

```ts
// Find a tracked keyword, then trace its rank day by day.
await af.keywords.trackedRanks({ productId: 336744124021, country: "US" })
await af.keywords.trackedTrend({ keywordId: "00f2b1ead3a0990b818517356cb40280", productId: 336744124021, country: "US" })

// Trace a keyword's rank for ChatGPT across a specific week.
await af.keywords.trackedTrend({ keywordId: "00f2b1ead3a0990b818517356cb40280", productId: 336744124021, country: "US", start: "2026-01-06", end: "2026-01-12" })

// Trace a keyword hour by hour.
await af.keywords.trackedTrend({ keywordId: "00f2b1ead3a0990b818517356cb40280", productId: 336744124021, country: "US", granularity: "hourly" })
```

<a id="af-keywords-suggestions"></a>

## af.keywords.suggestions

Discover keyword ideas to consider targeting for a single app+country combo, ranked by relevance to the app and including some drawn from apps you compete with. Each comes with its popularity, competitiveness, and the app's current rank.

> [!NOTE]
> Works for any app, not just tracked ones. For the keywords an app already ranks for, use [`af.keywords.organic`](#af-keywords-organic).

**Parameters**

- `productId` required `number` — Numeric product ID for one storefront. Not a unified app ID. Member product_id values are available from [`af.apps.get({ appId: "<unified-app-id>" })`](#af-apps-get).
- `country` required `string` — ISO country code (e.g. US, JP, GB)
- `deviceType` `"watch" | "handheld" | "tablet" | "tv" | "desktop" | "headset"` — Device to read ranks for. Omit to use the store default.
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// Discover keywords ChatGPT should consider targeting.
await af.keywords.suggestions({ productId: 336744124021, country: "US" })

// Find keyword ideas for ChatGPT in Japan.
await af.keywords.suggestions({ productId: 336744124021, country: "JP" })

// Pull a broader set of suggestions.
await af.keywords.suggestions({ productId: 336744124021, country: "US", count: 50 })
```

<a id="af-keywords-rankingApps"></a>

## af.keywords.rankingApps

List the apps ranking for a specific keyword in organic search, plus the keyword's own popularity and competitiveness scores.

> [!NOTE]
> For a specific app's keyword positions, see [`af.keywords.organic`](#af-keywords-organic). For related search terms to brainstorm, see [`af.keywords.related`](#af-keywords-related).

**Parameters**

- `keywordTerm` required `string` — Keyword to look up.
- `country` required `string` — ISO country code (e.g. US, JP, GB)
- `storefront` required `string` — App store platform (e.g. apple:ios, google_play, amazon_appstore, steam, windows10, apple:mac, apple:tv, apple:imessage, or another supported storefront).
- `deviceType` `"watch" | "handheld" | "tablet" | "tv" | "desktop" | "headset"` — Device type
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// Find US iOS apps ranking for "fitness".
await af.keywords.rankingApps({ keywordTerm: "fitness", country: "US", storefront: "apple:ios" })

// Find Google Play apps ranking for "fitness".
await af.keywords.rankingApps({ keywordTerm: "fitness", country: "US", storefront: "google_play" })

// Find US iPad apps ranking for "meditation".
await af.keywords.rankingApps({ keywordTerm: "meditation", country: "US", storefront: "apple:ios", deviceType: "tablet" })
```

<a id="af-keywords-advertisers"></a>

## af.keywords.advertisers

List the apps advertising on a specific keyword, with each advertiser's impression share, organic rank, and how long they've been bidding.

> [!NOTE]
> For the apps that rank organically on the same term, see [`af.keywords.rankingApps`](#af-keywords-rankingApps).

**Parameters**

- `keywordTerm` required `string` — Keyword to look up advertisers for
- `days` `number`, default `180` — Lookback period in days. Common values: 7, 14, 30, 90, 180, 365.
- `country` required `string` — ISO country code (e.g. US, JP, GB)
- `deviceType` `"watch" | "handheld" | "tablet" | "tv" | "desktop" | "headset"` — Device type
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// Find US apps advertising on the "notion" brand.
await af.keywords.advertisers({ keywordTerm: "notion", country: "US" })

// Find US iPad apps advertising on "meditation".
await af.keywords.advertisers({ keywordTerm: "meditation", country: "US", deviceType: "tablet" })

// Find US apps advertising on "fitness" over the last 30 days.
await af.keywords.advertisers({ keywordTerm: "fitness", country: "US", days: 30 })
```

<a id="af-keywords-related"></a>

## af.keywords.related

Find keywords related to a seed term for ASO research. Useful for finding alternatives with a similar audience that are more popular or less competitive.

> [!NOTE]
> For apps that rank on a keyword, see [`af.keywords.rankingApps`](#af-keywords-rankingApps).

**Parameters**

- `keywordTerm` required `string` — Seed keyword to find related terms for.
- `country` required `string` — ISO country code (e.g. US, JP, GB)
- `storefront` required `string` — App store platform (e.g. apple:ios, google_play, amazon_appstore, steam, windows10, apple:mac, apple:tv, apple:imessage, or another supported storefront).
- `deviceType` `"watch" | "handheld" | "tablet" | "tv" | "desktop" | "headset"` — Device type
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// Find US iOS keywords related to "fitness".
await af.keywords.related({ keywordTerm: "fitness", country: "US", storefront: "apple:ios" })

// Find US Google Play keywords related to "fitness".
await af.keywords.related({ keywordTerm: "fitness", country: "US", storefront: "google_play" })

// Find US iPad keywords related to "meditation".
await af.keywords.related({ keywordTerm: "meditation", country: "US", storefront: "apple:ios", deviceType: "tablet" })
```

<a id="af-keywords-tracked"></a>

## af.keywords.tracked

List tracked keywords with their opaque IDs.

> [!NOTE]
> Reference a keyword by its stable `keyword_id`, not its term text.

**Parameters**

- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.
- `q` `string` — Filter by `keyword_term`.
- `sort` `"keyword_term" | "active" | "added_on"` — Field to sort by. Omit to order by relevance when `q` is set, otherwise list order.
- `order` `"asc" | "desc"`, default `"desc"` — Sort direction.
- `includeRelationships` `boolean`, default `false` — Include per-(product, country) tracking detail and sync state on each row. Off by default; adds a nested block per tracked (product, country) pair.

**Examples**

```ts
// List every tracked keyword.
await af.keywords.tracked()

// Search tracked keywords for "fitness".
await af.keywords.tracked({ q: "fitness" })

// List the most-recently-tracked keywords first.
await af.keywords.tracked({ sort: "added_on" })

// Show each keyword's tracking and sync detail.
await af.keywords.tracked({ includeRelationships: true })
```

<a id="af-keywords-track"></a>

## af.keywords.track

> [!WARNING]
> Mutation (create) — refuses without `confirmMutation`.

Track a keyword to monitor your app's hourly rank for it over time and get automatic alerts when its position moves.

> [!NOTE]
> Product IDs for owned apps are available from [`af.apps.tracked`](#af-apps-tracked).

**Parameters**

- `productId` required `number` — Product ID of the app to track the keyword for
- `keywordTerm` required `string` — Keyword to start tracking
- `country` required `string` — ISO country code (e.g. US, JP, GB)

**Examples**

```ts
// Start tracking "meditation" for one of your apps in the US.
await af.keywords.track({ keywordTerm: "meditation", productId: 336744124021, country: "US" })

// Track "workout" in Japan.
await af.keywords.track({ keywordTerm: "workout", productId: 336744124021, country: "JP" })
```

<a id="af-keywords-untrack"></a>

## af.keywords.untrack

> [!WARNING]
> Mutation (destructive) — refuses without `confirmMutation`.

Stop tracking a keyword.

> [!NOTE]
> Keyword IDs are opaque hashes on each record from [`af.keywords.tracked`](#af-keywords-tracked).

**Parameters**

- `keywordId` required `string` — Identifier of a tracked keyword row (returned by [`af.keywords.tracked`](#af-keywords-tracked)). Not the keyword text.

**Examples**

```ts
// Stop tracking a keyword.
await af.keywords.untrack({ keywordId: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6" })
```

<a id="af-appleAds-organizations"></a>

## af.appleAds.organizations

List the Apple Ads organizations you manage campaigns in, with each one's currency and timezone.

> [!NOTE]
> The `organization_id` on each row is what [`af.appleAds.campaigns`](#af-appleAds-campaigns) rows reference.

**Parameters**

- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// List all the Apple Ads organizations you manage.
await af.appleAds.organizations()
```

<a id="af-appleAds-campaigns"></a>

## af.appleAds.campaigns

List your Apple Ads campaigns with each one's status, budget, targeted countries, and schedule.

> [!NOTE]
> Each row's `product_id` is the advertised app. Resolve its name with [`af.apps.get`](#af-apps-get).

**Parameters**

- `displayStatus` `"running" | "on_hold" | "paused" | "deleted"` — Filter to campaigns in one status. Omit to include all statuses.
- `name` `string` — Filter to campaigns whose name contains this text.
- `countries` `string[]` — Filter to campaigns targeting any of these countries.
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// List all your Apple Ads campaigns.
await af.appleAds.campaigns()

// List only your running campaigns.
await af.appleAds.campaigns({ displayStatus: "running" })

// Search your campaigns by name.
await af.appleAds.campaigns({ name: "Brand" })

// List campaigns targeting the US or UK.
await af.appleAds.campaigns({ countries: ["US","GB"] })
```

<a id="af-appleAds-adGroups"></a>

## af.appleAds.adGroups

List Apple Ads ad groups with each one's default bid, CPA cap, pricing model, and schedule.

> [!NOTE]
> Scope to one campaign from [`af.appleAds.campaigns`](#af-appleAds-campaigns). Its bid keywords live in [`af.appleAds.keywords`](#af-appleAds-keywords).

**Parameters**

- `campaignId` `string` — Scope to ad groups in one campaign.
- `displayStatus` `"running" | "on_hold" | "paused" | "deleted"` — Filter to ad groups in one status. Omit to include all statuses.
- `name` `string` — Filter to ad groups whose name contains this substring.
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// List all your ad groups across every campaign.
await af.appleAds.adGroups()

// List the ad groups in one campaign.
await af.appleAds.adGroups({ campaignId: "aac_W9YthU" })
```

<a id="af-appleAds-keywords"></a>

## af.appleAds.keywords

List a campaign's bid keywords with each keyword's performance (impressions, taps, installs, spend, cost-per-install) over a date range, plus its match type, bid, and whether it's a targeting or negative term.

> [!NOTE]
> Get campaign IDs from [`af.appleAds.campaigns`](#af-appleAds-campaigns) and ad groups from [`af.appleAds.adGroups`](#af-appleAds-adGroups). Omitting the range covers the last 30 days.

**Parameters**

- `campaignId` required `string` — Campaign whose bid keywords to list.
- `adGroupId` `string` — Filter to keywords in one ad group.
- `status` `"active" | "paused" | "deleted"` — Filter to keywords in one status. Omit to include all statuses.
- `matchType` `"broad" | "exact"` — Filter to one match type. Omit to include both.
- `name` `string` — Filter to keywords whose text contains this substring.
- `sort` `"spend" | "impressions" | "taps" | "installs" | "cpa" | "cvr" | "bid_amount"` — Order keywords by a performance metric or the bid. Omit for newest first.
- `order` `"asc" | "desc"`, default `"desc"` — Sort direction.
- `start` `string` — Start date (YYYY-MM-DD)
- `end` `string` — End date (YYYY-MM-DD, defaults to today)
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// Find a running campaign, then list its bid keywords.
await af.appleAds.campaigns({ displayStatus: "running" })
await af.appleAds.keywords({ campaignId: "aac_W9YthU" })

// See how a campaign's keywords performed over July 2026.
await af.appleAds.keywords({ campaignId: "aac_W9YthU", start: "2026-07-01", end: "2026-07-31" })

// Find a campaign's highest-spending keywords.
await af.appleAds.keywords({ campaignId: "aac_W9YthU", sort: "spend" })
```

<a id="af-appleAds-searchTerms"></a>

## af.appleAds.searchTerms

List the actual user search terms that triggered a campaign's ads, each with its all-time performance (impressions, taps, installs, spend, cost-per-install). Use these to discover new keywords to bid on or exclude.

> [!NOTE]
> Get campaign IDs from [`af.appleAds.campaigns`](#af-appleAds-campaigns). Bid on a promising term with `af.appleAds.addKeywords`.

**Parameters**

- `campaignId` required `string` — Campaign whose search terms to list.
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// Find a campaign, then see the user searches that triggered its ads.
await af.appleAds.campaigns()
await af.appleAds.searchTerms({ campaignId: "aac_uDGL4v" })
```

<a id="af-appleAds-report"></a>

## af.appleAds.report

Report Apple Ads performance per campaign (impressions, taps, installs, spend, cost-per-install), plus an account-wide total, over a date range.

> [!NOTE]
> Resolve campaign names and the advertised app from [`af.appleAds.campaigns`](#af-appleAds-campaigns). For one campaign's top-performing keywords, use [`af.appleAds.topKeywords`](#af-appleAds-topKeywords). Omitting the range reports the last 30 days.

**Parameters**

- `campaignIds` `string[]` — Limit the report to specific campaigns.
- `start` `string` — Start date (YYYY-MM-DD)
- `end` `string` — End date (YYYY-MM-DD, defaults to today)
- `count` `number`, default `10` — Number of results to return.
- `page` `number`, default `1` — Page number.

**Examples**

```ts
// See how much an install costs across all your campaigns.
await af.appleAds.report()

// Report on July 2026 performance.
await af.appleAds.report({ start: "2026-07-01", end: "2026-07-31" })

// List campaigns, then report on specific ones.
await af.appleAds.campaigns()
await af.appleAds.report({ campaignIds: ["aac_uDGL4v"] })
```

<a id="af-appleAds-topKeywords"></a>

## af.appleAds.topKeywords

Rank a campaign's top-performing keywords by conversion rate, spend, and installs over a date range. Each list holds the top keywords on one metric.

> [!NOTE]
> Get campaign IDs from [`af.appleAds.campaigns`](#af-appleAds-campaigns). For metrics across all campaigns, use [`af.appleAds.report`](#af-appleAds-report). Omitting the range covers the last 30 days.

**Parameters**

- `campaignId` required `string` — Campaign to rank keywords for.
- `top` `number`, default `5` — How many keywords to return per ranking (max 10).
- `start` `string` — Start date (YYYY-MM-DD)
- `end` `string` — End date (YYYY-MM-DD, defaults to today)

**Examples**

```ts
// Find a campaign, then see its top-performing keywords.
await af.appleAds.campaigns()
await af.appleAds.topKeywords({ campaignId: "aac_uDGL4v" })

// Rank a campaign's keywords for a specific week.
await af.appleAds.topKeywords({ campaignId: "aac_uDGL4v", start: "2026-07-25", end: "2026-07-31" })

// Widen each ranking to the maximum of 10 keywords.
await af.appleAds.topKeywords({ campaignId: "aac_uDGL4v", top: 10 })
```

<a id="af-sdks-list"></a>

## af.sdks.list

List every known SDK with its id, or search to find a specific one.

**Parameters**

- `count` `number`, default `50` — Number of results to return.
- `page` `number`, default `1` — Page number.
- `q` `string` — Filter by `name`, `description`, `tags`.
- `sort` `"name" | "active"` — Field to sort by. Omit to order by relevance when `q` is set, otherwise list order.
- `order` `"asc" | "desc"`, default `"desc"` — Sort direction.
- `sdkId` `string[]` — Only return these SDK ids.
- `includeInactive` `boolean`, default `false` — Include inactive SDKs. Rare; most callers want active only.

**Examples**

```ts
// Find OneSignal's id.
await af.sdks.list({ q: "OneSignal" })

// Search for analytics SDKs.
await af.sdks.list({ q: "analytics" })

// Look up details for several SDK ids.
await af.sdks.list({ sdkId: ["firebase","admob","onesignal"] })

// Include inactive SDKs in the listing (not common).
await af.sdks.list({ includeInactive: true })
```
