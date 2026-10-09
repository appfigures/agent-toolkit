import { $ as IntelTier, $t as TrackingSource, A as AppsBreakdownOutput, At as Product, B as AudienceDemographicsOutput, Bt as SortOrder, C as AppleAdsReportInput, Ct as MetricNode, D as AppleAdsTopKeywordsInput, Dt as MetricsQueryInput, E as AppleAdsSearchTermsOutput, Et as MetricsDescribeDatasetsOutput, F as AppsTrackedInput, Ft as ReviewsListOutput, G as ExplorerAggregateProductsInput, Gt as StoreCategoriesInput, H as DocsGetInput, Ht as StoreAppListingOutput, I as AppsTrackedOutput, It as ReviewsReplyInput, J as ExplorerDescribeFieldsOutput, Jt as StoreFeaturedInput, K as ExplorerAggregateProductsOutput, Kt as StoreCategoriesOutput, L as AudienceCrossUsageInput, Lt as ReviewsReplyOutput, M as AppsGetOutput, Mt as ReviewsBreakdownInput, N as AppsSearchInput, Nt as ReviewsBreakdownOutput, O as AppleAdsTopKeywordsOutput, Ot as MetricsQueryOutput, P as AppsSearchOutput, Pt as ReviewsListInput, Q as GroupWildcard, Qt as Tracking, R as AudienceCrossUsageOutput, Rt as SdksListInput, S as AppleAdsOrganizationsOutput, St as MetricGranularity, T as AppleAdsSearchTermsInput, Tt as MetricsDescribeDatasetsInput, U as DocsGetOutput, Ut as StoreAppRanksInput, V as DeviceType, Vt as StoreAppListingInput, W as EstimateBound, Wt as StoreAppRanksOutput, X as ExplorerListProductsOutput, Xt as StoreTopChartsInput, Y as ExplorerListProductsInput, Yt as StoreFeaturedOutput, Z as GroupByDimension, Zt as StoreTopChartsOutput, _ as AppleAdsDisplayStatus, _t as KeywordsTrackedRanksOutput, a as AdapterToolsOptions, at as KeywordsPaidOutput, b as AppleAdsKeywordsOutput, bt as KeywordsUntrackInput, c as ActionErrorCauseType, ct as KeywordsRelatedInput, d as ActionIO, dt as KeywordsSuggestionsOutput, en as UnifiedApp, et as KeywordsAdvertisersInput, f as AppId, ft as KeywordsTrackInput, g as AppleAdsCampaignsOutput, gt as KeywordsTrackedRanksInput, h as AppleAdsCampaignsInput, ht as KeywordsTrackedOutput, i as createAppfiguresActions, it as KeywordsPaidInput, j as AppsGetInput, jt as ProductType, k as AppsBreakdownInput, kt as MonetizationStrategy, l as ExecuteResult, lt as KeywordsRelatedOutput, m as AppleAdsAdGroupsOutput, mt as KeywordsTrackedInput, n as AppfiguresActions, nn as AppfiguresTransport, nt as KeywordsOrganicInput, o as AppfiguresActionsOptions, ot as KeywordsRankingAppsInput, p as AppleAdsAdGroupsInput, pt as KeywordsTrackOutput, q as ExplorerDescribeFieldsInput, qt as StoreCategorySubtype, r as ExecuteArgs, rn as FetchLike, rt as KeywordsOrganicOutput, s as ToolSelector, st as KeywordsRankingAppsOutput, t as ActionDescriptor, tn as APIKey, tt as KeywordsAdvertisersOutput, u as toModelPayload, ut as KeywordsSuggestionsInput, v as AppleAdsKeywordStatus, vt as KeywordsTrackedTrendInput, w as AppleAdsReportOutput, wt as MetricPartition, x as AppleAdsOrganizationsInput, xt as KeywordsUntrackOutput, y as AppleAdsKeywordsInput, yt as KeywordsTrackedTrendOutput, z as AudienceDemographicsInput, zt as SdksListOutput } from "./actions-CMfmwPV6.js";
//#region .gen/stage/clientActions.d.ts
/**
 * Groups the typed client + client-form docs omit — agent-runtime-only affordances.
 *
 * `docs.get` returns a reference playbook (catalog grammar, dataset naming, glossary) as markdown. A
 * *runtime* tool-calling model can't read the package's files, so it needs that as a tool (`docs_get`,
 * kept on the adapters). A typed-client caller — a developer, or a code-writing agent — already has
 * those playbooks as shipped files (`docs/<slug>.md`), so an `af.docs.get()` method would be
 * documentation-as-a-call: a category mismatch with every other method, which returns typed data.
 *
 * One source of truth: this drives the client's runtime attach-loop and its `ClientSurface` type (so
 * the two never disagree — no method that typechecks yet is `undefined` at runtime) and the
 * client-form doc generators. `ActionIO`, the adapter descriptors, and the `docs_get` tool are
 * unaffected — they expose the full surface. A client-form reference to one of these actions renders
 * as its shipped guide file (see `formatClientRef`).
 */
