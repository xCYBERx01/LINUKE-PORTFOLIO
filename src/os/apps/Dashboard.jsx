import { useState, useEffect } from "react";
import axios from "axios";
import {
  Bitcoin,
  Cloud,
  Sparkles,
  LayoutGrid,
  Newspaper,
  Calendar,
  X,
  Trophy,
  Target,
  Zap,
  Code,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CRYPTO_URL = "https://api.coinbase.com/v2/prices/BTC-USD/spot";

const WMO = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
  61: "Light rain", 63: "Moderate rain", 65: "Heavy rain", 71: "Light snow",
  80: "Light showers", 81: "Moderate showers", 95: "Thunderstorm", 96: "Thunderstorm w/ hail",
};

const FORTUNES = [
  "The best way to predict the future is to invent it.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "The only way to do great work is to love what you do.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "Talk is cheap. Show me the code. — Linus Torvalds",
  "Any fool can write code that a computer can understand.",
  "Programs must be written for people to read.",
];

function CryptoWidget() {
  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [spot, candles] = await Promise.all([
          axios.get(CRYPTO_URL),
          axios.get("https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=300&start=1&end=300"),
        ]);
        if (!mounted) return;
        setPrice(spot.data.data.amount);
        const data = candles.data
          .slice(0, 50)
          .reverse()
          .map((c) => ({
            time: new Date(c[0] * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            price: +c[4],
          }));
        setHistory(data);
      } catch {
        if (mounted) setHistory([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    const t = setInterval(async () => {
      try {
        const spot = await axios.get(CRYPTO_URL);
        if (mounted) setPrice(spot.data.data.amount);
      } catch {}
    }, 15000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget-header">
        <Bitcoin size={16} />
        <span>Bitcoin / USD</span>
        {price && (
          <strong>${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
        )}
      </div>
      {loading ? (
        <p className="dashboard-widget-loading">Loading...</p>
      ) : history.length ? (
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.5)" }} />
            <YAxis domain={["auto", "auto"]} tick={{ fontSize: 9, fill: "rgba(255,255,255,0.5)" }} width={50} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#E95420" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="dashboard-widget-loading">Offline</p>
      )}
    </div>
  );
}

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const pos = await new Promise((res, rej) =>
          navigator.geolocation?.getCurrentPosition(res, rej, { timeout: 6000 }),
        ).catch(() => null);
        let wea = null, cityName = null;
        if (pos) {
          const lat = pos.coords.latitude.toFixed(2);
          const lon = pos.coords.longitude.toFixed(2);
          const [wr, gr] = await Promise.all([
            axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`),
            axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`),
          ]);
          wea = wr.data.current_weather;
          cityName = gr.data.city || gr.data.locality || "Your location";
        } else {
          const byIp = await axios.get("https://get.geojs.io/v1/ip/geo.json");
          const lat = byIp.data.latitude, lon = byIp.data.longitude;
          const wr = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
          wea = wr.data.current_weather;
          cityName = byIp.data.city || "Your location";
        }
        if (!mounted) return;
        setWeather(wea);
        setCity(cityName);
      } catch {}
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget-header">
        <Cloud size={16} />
        <span>Weather</span>
      </div>
      <div className="dashboard-widget-weather">
        {weather ? (
          <>
            <strong>{Math.round(weather.temperature)}°C</strong>
            <span>{WMO[weather.weathercode] || "Mixed"}</span>
            <small>{city}</small>
          </>
        ) : (
          <p className="dashboard-widget-loading">Loading...</p>
        )}
      </div>
    </div>
  );
}

function NewsWidget() {
  const [news, setNews] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await axios.get("https://api.spaceflightnewsapi.net/v4/articles/?limit=6");
        if (mounted) setNews(res.data.results || []);
      } catch {}
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="dashboard-widget dashboard-widget-wide">
      <div className="dashboard-widget-header">
        <Newspaper size={16} />
        <span>Latest News</span>
      </div>
      {news ? (
        <div className="dashboard-news-list">
          {news.slice(0, 4).map((n) => (
            <a key={n.id} href={n.url} target="_blank" rel="noreferrer" className="dashboard-news-item">
              <strong>{n.title}</strong>
              <small>{new Date(n.published_at).toLocaleDateString()}</small>
            </a>
          ))}
        </div>
      ) : (
        <p className="dashboard-widget-loading">Loading...</p>
      )}
    </div>
  );
}

