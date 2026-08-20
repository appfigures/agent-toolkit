# Catalog Action Playbook For LLMs

The catalog is a table of public app-store Products. Use it for app identity, storefront coverage, availability, categories, ratings, releases, ranks, estimates, SDKs, ads, demographics, and related Products.

A **Product** is one app in one App Store with one `product_id`. Spotify on Apple and Spotify on Google Play are different Products. One Apple Product can cover multiple Apple storefronts such as `apple:ios`, `apple:mac`, and `apple:imessage`; those values are in `storefronts`.

Same-app links:

- `exact[]` = sibling Products for the same logical app in another App Store. Use `exact[*].related_id` for sibling Product IDs.
- `similar[]` = recommendation-style related Products. Do not use it for same-app matching.

The job is always: choose the Product population, choose values to read or aggregate, then interpret units and denominators correctly.

## 1. Choose The Action

Use `af.explorer.listProducts` for Product rows: "which apps", "list apps", "apps using SDK X", "apps available in country X", "apps by revenue/downloads/rating/release date".

Use `af.explorer.aggregateProducts` for math over a Product population: counts, distributions, averages, min/max/sum, histograms, distinct counts, or shares.

Use `af.explorer.describeFields` before guessing field names, units, shapes, or access. It is the field catalog and permission check.

Use `af.store.topCharts` for plain chart lookup such as "what is #10 in US iOS Games?" Use catalog `rank` only when chart rank is one filter inside a bigger Product query, such as "iOS apps in top 10 free US charts that use Firebase."

## 2. Query Syntax

`query` selects Products. Empty `[]` means every Product across every storefront. Add scope unless the user really means the whole catalog.

Formal shape:

```text
query       := [] | predicate
predicate   := match | exists | missing | bool | nested | raw | rank

match       := ["match", fieldPath, value, modifier*]
exists      := ["exists", fieldPath]
missing     := ["missing", fieldPath]
bool        := ["and", predicate+] | ["or", predicate+] | ["not", predicate]
nested      := ["nested", arrayObjectField, predicate]
raw         := ["raw", luceneQueryString]
rank        := ["rank", "position" | "delta", countries | null, categoryIds | null, listTypes | null, timeRange | null, rankValues]
countries   := countryCode | countryCode[]
categoryIds := categoryId | categoryId[]
listTypes   := listType | listType[]
listType    := "free" | "paid" | "topgrossing"
rankValues  := rankValue | rankValue[]
rankValue   := number

value       := string | number | boolean | ["or", value+] | ["and", value+] | range
range       := ["range", lower, upper] | ["number_range", lower, upper, bounds?]
bounds      := "inclusive" | "exclusive" | "left_exclusive" | "right_exclusive"
modifier    := ["operator", "and" | "or"] | ["mode", "fuzzy" | "phrase"]
fieldPath   := dotted catalog field path with no bracket selectors
```

Bracket field references like `custom_meta[country=us].downloads` are not query syntax. In `query`, bind that country row with `["nested","custom_meta",["and",["match","custom_meta.country","us"],...]]`; then use `custom_meta[country=us].downloads` in response columns (`extraFields`, `sort`) or aggregate `fields`.

Common population filters:

| Intent                  | Query                                                                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| iOS apps                | `["match","storefronts","apple:ios"]`                                                                                                                      |
| Google Play apps        | `["match","storefronts","google_play"]`                                                                                                                    |
| Apple or Google Play    | `["match","storefronts",["or","apple:ios","google_play"]]`                                                                                                 |
| available in Japan      | `["match","countries","jp"]`                                                                                                                               |
| released in 2024        | `["match","release_date",["range","2024-01-01","2024-12-31"]]`                                                                                             |
| currently uses Firebase | `["nested","all_sdks",["and",["match","all_sdks.id","firebase"],["match","all_sdks.active",true]]]`                                                        |
| US revenue over $100k   | `["nested","custom_meta",["and",["match","custom_meta.country","us"],["match","custom_meta.revenue_estimates_sum_30_days",["number_range",100000,null]]]]` |

Query forms:

