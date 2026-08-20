import { $ as GroupWildcard, $t as Tracking, A as AppleAdsTopKeywordsInput, At as MonetizationStrategy, B as AudienceDemographicsInput, Bt as SdksListOutput, C as AppleAdsKeywordsOutput, Ct as MetricGranularity, D as AppleAdsReportOutput, Dt as MetricsDescribeDatasetsOutput, E as AppleAdsReportInput, Et as MetricsDescribeDatasetsInput, F as AppsSearchOutput, Ft as ReviewsListInput, G as EstimateBound, Gt as StoreAppRanksOutput, H as DeviceType, Ht as StoreAppListingInput, I as AppsTrackedInput, It as ReviewsListOutput, J as ExplorerDescribeFieldsInput, Jt as StoreCategorySubtype, K as ExplorerAggregateProductsInput, Kt as StoreCategoriesInput, L as AppsTrackedOutput, Lt as ReviewsReplyInput, M as AppsGetInput, Mt as ProductType, N as AppsGetOutput, Nt as ReviewsBreakdownInput, O as AppleAdsSearchTermsInput, Ot as MetricsQueryInput, P as AppsSearchInput, Pt as ReviewsBreakdownOutput, Q as GroupByDimension, Qt as StoreTopChartsOutput, R as AudienceCrossUsageInput, Rt as ReviewsReplyOutput, S as AppleAdsKeywordsInput, St as KeywordsUntrackOutput, T as AppleAdsOrganizationsOutput, Tt as MetricPartition, U as DocsGetInput, Ut as StoreAppListingOutput, V as AudienceDemographicsOutput, Vt as SortOrder, W as DocsGetOutput, Wt as StoreAppRanksInput, X as ExplorerListProductsInput, Xt as StoreFeaturedOutput, Y as ExplorerDescribeFieldsOutput, Yt as StoreFeaturedInput, Z as ExplorerListProductsOutput, Zt as StoreTopChartsInput, _ as AppleAdsAdGroupsOutput, _t as KeywordsTrackedRanksInput, a as AdapterToolsOptions, at as KeywordsPaidInput, b as AppleAdsDisplayStatus, bt as KeywordsTrackedTrendOutput, c as ActionErrorCauseType, ct as KeywordsRankingAppsOutput, d as APIKey, dt as KeywordsSuggestionsInput, en as TrackingSource, et as IntelTier, f as AppfiguresTransport, ft as KeywordsSuggestionsOutput, g as AppleAdsAdGroupsInput, gt as KeywordsTrackedOutput, h as AppId, ht as KeywordsTrackedInput, i as createAppfiguresActions, it as KeywordsOrganicOutput, j as AppleAdsTopKeywordsOutput, jt as Product, k as AppleAdsSearchTermsOutput, kt as MetricsQueryOutput, l as ExecuteResult, lt as KeywordsRelatedInput, m as ActionIO, mt as KeywordsTrackOutput, n as AppfiguresActions, nt as KeywordsAdvertisersOutput, o as AppfiguresActionsOptions, ot as KeywordsPaidOutput, p as FetchLike, pt as KeywordsTrackInput, q as ExplorerAggregateProductsOutput, qt as StoreCategoriesOutput, r as ExecuteArgs, rt as KeywordsOrganicInput, s as ToolSelector, st as KeywordsRankingAppsInput, t as ActionDescriptor, tn as UnifiedApp, tt as KeywordsAdvertisersInput, u as toModelPayload, ut as KeywordsRelatedOutput, v as AppleAdsCampaignsInput, vt as KeywordsTrackedRanksOutput, w as AppleAdsOrganizationsInput, wt as MetricNode, x as AppleAdsKeywordStatus, xt as KeywordsUntrackInput, y as AppleAdsCampaignsOutput, yt as KeywordsTrackedTrendInput, z as AudienceCrossUsageOutput, zt as SdksListInput } from "./actions-CfzBB74Z.js";
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
export { type APIKey, type ActionDescriptor, type ActionErrorCauseType, type ActionIO, type AdapterToolsOptions, type AppId, AppfiguresActionError, type AppfiguresActions, type AppfiguresActionsOptions, AppfiguresAgentClient, AppfiguresAgentClientOptions, type AppfiguresTransport, type AppleAdsAdGroupsInput, type AppleAdsAdGroupsOutput, type AppleAdsCampaignsInput, type AppleAdsCampaignsOutput, type AppleAdsDisplayStatus, type AppleAdsKeywordStatus, type AppleAdsKeywordsInput, type AppleAdsKeywordsOutput, type AppleAdsOrganizationsInput, type AppleAdsOrganizationsOutput, type AppleAdsReportInput, type AppleAdsReportOutput, type AppleAdsSearchTermsInput, type AppleAdsSearchTermsOutput, type AppleAdsTopKeywordsInput, type AppleAdsTopKeywordsOutput, type AppsGetInput, type AppsGetOutput, type AppsSearchInput, type AppsSearchOutput, type AppsTrackedInput, type AppsTrackedOutput, type AudienceCrossUsageInput, type AudienceCrossUsageOutput, type AudienceDemographicsInput, type AudienceDemographicsOutput, CallOptions, type DefaultTransportOptions, type DeviceType, type DocsGetInput, type DocsGetOutput, type EstimateBound, type ExecuteArgs, type ExecuteResult, type ExplorerAggregateProductsInput, type ExplorerAggregateProductsOutput, type ExplorerDescribeFieldsInput, type ExplorerDescribeFieldsOutput, type ExplorerListProductsInput, type ExplorerListProductsOutput, type FetchLike, type GroupByDimension, type GroupWildcard, HintsCallback, type IntelTier, type KeywordsAdvertisersInput, type KeywordsAdvertisersOutput, type KeywordsOrganicInput, type KeywordsOrganicOutput, type KeywordsPaidInput, type KeywordsPaidOutput, type KeywordsRankingAppsInput, type KeywordsRankingAppsOutput, type KeywordsRelatedInput, type KeywordsRelatedOutput, type KeywordsSuggestionsInput, type KeywordsSuggestionsOutput, type KeywordsTrackInput, type KeywordsTrackOutput, type KeywordsTrackedInput, type KeywordsTrackedOutput, type KeywordsTrackedRanksInput, type KeywordsTrackedRanksOutput, type KeywordsTrackedTrendInput, type KeywordsTrackedTrendOutput, type KeywordsUntrackInput, type KeywordsUntrackOutput, type MetricGranularity, type MetricNode, type MetricPartition, type MetricsDescribeDatasetsInput, type MetricsDescribeDatasetsOutput, type MetricsQueryInput, type MetricsQueryOutput, type MonetizationStrategy, type Product, type ProductType, type ReviewsBreakdownInput, type ReviewsBreakdownOutput, type ReviewsListInput, type ReviewsListOutput, type ReviewsReplyInput, type ReviewsReplyOutput, type SdksListInput, type SdksListOutput, type SortOrder, type StoreAppListingInput, type StoreAppListingOutput, type StoreAppRanksInput, type StoreAppRanksOutput, type StoreCategoriesInput, type StoreCategoriesOutput, type StoreCategorySubtype, type StoreFeaturedInput, type StoreFeaturedOutput, type StoreTopChartsInput, type StoreTopChartsOutput, type ToolSelector, type Tracking, type TrackingSource, type UnifiedApp, createAppfiguresActions, defaultTransport, isAppfiguresActionError, resolveToolCall, toModelPayload };