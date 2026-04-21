import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key !== "n1s_analytics_2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Aggregate network stats
  const sites = [
    { domain: "llcformguide.site", vertical: "LLC Formation", cpc: 45, status: "live" },
    { domain: "mesotheliomahelp.online", vertical: "Mesothelioma", cpc: 935, status: "live" },
    { domain: "truckaccidentguide.site", vertical: "Truck Accident", cpc: 200, status: "live" },
    { domain: "medicalmalpracticeguide.site", vertical: "Medical Malpractice", cpc: 150, status: "live" },
    { domain: "workerscompguide.site", vertical: "Workers Comp", cpc: 120, status: "live" },
    { domain: "injuryclaimcalc.info", vertical: "Personal Injury", cpc: 180, status: "live" },
    { domain: "insurancecalc.info", vertical: "Insurance", cpc: 65, status: "live" },
    { domain: "mortgagecalc.site", vertical: "Mortgage", cpc: 55, status: "live" },
    { domain: "creditcardcalc.info", vertical: "Credit Cards", cpc: 40, status: "live" },
    { domain: "coinsnap.online", vertical: "Crypto", cpc: 35, status: "live" },
    { domain: "propertyvault.one", vertical: "Property Mgmt", cpc: 30, status: "live" },
    { domain: "coinvalueguide.info", vertical: "Coin Values", cpc: 15, status: "live" },
    { domain: "realtorvault.app", vertical: "Real Estate", cpc: 25, status: "build_fail" },
    { domain: "ndaforge.site", vertical: "Legal Docs", cpc: 20, status: "build_fail" },
    { domain: "legalcostguide.site", vertical: "Legal Services", cpc: 35, status: "build_fail" },
  ];

  return NextResponse.json({
    network: {
      total_sites: 15,
      live_sites: 12,
      total_articles: 15,
      cross_links: 210,
      affiliate_accounts: 11,
    },
    sites,
    updated: new Date().toISOString(),
  });
}