| Form                                                                                  | Meaning                                                                           |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `["match","<field>",<value>]`                                                         | Field equals, contains, or matches the value shape.                               |
| `["exists","<field>"]` / `["missing","<field>"]`                                      | Field is present or absent.                                                       |
| `["and",...]` / `["or",...]` / `["not",x]`                                            | Boolean composition. Operator names are case-insensitive; examples use lowercase. |
| `["nested","<array>",<predicate>]`                                                    | Bind predicates to one row inside an array-of-objects field.                      |
| `["raw","<lucene query>"]`                                                            | Raw Lucene predicate. Opaque; no field/type inference.                            |
| `["rank","position" \| "delta", countries, categories, listTypes, timeRange, values]` | Store top-chart rank predicate.                                                   |

Match values:

| Value                                     | Meaning                                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `"spotify"`                               | Text or enum value.                                                                              |
| `true`, `false`, `123`                    | Boolean and numeric values; do not quote them.                                                   |
| `["or","app","game"]`                     | Any listed value.                                                                                |
| `["and","a","b"]`                         | Every listed value. Prefer `or` for ordinary set membership.                                     |
| `["number_range",100000,null]`            | Numeric lower bound; `null` is unbounded.                                                        |
| `["number_range",0,50,"right_exclusive"]` | Numeric range; bracket mode is `inclusive`, `exclusive`, `left_exclusive`, or `right_exclusive`. |
| `["range","2024-01-01","2024-12-31"]`     | Two-bound range. Use `YYYY-MM-DD` for date fields.                                               |

Text modifiers are optional. Plain text search works:

```json
["match", "name", "spotify"]
```

Add modifiers only when token behavior matters:

```json
["match", "name", "spotify", ["operator", "and"], ["mode", "fuzzy"]]
```

Allowed modifier pairs: `["operator","and"]`, `["operator","or"]`, `["mode","fuzzy"]`, `["mode","phrase"]`.

Value rules:

- Enum values are case-sensitive. Use `us`, not `US`; use `apple:ios`, not `ios`.
- Most country-code fields use lowercase values: `us`, `jp`, `gb`. `developer_country` uses uppercase ISO values: `US`, `JP`, `GB`.
- Storefront values are exact enums. Common values: `apple:ios`, `google_play`, `apple:mac`. Do not invent aliases; use `af.explorer.describeFields`.
- `range` and `number_range` are value wrappers inside `match`, not top-level predicates.
- String fields require strings. Numeric ranges belong on numeric fields or arrays of numbers.

### Raw Lucene

Use `raw` only when the array grammar cannot express the text query. The string uses Lucene query syntax, which is useful for Lucene-only text behavior such as `*` / `?` wildcards, phrase proximity/slop, and boosts:

```json
["raw","name:Spotif*"]
["raw","name:Spotif?"]
["raw","name:\"music streaming\"~5"]
["raw","name:spotify^2 developer:spotify"]
```

Do not use `raw` for ordinary boolean matching; use `["match","name",["or","spotify","pandora"]]` or an `or` clause instead. `match` treats Lucene characters such as `*`, `?`, `~`, and `^` as literal text, not operators. `raw` can stand alone or compose under `and`, `or`, `not`, and `nested`, but its Lucene string is opaque: the action does not inspect fields, types, typos, nested row binding, or return fields. Use normal `nested` syntax for row-scoped logic whenever possible. If `raw` is the only signal in `af.explorer.listProducts`, pass `extraFields` explicitly — the action can't infer field references from an opaque Lucene string.

### Rank

Use `rank` as a filter, not as a chart-fetching action:

```json
["rank","position",countries,categories,listTypes,timeRange,values]
["rank","delta",countries,categories,listTypes,timeRange,values]
```

Slots:

