import { z } from "zod";
//#region .gen/stage/apiClientOptions.d.ts
/** A literal bearer token, or an async getter resolved per request (for refreshing credentials). */
type APIKey = string | (() => Promise<string>);
/**
 * A fetch implementation — the same shape as the global `fetch`, so the global (and any
 * `(url, init) => Promise<Response>`) satisfies it. It's `defaultTransport`'s underlying `fetch` and the
 * shape of an {@link AppfiguresTransport}'s `fetch` method.
 */
type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;
/**
 * The transport seam the toolkit calls to perform each request — from both the typed client and the tool
 * adapters. Any object with a matching `fetch` method is an `AppfiguresTransport`, so you can hand it your API
 * client directly (`transport: myClient`). Build the standard one with `defaultTransport`, or supply your own
 * to own the URL + auth.
 */
interface AppfiguresTransport {
  /** Perform one request: a path (or absolute URL) + `RequestInit` → `Response`. */
  fetch(input: string, init?: RequestInit): Promise<Response>;
}
//#endregion
//#region .gen/stage/publicTypes.d.ts
type AppId = number | string;
type AppleAdsDisplayStatus = 'running' | 'on_hold' | 'paused' | 'deleted';
type AppleAdsKeywordStatus = 'active' | 'paused' | 'deleted';
type DeviceType = 'watch' | 'handheld' | 'tablet' | 'tv' | 'desktop' | 'headset';
type EstimateBound = 'at_most' | 'at_least';
type GroupByDimension = 'date' | 'product' | 'unifiedApp' | 'country' | 'storefront' | 'network' | 'device';
type IntelTier = 'basic' | 'premium';
type MetricGranularity = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
interface MetricNode {
  /** The metric value for this slice. Null when the slice has no data. */
  value: number | null;
  /** Calendar date (YYYY-MM-DD) of this slice, on a date-grouped node. */
  date?: string;
  /** Numeric product ID of this slice, on a product-grouped node. */
  product_id?: number;
  /** Unified app ID of this slice, on a unified-app-grouped node. */
  unified_app_id?: string;
  /** ISO country code of this slice, on a country-grouped node. */
  country?: string;
  /** Storefront (e.g. apple:ios) of this slice, on a storefront-grouped node. */
  storefront?: string;
  /** Ad network (e.g. admob) of this slice, on a network-grouped node. */
  network?: string;
  /**
   * Device type (e.g. handheld, tablet) of this slice, on a device-grouped node. `unknown` covers
   * rows whose store reports no device.
   */
  device?: string;
  partition?: MetricPartition;
}
interface MetricPartition {
  dimension: GroupByDimension;
  nodes: MetricNode[];
}
type MonetizationStrategy = 'paid' | 'inapps' | 'ads' | 'subscriptions';
interface Product {
  type: 'product';
  /** A number representing a product on a single store */
  product_id: number;
  name: string;
  app_profile_url: string;
  /**
   * Mix of stores and networks (ad networks, analytics SDKs) connected to this product, sorted with
   * the canonical store first.
   */
  storefronts: string[];
  /** Whether the app is currently sold on its store. False once delisted or removed. */
  active_in_store: boolean;
  /** The store's primary key for this app */
  vendor_identifier: string;
  developer?: string;
  version?: string | null;
  /** Product type (e.g. app, bundle, inapp, subscription, or another type the platform reports). */
  product_type?: string;
  /** Apple bundle identifier (com.example.app). Apple stores only. */
  bundle_identifier?: string;
  release_date: string;
  updated_date: string | null;
  device_types: string[];
  us_price: number | null;
  categories?: Array<{
    id: number;
    name: string;
    main: boolean;
  }>;
  /**
   * How this product makes money on its store. Absent when the record comes from a source that
   * doesn't carry it, which doesn't mean the product is free.
   */
  monetization_strategies?: MonetizationStrategy[];
  /** Unified app identifier */
  parent_unified_app_id?: string;
  tracking?: Tracking;
  store_url: string | null;
}
type ProductType = 'app' | 'bundle' | 'inapp' | 'subscription';
type SortOrder = 'asc' | 'desc';
type StoreCategorySubtype = 'free' | 'paid' | 'topgrossing';
interface Tracking {
  /** ISO timestamp of when the user started tracking this product. */
  tracked_since: string;
  /**
   * Whether the caller is currently collecting data for this product. False means the user paused
   * tracking. Historical data remains, but no new data flows in.
   */
  tracking_active: boolean;
  /** Whether the user has soft-deleted this product from their tracked list. */
  hidden: boolean;
  source: TrackingSource;
  /**
   * Configured competitor tier for `manual` rows; `null` for `own` and `shared`. Independent of
   * `allowed_data_types`, which reflects what the account's plan currently grants.
   */
  intel_tier: IntelTier | null;
  allowed_data_types: Array<'private' | 'basic' | 'premium'>;
}
type TrackingSource = 'own' | 'shared' | 'manual';
interface UnifiedApp {
  type: 'unified-app';
  /** Unified app identifier */
  unified_app_id: string;
  name: string;
  publisher: string;
  publisher_id: number;
  /**
   * Whether the unified app is currently sold on any of its stores. False once every member product
   * is delisted.
   */
  active_in_store: boolean;
  storefronts: string[];
  app_profile_url: string;
  member_products: Product[];
  metadata?: {
    release_date: string | null;
    updated_date: string | null;
    categories: Array<{
      id: string;
      name: string;
      main: boolean;
    }>;
    monetization_strategies?: MonetizationStrategy[];
    us_price?: number;
  };
}
/**
 * List Apple Ads ad groups with each one's default bid, CPA cap, pricing model, and schedule.
 *
 * Scope to one campaign from af.appleAds.campaigns. Its bid keywords live in af.appleAds.keywords.
 *
 * @example
 * 	List all your ad groups across every campaign.
 * 	af.appleAds.adGroups
 *
 * @example
 * 	List the ad groups in one campaign.
 * 	af.appleAds.adGroups({ campaignId: "aac_W9YthU" })
 */
interface AppleAdsAdGroupsInput {
  /** Scope to ad groups in one campaign. */
  campaignId?: string;
  /** Filter to ad groups in one status. Omit to include all statuses. */
  displayStatus?: AppleAdsDisplayStatus;
  /** Filter to ad groups whose name contains this substring. */
  name?: string;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type AppleAdsAdGroupsOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    ad_group_id: string;
    campaign_id: string;
    name: string;
    display_status: AppleAdsDisplayStatus;
    default_bid: number | null;
    cpa_cap: number | null;
    currency: string | null;
    pricing_model: 'cpc' | 'cpm';
    start_date: string | null;
    end_date: string | null;
  }>;
};
/**
 * List your Apple Ads campaigns with each one's status, budget, targeted countries, and schedule.
 *
 * Each row's `product_id` is the advertised app. Resolve its name with af.apps.get.
 *
 * @example
 * 	List all your Apple Ads campaigns.
 * 	af.appleAds.campaigns
 *
 * @example
 * 	List only your running campaigns.
 * 	af.appleAds.campaigns({ displayStatus: "running" })
 *
 * @example
 * 	Search your campaigns by name.
 * 	af.appleAds.campaigns({ name: "Brand" })
 *
 * @example
 * 	List campaigns targeting the US or UK.
 * 	af.appleAds.campaigns({ countries: ["US","GB"] })
 */
interface AppleAdsCampaignsInput {
  /** Filter to campaigns in one status. Omit to include all statuses. */
  displayStatus?: AppleAdsDisplayStatus;
  /** Filter to campaigns whose name contains this text. */
  name?: string;
  /** Filter to campaigns targeting any of these countries. */
  countries?: string[];
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type AppleAdsCampaignsOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    campaign_id: string;
    name: string;
    product_id: number;
    organization_id: string;
    display_status: AppleAdsDisplayStatus;
    countries: string[];
    monthly_budget: number | null;
    daily_budget: number | null;
    target_cpa: number | null;
    currency: string | null;
    start_date: string | null;
    end_date: string | null;
    days_left: number | null;
  }>;
};
/**
 * List a campaign's bid keywords with each keyword's performance (impressions, taps, installs,
 * spend, cost-per-install) over a date range, plus its match type, bid, and whether it's a
 * targeting or negative term.
 *
 * Get campaign IDs from af.appleAds.campaigns and ad groups from af.appleAds.adGroups. Omitting the
 * range covers the last 30 days.
 *
 * @example
 * 	Find a running campaign, then list its bid keywords.
 * 	af.appleAds.campaigns({ displayStatus: "running" })
 * 	af.appleAds.keywords({ campaignId: "aac_W9YthU" })
 *
 * @example
 * 	See how a campaign's keywords performed over July 2026.
 * 	af.appleAds.keywords({ campaignId: "aac_W9YthU", start: "2026-07-01", end: "2026-07-31" })
 *
 * @example
 * 	Find a campaign's highest-spending keywords.
 * 	af.appleAds.keywords({ campaignId: "aac_W9YthU", sort: "spend" })
 */
interface AppleAdsKeywordsInput {
  /** Campaign whose bid keywords to list. */
  campaignId: string;
  /** Filter to keywords in one ad group. */
  adGroupId?: string;
  /** Filter to keywords in one status. Omit to include all statuses. */
  status?: AppleAdsKeywordStatus;
  /** Filter to one match type. Omit to include both. */
  matchType?: 'broad' | 'exact';
  /** Filter to keywords whose text contains this substring. */
  name?: string;
  /** Order keywords by a performance metric or the bid. Omit for newest first. */
  sort?: 'spend' | 'impressions' | 'taps' | 'installs' | 'cpa' | 'cvr' | 'bid_amount';
  order?: SortOrder;
  /** Start date (YYYY-MM-DD) */
  start?: string;
  /** End date (YYYY-MM-DD, defaults to today) */
  end?: string;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type AppleAdsKeywordsOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
    performance_date_range: [string, string];
  };
  results: Array<{
    ad_keyword_id: string;
    keyword_term: string;
    kind: 'targeting' | 'negative';
    match_type: 'broad' | 'exact';
    status: AppleAdsKeywordStatus;
    bid_amount: number | null;
    currency: string | null;
    ad_group_id: string;
    campaign_id: string;
    performance: {
      impressions: number;
      taps: number;
      installs: number;
      new_installs: number | null;
      spend: number;
      currency: string | null;
      ttr: number | null;
      cvr: number | null;
      cpa: number | null;
      avg_cpi: number | null;
      avg_cpt: number | null;
      avg_daily_spend: number | null;
    } | null;
  }>;
};
/**
 * List the Apple Ads organizations you manage campaigns in, with each one's currency and timezone.
 *
 * The `organization_id` on each row is what af.appleAds.campaigns rows reference.
 *
 * @example
 * 	List all the Apple Ads organizations you manage.
 * 	af.appleAds.organizations
 */
interface AppleAdsOrganizationsInput {
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type AppleAdsOrganizationsOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    organization_id: string;
    name: string;
    currency: string | null;
    time_zone: string | null;
    payment_model: string | null;
    role_names: string[] | null;
  }>;
};
/**
 * Report Apple Ads performance per campaign (impressions, taps, installs, spend, cost-per-install),
 * plus an account-wide total, over a date range.
 *
 * Resolve campaign names and the advertised app from af.appleAds.campaigns. For one campaign's
 * top-performing keywords, use af.appleAds.topKeywords. Omitting the range reports the last 30
 * days.
 *
 * @example
 * 	See how much an install costs across all your campaigns.
 * 	af.appleAds.report
 *
 * @example
 * 	Report on July 2026 performance.
 * 	af.appleAds.report({ start: "2026-07-01", end: "2026-07-31" })
 *
 * @example
 * 	List campaigns, then report on specific ones.
 * 	af.appleAds.campaigns
 * 	af.appleAds.report({ campaignIds: ["aac_uDGL4v"] })
 */
interface AppleAdsReportInput {
  /** Limit the report to specific campaigns. */
  campaignIds?: string[];
  /** Start date (YYYY-MM-DD) */
  start?: string;
  /** End date (YYYY-MM-DD, defaults to today) */
  end?: string;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type AppleAdsReportOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
    performance_date_range: [string, string];
    totals: {
      impressions: number;
      taps: number;
      installs: number;
      new_installs: number | null;
      spend: number;
      currency: string | null;
      ttr: number | null;
      cvr: number | null;
      cpa: number | null;
      avg_cpi: number | null;
      avg_cpt: number | null;
      avg_daily_spend: number | null;
    };
  };
  results: Array<{
    campaign_id: string;
    performance: {
      impressions: number;
      taps: number;
      installs: number;
      new_installs: number | null;
      spend: number;
      currency: string | null;
      ttr: number | null;
      cvr: number | null;
      cpa: number | null;
      avg_cpi: number | null;
      avg_cpt: number | null;
      avg_daily_spend: number | null;
    };
  }>;
};
/**
 * List the actual user search terms that triggered a campaign's ads, each with its all-time
 * performance (impressions, taps, installs, spend, cost-per-install). Use these to discover new
 * keywords to bid on or exclude.
 *
 * Get campaign IDs from af.appleAds.campaigns.
 *
 * @example
 * 	Find a campaign, then see the user searches that triggered its ads.
 * 	af.appleAds.campaigns
 * 	af.appleAds.searchTerms({ campaignId: "aac_uDGL4v" })
 */
