# `af.metrics.query` — dataset guide

Naming conventions, examples, and pitfalls for the numeric datasets `af.metrics.query` accepts.

For the dataset list itself — every name, its value type, and whether it's private data — use `af.metrics.describeDatasets`. The query parameters are documented on `af.metrics.query` itself.

## Dataset naming conventions

Dataset names encode whether IAP and subscription activity is folded in:

- `*.combined_*` (e.g. `sales.combined_downloads`, `sales.combined_revenue`, `revenue.combined_revenue`) — parent-app totals with IAP and subscription activity folded in. Use these when you want the app's overall number.
- `*.app_*` (e.g. `sales.app_downloads`, `revenue.app_revenue`) — app-only; IAPs and subscriptions excluded.
- `*.inapp_*` / `*.subscription_*` (e.g. `sales.inapp_purchases`, `subscriptions.gross_revenue`) — SKU-level data for the IAP or subscription itself, not the parent app.

Pick the prefix that matches the question. Querying a `combined_*` dataset against a specific IAP or subscription product ID returns 0 because those datasets are scoped to parent apps — pass `sales.inapp_purchases` (or the relevant `subscriptions.*` dataset) and the SKU's product ID instead.

## Examples

Weekly downloads for an app over the last 90 days:

    dataset:     sales.combined_downloads
    groupBy:    date
    granularity: weekly
    start:       (today minus 90 days)

Downloads broken down by country:

    dataset:  sales.combined_downloads
    groupBy: country

Revenue vs. downloads side by side (two separate calls — `af.metrics.query` returns one dataset per call):

    dataset: sales.combined_downloads
    dataset: revenue.combined_revenue

Estimated downloads for a competitor app:

    dataset: estimates.sales

Active subscriptions over time, grouped by date and product:

    dataset:     subscriptions.active_subscriptions
    groupBy:    date, product
    granularity: monthly

## Pitfalls

- **App availability.** Available only for apps you own or that were shared with you: `sales.*`, `revenue.*`, `subscriptions.*`, `usage.*`, `ads.*`, `adspend.*`. Available for any app, subject to your plan features: `estimates.*`, `ratings.*`, `reviews.*`.
- **`granularity` defaults to daily when grouping by date.** Pass `granularity` explicitly (`weekly`, `monthly`, `quarterly`, `yearly`) to change the bucket size.
- **Data lags 1-2 days.** Some datasets lag 1 day; `estimates.*` lags 2 days on Google Play. A query whose `end` resolves to today (including the default 30-day range) will return an incomplete or missing final datapoint — pass an earlier `end` for a fully settled series.
- **Missing estimates are `null`.** `estimates.*` returns `null` when there's no estimate, and breakdowns leave those apps out.