| Slot                     | Meaning                                                                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"position"` / `"delta"` | Chart position, or rank movement.                                                                                                                                    |
| `countries`              | Country code or country-code array; use `null` for any supported country.                                                                                            |
| `categories`             | Store category ID or ID array; use `null` for all categories. Top-overall category IDs are store/device specific.                                                    |
| `listTypes`              | One value or array of `free`, `paid`, `topgrossing`; use `null` for any list type.                                                                                   |
| `timeRange`              | Day-offset range such as `["range",0,0]` for today or `["range",0,30]`, the Explorer UI's "past 30 days"; `null` for any supported range.                            |
| `values`                 | Position bucket or bucket array: `1`, `5`, `10`, `25`, `50`, `100`, `200`, `400`, `1000`. Delta buckets also include `0`; use negative values for downward movement. |

Rules: put `rank` at top level or under top-level `and`/`or`/`not`; never inside `nested`; never as `["match","rank",...]`; pass `extraFields` explicitly when you want context columns alongside the rank filter.

## 3. Nested Rows

Array-of-object fields need `nested` when multiple predicates must hit the same row.

| Field         | Row key      | Meaning                                |
| ------------- | ------------ | -------------------------------------- |
| `custom_meta` | `country`    | Country or worldwide estimate rows.    |
| `all_sdks`    | `id`         | SDK rows.                              |
| `exact`       | `related_id` | Same-app sibling Products.             |
| `similar`     | `related_id` | Recommendation-style related Products. |

Correct US revenue filter:

```json
[
	"nested",
	"custom_meta",
	[
		"and",
		["match", "custom_meta.country", "us"],
		["match", "custom_meta.revenue_estimates_sum_30_days", ["number_range", 100000, null]]
	]
]
```

Wrong:

```json
[
	"and",
	["match", "custom_meta.country", "us"],
	["match", "custom_meta.revenue_estimates_sum_30_days", ["number_range", 100000, null]]
]
```

The wrong form can match `country=us` on one row and revenue on another.

Nested rules:

- Inside `nested`, use full paths: `custom_meta.country`, not `country`.
- Do not reference a different nested array inside a nested body; use separate `nested` clauses.
- `exists` / `missing` on an array-of-objects wrapper is invalid. Check a member, e.g. `["exists","custom_meta.country"]`.
- Add the row key when the user names a specific country, SDK, exact Product, or similar Product. A negated row-key filter does not scope the row.

Country trap:

- `countries` = Product availability.
- `custom_meta.country` = estimate row geography.
- `custom_meta.country = "zz"` = worldwide rollup row.

For "Japan apps' Japan downloads", use both availability and estimate geography:

```json
[
	"and",
	["match", "countries", "jp"],
	[
		"nested",
		"custom_meta",
		[
			"and",
			["match", "custom_meta.country", "jp"],
			["match", "custom_meta.download_estimates_sum_30_days", ["number_range", 1, null]]
		]
	]
]
```

Then read `custom_meta[country=jp].download_estimates_sum_30_days`.

## 4. Fields, Sort, And Access

`af.explorer.listProducts` always returns `product_id`, `name`, and every field referenced by `query` or `sort`. Pass `extraFields` to add more columns on top — it does not replace the auto-included set. In `af.explorer.aggregateProducts`, `fields` is required and lists the `<field>/<aggregation>` pairs you want.

Field references appear in:

- `af.explorer.listProducts` `extraFields` (add-on columns)
- `af.explorer.listProducts` `sort`
- `af.explorer.aggregateProducts` `fields` (required)

Brackets iterate over rows. Dots pick members after you are on a row or inside an object.

| Shape            | Examples                                                                                                        | Rule                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| scalar           | `name`, `release_date`, `developer_id`                                                                          | Use directly.                                                        |
| array of scalars | `storefronts`, `countries`, `monetization_strategies`                                                           | Use directly; do not add `[*]`.                                      |
| object           | `categories.main`, `categories.*`                                                                               | Pick a member; use `.*` only where many members are allowed.         |
| array of objects | `custom_meta[country=us].download_estimates_sum_30_days`, `all_sdks[id=firebase].active`, `exact[*].related_id` | Use `[key=value].member`, `[key=value].*`, `[*].member`, or `[*].*`. |

Every bracket must be followed by `.member` or `.*`; `custom_meta[country=us]` and `custom_meta[*]` are invalid.

Position rules:

| Position        | Rule                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Returned fields | `product_id` and `name` always returned; `query`/`sort` refs auto-included; `extraFields` adds more.                                                                                                                                                                                                                                                              |
| Sort key        | Use a sortable field. `.*` is never sortable. Pass `order:"desc"` for descending. `custom_meta[*].download_estimates_sum_30_days` is accepted, but prefer `[country=us]` when the question names US.                                                                                                                                                              |
| Aggregate field | Must be `<field>/<aggregation>`. `.*` and `[*].*` are rejected (heterogeneous member types can't be aggregated together). `[*].member` is accepted but iterates rows from the matched Products' arrays — bucket counts and `stats` are over rows, not Products. Cross-validate Product counts against `matched_product_count`. Array-of-scalar `/terms` is valid. |

Access from `af.explorer.describeFields` has two axes:

| Axis    | Controls                                                                         |
| ------- | -------------------------------------------------------------------------------- |
| `read`  | Whether a field can be returned in the response (auto-include or `extraFields`). |
| `query` | Whether a field can be used in `query`, `sort`, or aggregate fields.             |

Access values: `accessible`, `partial`, `upgrade_required`, `coming_soon`, `hidden`. `query: "partial"` means restricted but non-empty; if results look too small, check access before concluding the market is small.

### Time Windows

`custom_meta[]` rows carry the same metric at four different time aggregations. The suffix names the window; pick by user vocabulary:

| Suffix             | What it measures                      | Common name  |
| ------------------ | ------------------------------------- | ------------ |
| `_sum_30_days`     | Total over the last 30 days (monthly) | "last month" |
| `_sum_365_days`    | Total over the last 365 days          | TTM          |
| `_average_30_days` | Daily average over the last 30 days   | "daily avg"  |
| `_monthly_change`  | Percent change vs the prior month     | MoM          |

Each variant exists for both `download_estimates_*` and `revenue_estimates_*` — e.g. `revenue_estimates_sum_365_days` is TTM revenue.

Use `[country=zz]` for the worldwide-rollup row:

`af.explorer.listProducts({ query: ["match","product_id",304004187384], extraFields: ["custom_meta[country=zz].revenue_estimates_sum_365_days"] })`

## 5. Aggregations

An aggregate call has a Product population and measurements:

```json
{
	"query": ["match", "storefronts", "apple:ios"],
	"fields": ["all_rating/stats", "categories.all/terms"]
}
```

Suffixes:

| Suffix            | Use                                                                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/stats`          | Numeric/date min, max, avg, sum, count.                                                                                                               |
| `/terms`          | Top buckets for enums, strings, IDs, booleans, and array-of-scalar fields.                                                                            |
| `/histogram`      | Numeric/date bucket distribution.                                                                                                                     |
| `/date_histogram` | Date-keyed bucket distribution. Set granularity with the `dateHistogramInterval` arg (omit for the API default; coarsen to `year` for fewer buckets). |
| `/cardinality`    | Distinct count for numeric/date/identifier-style fields the action accepts.                                                                           |