interface AppleAdsSearchTermsInput {
  /** Campaign whose search terms to list. */
  campaignId: string;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type AppleAdsSearchTermsOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    search_term_id: string;
    keyword_term: string;
    match_type: 'broad' | 'auto';
    ad_keyword_id: string | null;
    ad_group_id: string;
    campaign_id: string;
    performance: {
      impressions: number;
      taps: number;
      installs: number;
      new_installs: number | null;
      spend: number;
      currency: string | null;
      ttr: number | null;
      cvr: number | null;
      cpa: number | null;
      avg_cpi: number | null;
      avg_cpt: number | null;
      avg_daily_spend: number | null;
    } | null;
  }>;
};
/**
 * Rank a campaign's top-performing keywords by conversion rate, spend, and installs over a date
 * range. Each list holds the top keywords on one metric.
 *
 * Get campaign IDs from af.appleAds.campaigns. For metrics across all campaigns, use
 * af.appleAds.report. Omitting the range covers the last 30 days.
 *
 * @example
 * 	Find a campaign, then see its top-performing keywords.
 * 	af.appleAds.campaigns
 * 	af.appleAds.topKeywords({ campaignId: "aac_uDGL4v" })
 *
 * @example
 * 	Rank a campaign's keywords for a specific week.
 * 	af.appleAds.topKeywords({ campaignId: "aac_uDGL4v", start: "2026-07-25", end: "2026-07-31" })
 *
 * @example
 * 	Widen each ranking to the maximum of 10 keywords.
 * 	af.appleAds.topKeywords({ campaignId: "aac_uDGL4v", top: 10 })
 */
interface AppleAdsTopKeywordsInput {
  /** Campaign to rank keywords for. */
  campaignId: string;
  /** How many keywords to return per ranking (max 10). */
  top?: number;
  /** Start date (YYYY-MM-DD) */
  start?: string;
  /** End date (YYYY-MM-DD, defaults to today) */
  end?: string;
}
type AppleAdsTopKeywordsOutput = {
  campaign_id: string;
  top_by_installs: Array<{
    ad_keyword_id: string | null;
    keyword_term: string | null;
    value: number | null;
  }>;
  top_by_conversion_rate: Array<{
    ad_keyword_id: string | null;
    keyword_term: string | null;
    value: number | null;
  }>;
  top_by_spend: Array<{
    ad_keyword_id: string | null;
    keyword_term: string | null;
    value: number | null;
  }>;
};
/**
 * Count your tracked apps by data group (e.g. sales, usage, ranks, reviews, keywords), storefront,
 * monetization model, and source (yours vs tracked competitors), plus the total and earliest
 * release date.
 *
 * For the figures behind a data group use af.metrics.query; to list the apps use af.apps.tracked.
 *
 * @example
 * 	Check what data the whole account has.
 * 	af.apps.breakdown
 *
 * @example
 * 	Limit to apps you own or that were shared with you.
 * 	af.apps.breakdown({ filterAppsBySource: ["own","shared"] })
 *
 * @example
 * 	Limit to your iOS apps.
 * 	af.apps.breakdown({ filterAppsByStorefront: ["apple:ios"] })
 */
interface AppsBreakdownInput {
  /**
   * Only include data about specific apps, by product ID or unified app ID. Takes precedence over the
   * other `filterAppsBy*` keys when set. Storefront, source, or type filters are better for app sets
   * that can be described by those criteria.
   */
  filterAppsById?: AppId[];
  /** Narrow the account's tracked apps to those on these storefronts (e.g. apple:ios, google_play). */
  filterAppsByStorefront?: string[];
  /** Narrow the account's tracked apps by tracking relationship. */
  filterAppsBySource?: TrackingSource[];
  /** Narrow the account's tracked apps to products of these types. */
  filterAppsByType?: ProductType[];
}
type AppsBreakdownOutput = {
  /**
   * Total tracked apps. The by_* maps overlap (an app spans several keys), so they need not sum to
   * this; absent keys mean zero.
   */
  total_apps: number;
  /** Apps per storefront (app stores, ad networks, and analytics SDKs). */
  by_storefront: Record<string, number | undefined>;
  /** Apps per data group. */
  by_data_group: Record<string, number | undefined>;
  /** Apps per monetization model. */
  by_monetization: Record<string, number | undefined>;
  /** Apps per source: own (your linked-account apps), manual (tracked competitors), shared. */
  by_source: Record<string, number | undefined>;
  /** Distinct storefronts per type (app store, ad network, analytics), not app counts. */
  storefront_types: Record<string, number | undefined>;
  /** Earliest release date (YYYY-MM-DD), or null when empty. */
  earliest_release_date: string | null;
};
/**
 * Get an app's record: basic metadata (name, developer, etc) and, if the user tracks it, what data
 * they can access. Pass a product ID for one storefront; unified app ID for all storefronts
 * together.
 *
 * The app's full store listing (description, screenshots, etc.) is available through
 * af.store.appListing.
 *
 * @example
 * 	Get Minecraft's unified-app record (iOS + Google Play by default).
 * 	af.apps.get({ appId: "ua_X7iNgb" })
 *
 * @example
 * 	Get Minecraft's Google Play product record.
 * 	af.apps.get({ appId: 6938219 })
 */
interface AppsGetInput {
  /** The app's unified app ID or product ID. */
  appId: AppId;
  /**
   * For a unified app ID: include member products across all storefronts (Amazon, Steam, Windows,
   * Roku, etc.). When false, `member_products` is restricted to storefronts with app-intelligence
   * coverage (iOS + Google Play). Ignored for product IDs.
   */
  allStores?: boolean;
}
type AppsGetOutput = Product | UnifiedApp;
/**
 * Find apps by name or publisher. Returns one row per unified app. Default returns Apple and Google
 * listings; pass allStores to include other storefronts. To filter apps by estimate values (e.g.
 * apps with >100k downloads last month) use af.explorer.listProducts. For estimates broken down by
 * time, country, or storefront, use af.metrics.query with datasets estimates.sales or
 * estimates.revenue.
 *
 * @example
 * 	Find every Electronic Arts app.
 * 	af.apps.search({ q: "electronic arts" })
 *
 * @example
 * 	Page through long results.
 * 	af.apps.search({ q: "electronic arts", count: 25, page: 2 })
 *
 * @example
 * 	Find Minecraft on every storefront (e.g. Amazon, Steam, Windows, Roku; not common).
 * 	af.apps.search({ q: "minecraft", allStores: true })
 */
interface AppsSearchInput {
  /** Search query (app name or publisher). */
  q: string;
  /**
   * Include storefronts beyond Apple and Google: Amazon, Windows, Steam, Roku, LG TV, Samsung TV, and
   * others.
   */
  allStores?: boolean;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type AppsSearchOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    /** Unified app identifier */
    unified_app_id: string;
    name: string;
    publisher: string;
    /**
     * Whether the unified app is currently sold on any of its stores. False once every member product
     * is delisted.
     */
    active_in_store: boolean;
    storefronts: string[];
    member_product_ids: number[];
    /** Worldwide download estimate for the previous calendar month. */
    downloads_last_month?: number;
    downloads_last_month_bound?: EstimateBound;
    /** Worldwide revenue estimate in USD for the previous calendar month. */
    revenue_last_month_usd?: number;
    revenue_last_month_usd_bound?: EstimateBound;
  }>;
};
/**
 * List the apps your Appfigures account tracks.
 *
 * @example
 * 	List your apps with private-data access.
 * 	af.apps.tracked({ filterAppsBySource: ["own","shared"] })
 *
 * @example
 * 	List your tracked fitness apps.
 * 	af.apps.tracked({ q: "fitness" })
 *
 * @example
 * 	List just your iOS apps.
 * 	af.apps.tracked({ filterAppsByStorefront: ["apple:ios"] })
 *
 * @example
 * 	Page through long results.
 * 	af.apps.tracked({ filterAppsBySource: ["own","shared"], count: 50, page: 2 })
 *
 * @example
 * 	List tracked competitors.
 * 	af.apps.tracked({ filterAppsBySource: ["manual"] })
 *
 * @example
 * 	Find individual IAPs or subscriptions (not common).
 * 	af.apps.tracked({ filterAppsByType: ["inapp","subscription"] })
 */
interface AppsTrackedInput {
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
  /** App name to filter by. */
  q?: string;
  /**
   * Only include data about specific apps, by product ID or unified app ID. Takes precedence over the
   * other `filterAppsBy*` keys when set. Storefront, source, or type filters are better for app sets
   * that can be described by those criteria.
   */
  filterAppsById?: AppId[];
  /** Narrow the account's tracked apps to those on these storefronts (e.g. apple:ios, google_play). */
  filterAppsByStorefront?: string[];
  /** Narrow the account's tracked apps by tracking relationship. */
  filterAppsBySource?: TrackingSource[];
  /** Narrow the account's tracked apps to products of these types. */
  filterAppsByType?: ProductType[];
}
type AppsTrackedOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Product[];
};
/**
 * Find the apps that an app's users also use.
 *
 * Competitive and partnership intel. For that app's own audience makeup (age, gender), use
 * af.audience.demographics.
 *
 * @example
 * 	Find the apps ChatGPT's users also use (unified app ID).
 * 	af.audience.crossUsage({ appId: "ua_miTXv6" })
 *
 * @example
 * 	Find the apps ChatGPT's users also use on the App Store only (product ID).
 * 	af.audience.crossUsage({ appId: 336744124021 })
 */
interface AudienceCrossUsageInput {
  /** The app's unified app ID or product ID. */
  appId: AppId;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type AudienceCrossUsageOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
    /** Categories the subject app’s audience gravitates to, ranked by aggregated overlap. */
    top_categories: Array<{
      id: number | string;
      name: string;
      /**
       * Aggregated overlap for this category across the subject app’s audience. Larger scale than the
       * per-app score.
       */
      cross_usage_score: number;
    }>;
    /**
     * Category names keyed by ID, for every category ID on this page’s apps. Resolve each
     * `app.categories[].id` here.
     */
    page_categories: Record<string, string>;
  };
  results: Array<{
    /** Audience-overlap strength with the subject app (0–1). Higher means more shared users. */
    cross_usage_score: number;
    /** Worldwide download estimate for the previous calendar month. */
    downloads_last_month?: number;
    downloads_last_month_bound?: EstimateBound;
    /** Worldwide revenue estimate in USD for the previous calendar month. */
    revenue_last_month_usd?: number;
    revenue_last_month_usd_bound?: EstimateBound;
    app: {
      type: 'product';
      /** A number representing a product on a single store */
      product_id: number;
      name: string;
      publisher: string;
      storefronts: string[];
      categories: Array<{
        id: number;
        main: boolean;
      }>;
    } | {
      type: 'unified-app';
      /** Unified app identifier */
      unified_app_id: string;
      name: string;
      publisher: string;
      storefronts: string[];
      member_product_ids: number[];
      categories: Array<{
        id: string;
        main: boolean;
      }>;
    };
  }>;
};
/**
 * Read an app's audience demographics: the estimated age and gender breakdown.
 *
 * Returns who the audience is (age, gender). For what else that audience uses, see
 * af.audience.crossUsage. For the app's performance numbers (downloads, revenue, ratings), use
 * af.metrics.query for trends over time or af.explorer.listProducts for a current snapshot.
 *
 * @example
 * 	Read Minecraft's audience across all its storefronts (unified app ID).
 * 	af.audience.demographics({ appId: "ua_X7iNgb" })
 *
 * @example
 * 	Read Minecraft's audience on Google Play only (product ID).
 * 	af.audience.demographics({ appId: 6938219 })
 */
interface AudienceDemographicsInput {
  /** The app's unified app ID or product ID. */
  appId: AppId;
}
type AudienceDemographicsOutput = {
  /** Observations the estimate is derived from. */
  total_observations: number;
  /** Audience share in each age band (0–1 fractions). */
  by_age: Record<'age_18_to_24' | 'age_25_to_34' | 'age_35_to_49' | 'age_50_to_64' | 'age_65_and_older', number>;
  /**
   * Audience share by gender (0–1). `even` is the platform's 'other' bucket: audience not classified
   * male or female.
   */
  by_gender: Record<'female' | 'male' | 'even', number>;
  /** Within each age band, how the audience splits by gender (0–1). */
  gender_by_age: Record<'age_18_to_24' | 'age_25_to_34' | 'age_35_to_49' | 'age_50_to_64' | 'age_65_and_older', Record<'female' | 'male' | 'even', number>>;
  /** Within each gender, how the audience splits by age band (0–1). */
  age_by_gender: Record<'female' | 'male' | 'even', Record<'age_18_to_24' | 'age_25_to_34' | 'age_35_to_49' | 'age_50_to_64' | 'age_65_and_older', number>>;
};
/**
 * Return a reference doc or guide by slug.
 *
 * `numeric_metrics`: dataset naming conventions, examples, and pitfalls for af.metrics.query (the
 * dataset list lives in af.metrics.describeDatasets). `catalog_playbook`: query grammar,
 * field-reference syntax, aggregation rules, examples, and gotchas for af.explorer.listProducts /
 * af.explorer.aggregateProducts; pairs with af.explorer.describeFields for the current user's field
 * catalog and access. `glossary`: domain terms (product vs unified app, storefront, top chart,
 * ASA).
 *
 * @example
 * 	Read the dataset naming conventions and pitfalls for af.metrics.query; the dataset list itself is in af.metrics.describeDatasets.
 * 	docs/numeric_metrics.md
 *
 * @example
 * 	Read the catalog query grammar, field-reference syntax, aggregation rules, and worked queries for af.explorer.listProducts and af.explorer.aggregateProducts.
 * 	docs/catalog_playbook.md
 *
 * @example
 * 	Read the glossary of domain terms seen in responses.
 * 	docs/glossary.md
 */