declare const CLIENT_OMITTED_GROUPS: readonly ["docs"];
/** A group in {@link CLIENT_OMITTED_GROUPS}. */
type ClientOmittedGroup = (typeof CLIENT_OMITTED_GROUPS)[number];
//#endregion
//#region .gen/stage/defaultTransport.d.ts
interface DefaultTransportOptions {
  /**
   * Bearer token, or an async getter resolved per request (for refreshing credentials). Omit to send no
   * `Authorization` — e.g. a `baseUrl` pointing at an unauthenticated mock.
   */
  apiKey?: APIKey;
  /** API base URL, prepended to each request path; defaults to production. */
  baseUrl?: string;
  /** Underlying fetch; defaults to the global `fetch`. Swap it for retries, a proxy, timeouts, or logging. */
  fetch?: FetchLike;
}
/**
 * Build the standard Appfigures transport: prepend `baseUrl`, attach the bearer from `apiKey` and the SDK's
 * `User-Agent`, then call `fetch`. Pass the result as the `transport` client option to customize the
 * built-in behavior — e.g. `transport: defaultTransport({ apiKey, fetch: withRetries })`. The bare
 * `apiKey`/`baseUrl` client options are sugar for calling this.
 */
declare function defaultTransport({ apiKey, baseUrl, fetch }?: DefaultTransportOptions): AppfiguresTransport;
//#endregion
//#region .gen/stage/client.d.ts
/**
 * The sole error type thrown by the typed client — including input validation. Detect it with
 * `isAppfiguresActionError` (an `instanceof` check breaks across bundler realms; the guard uses a
 * brand instead).
 */
declare class AppfiguresActionError extends Error {
  /** Brand for cross-realm-safe detection via `isAppfiguresActionError`. */
  readonly __appfiguresActionError: true;
  /** Failure classification — switch on this to recover. */
  readonly causeType: ActionErrorCauseType;
  /** The action that failed, as its dotted path (`apps.get`). */
  readonly action: keyof ActionIO;
  /** Follow-up calls the agent might make instead, rendered in client form (`af.apps.get({ … })`). */
  readonly suggestedActions: string[];
  /** Resolved request-side hints accumulated before the failure. */
  readonly hints: string[];
  constructor(init: {
    causeType: ActionErrorCauseType;
    action: keyof ActionIO;
    message: string;
    suggestedActions?: string[];
    hints?: string[];
    /** The underlying thrown error, set only for `unexpected` failures. */
    cause?: unknown;
  });
}
/** Cross-realm-safe guard — use in a `try/catch` rather than `instanceof`. */
declare function isAppfiguresActionError(value: unknown): value is AppfiguresActionError;
/**
 * Trailing per-call options. `signal` is per-call, never client-wide (a client signal would abort
 * every future call once fired).
 */
interface CallOptions {
  signal?: AbortSignal;
}
type ActionKey = keyof ActionIO & string;
type ClientActionKey = Exclude<ActionKey, `${ClientOmittedGroup}.${string}`>;
type GroupName = ClientActionKey extends `${infer G}.${string}` ? G : never;
/**
 * One typed method. Actions whose input has no required keys make the `input` argument optional, so
 * both `af.apps.tracked()` and `af.apps.tracked({ q: 'fitness' }, { signal })` typecheck.
 */
type ClientMethod<A extends ClientActionKey> = {} extends ActionIO[A]['input'] ? (input?: ActionIO[A]['input'], opts?: CallOptions) => Promise<ActionIO[A]['output']> : (input: ActionIO[A]['input'], opts?: CallOptions) => Promise<ActionIO[A]['output']>;
/**
 * The nested method surface `af.<group>.<action>(input, opts?)`, mapped from the generated actions.
 * Merged onto the class instance below so `new AppfiguresAgentClient()` exposes it fully typed.
 */
type ClientSurface = { [G in GroupName]: { [P in ClientActionKey as P extends `${G}.${infer V}` ? V : never]: ClientMethod<P>; }; };
/** Delivers resolved hints. Defaults to a stderr writer; pass `null` to silence, or a custom sink. */
type HintsCallback = (args: {
  action: keyof ActionIO;
  hints: string[];
}) => void;
interface AppfiguresAgentClientOptions {
  /**
   * Bearer token, or an async getter called on each request (for refreshing/rotating credentials).
   * Falls back to `process.env.APPFIGURES_API_KEY`; construction throws when neither it nor a
   * `transport` supplies auth. Mutually exclusive with `transport`.
   */
  apiKey?: APIKey;
  /**
   * **Replace** the built-in transport with your own client: it gets the bare path and owns auth
   * (the SDK attaches no `Authorization`). Mutually exclusive with `apiKey`. To _customize_ the
   * built-in transport instead — a proxy `baseUrl`, a wrapped `fetch` — pass `transport:
   * defaultTransport({ apiKey, baseUrl, fetch })`. See `AppfiguresTransport`.
   */
  transport?: AppfiguresTransport;
  /** Hint sink: omit for the stderr default, `null` to silence, or a function to route elsewhere. */
  onHints?: HintsCallback | null;
}
interface AppfiguresAgentClient extends ClientSurface {}
/** Typed Appfigures client: `new AppfiguresAgentClient({ apiKey }).apps.get({ appId })`. */
declare class AppfiguresAgentClient {
  constructor(options?: AppfiguresAgentClientOptions);
}
//#endregion
//#region .gen/stage/adapterCore.d.ts
/**
 * The per-call dispatch every framework adapter shares, before it renders the result in its own shape.
 * Runs the call through the host's `execute` hook if provided (handing it the adapter's `payload`), else the
 * surface's own `execute`.
 *
 * The result is already safe to render: `execute()` sanitizes a bug (logs the raw error via the surface's
 * `onUnexpectedError`, returns `internal error in <tool>`), so there's nothing to fold in here — map it with
 * {@link toModelPayload}. Everything downstream (object vs. string vs. tool-message, and whether a failure
 * returns or throws) is framework-specific, so it stays in each adapter.
 */