Compatibility:

| Field type                | Valid aggregations                                                             |
| ------------------------- | ------------------------------------------------------------------------------ |
| number                    | `stats`, `terms`, `histogram`, `cardinality`                                   |
| date                      | `stats`, `terms`, `histogram`, `date_histogram`, `cardinality`                 |
| string / enum / boolean   | `terms`                                                                        |
| array of scalars          | `terms`                                                                        |
| object / array of objects | Pick a leaf member: `obj.member` or `arr[*].member` / `arr[key=value].member`. |

Interpretation rules:

- Aggregation names are lowercase and case-sensitive.
- `boolean` is not an aggregation. Use `/terms` on boolean fields.
- Match result rows by `field` and `aggregation`, not array position.
- `matched_product_count` is the Product population selected by `query`.
- `stats.count` is the populated subset for that field, not total matched Products.
- Multi-value `terms` buckets can sum above `matched_product_count`.
- `terms.other_count` is count outside returned top buckets; `terms.error_upper_bound` is worst-case bucket undercount from shard merging.
- Category buckets are IDs. Use `af.store.categories` before presenting labels.
- For shares, state the denominator: `matched_product_count` for Product-population share, bucket totals for term share, never `stats.count` as total population.

Units:

- `custom_meta.revenue_estimates_*`: integer dollars, net of platform fees. `$100k` is `100000`.
- `custom_meta.download_estimates_*`: integer downloads.
- `us_price` and app price currency fields: `/1000` units. Divide by 1000 for dollars.
- `all_rating` and `version_rating`: 0-50, stars times 10. Divide by 10 for stars.
- `all_rating_count` and `version_rating_count`: rating counts, not averages.

## 6. Examples

Each example is a question plus the action shape that matters. Reuse the modeling decision, not just the literal fields.

### Which Spotify Products appear in the catalog?

Use name lookup; return storefront coverage and same-app siblings.

`af.explorer.listProducts({ query: ["match","name","spotify"], extraFields: ["developer","storefronts","exact[*].related_id","exact[*].storefronts"], count: 5 })`

### Which apps are available in Japan?

Availability is `countries`, not `custom_meta.country`.