interface DocsGetInput {
  /** Which reference to return */
  slug: 'numeric_metrics' | 'catalog_playbook' | 'glossary';
}
type DocsGetOutput = unknown;
/**
 * Aggregate across the full catalog of millions of products across Apple, Google Play, Amazon, and
 * other major stores: counts, averages, min/max, and histograms over any set of matching products.
 * Uses the same query grammar as af.explorer.listProducts; returns aggregates, not product records.
 * For market sizing, benchmarking, and segment analysis.
 *
 * Returns public catalog estimates only. Real numbers on owned apps (downloads, revenue,
 * subscriptions) live in af.metrics.query.
 *
 * @example
 * 	How many monthly downloads does an average iOS app get in Japan?
 * 	af.explorer.aggregateProducts({ fields: ["custom_meta[country=jp].download_estimates_average_30_days/stats"], query: ["and",["match","storefronts","apple:ios"],["match","countries","jp"]] })
 *
 * @example
 * 	What's the rating, category mix, and developer concentration for US iOS apps in the $100k–$10M/mo net-revenue tier?
 * 	af.explorer.aggregateProducts({ fields: ["all_rating/stats","categories.all/terms","developer_id/cardinality"], query: ["and",["match","storefronts","apple:ios"],["nested","custom_meta",["and",["match","custom_meta.revenue_estimates_sum_30_days",["number_range",100000,10000000]],["match","custom_meta.country","us"]]]] })
 *
 * @example
 * 	Are new iOS games still launching at the same rate as two years ago?
 * 	af.explorer.aggregateProducts({ fields: ["release_date/date_histogram"], query: ["and",["match","storefronts","apple:ios"],["match","categories.all",6014],["match","release_date",["range","2024-01-01","2025-12-31"]]] })
 *
 * @example
 * 	What SDKs do apps commonly ship alongside OneSignal?
 * 	af.explorer.aggregateProducts({ fields: ["all_sdks[*].id/terms"], query: ["nested","all_sdks",["and",["match","all_sdks.id","onesignal"],["match","all_sdks.active",true]]] })
 *
 * @example
 * 	How do iOS app ratings distribute?
 * 	af.explorer.aggregateProducts({ fields: ["all_rating/histogram"], query: ["match","storefronts","apple:ios"] })
 *
 * @example
 * 	How many apps are on each storefront?
 * 	af.explorer.aggregateProducts({ fields: ["storefronts/terms"] })
 */
interface ExplorerAggregateProductsInput {
  /**
   * Explorer query in JSON array format to select matching catalog Products. Defaults to active
   * Products. Include inactive too: ["match","active",["or",true,false]]. The full field list and
   * query syntax are documented in docs/catalog_playbook.md.
   */
  query?: unknown[];
  /**
   * Field+aggregation pairs (e.g. `all_rating/stats`, `storefronts/terms`). Aggregations: `stats`,
   * `terms`, `histogram`, `date_histogram`, `cardinality`. The full field list is documented in
   * docs/catalog_playbook.md.
   */
  fields: string[];
  /**
   * Escape hatch for intentionally broad queries. Bypasses the default block on unscoped nested
   * predicates that usually inflate results.
   */
  allowUnscopedNested?: boolean;
  /** Maximum buckets returned for each `terms` aggregation. Other aggregation types ignore it. */
  termsCount?: number;
  /** Bucket granularity for each `date_histogram` aggregation. Other aggregation types ignore it. */
  dateHistogramInterval?: 'year' | 'quarter' | 'month' | 'week' | 'day';
}
type ExplorerAggregateProductsOutput = {
  /** Number of products matching the query. */
  matched_product_count: number;
  results: Array<{
    field: string;
    aggregation: 'stats';
    avg: number;
    min: number;
    max: number;
    sum: number;
    count: number;
  } | {
    field: string;
    aggregation: 'terms';
    buckets: Array<{
      value: string;
      count: number;
    }>;
    other_count: number;
    error_upper_bound: number;
  } | {
    field: string;
    aggregation: 'histogram';
    buckets: Array<{
      value: string;
      count: number;
    }>;
  } | {
    field: string;
    aggregation: 'date_histogram';
    buckets: Array<{
      date: string;
      count: number;
    }>;
  } | {
    field: string;
    aggregation: 'cardinality';
    distinct_count: number;
  }>;
};
/**
 * List the catalog fields and the current user's access level for each. Search by keyword to find
 * fields. Same field set af.explorer.listProducts and af.explorer.aggregateProducts accept.
 *
 * Each entry has two access axes: `read` (gates response columns in af.explorer.listProducts) and
 * `query` (gates query, sort, and aggregate fields). `query: 'partial'` means
 * restricted-but-non-empty results. For paths containing `[]` (array-of-objects members),
 * substitute a bracket filter before use: `custom_meta[].download_estimates_sum_30_days` →
 * `custom_meta[country=us].download_estimates_sum_30_days`. Pair with docs/catalog_playbook.md for
 * query grammar.
 *
 * @example
 * 	Search for revenue-related fields.
 * 	af.explorer.describeFields({ q: "revenue" })
 *
 * @example
 * 	List every catalog field with the current user's access level.
 * 	af.explorer.describeFields
 */
interface ExplorerDescribeFieldsInput {
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
  /** Filter by `path`, `title`, `description`, `type`. */
  q?: string;
}
type ExplorerDescribeFieldsOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    path: string;
    title?: string;
    description?: string;
    type: string;
    read: 'accessible' | 'upgrade_required' | 'coming_soon';
    query: 'accessible' | 'partial' | 'upgrade_required' | 'coming_soon';
  }>;
};
/**
 * Read catalog fields for one app or many. Fields referenced by `query` or `sort` come back
 * automatically; pass extraFields for more. Use `["match","product_id",<id>]` for a single app, or
 * combine filters for population queries (e.g. iOS apps using Firebase with $1M+ US revenue). The
 * 120+ fields span ranks, ratings, download and revenue estimates, SDKs, demographics, and more;
 * query grammar and field list in docs/catalog_playbook.md.
 *
 * Current point-in-time values per app. Aggregates across matching apps live in
 * af.explorer.aggregateProducts; changes over time live in af.metrics.query. For simple
 * name/publisher lookup, see af.apps.search, which is faster and doesn't require the query
 * grammar.
 *
 * @example
 * 	Find iOS apps that have Firebase installed.
 * 	af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","all_sdks",["and",["match","all_sdks.id","firebase"],["match","all_sdks.active",true]]]] })
 *
 * @example
 * 	Rank the biggest US iOS games by revenue.
 * 	af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["match","categories.all",6014]], sort: "custom_meta[country=us].revenue_estimates_sum_30_days", order: "desc", count: 25 })
 *
 * @example
 * 	Find US iOS apps in the $100k–$1M/month revenue tier.
 * 	af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["nested","custom_meta",["and",["match","custom_meta.country","us"],["match","custom_meta.revenue_estimates_sum_30_days",["number_range",100000,1000000]]]]] })
 *
 * @example
 * 	Page through results.
 * 	af.explorer.listProducts({ query: ["and",["match","storefronts","apple:ios"],["match","categories.all",6014]], count: 50, page: 2 })
 *
 * @example
 * 	Pass extraFields for columns the query doesn't already reference. Common for single-app reads.
 * 	af.explorer.listProducts({ query: ["match","product_id",304004187384], extraFields: ["custom_meta[country=zz].revenue_estimates_sum_365_days","all_sdks[id=firebase].active"] })
 */
interface ExplorerListProductsInput {
  /**
   * Explorer query in JSON array format to select matching catalog Products. Defaults to active
   * Products. Include inactive too: ["match","active",["or",true,false]]. The full field list and
   * query syntax are documented in docs/catalog_playbook.md.
   */
  query?: unknown[];
  /**
   * Additional fields to include beyond those your `query` or `sort` already reference. Find field
   * paths (and which you can read) with af.explorer.describeFields.
   */
  extraFields?: string[];
  /** Explorer field name. The full field list is documented in docs/catalog_playbook.md. */
  sort?: string;
  order?: SortOrder;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
  /**
   * Escape hatch for intentionally broad queries. Bypasses the default block on unscoped nested
   * predicates that usually inflate results.
   */
  allowUnscopedNested?: boolean;
}
type ExplorerListProductsOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: unknown[];
};
/**
 * List the apps advertising on a specific keyword, with each advertiser's impression share, organic
 * rank, and how long they've been bidding.
 *
 * For the apps that rank organically on the same term, see af.keywords.rankingApps.
 *
 * @example
 * 	Find US apps advertising on the "notion" brand.
 * 	af.keywords.advertisers({ keywordTerm: "notion", country: "US" })
 *
 * @example
 * 	Find US iPad apps advertising on "meditation".
 * 	af.keywords.advertisers({ keywordTerm: "meditation", country: "US", deviceType: "tablet" })
 *
 * @example
 * 	Find US apps advertising on "fitness" over the last 30 days.
 * 	af.keywords.advertisers({ keywordTerm: "fitness", country: "US", days: 30 })
 */
interface KeywordsAdvertisersInput {
  /** Keyword to look up advertisers for */
  keywordTerm: string;
  /** Lookback period in days. Common values: 7, 14, 30, 90, 180, 365. */
  days?: number;
  /** ISO country code (e.g. US, JP, GB) */
  country: string;
  deviceType?: DeviceType;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type KeywordsAdvertisersOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
    keyword: {
      /** Opaque keyword identifier. */
      keyword_id: string;
      /** Human-readable search term. */
      keyword_term: string;
      /** Estimated search popularity (0–100). `null` when there is no score for this keyword. */
      popularity: number | null;
      /** How crowded the search results page is (0–100). `null` when there is no score for this keyword. */
      competitiveness: number | null;
      /** Total apps ranking for this keyword. High popularity with low `num_apps` is an opening. */
      num_apps: number;
      /** Earliest date the platform has data. */
      data_available: string;
      /** Last time this data was refreshed (ISO 8601 UTC). */
      last_synced: string | null;
    };
    /** Number of days these metrics cover (the requested lookback window). */
    lookback_days: number;
  };
  results: Array<{
    /** A number representing a product on a single store */
    product_id: number;
    name: string;
    developer: string;
    /** Share of paid impressions captured (0–100). */
    impressions_share: number;
    /** Organic rank without the ad. `null` if not ranked organically. */
    organic_rank: number | null;
    /** Total keywords this advertiser bids on, not just this one. */
    num_keywords: number;
    /** First seen advertising (ISO 8601 UTC). */
    first_seen: string;
    /** Last seen advertising. */
    last_seen: string;
    /** Days spent advertising. */
    lifetime_days: number;
    /** Per-country impression share. */
    countries: Array<{
      /** ISO country code (e.g. US, JP, GB) */
      country: string;
      /** Share in this country (0–100). */
      impressions_share: number;
    }>;
  }>;
};
/**
 * Check the organic keywords one or more apps rank for, with position, popularity, and
 * competitiveness.
 *
 * For the inverse (apps that rank for a keyword), see af.keywords.rankingApps. This works for any
 * app (with the right plan), not just those the account tracks; with no app filter, covers every
 * tracked app.
 *
 * @example
 * 	Check ChatGPT's current US keyword rankings.
 * 	af.keywords.organic({ productIds: [336744124021], countries: ["US"] })
 *
 * @example
 * 	Check ChatGPT's iPad-only keyword rankings.
 * 	af.keywords.organic({ productIds: [336744124021], countries: ["US"], deviceType: "tablet" })
 *
 * @example
 * 	Compare ChatGPT and Gemini's US keyword rankings.
 * 	af.keywords.organic({ productIds: [336744124021,337217072531], countries: ["US"] })
 */
interface KeywordsOrganicInput {
  /** Product identifiers (numeric, one storefront each). */
  productIds?: number[];
  /** One or more ISO country codes (e.g. US, JP, GB). Pass several to compare markets. */
  countries: string[];
  deviceType?: DeviceType;
  /** Number of results to return (min 10). */
  count?: number;
  /** Page number. */
  page?: number;
}
type KeywordsOrganicOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
    /**
     * Total keywords each app ranks for across the whole query (not just this page), keyed by
     * `product_id`.
     */
    keywords_per_app: Record<string, number | undefined>;
    supports: {
      /** Whether this country/storefront measures popularity at all. */
      popularity: boolean;
      /** Whether this country/storefront measures competitiveness at all. */
      competitiveness: boolean;
    };
  };
  results: Array<{
    /** Opaque keyword identifier. */
    keyword_id: string;
    /** Human-readable search term. */
    keyword_term: string;
    /** Estimated search popularity (0–100). `null` when there is no score for this keyword. */
    popularity: number | null;
    /** How crowded the search results page is (0–100). `null` when there is no score for this keyword. */
    competitiveness: number | null;
    /** Total apps ranking for this keyword. High popularity with low `num_apps` is an opening. */
    num_apps: number;
    /** ISO country code (e.g. US, JP, GB) */
    country: string;
    /**
     * App store platform (e.g. apple:ios, google_play, amazon_appstore, steam, windows10, apple:mac,
     * apple:tv, apple:imessage, or another supported storefront).
     */
    storefront: string;
    /**
     * Device type (e.g. handheld, tablet, watch, tv, desktop, headset, or another value the platform
     * reports).
     */
    device_type: string;
    /** When the platform last sampled rankings for this keyword (ISO 8601 UTC). */
    snapshot_at: string;
    /** Per-app current rank, keyed by `product_id` as a string. */
    positions: Record<string, {
      /** A number representing a product on a single store */
      product_id: number;
      position: number;
      /** Position change since the previous snapshot (negative = improved). */
      delta?: number;
    } | undefined>;
  }>;
};
/**
 * List the paid keywords one or more apps run ads on, with impression share and organic rank.
 *
 * Organic keyword rankings are in af.keywords.organic.
 *
 * @example
 * 	Find Headspace's US paid keywords.
 * 	af.keywords.paid({ productIds: [15250929], countries: ["US"] })
 *
 * @example
 * 	Compare Headspace's and Calm's US paid keywords.
 * 	af.keywords.paid({ productIds: [15250929,304554144], countries: ["US"] })
 *
 * @example
 * 	Find Headspace's paid keywords across the US, UK, and Japan.
 * 	af.keywords.paid({ productIds: [15250929], countries: ["US","GB","JP"] })
 *
 * @example
 * 	Find Headspace's US iPad paid keywords.
 * 	af.keywords.paid({ productIds: [15250929], countries: ["US"], deviceTypes: ["tablet"] })
 *
 * @example
 * 	Check Headspace's US paid keywords over the last 30 days.
 * 	af.keywords.paid({ productIds: [15250929], countries: ["US"], days: 30 })
 */