declare function resolveToolCall<TPayload>({ actions, options, descriptor, input, payload, signal }: {
  actions: AppfiguresActions;
  options: AdapterToolsOptions<TPayload>;
  descriptor: ActionDescriptor;
  input: unknown;
  payload: TPayload;
  signal?: AbortSignal;
}): Promise<ExecuteResult>;
//#endregion
export { type APIKey, type ActionDescriptor, type ActionErrorCauseType, type ActionIO, type AdapterToolsOptions, type AppId, AppfiguresActionError, type AppfiguresActions, type AppfiguresActionsOptions, AppfiguresAgentClient, AppfiguresAgentClientOptions, type AppfiguresTransport, type AppleAdsAdGroupsInput, type AppleAdsAdGroupsOutput, type AppleAdsCampaignsInput, type AppleAdsCampaignsOutput, type AppleAdsDisplayStatus, type AppleAdsKeywordStatus, type AppleAdsKeywordsInput, type AppleAdsKeywordsOutput, type AppleAdsOrganizationsInput, type AppleAdsOrganizationsOutput, type AppleAdsReportInput, type AppleAdsReportOutput, type AppleAdsSearchTermsInput, type AppleAdsSearchTermsOutput, type AppleAdsTopKeywordsInput, type AppleAdsTopKeywordsOutput, type AppsBreakdownInput, type AppsBreakdownOutput, type AppsGetInput, type AppsGetOutput, type AppsSearchInput, type AppsSearchOutput, type AppsTrackedInput, type AppsTrackedOutput, type AudienceCrossUsageInput, type AudienceCrossUsageOutput, type AudienceDemographicsInput, type AudienceDemographicsOutput, CallOptions, type DefaultTransportOptions, type DeviceType, type DocsGetInput, type DocsGetOutput, type EstimateBound, type ExecuteArgs, type ExecuteResult, type ExplorerAggregateProductsInput, type ExplorerAggregateProductsOutput, type ExplorerDescribeFieldsInput, type ExplorerDescribeFieldsOutput, type ExplorerListProductsInput, type ExplorerListProductsOutput, type FetchLike, type GroupByDimension, type GroupWildcard, HintsCallback, type IntelTier, type KeywordsAdvertisersInput, type KeywordsAdvertisersOutput, type KeywordsOrganicInput, type KeywordsOrganicOutput, type KeywordsPaidInput, type KeywordsPaidOutput, type KeywordsRankingAppsInput, type KeywordsRankingAppsOutput, type KeywordsRelatedInput, type KeywordsRelatedOutput, type KeywordsSuggestionsInput, type KeywordsSuggestionsOutput, type KeywordsTrackInput, type KeywordsTrackOutput, type KeywordsTrackedInput, type KeywordsTrackedOutput, type KeywordsTrackedRanksInput, type KeywordsTrackedRanksOutput, type KeywordsTrackedTrendInput, type KeywordsTrackedTrendOutput, type KeywordsUntrackInput, type KeywordsUntrackOutput, type MetricGranularity, type MetricNode, type MetricPartition, type MetricsDescribeDatasetsInput, type MetricsDescribeDatasetsOutput, type MetricsQueryInput, type MetricsQueryOutput, type MonetizationStrategy, type Product, type ProductType, type ReviewsBreakdownInput, type ReviewsBreakdownOutput, type ReviewsListInput, type ReviewsListOutput, type ReviewsReplyInput, type ReviewsReplyOutput, type SdksListInput, type SdksListOutput, type SortOrder, type StoreAppListingInput, type StoreAppListingOutput, type StoreAppRanksInput, type StoreAppRanksOutput, type StoreCategoriesInput, type StoreCategoriesOutput, type StoreCategorySubtype, type StoreFeaturedInput, type StoreFeaturedOutput, type StoreTopChartsInput, type StoreTopChartsOutput, type ToolSelector, type Tracking, type TrackingSource, type UnifiedApp, createAppfiguresActions, defaultTransport, isAppfiguresActionError, resolveToolCall, toModelPayload };