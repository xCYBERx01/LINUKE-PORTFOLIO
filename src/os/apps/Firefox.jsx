import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  RotateCw,
  Search,
  ExternalLink,
  X,
  Bookmark,
  History,
  Globe,
  Shield,
  Lock,
} from "lucide-react";

// Use an embed-friendly default — example.com always allows framing.
// Wikipedia also allows framing; pick one and provide portfolio guidance.
const FIREFOX_HOME = "https://webcv-ahmed.netlify.app";
const EMBED_FRIENDLY = [
  { label: "WebCV — Ahmed (your site as app)", url: "https://webcv-ahmed.netlify.app" },
  { label: "AhmedCLI — CLI portfolio", url: "https://ahmedcli.netlify.app" },
  { label: "Example (always works)", url: "https://example.com" },
  { label: "Wikipedia — Robotics", url: "https://en.wikipedia.org/wiki/Robotics" },
  { label: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/" },
];

const SEARCH_ENGINES = {
  brave: "https://search.brave.com/search?q=",
  duckduckgo: "https://duckduckgo.com/html?q=",
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
};

export default function Firefox({ win }) {
  // Allow opening Firefox with a specific URL (e.g., from Nautilus Live Demo)
  const initial = win?.url || win?.initialUrl || FIREFOX_HOME;
  const [url, setUrl] = useState(initial);
  const [inputValue, setInputValue] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const [idx, setIdx] = useState(0);
  const [searchEngine, setSearchEngine] = useState("brave");
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("firefox_bookmarks")) || [
        { url: "https://webcv-ahmed.netlify.app", title: "WebCV — Ahmed (app)" },
        { url: "https://ahmedcli.netlify.app", title: "AhmedCLI — CLI" },
        { url: "https://example.com", title: "Example" },
        { url: "https://github.com/xCYBERx01", title: "GitHub — xCYBERx01" },
      ];
    } catch {
      return [];
    }
  });
  const [historyList, setHistoryList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("firefox_history")) || [];
    } catch {
      return [];
    }
  });
  const [showSidebar, setShowSidebar] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const iframeRef = useRef(null);
  const progressRef = useRef(null);
  const timeoutRef = useRef(null);

  // keep address bar in sync when navigating via back/forward/home
  useEffect(() => {
    setInputValue(url);
  }, [url]);

  function normalizeTarget(value) {
    let target = String(value).trim();
    if (!target) return null;
    if (!/^https?:\/\//i.test(target)) {
      if (target.includes(".") && !target.includes(" ")) {
        target = `https://${target}`;
      } else {
        target = `${SEARCH_ENGINES[searchEngine]}${encodeURIComponent(target)}`;
      }
    }
    return target;
  }

  function go(value, push = true) {
    const target = normalizeTarget(value);
    if (!target) return;
    if (push) {
      const next = [...history.slice(0, idx + 1), target];
      setHistory(next);
      setIdx(next.length - 1);
    }
    setUrl(target);
    setInputValue(target);
    setLoadError(false);
    setIsLoading(true);
    setProgress(0);
    startProgress();
    // X-Frame-Options blocks don't fire onError reliably.
    // Show blocked hint after 4s if still loading (user can dismiss via Open in New Tab).
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      // if still loading after 4s, hint that target may block embedding
      setIsLoading((prev) => {
        if (prev) {
          // don't auto-error, just let user see hint bar (kept always visible)
        }
        return prev;
      });
    }, 4000);
  }

  function startProgress() {
    if (progressRef.current) clearInterval(progressRef.current);
    let p = 0;
    progressRef.current = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 90) p = 90;
      setProgress(p);
    }, 200);
  }

  function back() {
    if (idx <= 0) return;
    const n = idx - 1;
    setIdx(n);
    setUrl(history[n]);
    setLoadError(false);
    setIsLoading(true);
    startProgress();
  }

  function fwd() {
    if (idx >= history.length - 1) return;
    const n = idx + 1;
    setIdx(n);
    setUrl(history[n]);
    setLoadError(false);
    setIsLoading(true);
    startProgress();
  }

  function home() {
    setIdx(0);
    setUrl(FIREFOX_HOME);
    setLoadError(false);
    setIsLoading(true);
    startProgress();
  }

  function refresh() {
    // force iframe reload
    setUrl((u) => `${u.split("#")[0].split("?")[0]}?t=${Date.now()}`);
    setLoadError(false);
    setIsLoading(true);
    startProgress();
  }

  function handleLoad() {
    setLoadError(false);
    setIsLoading(false);
    setProgress(100);
    if (progressRef.current) clearInterval(progressRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Don't add t= cache-buster to history
    const clean = url.split("?t=")[0];
    if (!historyList.includes(clean)) {
      const newHistory = [clean, ...historyList.slice(0, 99)];
      setHistoryList(newHistory);
      localStorage.setItem("firefox_history", JSON.stringify(newHistory));
    }
  }

  function handleError() {
    setLoadError(true);
    setIsLoading(false);
    if (progressRef.current) clearInterval(progressRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  function addBookmark() {
    if (!bookmarks.some((b) => b.url === url)) {
      const bm = { url, title: url, date: new Date().toISOString() };
      setBookmarks((prev) => [...prev, bm]);
      localStorage.setItem("firefox_bookmarks", JSON.stringify([...bookmarks, bm]));
    }
  }

  function removeBookmark(targetUrl) {
    const next = bookmarks.filter((b) => b.url !== targetUrl);
    setBookmarks(next);
    localStorage.setItem("firefox_bookmarks", JSON.stringify(next));
  }

  function clearHistory() {
    setHistoryList([]);
    localStorage.removeItem("firefox_history");
  }

  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isEmbedFriendly = EMBED_FRIENDLY.some((e) => url.startsWith(e.url));

  return (
    <div className="firefox">
      <div className="firefox-toolbar">
        <div className="firefox-nav">
          <button disabled={idx <= 0} onClick={back} title="Back">
            <ArrowLeft size={14} />
          </button>
          <button disabled={idx >= history.length - 1} onClick={fwd} title="Forward">
            <ArrowRight size={14} />
          </button>
          <button onClick={refresh} title="Refresh">
            <RotateCw size={14} />
          </button>
          <button onClick={home} title="Home">
            <Home size={14} />
          </button>
        </div>
        <div className="firefox-address">
          <div className="firefox-address-lock">
            {url.startsWith("https") ? <Lock size={12} /> : <Shield size={12} />}
          </div>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go(inputValue)}
            spellCheck={false}
            placeholder="Search or enter address"
          />
          <div className="firefox-address-actions">
            <button onClick={addBookmark} title="Bookmark this page">
              <Bookmark size={14} />
            </button>
            <button
              onClick={() => setShowSidebar(showSidebar === "bookmarks" ? null : "bookmarks")}
              title="Bookmarks"
              className={showSidebar === "bookmarks" ? "active" : ""}
            >
              <Bookmark size={14} />
            </button>
            <button
              onClick={() => setShowSidebar(showSidebar === "history" ? null : "history")}
              title="History"
              className={showSidebar === "history" ? "active" : ""}
            >
              <History size={14} />
            </button>
            <a href={url} target="_blank" rel="noopener noreferrer" title="Open in new tab">
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="firefox-progress">
        <div style={{ width: `${isLoading ? progress : 100}%` }} />
      </div>

      {/* Always-visible hint — X-Frame-Options blocks are silent, so explain upfront */}
      <div className="firefox-hintbar">
        <span>
          {isEmbedFriendly ? "✓ Embed-friendly site" : "Some sites (Google, GitHub, LinkedIn) block embedding — if blank, use "}
          {!isEmbedFriendly && (
            <button onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>Open in New Tab</button>
          )}
        </span>
        <span className="firefox-hintbar-right">Host your own projects on Netlify/Vercel to allow embedding.</span>
      </div>

      <div className="firefox-body">
        {showSidebar && (
          <div className="firefox-sidebar">
            <div className="firefox-sidebar-header">
              <h3>{showSidebar === "bookmarks" ? "Bookmarks" : "History"}</h3>
              <button onClick={() => setShowSidebar(null)}>
                <X size={14} />
              </button>
            </div>
            <div className="firefox-sidebar-content">
              {showSidebar === "bookmarks" ? (
                bookmarks.length === 0 ? (
                  <p className="firefox-empty">No bookmarks yet. Use ☆ to save.</p>
                ) : (
                  bookmarks.map((bm, i) => (
                    <div key={i} className="firefox-sidebar-item" onClick={() => go(bm.url)}>
                      <Globe size={14} />
                      <span>{bm.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(bm.url);
                        }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))
                )
              ) : historyList.length === 0 ? (
                <p className="firefox-empty">No history yet.</p>
              ) : (
                <div>
                  <button className="firefox-sidebar-clear" onClick={clearHistory}>
                    Clear History
                  </button>
                  {historyList.map((h, i) => (
                    <div key={i} className="firefox-sidebar-item" onClick={() => go(h)}>
                      <History size={14} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
              {showSidebar === "bookmarks" && (
                <div style={{ marginTop: 12, borderTop: "1px solid #333", paddingTop: 8 }}>
                  <p style={{ fontSize: 11, color: "#888", margin: "0 0 6px" }}>Embed-friendly quick open:</p>
                  {EMBED_FRIENDLY.map((e) => (
                    <div key={e.url} className="firefox-sidebar-item" onClick={() => go(e.url)}>
                      <Globe size={14} />
                      <span>{e.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="firefox-content">
          {loadError ? (
            <div className="firefox-error">
              <Globe size={48} />
              <h3>Cannot display this page</h3>
              <p>This site blocks embedding (X-Frame-Options: SAMEORIGIN) or the URL is invalid. This is a security policy from the target site, not a bug.</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>Open in New Tab</button>
                <button onClick={home}>Go Home (Example.com)</button>
              </div>
              <small style={{ color: "#888", marginTop: 8 }}>
                Tip: For your portfolio, host your own projects on Netlify — they will embed perfectly because you control the headers.
              </small>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              key={url}
              title="browser"
              src={url}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
              allow="fullscreen; clipboard-write"
              onLoad={handleLoad}
              onError={handleError}
              style={{ width: "100%", height: "100%", border: 0, background: "#fff" }}
            />
          )}
        </div>
      </div>

      <div className="firefox-statusbar">
        <span>{isLoading ? "Loading…" : loadError ? "Blocked" : "Done — portfolio viewer"}</span>
        <select value={searchEngine} onChange={(e) => setSearchEngine(e.target.value)} className="firefox-engine-select">
          <option value="brave">Brave</option>
          <option value="duckduckgo">DuckDuckGo</option>
          <option value="google">Google</option>
          <option value="bing">Bing</option>
        </select>
      </div>
    </div>
  );
}