interface KeywordsPaidInput {
  /** Product identifiers (numeric, one storefront each). */
  productIds: number[];
  /** Lookback period in days. Common values: 7, 14, 30, 90, 180, 365. */
  days?: number;
  /** One or more ISO country codes (e.g. US, JP, GB). Pass several to compare markets. */
  countries: string[];
  /** Filter by device type. Defaults to handheld. */
  deviceTypes?: DeviceType[];
  /** Number of results to return (min 10). */
  count?: number;
  /** Page number. */
  page?: number;
}
type KeywordsPaidOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
    /**
     * Total keywords each app advertises on across the whole query (not just this page), keyed by
     * `product_id`.
     */
    keywords_per_app: Record<string, number | undefined>;
    /** The reporting window `[start, end]` the impression shares cover. */
    date_range: [string, string];
  };
  results: Array<{
    /** Opaque keyword identifier. */
    keyword_id: string;
    /** Human-readable search term. */
    keyword_term: string;
    /** Estimated search popularity (0–100). `null` when there is no score for this keyword. */
    popularity: number | null;
    /** ISO country code (e.g. US, JP, GB) */
    country: string;
    /**
     * Device type (e.g. handheld, tablet, watch, tv, desktop, headset, or another value the platform
     * reports).
     */
    device_type: string;
    /** Per-app paid performance, keyed by `product_id` as a string. */
    advertising: Record<string, {
      /** Share of paid impressions captured (0–100). `null` when not advertising. */
      impressions_share: number | null;
      /** Organic rank without the ad. `null` if not ranked organically. */
      organic_rank: number | null;
    } | undefined>;
  }>;
};
/**
 * List the apps ranking for a specific keyword in organic search, plus the keyword's own popularity
 * and competitiveness scores.
 *
 * For a specific app's keyword positions, see af.keywords.organic. For related search terms to
 * brainstorm, see af.keywords.related.
 *
 * @example
 * 	Find US iOS apps ranking for "fitness".
 * 	af.keywords.rankingApps({ keywordTerm: "fitness", country: "US", storefront: "apple:ios" })
 *
 * @example
 * 	Find Google Play apps ranking for "fitness".
 * 	af.keywords.rankingApps({ keywordTerm: "fitness", country: "US", storefront: "google_play" })
 *
 * @example
 * 	Find US iPad apps ranking for "meditation".
 * 	af.keywords.rankingApps({ keywordTerm: "meditation", country: "US", storefront: "apple:ios", deviceType: "tablet" })
 */
interface KeywordsRankingAppsInput {
  /** Keyword to look up. */
  keywordTerm: string;
  /** ISO country code (e.g. US, JP, GB) */
  country: string;
  /**
   * App store platform (e.g. apple:ios, google_play, amazon_appstore, steam, windows10, apple:mac,
   * apple:tv, apple:imessage, or another supported storefront).
   */
  storefront: string;
  deviceType?: DeviceType;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type KeywordsRankingAppsOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
    keyword: {
      /** Opaque keyword identifier. */
      keyword_id: string;
      /** Human-readable search term. */
      keyword_term: string;
      /** Estimated search popularity (0–100). `null` when there is no score for this keyword. */
      popularity: number | null;
      /** How crowded the search results page is (0–100). `null` when there is no score for this keyword. */
      competitiveness: number | null;
      /** Total apps ranking for this keyword. `null` while the results dataset is syncing. */
      num_apps: number | null;
      supports: {
        /** Whether this country/storefront measures popularity at all. */
        popularity: boolean;
        /** Whether this country/storefront measures competitiveness at all. */
        competitiveness: boolean;
      };
      /** Last time `popularity` was refreshed. `null` when unsupported or never synced. */
      popularity_last_synced: string | null;
      /** Last time `competitiveness` was refreshed. `null` when unsupported or never synced. */
      competitiveness_last_synced: string | null;
      /** Last time any keyword data was refreshed. */
      last_synced: string | null;
      /** Earliest date the platform has data for this keyword. */
      data_available: string;
      /** Which datasets are still syncing for this keyword. All false means the response is final. */
      syncing: {
        results: boolean;
        popularity: boolean;
        competitiveness: boolean;
      };
    };
  };
  results: Array<{
    /** A number representing a product on a single store */
    product_id: number;
    name: string;
    developer: string;
  }>;
};
/**
 * Find keywords related to a seed term for ASO research. Useful for finding alternatives with a
 * similar audience that are more popular or less competitive.
 *
 * For apps that rank on a keyword, see af.keywords.rankingApps.
 *
 * @example
 * 	Find US iOS keywords related to "fitness".
 * 	af.keywords.related({ keywordTerm: "fitness", country: "US", storefront: "apple:ios" })
 *
 * @example
 * 	Find US Google Play keywords related to "fitness".
 * 	af.keywords.related({ keywordTerm: "fitness", country: "US", storefront: "google_play" })
 *
 * @example
 * 	Find US iPad keywords related to "meditation".
 * 	af.keywords.related({ keywordTerm: "meditation", country: "US", storefront: "apple:ios", deviceType: "tablet" })
 */
interface KeywordsRelatedInput {
  /** Seed keyword to find related terms for. */
  keywordTerm: string;
  /** ISO country code (e.g. US, JP, GB) */
  country: string;
  /**
   * App store platform (e.g. apple:ios, google_play, amazon_appstore, steam, windows10, apple:mac,
   * apple:tv, apple:imessage, or another supported storefront).
   */
  storefront: string;
  deviceType?: DeviceType;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type KeywordsRelatedOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    /** Opaque keyword identifier. */
    keyword_id: string;
    /** Human-readable search term. */
    keyword_term: string;
    /** Relatedness to the seed term (0–100). */
    relevance: number;
    /** Estimated search popularity (0–100). `null` when there is no score for this keyword. */
    popularity: number | null;
    /** How crowded the search results page is (0–100). `null` when there is no score for this keyword. */
    competitiveness: number | null;
    /** Total apps ranking for this keyword. High popularity with low `num_apps` is an opening. */
    num_apps: number;
  }>;
};
/**
 * Discover keyword ideas to consider targeting for a single app+country combo, ranked by relevance
 * to the app and including some drawn from apps you compete with. Each comes with its popularity,
 * competitiveness, and the app's current rank.
 *
 * Works for any app, not just tracked ones. For the keywords an app already ranks for, use
 * af.keywords.organic.
 *
 * @example
 * 	Discover keywords ChatGPT should consider targeting.
 * 	af.keywords.suggestions({ productId: 336744124021, country: "US" })
 *
 * @example
 * 	Find keyword ideas for ChatGPT in Japan.
 * 	af.keywords.suggestions({ productId: 336744124021, country: "JP" })
 *
 * @example
 * 	Pull a broader set of suggestions.
 * 	af.keywords.suggestions({ productId: 336744124021, country: "US", count: 50 })
 */
interface KeywordsSuggestionsInput {
  /**
   * Numeric product ID for one storefront. Not a unified app ID. Member product_id values are
   * available from af.apps.get({ appId: "<unified-app-id>" }).
   */
  productId: number;
  /** ISO country code (e.g. US, JP, GB) */
  country: string;
  /** Device to read ranks for. Omit to use the store default. */
  deviceType?: DeviceType;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type KeywordsSuggestionsOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    /** Opaque keyword identifier. */
    keyword_id: string;
    /** Human-readable search term. */
    keyword_term: string;
    /** How relevant this keyword is to the app (0-100). Suggestions come sorted by this. */
    relevance: number;
    /** The app's current rank for this keyword (1 = top). `null` when it isn't ranking yet. */
    position: number | null;
    /**
     * Rank movement from the prior reading (positive = moved up). `0` held steady; `null` when there's
     * no prior reading (newly ranking or not ranking).
     */
    delta: number | null;
    /** Estimated search popularity (0–100). `null` when there is no score for this keyword. */
    popularity: number | null;
    /** How crowded the search results page is (0–100). `null` when there is no score for this keyword. */
    competitiveness: number | null;
    /** Total apps ranking for this keyword. High popularity with low `num_apps` is an opening. */
    num_apps: number;
  }>;
};
/**
 * Track a keyword to monitor your app's hourly rank for it over time and get automatic alerts when
 * its position moves.
 *
 * Product IDs for owned apps are available from af.apps.tracked.
 *
 * @remarks
 *   Mutation (create) — requires explicit confirmation in tools mode.
 * @example
 * 	Start tracking "meditation" for one of your apps in the US.
 * 	af.keywords.track({ keywordTerm: "meditation", productId: 336744124021, country: "US" })
 *
 * @example
 * 	Track "workout" in Japan.
 * 	af.keywords.track({ keywordTerm: "workout", productId: 336744124021, country: "JP" })
 */
interface KeywordsTrackInput {
  /** Product ID of the app to track the keyword for */
  productId: number;
  /** Keyword to start tracking */
  keywordTerm: string;
  /** ISO country code (e.g. US, JP, GB) */
  country: string;
}
type KeywordsTrackOutput = {
  /** Opaque keyword identifier. */
  keyword_id: string;
  /** Human-readable search term. */
  keyword_term: string;
  /** Whether the platform is currently tracking this keyword. */
  active: boolean;
  /** When the keyword joined the account (ISO 8601 UTC). */
  added_on: string;
  /** Earliest date with queryable data. `null` when nothing has synced yet. */
  data_available: string | null;
  /** Per-pair tracking detail. Present only when the include-relationships flag is set. */
  relationships?: Array<{
    /** A number representing a product on a single store */
    product_id: number;
    /** ISO country code (e.g. US, JP, GB) */
    country: string;
    /** When tracking started for this pair (ISO 8601 UTC). */
    tracked_since: string;
    /** Sync state keyed by device type. `finished` means current; otherwise a refresh is in flight. */
    sync_per_device_type: Record<string, {
      last_synced: string | null;
      status: 'running' | 'queued' | 'finished';
    } | undefined>;
  }>;
};
/**
 * List tracked keywords with their opaque IDs.
 *
 * Reference a keyword by its stable `keyword_id`, not its term text.
 *
 * @example
 * 	List every tracked keyword.
 * 	af.keywords.tracked
 *
 * @example
 * 	Search tracked keywords for "fitness".
 * 	af.keywords.tracked({ q: "fitness" })
 *
 * @example
 * 	List the most-recently-tracked keywords first.
 * 	af.keywords.tracked({ sort: "added_on" })
 *
 * @example
 * 	Show each keyword's tracking and sync detail.
 * 	af.keywords.tracked({ includeRelationships: true })
 */
interface KeywordsTrackedInput {
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
  /** Filter by `keyword_term`. */
  q?: string;
  /** Field to sort by. Omit to order by relevance when `q` is set, otherwise list order. */
  sort?: 'keyword_term' | 'active' | 'added_on';
  order?: SortOrder;
  /**
   * Include per-(product, country) tracking detail and sync state on each row. Off by default; adds a
   * nested block per tracked (product, country) pair.
   */
  includeRelationships?: boolean;
}
type KeywordsTrackedOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    /** Opaque keyword identifier. */
    keyword_id: string;
    /** Human-readable search term. */
    keyword_term: string;
    /** Whether the platform is currently tracking this keyword. */
    active: boolean;
    /** When the keyword joined the account (ISO 8601 UTC). */
    added_on: string;
    /** Earliest date with queryable data. `null` when nothing has synced yet. */
    data_available: string | null;
    /** Per-pair tracking detail. Present only when the include-relationships flag is set. */
    relationships?: Array<{
      /** A number representing a product on a single store */
      product_id: number;
      /** ISO country code (e.g. US, JP, GB) */
      country: string;
      /** When tracking started for this pair (ISO 8601 UTC). */
      tracked_since: string;
      /** Sync state keyed by device type. `finished` means current; otherwise a refresh is in flight. */
      sync_per_device_type: Record<string, {
        last_synced: string | null;
        status: 'running' | 'queued' | 'finished';
      } | undefined>;
    }>;
  }>;
};
/**
 * View where all your tracked keywords rank for a single app+country combo, with each keyword's
 * current position, movement since it last changed, starting position, popularity, and
 * competitiveness.
 *
 * To trace one keyword's rank over time for an app+country combo, use af.keywords.trackedTrend. For
 * a point-in-time list of every keyword any app ranks for, use af.keywords.organic. Add more
 * tracked keywords with af.keywords.track.
 *
 * @example
 * 	Check how ChatGPT's tracked keywords are ranking.
 * 	af.keywords.trackedRanks({ productId: 336744124021, country: "US" })
 *
 * @example
 * 	List ChatGPT's best-ranking keywords first.
 * 	af.keywords.trackedRanks({ productId: 336744124021, country: "US", sort: "position", order: "asc" })
 *
 * @example
 * 	Show only the keywords ChatGPT ranks in the top 10.
 * 	af.keywords.trackedRanks({ productId: 336744124021, country: "US", maxPosition: 10 })
 *
 * @example
 * 	Find the most-searched keywords ChatGPT should prioritize.
 * 	af.keywords.trackedRanks({ productId: 336744124021, country: "US", sort: "popularity", minPopularity: 50 })
 *
 * @example
 * 	Trace ChatGPT's keyword movement across a custom week.
 * 	af.keywords.trackedRanks({ productId: 336744124021, country: "US", start: "2026-08-06", end: "2026-08-12" })
 *
 * @example
 * 	Page through a long tracked keyword set.
 * 	af.keywords.trackedRanks({ productId: 336744124021, country: "US", page: 2 })
 */
