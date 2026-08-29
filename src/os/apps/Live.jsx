import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Bitcoin, Cloud, ExternalLink, ArrowLeft, ArrowRight, RotateCw, Home } from "lucide-react";

const CRYPTO_URL = "https://api.coinbase.com/v2/prices/BTC-USD/spot";

export function CryptoWindow() {
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
          .map((c) => ({ time: new Date(c[0] * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), price: +c[4] }));
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
    <div className="os-content os-crypto">
      <div className="os-crypto-head">
        <Bitcoin size={22} />
        <div>
          <span>Bitcoin / USD</span>
          <strong>{price ? `$${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "—"}</strong>
        </div>
      </div>
      {loading ? (
        <p className="os-empty">Loading market data…</p>
      ) : history.length ? (
        <div className="os-crypto-chart">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c4d1cd" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} width={64} />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="var(--accent-teal)" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="os-empty">Live chart unavailable — offline or rate-limited.</p>
      )}
      <p className="os-hint">Price updates every 15s. Data via Coinbase.</p>
    </div>
  );
}

const WMO = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
  61: "Light rain", 63: "Moderate rain", 65: "Heavy rain", 71: "Light snow",
  80: "Light showers", 81: "Moderate showers", 95: "Thunderstorm", 96: "Thunderstorm w/ hail",
};

export function NewsWindow() {
  const [news, setNews] = useState(null);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(null);
    const [units, setUnits] = useState("c");

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
      } catch {
        // weather unavailable — non-fatal
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadNews() {
      try {
        const res = await axios.get("https://api.spaceflightnewsapi.net/v4/articles/?limit=24");
        if (mounted) setNews(res.data.results || []);
      } catch {
        // non-fatal
      }
    }
    loadNews();
    return () => { mounted = false; };
  }, []);

  const temp =
    weather &&
    (units === "c" ? `${Math.round(weather.temperature)}°C` : `${Math.round((weather.temperature * 9) / 5 + 32)}°F`);

  return (
    <div className="os-news">
      <div className="os-news-weather">
        <Cloud size={20} />
        <div>
          <strong>{city ? temp : "Weather"}</strong>
          <span>{weather ? WMO[weather.weathercode] || "Mixed" : "Unavailable"}</span>
          <small>
            {city && (
              <button onClick={() => setUnits(units === "c" ? "f" : "c")}>
                Change to °{units === "c" ? "F" : "C"}
              </button>
            )}
          </small>
        </div>
      </div>
      {news ? (
        <div className="os-news-list">
          {news.map((n) => (
            <a key={n.id} href={n.url} target="_blank" rel="noreferrer">
              <strong>{n.title}</strong>
              <span>{new Date(n.published_at).toLocaleDateString()}</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="os-empty">Loading latest news…</p>
      )}
      <p className="os-hint">News via Spaceflight News API · weather via Open-Meteo</p>
    </div>
  );
}

export function BrowserWindow() {
  const HOME = "https://duckduckgo.com/html";
  const [url, setUrl] = useState(HOME);
  const [history, setHistory] = useState([HOME]);
  const [idx, setIdx] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const iframeRef = useRef(null);

  function go(value, push = true) {
    let target = String(value).trim();
    if (!target) return;
    if (!/^https?:\/\//i.test(target)) target = `https://${target}`;
    if (push) {
      const next = [...history.slice(0, idx + 1), target];
      setHistory(next);
      setIdx(next.length - 1);
    }
    setUrl(target);
    setLoadError(false);
  }

  function back() {
    if (idx <= 0) return;
    const n = idx - 1;
    setIdx(n);
    setUrl(history[n]);
    setLoadError(false);
  }

  function fwd() {
    if (idx >= history.length - 1) return;
    const n = idx + 1;
    setIdx(n);
    setUrl(history[n]);
    setLoadError(false);
  }

  function home() {
    setIdx(0);
    setUrl("https://duckduckgo.com/html");
    setLoadError(false);
  }

  function refresh() {
    setUrl((u) => `${u.split("#")[0].split("?")[0]}?t=${Date.now()}`);
    setLoadError(false);
  }

  function handleLoad() {
    setLoadError(false);
  }

  function handleError() {
    setLoadError(true);
  }

  return (
    <div className="os-browser">
      <div className="os-browser-bar">
        <button disabled={idx === 0} onClick={back} aria-label="Back"><ArrowLeft size={14} /></button>
        <button disabled={idx >= history.length - 1} onClick={fwd} aria-label="Forward"><ArrowRight size={14} /></button>
        <button onClick={home} aria-label="Home"><Home size={14} /></button>
        <button onClick={refresh} aria-label="Refresh"><RotateCw size={14} /></button>
        <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go(url)} spellCheck={false} />
        <a href={url} target="_blank" rel="noreferrer" title="Open in new tab"><ExternalLink size={14} /></a>
      </div>
      {loadError ? (
        <div className="os-browser-blocked">
          <h3>This site blocks embedding</h3>
          <p>Sites like Google, YouTube, GitHub, and many others prevent being loaded inside an iframe for security reasons.</p>
          <button onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>Open in New Tab</button>
          <button onClick={home}>Go Home (Wikipedia)</button>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          key={url}
          title="browser"
          src={url}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      <div className="os-browser-hint">Some sites block embedding. Use "Open in New Tab" or visit sites that allow iframe embedding.</div>
    </div>
  );
}