function FortuneWidget() {
  const [fortune, setFortune] = useState(() => FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);

  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget-header">
        <Sparkles size={16} />
        <span>Daily Fortune</span>
      </div>
      <p className="dashboard-fortune">{fortune}</p>
      <button className="dashboard-fortune-btn" onClick={() => setFortune(FORTUNES[Math.floor(Math.random() * FORTUNES.length)])}>
        New Fortune
      </button>
    </div>
  );
}

function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget-header">
        <Calendar size={16} />
        <span>Clock</span>
      </div>
      <div className="dashboard-clock">
        <strong className="dashboard-clock-time">
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </strong>
        <span className="dashboard-clock-date">
          {now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </span>
      </div>
    </div>
  );
}

const FOOTBALL_KEY = "fcb170a793636f414b96901de3a4f2b8";
const CRICKET_KEY = "0e73d340-e7ae-46a8-8f7e-fcc0bee69b7b";

function FootballWidget() {
  const [matches, setMatches] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await axios.get("https://v3.football.api-sports.io/fixtures?live=all", {
          headers: { "x-apisports-key": FOOTBALL_KEY },
        });
        const list = res.data?.response?.slice(0, 4) || [];
        if (!mounted) return;
        if (list.length) {
          setMatches(list.map((f) => ({
            league: f.league?.name || "League",
            home: f.teams?.home?.name || "Home",
            away: f.teams?.away?.name || "Away",
            score: f.goals ? `${f.goals.home ?? 0} — ${f.goals.away ?? 0}` : f.score?.fulltime ? `${f.score.fulltime.home ?? 0} — ${f.score.fulltime.away ?? 0}` : "vs",
            status: f.fixture?.status?.short || f.fixture?.status?.long || "LIVE",
            live: true,
          })));
        } else {
          // no live right now — show today fixtures as fallback
          const today = new Date().toISOString().slice(0, 10);
          const r2 = await axios.get(`https://v3.football.api-sports.io/fixtures?date=${today}`, { headers: { "x-apisports-key": FOOTBALL_KEY } });
          const l2 = r2.data?.response?.slice(0, 4) || [];
          if (l2.length) setMatches(l2.map((f) => ({
            league: f.league?.name || "League",
            home: f.teams?.home?.name || "Home",
            away: f.teams?.away?.name || "Away",
            score: f.goals ? `${f.goals.home ?? 0} — ${f.goals.away ?? 0}` : "vs",
            status: f.fixture?.status?.short || "Scheduled",
            live: f.fixture?.status?.short === "1H" || f.fixture?.status?.short === "2H" || f.fixture?.status?.short === "LIVE",
          })));
          else setErr("No live fixtures now — showing mock");
        }
      } catch (e) {
        if (mounted) setErr(e.message || "Football API error");
      }
    }
    load();
    const id = setInterval(load, 60000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const display = matches || [
    { league: "Premier League", home: "Arsenal", away: "Man City", score: "2 — 1", status: "78'", live: true },
    { league: "LaLiga", home: "Barcelona", away: "Real Madrid", score: "1 — 1", status: "HT", live: true },
    { league: "Serie A", home: "Inter", away: "Milan", score: "0 — 0", status: "Tomorrow 19:45", live: false },
  ];

  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget-header">
        <Trophy size={16} />
        <span>Football Live</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#E95420" }}>{matches ? "● LIVE" : "● MOCK"}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {display.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 8, background: m.live ? "rgba(233,84,32,0.12)" : "#1a1a1a", border: "1px solid #333" }}>
            <div>
              <div style={{ fontSize: 11, color: "#888" }}>{m.league} • {m.status}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{m.home} vs {m.away}</div>
            </div>
            <strong style={{ fontSize: 14, color: m.live ? "#E95420" : "#aaa" }}>{m.score}</strong>
          </div>
        ))}
        <small style={{ fontSize: 10, color: "#666" }}>{err || (matches ? "Live via v3.football.api-sports.io" : "Live scores via mock — API will fill when matches are live")}</small>
      </div>
    </div>
  );
}