`af.explorer.listProducts({ query: ["match","countries","jp"], count: 10 })`

### Which US iOS apps have at least $100k monthly net revenue?

`storefronts` scopes iOS Products; `nested custom_meta` binds US and revenue to one row.

`af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","custom_meta",["and",["match","custom_meta.country","us"],["match","custom_meta.revenue_estimates_sum_30_days",["number_range",100000,null]]]]], sort: "custom_meta[country=us].revenue_estimates_sum_30_days", order: "desc", count: 10 })`

### Which apps currently use Firebase?

SDKs are `all_sdks` rows; bind SDK ID and active flag in one `nested`.

`af.explorer.listProducts({ query: ["nested","all_sdks",["and",["match","all_sdks.id","firebase"],["match","all_sdks.active",true]]], count: 10 })`

### Which iOS apps have the most US downloads?

Filter and sort by the same US estimate row.

`af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","custom_meta",["and",["match","custom_meta.country","us"],["match","custom_meta.download_estimates_sum_30_days",["number_range",1,null]]]]], sort: "custom_meta[country=us].download_estimates_sum_30_days", order: "desc", count: 10 })`

### What is the rating profile of iOS apps?

Aggregate rating values; divide by 10 before presenting stars.

`af.explorer.aggregateProducts({ query: ["match","storefronts","apple:ios"], fields: ["all_rating/stats"] })`

### Which categories dominate the iOS catalog?

Category buckets are IDs; label them with `af.store.categories`.

`af.explorer.aggregateProducts({ query: ["match","storefronts","apple:ios"], fields: ["categories.all/terms"] })`

### Compare US and Japan average downloads for iOS apps.

One Product population, two country-specific estimate rows.

`af.explorer.aggregateProducts({ query: ["match","storefronts","apple:ios"], fields: ["custom_meta[country=us].download_estimates_average_30_days/stats","custom_meta[country=jp].download_estimates_average_30_days/stats"] })`

### How many distinct developers are in a US iOS revenue tier?

Revenue tier is a nested Product filter; distinct developers is `developer_id/cardinality`.

`af.explorer.aggregateProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","custom_meta",["and",["match","custom_meta.country","us"],["match","custom_meta.revenue_estimates_sum_30_days",["number_range",100000,10000000]]]]], fields: ["developer_id/cardinality"] })`

### How are 2024 iOS launches distributed over time?

Release date selects the launch cohort; `date_histogram` buckets the same field.

`af.explorer.aggregateProducts({ query: ["and",["match","storefronts","apple:ios"],["match","release_date",["range","2024-01-01","2024-12-31"]]], fields: ["release_date/date_histogram"] })`

### Which iOS apps currently use Firebase and also appear in top-10 free US charts?

This is not a plain chart lookup. Use `rank` because chart position is one filter alongside SDK presence. `categories:null` means all chart categories, not "Top overall".

`af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","all_sdks",["and",["match","all_sdks.id","firebase"],["match","all_sdks.active",true]]],["rank","position",["us"],null,["free"],["range",0,0],[1,5,10]]], extraFields: ["developer"], count: 10 })`

### Which apps were built specifically for visionOS?

`is_built_for_visionos` lives on the worldwide `custom_meta` row.

`af.explorer.listProducts({ query: ["nested","custom_meta",["and",["match","custom_meta.country","zz"],["match","custom_meta.is_built_for_visionos",true]]], extraFields: ["developer","release_date","storefronts"], count: 10 })`

### How is monetization split in iOS games?

Games category filter plus multi-value `monetization_strategies/terms`; bucket counts can overlap.

`af.explorer.aggregateProducts({ query: ["and",["match","storefronts","apple:ios"],["match","categories.all",6014]], fields: ["monetization_strategies/terms"] })`

### Which countries produce high-download US iOS publishers?

Publisher country is top-level; US downloads are nested. `developer_country` values are uppercase.

`af.explorer.aggregateProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","custom_meta",["and",["match","custom_meta.country","us"],["match","custom_meta.download_estimates_sum_30_days",["number_range",1000000,null]]]]], fields: ["developer_country/terms"] })`

### Which iOS apps removed Mixpanel?

SDK removal is `all_sdks.active:false`; read the Mixpanel row's removal date.

`af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","all_sdks",["and",["match","all_sdks.id","mixpanel"],["match","all_sdks.active",false]]]], extraFields: ["developer","all_sdks[id=mixpanel].removed_on"], count: 10 })`