interface KeywordsTrackedRanksInput {
  /**
   * Numeric product ID for one storefront. Not a unified app ID. Member product_id values are
   * available from af.apps.get({ appId: "<unified-app-id>" }).
   */
  productId: number;
  /** ISO country code (e.g. US, JP, GB) */
  country: string;
  /** Device to read ranks for. Omit to use the store default. */
  deviceType?: DeviceType;
  /** Number of results to return (min 10). */
  count?: number;
  /** Page number. */
  page?: number;
  /** Field to order results by. */
  sort?: 'position' | 'popularity' | 'competitiveness' | 'num_apps' | 'keyword_term' | 'delta';
  order?: SortOrder;
  /**
   * Start of the window (YYYY-MM-DD). Omit the range for the last 7 days; the rank on the start date
   * is the starting-position baseline.
   */
  start?: string;
  /** End of the window (YYYY-MM-DD, defaults to today). Spans at most 31 days. */
  end?: string;
  /** Only include tracked keywords whose term contains this text. */
  keywordTerm?: string;
  /** Best rank to include (1 = top). */
  minPosition?: number;
  /** Worst rank to include. */
  maxPosition?: number;
  /** Lowest popularity to include (0-100). */
  minPopularity?: number;
  /** Highest popularity to include (0-100). */
  maxPopularity?: number;
  /** Lowest competitiveness to include (0-100). */
  minCompetitiveness?: number;
  /** Highest competitiveness to include (0-100). */
  maxCompetitiveness?: number;
}
type KeywordsTrackedRanksOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    /** Opaque keyword identifier. */
    keyword_id: string;
    /** Human-readable search term. */
    keyword_term: string;
    /** Current rank in search results (1 = top). `null` when the app is not ranking for it. */
    position: number | null;
    /** Rank at the start of the queried window. */
    starting_position: number | null;
    /**
     * Positions moved since the rank last changed (positive = moved up). Baselined on the most recent
     * change, not the window start.
     */
    delta: number | null;
    /** Date the rank last changed. `null` when it held steady across the window. */
    last_change: string | null;
    /** Estimated search popularity (0–100). `null` when there is no score for this keyword. */
    popularity: number | null;
    /** How crowded the search results page is (0–100). `null` when there is no score for this keyword. */
    competitiveness: number | null;
    /** Total apps ranking for this keyword. High popularity with low `num_apps` is an opening. */
    num_apps: number;
  }>;
};
/**
 * Trace how one tracked keyword's rank changes over time for a single app+country combo. Each point
 * gives the rank and how many positions it moved since the one before.
 *
 * For all of an app's tracked keywords at once, use af.keywords.trackedRanks.
 *
 * @example
 * 	Find a tracked keyword, then trace its rank day by day.
 * 	af.keywords.trackedRanks({ productId: 336744124021, country: "US" })
 * 	af.keywords.trackedTrend({ keywordId: "00f2b1ead3a0990b818517356cb40280", productId: 336744124021, country: "US" })
 *
 * @example
 * 	Trace a keyword's rank for ChatGPT across a specific week.
 * 	af.keywords.trackedTrend({ keywordId: "00f2b1ead3a0990b818517356cb40280", productId: 336744124021, country: "US", start: "2026-08-06", end: "2026-08-12" })
 *
 * @example
 * 	Trace a keyword hour by hour.
 * 	af.keywords.trackedTrend({ keywordId: "00f2b1ead3a0990b818517356cb40280", productId: 336744124021, country: "US", granularity: "hourly" })
 */
interface KeywordsTrackedTrendInput {
  /**
   * Numeric product ID for one storefront. Not a unified app ID. Member product_id values are
   * available from af.apps.get({ appId: "<unified-app-id>" }).
   */
  productId: number;
  /** ISO country code (e.g. US, JP, GB) */
  country: string;
  /** Device to read ranks for. Omit to use the store default. */
  deviceType?: DeviceType;
  /**
   * The keyword to trace. Must be tracked for this app and country; its opaque id comes from
   * af.keywords.trackedRanks or af.keywords.tracked.
   */
  keywordId: string;
  /** Sampling rate. */
  granularity?: 'daily' | 'hourly';
  /** Start of the window (YYYY-MM-DD). Omit the range for the last 7 days. */
  start?: string;
  /**
   * End of the window (YYYY-MM-DD, defaults to today). Spans at most 14 days for hourly granularity,
   * 31 for daily.
   */
  end?: string;
}
type KeywordsTrackedTrendOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
    /** The traced keyword. */
    keyword_id: string;
    /** ISO country code (e.g. US, JP, GB) */
    country: string;
    granularity: 'daily' | 'hourly';
    /** First day of the queried window (YYYY-MM-DD). */
    start_date: string;
    /** Last day of the queried window (YYYY-MM-DD). */
    end_date: string;
  };
  results: Array<{
    /**
     * When this datapoint was sampled (ISO 8601 UTC). Daily points are midnight-pinned; read the
     * spacing off `metadata.granularity`.
     */
    snapshot_at: string;
    /** Rank at this point (1 = top). `null` when the app is not ranking then. */
    position: number | null;
    /** Change from the previous datapoint (positive = moved up). */
    delta: number | null;
  }>;
};
/**
 * Stop tracking a keyword.
 *
 * Keyword IDs are opaque hashes on each record from af.keywords.tracked.
 *
 * @remarks
 *   Mutation (destructive) — requires explicit confirmation in tools mode.
 * @example
 * 	Stop tracking a keyword.
 * 	af.keywords.untrack({ keywordId: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6" })
 */
interface KeywordsUntrackInput {
  /** Identifier of a tracked keyword row (returned by af.keywords.tracked). Not the keyword text. */
  keywordId: string;
}
type KeywordsUntrackOutput = {
  deleted: true;
};
/**
 * List every numeric dataset af.metrics.query accepts, one row per dataset with its value type and
 * whether it's limited to your own apps.
 *
 * A dataset with `your_apps_only: true` returns data only for apps you own or that were shared with
 * you. af.metrics.query returns nothing for one of these on any other app. Feed any `dataset`
 * straight into af.metrics.query. Each row's `supported_group_by` and `supported_granularities`
 * list how that dataset can be broken down, so you can pick a valid grouping before querying. Pair
 * with docs/numeric_metrics.md for dataset naming conventions and pitfalls.
 *
 * @example
 * 	Search by keyword (matches name, label, or description).
 * 	af.metrics.describeDatasets({ q: "combined downloads" })
 *
 * @example
 * 	Look up one dataset by its exact name.
 * 	af.metrics.describeDatasets({ q: "sales.combined_downloads" })
 *
 * @example
 * 	List every dataset with its value type and whether it's limited to your own apps.
 * 	af.metrics.describeDatasets
 */
interface MetricsDescribeDatasetsInput {
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
  /** Filter by `dataset`, `value_type`, `label`, `description`. */
  q?: string;
}
type MetricsDescribeDatasetsOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    dataset: string;
    your_apps_only: boolean;
    value_type: string;
    supported_group_by: string[];
    supported_granularities: string[];
    label?: string;
    description?: string;
  }>;
};
/**
 * Query any numeric dataset for one or more apps. Optionally grouped by up to two dimensions,
 * returned as a nested partition tree, not app records. Independently filterable by country, device
 * type, and date range. `filterAppsBy*` options narrow the app set (by ID, storefront, source, or
 * type); without one, a query covers every app the account tracks.
 *
 * Current point-in-time values live in af.explorer.listProducts; counts/averages across the catalog
 * live in af.explorer.aggregateProducts. See docs/numeric_metrics.md for dataset naming conventions
 * and pitfalls.
 *
 * @example
 * 	Get total downloads across your apps with private-data access.
 * 	af.metrics.query({ dataset: "sales.combined_downloads", filterAppsBySource: ["own","shared"] })
 *
 * @example
 * 	Get revenue split by storefront, plus a top-level total.
 * 	af.metrics.query({ dataset: "sales.combined_revenue", filterAppsBySource: ["own","shared"], groupBy: ["storefront"] })
 *
 * @example
 * 	Rank the top 5 tracked competitors by estimated monthly revenue.
 * 	af.metrics.query({ dataset: "estimates.revenue", filterAppsBySource: ["manual"], groupBy: ["product"], count: 5 })
 *
 * @example
 * 	Track Candy Crush Saga's daily download estimates.
 * 	af.metrics.query({ dataset: "estimates.sales", filterAppsById: ["ua_V1Q1uX"], groupBy: ["date"], granularity: "daily" })
 *
 * @example
 * 	Track net monthly recurring revenue per app, month over month.
 * 	af.metrics.query({ dataset: "subscriptions.mrr", filterAppsBySource: ["own","shared"], groupBy: ["product","date"], granularity: "monthly" })
 *
 * @example
 * 	Get Minecraft's new ratings.
 * 	af.metrics.query({ dataset: "ratings.new_total", filterAppsById: ["ua_X7iNgb"] })
 *
 * @example
 * 	Track daily ad spend across your apps.
 * 	af.metrics.query({ dataset: "adspend.cost", filterAppsBySource: ["own","shared"], groupBy: ["date"], granularity: "daily" })
 *
 * @example
 * 	Compare Candy Crush's December 2025 downloads across the US, Japan, and UK.
 * 	af.metrics.query({ dataset: "estimates.sales", filterAppsById: ["ua_V1Q1uX"], countries: ["US","JP","GB"], groupBy: ["country"], start: "2025-12-01", end: "2025-12-31" })
 *
 * @example
 * 	Track all-time monthly revenue across your apps with private-data access.
 * 	af.metrics.query({ dataset: "sales.combined_revenue", filterAppsBySource: ["own","shared"], groupBy: ["date"], granularity: "monthly", allTime: true })
 *
 * @example
 * 	Get Minecraft's review volume by country.
 * 	af.metrics.query({ dataset: "reviews.total", filterAppsById: ["ua_X7iNgb"], groupBy: ["country"] })
 */
interface MetricsQueryInput {
  /**
   * Dataset to query (e.g. sales.combined_downloads). See af.metrics.describeDatasets for the full
   * list and which datasets are private data (visible only for apps you own or that were shared).
   */
  dataset: string;
  /**
   * Dimensions to group by. Max 2: the first slot becomes the outer entity type, the second the inner
   * series. Each dimension multiplies the result size.
   */
  groupBy?: GroupByDimension[];
  /** Time granularity when grouping by date */
  granularity?: MetricGranularity;
  /**
   * Row cap. With groupBy, top N of the outer entity type by value (earliest N when grouping by
   * date). Without groupBy, single-page preview.
   */
  count?: number;
  /** Filter to one or more ISO country codes (e.g. US, JP, GB) */
  countries?: string[];
  deviceType?: DeviceType;
  /**
   * Opt in to the entire history. Without this flag (and without `start`/`end`), the query defaults
   * to the last 30 days. Mutually exclusive with `start` and `end`.
   */
  allTime?: boolean;
  /**
   * Only include data about specific apps, by product ID or unified app ID. Takes precedence over the
   * other `filterAppsBy*` keys when set. Storefront, source, or type filters are better for app sets
   * that can be described by those criteria.
   */
  filterAppsById?: AppId[];
  /** Narrow the account's tracked apps to those on these storefronts (e.g. apple:ios, google_play). */
  filterAppsByStorefront?: string[];
  /** Narrow the account's tracked apps by tracking relationship. */
  filterAppsBySource?: TrackingSource[];
  /** Narrow the account's tracked apps to products of these types. */
  filterAppsByType?: ProductType[];
  /** Start date (YYYY-MM-DD) */
  start?: string;
  /** End date (YYYY-MM-DD, defaults to today) */
  end?: string;
}
type MetricsQueryOutput = {
  metadata: {
    /** The dataset that was queried. */
    dataset: string;
    /** How to read every value in the tree: units, currency, rating, percent, ratio, or duration. */
    data_type: string;
    /** Currency of every value in the tree (e.g. USD). Present only for currency datasets. */
    currency_code?: string;
    /** Time bucket size, present when grouped by date. */
    granularity?: MetricGranularity;
    /** Inclusive [start, end] calendar dates the query covered. Omitted for all-history queries. */
    date_range?: [string, string];
  };
  /** Grand total across the whole query. Null when there is no data. */
  value: number | null;
  partition?: MetricPartition;
};
/**
 * Aggregate review counts for one or more apps, bucketed by dimension. Returns one count per
 * dimension value, plus a global total across the matched set.
 *
 * Reviews are public, so this works for any app (with the right plan), not just those the account
 * tracks; with no app filter, counts cover every tracked app. Without a date range, covers the last
 * 30 days. For individual review text, use af.reviews.list.
 *
 * @example
 * 	Break down Minecraft's recent reviews.
 * 	af.reviews.breakdown({ filterAppsById: ["ua_X7iNgb"] })
 *
 * @example
 * 	Where are Minecraft's biggest fans writing from?
 * 	af.reviews.breakdown({ filterAppsById: ["ua_X7iNgb"], stars: [5] })
 *
 * @example
 * 	Count Minecraft's December 2025 5-star reviews.
 * 	af.reviews.breakdown({ filterAppsById: ["ua_X7iNgb"], stars: [5], start: "2025-12-01", end: "2025-12-31" })
 *
 * @example
 * 	How many Minecraft reviewers raved?
 * 	af.reviews.breakdown({ filterAppsById: ["ua_X7iNgb"], q: "love amazing fun great best" })
 *
 * @example
 * 	Compare review volume across your own apps.
 * 	af.reviews.breakdown({ filterAppsBySource: ["own"] })
 */