function CricketWidget() {
  const [matches, setMatches] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await axios.get(`https://api.cricapi.com/v1/currentMatches?apikey=${CRICKET_KEY}&offset=0`);
        const list = res.data?.data || res.data?.data?.data || [];
        const arr = Array.isArray(list) ? list.slice(0, 4) : [];
        if (!mounted) return;
        if (arr.length) {
          setMatches(arr.map((m) => ({
            league: m.name?.split(",")?.[0] || m.matchType || "Match",
            home: m.teamInfo?.[0]?.name || m.teams?.[0] || "Team 1",
            away: m.teamInfo?.[1]?.name || m.teams?.[1] || "Team 2",
            score: Array.isArray(m.score) ? m.score.map((s) => `${s.inning}: ${s.r}/${s.w} (${s.o} ov)`).join(" • ") : m.status || "Live",
            status: m.status || (m.matchStarted ? "Live" : "Scheduled"),
            live: !!m.matchStarted && m.status !== "Match not started",
          })));
        } else setErr("No live matches — showing mock");
      } catch (e) {
        if (mounted) setErr(e.response?.data?.error || e.message || "CricAPI error");
      }
    }
    load();
    const id = setInterval(load, 60000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const display = matches || [
    { league: "IPL", home: "MI", away: "CSK", score: "MI 182/4 (18.2) • CSK needs 34 off 10", status: "Live", live: true },
    { league: "ICC World Cup", home: "IND", away: "AUS", score: "IND 298/8 — AUS 142/3 (22.4)", status: "Live", live: true },
    { league: "Test", home: "ENG", away: "NZ", score: "Day 2 — ENG 320 & 45/1", status: "Stumps", live: false },
  ];

  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget-header">
        <Target size={16} />
        <span>Cricket Live</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#4fc3f7" }}>{matches ? "● LIVE" : "● MOCK"}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {display.map((m, i) => (
          <div key={i} style={{ padding: "8px 10px", borderRadius: 8, background: m.live ? "rgba(79,195,247,0.10)" : "#1a1a1a", border: "1px solid #333" }}>
            <div style={{ fontSize: 11, color: "#888" }}>{m.league} • {m.status}</div>
            <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{m.home} vs {m.away}<br /><span style={{ color: m.live ? "#4fc3f7" : "#aaa", fontWeight: 400 }}>{m.score}</span></div>
          </div>
        ))}
        <small style={{ fontSize: 10, color: "#666" }}>{err ? `${err} — mock fallback` : matches ? "Live via CricAPI (api.cricapi.com)" : "Mock fallback — live when API returns data"}</small>
      </div>
    </div>
  );
}

function QuickStatsWidget() {
  const [stats] = useState({ cpu: 42, ram: 68, uptime: "2h 14m" });
  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget-header">
        <Activity size={16} />
        <span>System Pulse</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
        <div style={{ padding: 10, background: "#1a1a1a", borderRadius: 8, border: "1px solid #333" }}><div style={{ fontSize: 18, fontWeight: 700, color: "#E95420" }}>{stats.cpu}%</div><div style={{ fontSize: 10, color: "#888" }}>CPU</div></div>
        <div style={{ padding: 10, background: "#1a1a1a", borderRadius: 8, border: "1px solid #333" }}><div style={{ fontSize: 18, fontWeight: 700, color: "#4fc3f7" }}>{stats.ram}%</div><div style={{ fontSize: 10, color: "#888" }}>RAM</div></div>
        <div style={{ padding: 10, background: "#1a1a1a", borderRadius: 8, border: "1px solid #333" }}><div style={{ fontSize: 14, fontWeight: 700 }}>{stats.uptime}</div><div style={{ fontSize: 10, color: "#888" }}>Uptime</div></div>
      </div>
    </div>
  );
}

function GithubPulseWidget() {
  return (
    <div className="dashboard-widget">
      <div className="dashboard-widget-header">
        <Code size={16} />
        <span>GitHub Pulse</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <a href="https://github.com/xCYBERx01" target="_blank" rel="noreferrer" style={{ padding: "8px 10px", background: "#1a1a1a", borderRadius: 8, border: "1px solid #333", color: "#ddd", textDecoration: "none", display: "flex", justifyContent: "space-between" }}><span>xCYBERx01</span><Zap size={14} color="#E95420" /></a>
        <div style={{ fontSize: 11, color: "#888" }}>13 projects • Croc OS most starred • Last push 2d ago</div>
        <small style={{ fontSize: 10, color: "#666" }}>Wire to GitHub API with token for live commits</small>
      </div>
    </div>
  );
}

export default function Dashboard({ onClose }) {
  return (
    <div className="dashboard-overlay">
      <div className="dashboard-backdrop" onClick={onClose} />
      <div className="dashboard-panel">
        <div className="dashboard-header">
          <LayoutGrid size={18} />
          <span>Dashboard</span>
          <button onClick={onClose} className="dashboard-close">
            <X size={16} />
          </button>
        </div>
        <div className="dashboard-grid">
          <ClockWidget />
          <WeatherWidget />
          <CryptoWidget />
          <FortuneWidget />
          <FootballWidget />
          <CricketWidget />
          <QuickStatsWidget />
          <GithubPulseWidget />
          <NewsWidget />
        </div>
      </div>
    </div>
  );
}