### Which attribution SDKs are most present across iOS apps?

One boolean `/terms` aggregation per SDK row. Use this shape when the SDK set is known and you want each one's adoption answered individually.

`af.explorer.aggregateProducts({ query: ["match","storefronts","apple:ios"], fields: ["all_sdks[id=appsflyer].active/terms","all_sdks[id=adjust].active/terms","all_sdks[id=branch].active/terms","all_sdks[id=singular].active/terms"] })`

### Which SDKs are most popular alongside RevenueCat?

Scope to Products that use RevenueCat, then bucket every `all_sdks` row by its SDK ID. Top buckets (excluding the seed) are the co-used set. The `[*].id` form discovers SDKs you didn't name up front.

`af.explorer.aggregateProducts({ query: ["nested","all_sdks",["match","all_sdks.id","revenuecat"]], fields: ["all_sdks[*].id/terms"] })`

### What is the rating, category mix, and developer concentration for a revenue segment?

One population can feed mixed aggregation types.

`af.explorer.aggregateProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","custom_meta",["and",["match","custom_meta.country","us"],["match","custom_meta.revenue_estimates_sum_30_days",["number_range",100000,10000000]]]]], fields: ["all_rating/stats","categories.all/terms","developer_id/cardinality"] })`

### Which 2024 iOS launches already crossed 100k US downloads?

Release date defines the cohort; US downloads still require a nested US estimate row.

`af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["match","release_date",["range","2024-01-01","2024-12-31"]],["nested","custom_meta",["and",["match","custom_meta.country","us"],["match","custom_meta.download_estimates_sum_30_days",["number_range",100000,null]]]]], extraFields: ["developer"], sort: "custom_meta[country=us].download_estimates_sum_30_days", order: "desc", count: 10 })`

### Which iOS apps are growing fastest in the US?

Growth fields are percentages on the country row. Add a download floor so near-zero bases do not dominate.

`af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","custom_meta",["and",["match","custom_meta.country","us"],["match","custom_meta.download_estimates_sum_30_days",["number_range",100000,null]],["match","custom_meta.download_estimates_monthly_change",["number_range",100,null]]]]], extraFields: ["developer","release_date"], sort: "custom_meta[country=us].download_estimates_monthly_change", order: "desc", count: 10 })`

### What share of iOS revenue is concentrated in the top returned Products?

Two-step workflow: aggregate denominator, then top rows for numerator.

`af.explorer.aggregateProducts({ query: ["match","storefronts","apple:ios"], fields: ["custom_meta[country=us].revenue_estimates_sum_30_days/stats"] })`

`af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","custom_meta",["and",["match","custom_meta.country","us"],["match","custom_meta.revenue_estimates_sum_30_days",["number_range",1,null]]]]], extraFields: ["developer"], sort: "custom_meta[country=us].revenue_estimates_sum_30_days", order: "desc", count: 100 })`

Use aggregate `sum` as denominator and returned-row revenue sum as numerator. Say `stats.count` is only Products with populated revenue estimates.

## 7. Gotchas

- Leaving `query` as `[]` when the user implied storefront, country, category, date, SDK, estimate, or rank scope.
- Using `ios` instead of `apple:ios`.
- Using uppercase country codes in catalog query fields. Use `us`, `jp`, `gb`; exception: `developer_country` uses `US`, `JP`, `GB`.
- Treating `countries` as estimate geography, or `custom_meta.country` as availability.
- Filtering nested row fields without `nested`.
- Using bracket field refs in `query`.
- Using dotted array-of-object refs in response columns (`extraFields`, `sort`) or aggregate `fields`.
- Putting `rank` inside `nested`, or writing `["match","rank",...]`.
- Using catalog `rank` for plain top-chart lookup; use `af.store.topCharts`.
- Assuming `raw` Lucene gets field validation or field inference.
- Reporting `stats.count` as total matched Products.
- Reporting rating averages without dividing by 10.
- Multiplying revenue estimates by 100; they are already integer dollars.
- Treating app price fields like revenue fields; prices are `/1000` units.
- Labeling category ID buckets without `af.store.categories`.
- Treating `similar[*]` as same-app siblings; use `exact[*]`.
- Treating partial-access fields as full-market data without checking `af.explorer.describeFields`.