interface ReviewsBreakdownInput {
  /** Filter by star rating. */
  stars?: Array<1 | 2 | 3 | 4 | 5>;
  /** Filter by app version. Pass multiple to combine. */
  versions?: string[];
  /** Filter to one or more ISO country codes (e.g. US, JP, GB). */
  countries?: string[];
  /**
   * Search review title and body. Pass multiple keywords to match any. Case-insensitive; combines
   * with other filters.
   */
  q?: string;
  /** Filter by whether you have responded. Omit to include all reviews. */
  responseStatus?: 'with_response' | 'without_response';
  /**
   * Only include data about specific apps, by product ID or unified app ID. Takes precedence over the
   * other `filterAppsBy*` keys when set. Storefront, source, or type filters are better for app sets
   * that can be described by those criteria.
   */
  filterAppsById?: AppId[];
  /** Narrow the account's tracked apps to those on these storefronts (e.g. apple:ios, google_play). */
  filterAppsByStorefront?: string[];
  /** Narrow the account's tracked apps by tracking relationship. */
  filterAppsBySource?: TrackingSource[];
  /** Narrow the account's tracked apps to products of these types. */
  filterAppsByType?: ProductType[];
  /** Start date (YYYY-MM-DD) */
  start?: string;
  /** End date (YYYY-MM-DD, defaults to today) */
  end?: string;
  /** Limit the response to these dimensions; omit to return all. */
  by?: Array<'stars' | 'country' | 'version' | 'language' | 'product' | 'response' | 'deleted' | 'tag'>;
  /** Maximum values returned per dimension; the rest are summed under `__other__`. */
  top?: number;
}
type ReviewsBreakdownOutput = {
  metadata: {
    total_count: number;
    date_range: [string, string];
  };
  by_stars?: Record<string, number | undefined>;
  by_country?: Record<string, number | undefined>;
  by_version?: Record<string, number | undefined>;
  by_language?: Record<string, number | undefined>;
  by_product?: Record<string, number | undefined>;
  by_response?: {
    with_response: number;
    without_response: number;
  };
  by_deleted?: {
    deleted: number;
    active: number;
  };
  by_tag?: Record<string, number | undefined>;
};
/**
 * Read individual reviews for one or more apps. Returns review text, star rating, country, app
 * version, and your response. Filterable by star rating, date range, country, version, response
 * status, and tracking relationship.
 *
 * Reviews are public, so this works for any app (with the right plan), not just those the account
 * tracks; with no app filter, results cover every tracked app. For volume counts by dimension, see
 * af.reviews.breakdown. To respond to a review, use af.reviews.reply (write access requires owning
 * the app). `response` can include responses the store hasn't published yet.
 *
 * @example
 * 	Read Minecraft's recent reviews.
 * 	af.reviews.list({ filterAppsById: ["ua_X7iNgb"] })
 *
 * @example
 * 	Read Minecraft's 5-star reviews.
 * 	af.reviews.list({ filterAppsById: ["ua_X7iNgb"], stars: [5] })
 *
 * @example
 * 	Compare Minecraft's reviews across the US, Japan, and the UK.
 * 	af.reviews.list({ filterAppsById: ["ua_X7iNgb"], countries: ["US","JP","GB"] })
 *
 * @example
 * 	Read Minecraft's December 2025 reviews.
 * 	af.reviews.list({ filterAppsById: ["ua_X7iNgb"], start: "2025-12-01", end: "2025-12-31" })
 *
 * @example
 * 	Page through long results across your own apps.
 * 	af.reviews.list({ filterAppsBySource: ["own"], count: 50, page: 2 })
 *
 * @example
 * 	Find your 1-2 star reviews without a response.
 * 	af.reviews.list({ filterAppsBySource: ["own"], stars: [1,2], responseStatus: "without_response" })
 */
interface ReviewsListInput {
  /** Filter by star rating. */
  stars?: Array<1 | 2 | 3 | 4 | 5>;
  /** Filter by app version. Pass multiple to combine. */
  versions?: string[];
  /** Filter to one or more ISO country codes (e.g. US, JP, GB). */
  countries?: string[];
  /**
   * Search review title and body. Pass multiple keywords to match any. Case-insensitive; combines
   * with other filters.
   */
  q?: string;
  /** Filter by whether you have responded. Omit to include all reviews. */
  responseStatus?: 'with_response' | 'without_response';
  /** Sort by review date or star rating. */
  sort?: 'date' | 'stars';
  order?: SortOrder;
  /**
   * Only include data about specific apps, by product ID or unified app ID. Takes precedence over the
   * other `filterAppsBy*` keys when set. Storefront, source, or type filters are better for app sets
   * that can be described by those criteria.
   */
  filterAppsById?: AppId[];
  /** Narrow the account's tracked apps to those on these storefronts (e.g. apple:ios, google_play). */
  filterAppsByStorefront?: string[];
  /** Narrow the account's tracked apps by tracking relationship. */
  filterAppsBySource?: TrackingSource[];
  /** Narrow the account's tracked apps to products of these types. */
  filterAppsByType?: ProductType[];
  /** Start date (YYYY-MM-DD) */
  start?: string;
  /** End date (YYYY-MM-DD, defaults to today) */
  end?: string;
  /** Number of results to return. */
  count?: number;
  /** Page number. 1-500. */
  page?: number;
}
type ReviewsListOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
    page_products: Record<string, {
      name: string;
      /**
       * Mix of stores and networks (ad networks, analytics SDKs) connected to this product, sorted with
       * the canonical store first.
       */
      storefronts: string[];
    } | undefined>;
    review_counts_by_product: Record<string, number | undefined>;
  };
  results: Array<{
    /** Review ID */
    review_id: string;
    /** A number representing a product on a single store */
    product_id: number;
    stars: 0 | 1 | 2 | 3 | 4 | 5;
    /** ISO country code (e.g. US, JP, GB) */
    country: string;
    version: string | null;
    date: string;
    author: string;
    title: string;
    body: string;
    deleted: boolean;
    has_response: boolean;
    response?: {
      content: string;
      date: string;
    };
  }>;
};
/**
 * Post or withdraw a developer response on a specific review. Pass `content` to post; pass `delete:
 * true` to withdraw a previously-posted response.
 *
 * Write access only: the account must own the app the review is on. Review IDs come from
 * af.reviews.list; pass the row's `review_id`. The store may take time to show a response publicly.
 * Posted responses appear as `response` in af.reviews.list.
 *
 * @remarks
 *   Mutation (destructive) — requires explicit confirmation in tools mode.
 * @example
 * 	Reply to a low-star review after shipping a fix.
 * 	af.reviews.reply({ reviewId: "rev123", content: "We just shipped a fix in v2.1. Let us know if you still see this." })
 *
 * @example
 * 	Withdraw a previously-posted response.
 * 	af.reviews.reply({ reviewId: "rev123", delete: true })
 */
interface ReviewsReplyInput {
  /** Review to act on. Use `review_id` from af.reviews.list. */
  reviewId: string;
  /** Response text the developer wants to publish. */
  content?: string;
  /** Withdraw the previously-posted response on this review. Mutually exclusive with `content`. */
  delete?: boolean;
}
type ReviewsReplyOutput = {
  accepted: true;
};
/**
 * List every known SDK with its id, or search to find a specific one.
 *
 * @example
 * 	Find OneSignal's id.
 * 	af.sdks.list({ q: "OneSignal" })
 *
 * @example
 * 	Search for analytics SDKs.
 * 	af.sdks.list({ q: "analytics" })
 *
 * @example
 * 	Look up details for several SDK ids.
 * 	af.sdks.list({ sdkId: ["firebase","admob","onesignal"] })
 *
 * @example
 * 	Include inactive SDKs in the listing (not common).
 * 	af.sdks.list({ includeInactive: true })
 */
interface SdksListInput {
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
  /** Filter by `name`, `description`, `tags`. */
  q?: string;
  /** Field to sort by. Omit to order by relevance when `q` is set, otherwise list order. */
  sort?: 'name' | 'active';
  order?: SortOrder;
  /** Only return these SDK ids. */
  sdkId?: string[];
  /** Include inactive SDKs. Rare; most callers want active only. */
  includeInactive?: boolean;
}
type SdksListOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    sdk_id: string;
    name: string;
    description?: string | null;
    tags: string[];
    active: boolean;
  }>;
};
/**
 * Read the full store listing for one storefront: localized text (name, subtitle, description,
 * release notes) plus screenshots, video, categories, monetization, supported devices, country
 * availability, price, ratings, file size, and age rating. Takes a numeric product ID (one
 * storefront at a time; a unified app has one product per storefront). One locale per request.
 *
 * Everything visible on one app's store page, resolved to one locale. The response includes
 * `sibling_products` (product IDs for the same app on other storefronts); one request covers one
 * listing. Filtering or searching listings across the catalog (e.g. "apps whose description
 * mentions X") lives in af.explorer.listProducts. Identity/publisher/member-products data lives in
 * af.apps.get.
 *
 * @example
 * 	Read Minecraft's store listing.
 * 	af.store.appListing({ productId: 10157213 })
 *
 * @example
 * 	Read Minecraft's Japanese-localized listing.
 * 	af.store.appListing({ productId: 10157213, language: "ja" })
 *
 * @example
 * 	Read Minecraft's iPad screenshots.
 * 	af.store.appListing({ productId: 10157213, deviceType: "tablet" })
 */
interface StoreAppListingInput {
  /**
   * Numeric product ID for one storefront. Not a unified app ID. Member product_id values are
   * available from af.apps.get({ appId: "<unified-app-id>" }).
   */
  productId: number;
  /**
   * Locale (e.g. en, ja, zh-Hans) for name, subtitle, description, release notes, and screenshots.
   * Defaults to en; falls back to the first available locale when the requested one has no metadata.
   * The response echoes the resolved language.
   */
  language?: string;
  /**
   * Relevant to Apple apps. Pick handheld for iPhone-specific metadata, tablet for iPad, desktop for
   * Mac, etc.
   */
  deviceType?: DeviceType;
}
type StoreAppListingOutput = {
  /** A number representing a product on a single store */
  product_id: number;
  name?: string;
  subtitle?: string;
  storefronts: string[];
  publisher: {
    id: number;
    name: string;
  };
  /** All-time average star rating shown on the store page, 0-5. Null when there are no ratings. */
  rating: number | null;
  /** All-time number of ratings shown on the store page. Null when the catalog has no rating data. */
  all_rating_count: number | null;
  price_usd: number | null;
  monetization_strategies: MonetizationStrategy[];
  media: {
    device_model?: string;
    device_display_name?: string;
    screenshots: string[];
    video_url?: string;
  };
  release_notes?: string;
  latest_version: string;
  description?: string;
  file_size_bytes: number | null;
  categories: Array<{
    id: number;
    name: string;
    parent_id: number | null;
  }>;
  supported_device_types: string[];
  /**
   * Locales the app's own UI is translated into. Independent of store_languages: an app can ship in
   * English only while its store page is in 20 languages, or vice versa.
   */
  app_languages: string[];
  recommended_age?: string;
  language: string;
  store_url: string | null;
  /**
   * Locales the store listing page is translated into (marketing copy: name, subtitle, description,
   * screenshots).
   */
  store_languages: string[];
  countries: string[];
  /** Unified app identifier */
  parent_unified_app_id: string;
  sibling_products: Array<{
    /** A number representing a product on a single store */
    product_id: number;
    storefronts: string[];
  }>;
};
/**
 * Trace rank history for one or more apps across countries, device types, category subtypes, and
 * categories, as time-series positions with day-over-day deltas.
 *
 * For the inverse (e.g., "what app is at #10 in UK Games?"), see af.store.topCharts. Keyword search
 * positions are in af.keywords.organic. Pass a unified app ID to cover every storefront with
 * app-intelligence coverage, or a numeric product ID for one storefront.
 *
 * @example
 * 	Check ChatGPT's current ranks (unified app).
 * 	af.store.appRanks({ appIds: ["ua_miTXv6"], countries: ["US"] })
 *
 * @example
 * 	Check ChatGPT's current ranks on one storefront.
 * 	af.store.appRanks({ appIds: [336744124021], countries: ["US"] })
 *
 * @example
 * 	Compare ChatGPT's ranks across the US, UK, and Japan.
 * 	af.store.appRanks({ appIds: ["ua_miTXv6"], countries: ["US","GB","JP"] })
 *
 * @example
 * 	Check Procreate's paid iPad chart ranks.
 * 	af.store.appRanks({ appIds: ["ua_CxA1MS"], subtypes: ["paid"], deviceTypes: ["tablet"], countries: ["US"] })
 *
 * @example
 * 	Trace ChatGPT's chart history through July 2026.
 * 	af.store.appRanks({ appIds: ["ua_miTXv6"], granularity: "daily", start: "2026-07-01", end: "2026-07-31", countries: ["US"] })
 *
 * @example
 * 	Check ChatGPT's rank in one category (US iOS Productivity).
 * 	af.store.appRanks({ appIds: [336744124021], categoryIds: [6007], countries: ["US"] })
 */
