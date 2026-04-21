export default function Home() {
  return (
    <div style={{padding:"40px",fontFamily:"system-ui",maxWidth:600,margin:"0 auto"}}>
      <h1 style={{fontSize:"24px",fontWeight:800}}>N1S Analytics Hub</h1>
      <p style={{color:"#666",marginTop:8}}>Central event collection for the 15-site N1S content network.</p>
      <h2 style={{fontSize:"16px",marginTop:24}}>Endpoints</h2>
      <ul style={{marginTop:8,lineHeight:2}}>
        <li><code>POST /api/collect</code> — Send events (pageview, affiliate_click, conversion)</li>
        <li><code>GET /api/collect?key=...&hours=24</code> — Query events</li>
        <li><code>GET /api/stats?key=...</code> — Network overview</li>
        <li><code>/tracker.js</code> — Universal tracking script</li>
      </ul>
    </div>
  );
}

