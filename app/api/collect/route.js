import { NextResponse } from "next/server";

// In-memory store (will persist per Vercel instance lifecycle)
// For production scale, replace with Redis/Postgres
const events = [];
const MAX_EVENTS = 50000;

const ALLOWED_SITES = [
  "llcformguide.site", "mesotheliomahelp.online", "truckaccidentguide.site",
  "medicalmalpracticeguide.site", "workerscompguide.site", "injuryclaimcalc.info",
  "insurancecalc.info", "mortgagecalc.site", "creditcardcalc.info",
  "coinsnap.online", "propertyvault.one", "coinvalueguide.info",
  "realtorvault.app", "ndaforge.site", "legalcostguide.site"
];

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { site, event, page, data } = body;

    if (!site || !event) {
      return NextResponse.json({ error: "Missing site or event" }, { status: 400 });
    }

    // Validate site
    const domain = site.replace(/^https?:\/\//, "").split("/")[0];
    if (!ALLOWED_SITES.includes(domain)) {
      return NextResponse.json({ error: "Unknown site" }, { status: 403 });
    }

    const record = {
      id: crypto.randomUUID(),
      site: domain,
      event, // pageview, affiliate_click, conversion, scroll_depth, time_on_page
      page: page || "/",
      data: data || {},
      timestamp: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "unknown",
      ua: request.headers.get("user-agent") || "unknown",
      referer: request.headers.get("referer") || "",
    };

    events.push(record);
    if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);

    return NextResponse.json({ ok: true, id: record.id });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const site = searchParams.get("site");
  const event = searchParams.get("event");
  const hours = parseInt(searchParams.get("hours") || "24");
  const key = searchParams.get("key");

  // Simple API key check
  if (key !== "n1s_analytics_2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  let filtered = events.filter(e => e.timestamp >= cutoff);

  if (site) filtered = filtered.filter(e => e.site === site);
  if (event) filtered = filtered.filter(e => e.event === event);

  // Aggregate by site
  const bySite = {};
  filtered.forEach(e => {
    if (!bySite[e.site]) bySite[e.site] = { pageviews: 0, affiliate_clicks: 0, conversions: 0, unique_pages: new Set() };
    bySite[e.site][e.event] = (bySite[e.site][e.event] || 0) + 1;
    if (e.event === "pageview") {
      bySite[e.site].pageviews++;
      bySite[e.site].unique_pages.add(e.page);
    }
    if (e.event === "affiliate_click") bySite[e.site].affiliate_clicks++;
    if (e.event === "conversion") bySite[e.site].conversions++;
  });

  // Convert Sets to counts
  Object.values(bySite).forEach(v => { v.unique_pages = v.unique_pages.size; });

  return NextResponse.json({
    total_events: filtered.length,
    period_hours: hours,
    by_site: bySite,
    recent: filtered.slice(-50).reverse(),
  });
}