interface StoreAppRanksInput {
  /** App identifiers (unified app IDs or product IDs) */
  appIds: AppId[];
  /** Country codes to query. Defaults to every country with rank coverage. */
  countries?: string[];
  /**
   * Sampling rate. Hourly gives the freshest data; pass granularity: "daily" for compact multi-day
   * history.
   */
  granularity?: 'daily' | 'hourly';
  /** Which device types to include; each ranks in its own chart. Add more to widen the response. */
  deviceTypes?: DeviceType[];
  /** Which category subtypes to include; each ranks in its own chart. Add more to widen the response. */
  subtypes?: StoreCategorySubtype[];
  /**
   * Filter response rows to specific category IDs; omit for all. Category IDs come from
   * af.store.categories.
   */
  categoryIds?: number[];
  /** Start date (YYYY-MM-DD) */
  start?: string;
  /** End date (YYYY-MM-DD, defaults to today) */
  end?: string;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type StoreAppRanksOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
    start_date: string | null;
    end_date: string | null;
    dates: string[];
    page_categories: Record<string, string | undefined>;
    unified_app_member_products?: Record<string, {
      name: string;
      /**
       * Mix of stores and networks (ad networks, analytics SDKs) connected to this product, sorted with
       * the canonical store first.
       */
      storefronts: string[];
    } | undefined>;
  };
  results: Array<{
    /** ISO country code (e.g. US, JP, GB) */
    country: string;
    /** A number representing a product on a single store */
    product_id: number;
    /** Store category ID */
    category_id: number;
    category_subtype: StoreCategorySubtype;
    positions: Array<number | null>;
    deltas: Array<number | null>;
  }>;
};
/**
 * List every store category with its ID. Numeric category IDs required by af.store.appRanks({
 * categoryIds }) and af.store.topCharts({ categoryId }) are available here.
 *
 * @example
 * 	Find the Games category.
 * 	af.store.categories({ q: "games" })
 *
 * @example
 * 	List every Apple iOS category.
 * 	af.store.categories({ storefront: ["apple:ios"] })
 *
 * @example
 * 	List subcategories of a parent category (here, Apple Games).
 * 	af.store.categories({ parentId: 6014 })
 *
 * @example
 * 	Include categories from non-rank-supporting stores (e.g. Roku, Vizio) (not common).
 * 	af.store.categories({ all: true })
 */
interface StoreCategoriesInput {
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
  /** Filter by `name`. */
  q?: string;
  /** Field to sort by. Omit to order by relevance when `q` is set, otherwise list order. */
  sort?: 'name';
  order?: SortOrder;
  /** Only return these category IDs. */
  categoryId?: number[];
  /** Only include subcategories of this parent category (drill-down by id). */
  parentId?: number;
  /** Only include categories from these storefronts (e.g. `apple:ios`, `google_play`). */
  storefront?: string[];
  /** Only include categories for these device types (e.g. `handheld`, `tablet`). */
  deviceType?: string[];
  /** Include non-rank stores (roku, vizio, etc.). These have categories but no rank data. */
  all?: boolean;
}
type StoreCategoriesOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
  };
  results: Array<{
    /** Store category ID */
    category_id: number;
    name: string;
    parent_id: number | null;
    /**
     * App store platform (e.g. apple:ios, google_play, amazon_appstore, steam, windows10, apple:mac,
     * apple:tv, apple:imessage, or another supported storefront).
     */
    storefront: string;
    /**
     * Device type (e.g. handheld, tablet, watch, tv, desktop, headset, or another value the platform
     * reports).
     */
    device_type: string;
    subtypes: StoreCategorySubtype[];
  }>;
};
/**
 * List featured and editorial placements for an app or storefront product. Request 0 rows for
 * summary stats only.
 *
 * Today tab, stories, collections, and similar curated placements. Pass a unified app ID to cover
 * every storefront with app-intelligence coverage, or a numeric product ID for one storefront.
 * Without a date range, covers the last 30 days.
 *
 * @example
 * 	List Minecraft's recent featured placements (unified app).
 * 	af.store.featured({ appId: "ua_X7iNgb" })
 *
 * @example
 * 	List Minecraft's recent featured placements on one storefront.
 * 	af.store.featured({ appId: 10157213 })
 *
 * @example
 * 	Compare Minecraft's placement coverage across the US, UK, and Japan.
 * 	af.store.featured({ appId: "ua_X7iNgb", countries: ["US","GB","JP"] })
 *
 * @example
 * 	List Minecraft's placements during a specific month (December 2025).
 * 	af.store.featured({ appId: "ua_X7iNgb", start: "2025-12-01", end: "2025-12-31" })
 *
 * @example
 * 	List Minecraft's placements with rank history.
 * 	af.store.featured({ appId: "ua_X7iNgb", includeRankTrend: true })
 *
 * @example
 * 	List Minecraft's placements sorted by end date, newest run first.
 * 	af.store.featured({ appId: "ua_X7iNgb", sort: "date", order: "desc" })
 *
 * @example
 * 	Get Minecraft's placement summary only.
 * 	af.store.featured({ appId: "ua_X7iNgb", count: 0 })
 */
interface StoreFeaturedInput {
  /** The app's unified app ID or product ID. */
  appId: AppId;
  /**
   * Countries to include. Omit to query US only, or pass multiple to compare markets. To include
   * every country, set allCountries instead.
   */
  countries?: string[];
  /** Include every country. Cannot be combined with countries. */
  allCountries?: boolean;
  /** Include per-interval rank_trend for each placement. */
  includeRankTrend?: boolean;
  /** Sort placements by relevance or date. */
  sort?: 'relevance' | 'date';
  order?: SortOrder;
  /** Start date (YYYY-MM-DD) */
  start?: string;
  /** End date (YYYY-MM-DD, defaults to today). Spans at most 31 days. */
  end?: string;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type StoreFeaturedOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
    /** Labels for category IDs visible on the current result page, keyed by category ID. */
    page_categories: Record<string, string | undefined>;
    summary: {
      total_placements: number;
      countries_count: number;
      products_count: number;
      by_featured_surface: {
        apple_today: number;
        google_editors_choice: number;
      };
      /** Placement counts keyed by ISO country code. */
      by_country: Record<string, number | undefined>;
      /** Placement counts keyed by numeric product ID as a string. */
      by_product_id: Record<string, number | undefined>;
      latest_placement_end_date: string | null;
    };
    unified_app_member_products?: Record<string, {
      name: string;
      /**
       * Mix of stores and networks (ad networks, analytics SDKs) connected to this product, sorted with
       * the canonical store first.
       */
      storefronts: string[];
    } | undefined>;
  };
  results: Array<{
    placement_id: string;
    /** A number representing a product on a single store */
    product_id: number;
    /** ISO country code (e.g. US, JP, GB) */
    country: string;
    /** Store category ID */
    category_id: number;
    category_subtype: StoreCategorySubtype;
    /**
     * Device type (e.g. handheld, tablet, watch, tv, desktop, headset, or another value the platform
     * reports).
     */
    viewed_from: string;
    crumbs: string[];
    /**
     * Usually YYYY-MM-DD. If a date string has no valid YYYY-MM-DD prefix, the original value is
     * preserved.
     */
    start_date: string;
    /**
     * Usually YYYY-MM-DD. If a date string has no valid YYYY-MM-DD prefix, the original value is
     * preserved.
     */
    end_date: string;
    best_rank: number;
    worst_rank: number;
    /** Per-interval placement rank trend. Pass includeRankTrend to expand it. */
    rank_trend: Array<{
      /**
       * Usually YYYY-MM-DD. If a date string has no valid YYYY-MM-DD prefix, the original value is
       * preserved.
       */
      start_date: string;
      /**
       * Usually YYYY-MM-DD. If a date string has no valid YYYY-MM-DD prefix, the original value is
       * preserved.
       */
      end_date: string;
      rank: number;
    }> | null;
  }>;
};
/**
 * List the top apps in a category chart for a given country and category, with current positions
 * and day-over-day deltas.
 *
 * For the inverse (e.g., "where does Minecraft rank in UK Games?"), see af.store.appRanks.
 *
 * @example
 * 	Find the Games category, then pull its US chart.
 * 	af.store.categories({ q: "games" })
 * 	af.store.topCharts({ country: "US", categoryId: 6014 })
 *
 * @example
 * 	List top paid apps on the US App Store.
 * 	af.store.topCharts({ country: "US", categoryId: 25204, subtype: "paid" })
 *
 * @example
 * 	List top free apps on the Japan App Store.
 * 	af.store.topCharts({ country: "JP", categoryId: 25204 })
 *
 * @example
 * 	List top free apps on Google Play in the US.
 * 	af.store.topCharts({ country: "US", categoryId: 100 })
 *
 * @example
 * 	List top free apps on the US App Store in July 2026.
 * 	af.store.topCharts({ country: "US", categoryId: 25204, date: "2026-07-01" })
 */
interface StoreTopChartsInput {
  /** ISO country code (e.g. US, JP, GB) */
  country: string;
  /** Category IDs come from af.store.categories. */
  categoryId: number;
  /** Category subtype (chart variant within the category). */
  subtype?: StoreCategorySubtype;
  /** Snapshot date (YYYY-MM-DD, defaults to current). */
  date?: string;
  /** Number of results to return. */
  count?: number;
  /** Page number. */
  page?: number;
}
type StoreTopChartsOutput = {
  metadata: {
    resultset: {
      count: number;
      page: number;
      total_count: number;
      total_pages: number;
    };
    category: {
      /** Store category ID */
      id: number;
      name: string;
      subtype: StoreCategorySubtype;
    };
    timestamp: string;
  };
  results: Array<{
    /** A number representing a product on a single store */
    product_id: number;
    name: string;
    developer: string;
    /**
     * App store platform (e.g. apple:ios, google_play, amazon_appstore, steam, windows10, apple:mac,
     * apple:tv, apple:imessage, or another supported storefront).
     */
    storefront: string;
    price: number | null;
    price_currency: string | null;
    position: number;
    delta?: number;
  }>;
};
/** Every visible action's dotted path → its input/output types. The SDK is typed against this. */
interface ActionIO {
  'appleAds.adGroups': {
    input: AppleAdsAdGroupsInput;
    output: AppleAdsAdGroupsOutput;
  };
  'appleAds.campaigns': {
    input: AppleAdsCampaignsInput;
    output: AppleAdsCampaignsOutput;
  };
  'appleAds.keywords': {
    input: AppleAdsKeywordsInput;
    output: AppleAdsKeywordsOutput;
  };
  'appleAds.organizations': {
    input: AppleAdsOrganizationsInput;
    output: AppleAdsOrganizationsOutput;
  };
  'appleAds.report': {
    input: AppleAdsReportInput;
    output: AppleAdsReportOutput;
  };
  'appleAds.searchTerms': {
    input: AppleAdsSearchTermsInput;
    output: AppleAdsSearchTermsOutput;
  };
  'appleAds.topKeywords': {
    input: AppleAdsTopKeywordsInput;
    output: AppleAdsTopKeywordsOutput;
  };
  'apps.breakdown': {
    input: AppsBreakdownInput;
    output: AppsBreakdownOutput;
  };
  'apps.get': {
    input: AppsGetInput;
    output: AppsGetOutput;
  };
  'apps.search': {
    input: AppsSearchInput;
    output: AppsSearchOutput;
  };
  'apps.tracked': {
    input: AppsTrackedInput;
    output: AppsTrackedOutput;
  };
  'audience.crossUsage': {
    input: AudienceCrossUsageInput;
    output: AudienceCrossUsageOutput;
  };
  'audience.demographics': {
    input: AudienceDemographicsInput;
    output: AudienceDemographicsOutput;
  };
  'docs.get': {
    input: DocsGetInput;
    output: DocsGetOutput;
  };
  'explorer.aggregateProducts': {
    input: ExplorerAggregateProductsInput;
    output: ExplorerAggregateProductsOutput;
  };
  'explorer.describeFields': {
    input: ExplorerDescribeFieldsInput;
    output: ExplorerDescribeFieldsOutput;
  };
  'explorer.listProducts': {
    input: ExplorerListProductsInput;
    output: ExplorerListProductsOutput;
  };
  'keywords.advertisers': {
    input: KeywordsAdvertisersInput;
    output: KeywordsAdvertisersOutput;
  };
  'keywords.organic': {
    input: KeywordsOrganicInput;
    output: KeywordsOrganicOutput;
  };
  'keywords.paid': {
    input: KeywordsPaidInput;
    output: KeywordsPaidOutput;
  };
  'keywords.rankingApps': {
    input: KeywordsRankingAppsInput;
    output: KeywordsRankingAppsOutput;
  };
  'keywords.related': {
    input: KeywordsRelatedInput;
    output: KeywordsRelatedOutput;
  };
  'keywords.suggestions': {
    input: KeywordsSuggestionsInput;
    output: KeywordsSuggestionsOutput;
  };
  'keywords.track': {
    input: KeywordsTrackInput;
    output: KeywordsTrackOutput;
  };
  'keywords.tracked': {
    input: KeywordsTrackedInput;
    output: KeywordsTrackedOutput;
  };
  'keywords.trackedRanks': {
    input: KeywordsTrackedRanksInput;
    output: KeywordsTrackedRanksOutput;
  };
  'keywords.trackedTrend': {
    input: KeywordsTrackedTrendInput;
    output: KeywordsTrackedTrendOutput;
  };
  'keywords.untrack': {
    input: KeywordsUntrackInput;
    output: KeywordsUntrackOutput;
  };
  'metrics.describeDatasets': {
    input: MetricsDescribeDatasetsInput;
    output: MetricsDescribeDatasetsOutput;
  };
  'metrics.query': {
    input: MetricsQueryInput;
    output: MetricsQueryOutput;
  };
  'reviews.breakdown': {
    input: ReviewsBreakdownInput;
    output: ReviewsBreakdownOutput;
  };
  'reviews.list': {
    input: ReviewsListInput;
    output: ReviewsListOutput;
  };
  'reviews.reply': {
    input: ReviewsReplyInput;
    output: ReviewsReplyOutput;
  };
  'sdks.list': {
    input: SdksListInput;
    output: SdksListOutput;
  };
  'store.appListing': {
    input: StoreAppListingInput;
    output: StoreAppListingOutput;
  };
  'store.appRanks': {
    input: StoreAppRanksInput;
    output: StoreAppRanksOutput;
  };
  'store.categories': {
    input: StoreCategoriesInput;
    output: StoreCategoriesOutput;
  };
  'store.featured': {
    input: StoreFeaturedInput;
    output: StoreFeaturedOutput;
  };
  'store.topCharts': {
    input: StoreTopChartsInput;
    output: StoreTopChartsOutput;
  };
}
/** Group wildcards for tools-mode `include`/`exclude` (expands to that group's visible actions). */
type GroupWildcard = 'appleAds.*' | 'apps.*' | 'audience.*' | 'docs.*' | 'explorer.*' | 'keywords.*' | 'metrics.*' | 'reviews.*' | 'sdks.*' | 'store.*';
//#endregion
//#region .gen/stage/toolResult.d.ts
/**
 * Why a call failed — the af-utils-free cause taxonomy, mirroring `runAction`'s `ActionErrorCause`.
 * `input` is client-side validation; the rest come from `runAction`. (A `refusal` isn't here — a declined
 * write isn't an error; see {@link ExecuteResult}.)
 */
