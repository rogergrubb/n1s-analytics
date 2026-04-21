// N1S Analytics Tracker v1.0
// Embed: <script src="https://n1s-analytics.vercel.app/tracker.js" defer></script>

(function() {
  const ENDPOINT = "https://n1s-analytics.vercel.app/api/collect";
  const site = window.location.hostname;

  function send(event, data) {
    const payload = {
      site: site,
      event: event,
      page: window.location.pathname,
      data: data || {}
    };
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, JSON.stringify(payload));
    } else {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  }

  // 1. Page View
  send("pageview", {
    referrer: document.referrer,
    title: document.title,
    screen: window.innerWidth + "x" + window.innerHeight
  });

  // 2. Affiliate Click Tracking
  // Intercept clicks on external links (affiliate links)
  document.addEventListener("click", function(e) {
    const link = e.target.closest("a[href]");
    if (!link) return;
    const href = link.href;
    // Track external links (potential affiliate clicks)
    if (href && !href.includes(site) && href.startsWith("http")) {
      send("affiliate_click", {
        url: href,
        text: (link.textContent || "").trim().substring(0, 100),
        position: link.getBoundingClientRect().top
      });
    }
    // Track cross-network links
    const n1sDomains = [
      "llcformguide", "mesotheliomahelp", "truckaccidentguide",
      "medicalmalpracticeguide", "workerscompguide", "injuryclaimcalc",
      "insurancecalc", "mortgagecalc", "creditcardcalc",
      "coinsnap", "propertyvault", "coinvalueguide",
      "realtorvault", "ndaforge", "legalcostguide"
    ];
    if (href && n1sDomains.some(d => href.includes(d))) {
      send("crosslink_click", { destination: href });
    }
  });

  // 3. Scroll Depth (25%, 50%, 75%, 100%)
  let scrollMarks = { 25: false, 50: false, 75: false, 100: false };
  let ticking = false;
  window.addEventListener("scroll", function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = Math.round((scrollTop / docHeight) * 100);
        [25, 50, 75, 100].forEach(function(mark) {
          if (pct >= mark && !scrollMarks[mark]) {
            scrollMarks[mark] = true;
            send("scroll_depth", { depth: mark });
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // 4. Time on Page
  let startTime = Date.now();
  window.addEventListener("beforeunload", function() {
    const seconds = Math.round((Date.now() - startTime) / 1000);
    send("time_on_page", { seconds: seconds });
  });

  // 5. Conversion Events (call from site code: window.n1sTrack("conversion", {type: "signup"}))
  window.n1sTrack = function(event, data) {
    send(event, data);
  };
})();