type ActionErrorCauseType = 'input' | 'expected' | 'auth' | 'unexpected';
/**
 * The outcome of `execute()`, in the `ok`/`cause` Result shape that `runAction`'s `ActionRunResult` and the
 * typed client's `AppfiguresActionError` both use — re-expressed in primitives (no af-utils
 * `AgentHint`/`AgentActionRef`) so it can sit in the published `.d.ts`.
 *
 * Two variants: a success, or a not-ok failure. Every failure shares one shape — a bug (`unexpected`) is just
 * another failure. `execute()` sanitizes it (raw error to `onUnexpectedError`, `internal error in <tool>` as
 * the message) and attaches a retry-once/degrade `hint`, so the result is always safe to render.
 *
 * A `refusal` (an unapproved write) is a cause alongside the rest — structurally like `auth` (didn't run, not
 * the agent's fault, unblocked by an external party).
 */
type ExecuteResult = {
  ok: true;
  data: unknown;
  hints: string[];
} | {
  ok: false;
  cause: ActionErrorCauseType | 'refusal';
  message: string;
  suggestedActions: string[];
  hints: string[];
};
/**
 * Map an {@link ExecuteResult} to the payload the model sees, so the success / failure shapes live in one
 * place instead of being re-derived in each framework adapter. Adapters that return objects (AI SDK) use it
 * directly; adapters that need a string (OpenAI Chat Completions, LangChain) `JSON.stringify` it.
 *
 * - **success** (`ok: true`) → `{ data, hints? }` — `hints` as a sibling key (not concatenated into `data`)
 *   so the model reads a truncation/deprecation note alongside the numbers it qualifies.
 * - **failure** (`ok: false`) → `{ error: { causeType, message, suggestedActions?, hints? } }` — structured so
 *   the model self-corrects. `causeType: 'refusal'` is the write-gate declining an unapproved write;
 *   `causeType: 'unexpected'` is a bug, whose `hints` steer the model to retry once, then degrade.
 */
declare function toModelPayload(result: ExecuteResult): {
  hints?: string[] | undefined;
  data: unknown;
  error?: undefined;
} | {
  error: {
    hints?: string[] | undefined;
    suggestedActions?: string[] | undefined;
    causeType: ActionErrorCauseType | "refusal";
    message: string;
  };
};
//#endregion
//#region .gen/stage/actionsOptions.d.ts
/** An action path or group wildcard, typed against the visible surface (not the authoring surface). */
type ToolSelector = keyof ActionIO | GroupWildcard;
/**
 * Options for `createAppfiguresActions` — the framework-neutral core. Configure transport once here: the
 * built-in one via `apiKey`, or a `transport` that replaces it. A per-call `execute(…, { transport })`
 * overrides it.
 */
interface AppfiguresActionsOptions {
  /**
   * Bearer token, or an async getter called on each request (for refreshing credentials). Falls back
   * to `process.env.APPFIGURES_API_KEY`; throws if neither is set. Omit when a `transport` authenticates.
   */
  apiKey?: APIKey;
  /**
   * **Replace** the built-in transport with your own client: it gets the bare path (no `baseUrl` prefix) and
   * owns auth (the SDK attaches no `Authorization`) — the multi-tenant seam where a host routes each request
   * through a per-request client. Mutually exclusive with `apiKey`. To *customize* the built-in transport
   * instead of replacing it — a non-production base URL, a wrapped `fetch` — pass
   * `transport: defaultTransport({ apiKey, baseUrl, fetch })`. See `AppfiguresTransport`.
   */
  transport?: AppfiguresTransport;
  /** Restrict to these actions/groups. Omit for the full visible surface. */
  include?: ToolSelector[];
  /** Drop these actions/groups (applied after `include`). */
  exclude?: ToolSelector[];
  /**
   * Transform each {@link ActionDescriptor} as `list()` produces it — e.g. add a display-only input field a
   * host UI needs on every tool. Applied once at creation. `execute` is unaffected: it runs against the
   * action's own schema, so any field added here that isn't in that schema is stripped when the input is
   * parsed. Use this instead of wrapping the surface after creation.
   */
  mapDescriptor?: (descriptor: ActionDescriptor) => ActionDescriptor;
  /**
   * A fixed date to write the example dates in tool descriptions from, instead of today. Set it to keep the
   * descriptions identical from day to day, so a model provider's prompt cache keeps matching them. Tools
   * still run on today's date (e.g. their default date ranges).
   */
  examplesDate?: Date;
  /**
   * Approve a mutating call. Every action with a `mutation` refuses unless this resolves `true` —
   * the guard against prompt-injected writes (e.g. `reviews.reply` reachable via attacker-authored
   * review text). Receives the parsed input.
   */
  confirmMutation?: (args: {
    path: keyof ActionIO;
    mutation: string;
    input: unknown;
  }) => Promise<boolean>;
  /**
   * Observe unexpected (bug) failures for logging/alerting. `execute` logs the raw error here, then returns
   * a sanitized `internal error in <tool>` — so the model (and any adapter) only ever sees the safe message,
   * never a stack or the underlying error. Receives the failing action's path and the thrown error.
   */
  onUnexpectedError?: (args: {
    path: keyof ActionIO;
    error: unknown;
  }) => void;
}
/**
 * Options for the framework adapters (`toAISDKTools` / `toOpenAITools` / `toLangChainTools`, …). Shared so
 * the option surface can't drift across adapters. `TPayload` is the adapter's framework-native per-call
 * payload (a tool-call id, a request context, …), surfaced to {@link AdapterToolsOptions.execute}.
 *
 * Bug logging (`onUnexpectedError`) and the write gate (`confirmMutation`) are surface-level policies — set
 * them on `createAppfiguresActions`, not here.
 */
interface AdapterToolsOptions<TPayload = never> {
  /**
   * Execute each call yourself instead of letting the adapter drive the surface's `execute`. Receives the
   * adapter's per-call `payload` and returns the {@link ExecuteResult} the adapter then maps. The point is
   * per-call transport: a multi-tenant host builds a per-request client from the payload and passes it as
   * `transport` (e.g. `actions.execute({ path, input, signal, transport })`), so auth varies per call
   * without rebuilding the surface. Omit it and the adapter runs the call with the configured transport.
   */
  execute?: (args: {
    /** The action being called, as its dotted path (`apps.get`). */
    path: keyof ActionIO;
    /** The model-supplied input for this call. */
    input: unknown;
    /** The adapter's framework-native per-call payload. */
    payload: TPayload;
    /** Abort signal for this call. */
    signal?: AbortSignal;
  }) => Promise<ExecuteResult>;
}
//#endregion
//#region .gen/stage/actions.d.ts
/**
 * Model-facing metadata for one action — everything a framework adapter needs to *register* a tool, with
 * no client attached. `execute` (on the returned surface) runs it. Kept af-utils-free so it can sit in the
 * published types and be imported by browser code (the committed `staticDescriptors.gen.ts`).
 */
interface ActionDescriptor {
  /** Dotted action path (`apps.get`) — pass it to `execute`. */
  path: keyof ActionIO;
  /** Registered tool name (`apps_get`) — underscore-joined per the MCP/tool-name convention. */
  name: string;
  /** description + agentHint + rendered examples, newline-joined. */
  description: string;
  /** Absent for reads; the level (`create` | `update` | `destructive`) for writes. Gate writes on it. */
  mutation?: 'create' | 'update' | 'destructive';
  /**
   * Input-side JSON Schema for the framework's tool definition. Typed via zod (a public dep) rather
   * than `ReturnType<typeof getActionInputJsonSchema>` so no af-utils value leaks into the published
   * `.d.ts`.
   */
  inputJsonSchema: z.core.JSONSchema.JSONSchema;
}
/** The single argument to `execute` — the call (`path` + `input`) plus optional per-call transport. */
interface ExecuteArgs {
  /** Dotted action path (`apps.get`). */
  path: keyof ActionIO;
  /** The model-supplied input for this call. */
  input: unknown;
  /** Abort the underlying request(s) for this call. */
  signal?: AbortSignal;
  /**
   * **Replace** transport for this one call — a per-request client that owns the URL and auth. Use it when
   * auth varies per call (multi-tenant): the surface stays built once, only this call's transport changes.
   * It gets the bare path (no `baseUrl` prefix) and the toolkit attaches no `Authorization`. Overrides the
   * configured transport for this call.
   */
  transport?: AppfiguresTransport;
}
/**
 * The framework-neutral Appfigures action surface: describe it once, execute one action at a time with a
 * client the core builds from your configured transport. Adapters (`toAISDKTools`, …) are thin projections
 * over this; a host framework the adapters don't cover (e.g. driving your own tool wiring) uses it directly.
 */
interface AppfiguresActions {
  /** The visible surface as model-facing metadata — build your tool set once from this. */
  list(): ActionDescriptor[];
  /**
   * Run one action through the canonical pipeline (decode nullable optionals → parse → mutation gate → `runAction` →
   * resolve hints) and return a discriminated {@link ExecuteResult}. Never throws for an expected outcome;
   * a bug (`cause: 'unexpected'`) is logged via `onUnexpectedError` and returned as a sanitized message plus
   * a recovery hint, so the result is always safe to hand a model.
   */
  execute(args: ExecuteArgs): Promise<ExecuteResult>;
}
/**
 * Build the Appfigures action surface for the selected actions. Transport is configured here and reused;
 * a per-call `execute(…, { transport })` overrides it. Reads run on their own; every mutation refuses unless
 * `confirmMutation` approves it.
 */
declare function createAppfiguresActions(options?: AppfiguresActionsOptions): AppfiguresActions;
//#endregion
export { IntelTier as $, TrackingSource as $t, AppsBreakdownOutput as A, Product as At, AudienceDemographicsOutput as B, SortOrder as Bt, AppleAdsReportInput as C, MetricNode as Ct, AppleAdsTopKeywordsInput as D, MetricsQueryInput as Dt, AppleAdsSearchTermsOutput as E, MetricsDescribeDatasetsOutput as Et, AppsTrackedInput as F, ReviewsListOutput as Ft, ExplorerAggregateProductsInput as G, StoreCategoriesInput as Gt, DocsGetInput as H, StoreAppListingOutput as Ht, AppsTrackedOutput as I, ReviewsReplyInput as It, ExplorerDescribeFieldsOutput as J, StoreFeaturedInput as Jt, ExplorerAggregateProductsOutput as K, StoreCategoriesOutput as Kt, AudienceCrossUsageInput as L, ReviewsReplyOutput as Lt, AppsGetOutput as M, ReviewsBreakdownInput as Mt, AppsSearchInput as N, ReviewsBreakdownOutput as Nt, AppleAdsTopKeywordsOutput as O, MetricsQueryOutput as Ot, AppsSearchOutput as P, ReviewsListInput as Pt, GroupWildcard as Q, Tracking as Qt, AudienceCrossUsageOutput as R, SdksListInput as Rt, AppleAdsOrganizationsOutput as S, MetricGranularity as St, AppleAdsSearchTermsInput as T, MetricsDescribeDatasetsInput as Tt, DocsGetOutput as U, StoreAppRanksInput as Ut, DeviceType as V, StoreAppListingInput as Vt, EstimateBound as W, StoreAppRanksOutput as Wt, ExplorerListProductsOutput as X, StoreTopChartsInput as Xt, ExplorerListProductsInput as Y, StoreFeaturedOutput as Yt, GroupByDimension as Z, StoreTopChartsOutput as Zt, AppleAdsDisplayStatus as _, KeywordsTrackedRanksOutput as _t, AdapterToolsOptions as a, KeywordsPaidOutput as at, AppleAdsKeywordsOutput as b, KeywordsUntrackInput as bt, ActionErrorCauseType as c, KeywordsRelatedInput as ct, ActionIO as d, KeywordsSuggestionsOutput as dt, UnifiedApp as en, KeywordsAdvertisersInput as et, AppId as f, KeywordsTrackInput as ft, AppleAdsCampaignsOutput as g, KeywordsTrackedRanksInput as gt, AppleAdsCampaignsInput as h, KeywordsTrackedOutput as ht, createAppfiguresActions as i, KeywordsPaidInput as it, AppsGetInput as j, ProductType as jt, AppsBreakdownInput as k, MonetizationStrategy as kt, ExecuteResult as l, KeywordsRelatedOutput as lt, AppleAdsAdGroupsOutput as m, KeywordsTrackedInput as mt, AppfiguresActions as n, AppfiguresTransport as nn, KeywordsOrganicInput as nt, AppfiguresActionsOptions as o, KeywordsRankingAppsInput as ot, AppleAdsAdGroupsInput as p, KeywordsTrackOutput as pt, ExplorerDescribeFieldsInput as q, StoreCategorySubtype as qt, ExecuteArgs as r, FetchLike as rn, KeywordsOrganicOutput as rt, ToolSelector as s, KeywordsRankingAppsOutput as st, ActionDescriptor as t, APIKey as tn, KeywordsAdvertisersOutput as tt, toModelPayload as u, KeywordsSuggestionsInput as ut, AppleAdsKeywordStatus as v, KeywordsTrackedTrendInput as vt, AppleAdsReportOutput as w, MetricPartition as wt, AppleAdsOrganizationsInput as x, KeywordsUntrackOutput as xt, AppleAdsKeywordsInput as y, KeywordsTrackedTrendOutput as yt, AudienceDemographicsInput as z, SdksListOutput as zt };