import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, ArrowRight, Home, RotateCw, Search, ExternalLink, 
  X, Minimize2, Maximize2, Plus, ChevronDown, ChevronUp,
  Bookmark, History, Settings, Download, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const IE_HOME = "https://duckduckgo.com/html";
const SEARCH_ENGINES = {
  duckduckgo: "https://duckduckgo.com/html?q=",
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  yahoo: "https://search.yahoo.com/search?p=",
};

export function IEBrowserWindow({ onClose, onMinimize, onToggleMax, windows, activeId }) {
  const [url, setUrl] = useState(IE_HOME);
  const [history, setHistory] = useState([IE_HOME]);
  const [idx, setIdx] = useState(0);
  const [searchEngine, setSearchEngine] = useState("duckduckgo");
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ie_bookmarks")) || []; } catch { return []; }
  });
  const [historyList, setHistoryList] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ie_history")) || []; } catch { return []; }
  });
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [downloads, setDownloads] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const iframeRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("ie_homepage");
    if (saved) setUrl(saved);
  }, []);

  function go(value, push = true) {
    let target = String(value).trim();
    if (!target) return;
    if (!/^https?:\/\//i.test(target)) {
      if (target.includes(".") && !target.includes(" ")) {
        target = `https://${target}`;
      } else {
        target = `${SEARCH_ENGINES[searchEngine]}${encodeURIComponent(target)}`;
      }
    }
    if (push) {
      const next = [...history.slice(0, idx + 1), target];
      setHistory(next);
      setIdx(next.length - 1);
    }
    setUrl(target);
    setLoadError(false);
    setIsLoading(true);
    setProgress(0);
    startProgressSimulation();
  }

  function startProgressSimulation() {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    let p = 0;
    progressIntervalRef.current = setInterval(() => {
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
    startProgressSimulation();
  }

  function fwd() {
    if (idx >= history.length - 1) return;
    const n = idx + 1;
    setIdx(n);
    setUrl(history[n]);
    setLoadError(false);
    setIsLoading(true);
    startProgressSimulation();
  }

  function home() {
    setIdx(0);
    setUrl(IE_HOME);
    setLoadError(false);
    setIsLoading(true);
    startProgressSimulation();
  }

  function refresh() {
    setUrl((u) => `${u.split("#")[0].split("?")[0]}?t=${Date.now()}`);
    setLoadError(false);
    setIsLoading(true);
    startProgressSimulation();
  }

  function handleLoad() {
    setLoadError(false);
    setIsLoading(false);
    setProgress(100);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    if (!historyList.includes(url)) {
      const newHistory = [url, ...historyList.slice(0, 99)];
      setHistoryList(newHistory);
      localStorage.setItem("ie_history", JSON.stringify(newHistory));
    }
  }

  function handleError() {
    setLoadError(true);
    setIsLoading(false);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }

  function addBookmark() {
    if (!bookmarks.some(b => b.url === url)) {
      const bm = { url, title: url, date: new Date().toISOString() };
      setBookmarks(prev => [...prev, bm]);
      localStorage.setItem("ie_bookmarks", JSON.stringify([...bookmarks, bm]));
    }
  }

  function removeBookmark(url) {
    setBookmarks(prev => prev.filter(b => b.url !== url));
    localStorage.setItem("ie_bookmarks", JSON.stringify(bookmarks.filter(b => b.url !== url)));
  }

  function clearHistory() {
    setHistoryList([]);
    localStorage.removeItem("ie_history");
  }

  function downloadFile() {
    const dl = { url, name: url.split("/").pop() || "download", progress: 0, date: new Date() };
    setDownloads(prev => [...prev, dl]);
    const interval = setInterval(() => {
      setDownloads(prev => prev.map(d => d.url === url ? { ...d, progress: Math.min(100, d.progress + Math.random() * 20) } : d));
    }, 300);
    setTimeout(() => clearInterval(interval), 3000);
  }

  const progressPercent = isLoading ? progress : 100;

  return (
    <div className="os-ie-browser">
      <header className="os-ie-titlebar">
        <div className="os-ie-title">
          <Globe size={16} />
          <span>Internet Explorer</span>
        </div>
        <div className="os-ie-controls">
          <button onClick={onMinimize} title="Minimize"><Minimize2 size={12} /></button>
          <button onClick={onToggleMax} title="Maximize"><Maximize2 size={12} /></button>
          <button onClick={onClose} title="Close"><X size={12} /></button>
        </div>
      </header>

      <div className="os-ie-toolbar">
        <div className="os-ie-nav">
          <button onClick={back} disabled={idx <= 0} title="Back"><ArrowLeft size={14} /></button>
          <button onClick={fwd} disabled={idx >= history.length - 1} title="Forward"><ArrowRight size={14} /></button>
          <button onClick={home} title="Home"><Home size={14} /></button>
          <button onClick={refresh} title="Refresh" disabled={isLoading}><RotateCw size={14} /></button>
          <button onClick={home} title="Stop" disabled={!isLoading}><X size={14} /></button>
        </div>
        <div className="os-ie-address">
          <select value={searchEngine} onChange={(e) => setSearchEngine(e.target.value)} className="os-ie-engine">
            <option value="duckduckgo">🦆 DuckDuckGo</option>
            <option value="google">🔍 Google</option>
            <option value="bing">🔎 Bing</option>
            <option value="yahoo">📌 Yahoo</option>
          </select>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go(url)}
            spellCheck={false}
            placeholder="Enter URL or search term..."
          />
          <div className="os-ie-address-actions">
            <button onClick={addBookmark} title="Add to Favorites"><Bookmark size={14} /></button>
            <button onClick={() => setShowBookmarks(!showBookmarks)} title="Favorites"><Bookmark size={14} className={showBookmarks ? "active" : ""} /></button>
            <button onClick={() => setShowHistory(!showHistory)} title="History"><History size={14} className={showHistory ? "active" : ""} /></button>
            <button onClick={downloadFile} title="Download"><Download size={14} /></button>
            <button onClick={() => setShowSettings(!showSettings)} title="Settings"><Settings size={14} className={showSettings ? "active" : ""} /></button>
            <a href={url} target="_blank" rel="noopener noreferrer" title="Open in new tab"><ExternalLink size={14} /></a>
          </div>
        </div>
        <div className="os-ie-progress">
          <div style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <AnimatePresence>
        {showBookmarks && (
          <motion.div className="os-ie-sidebar" initial={{ opacity: 0, x: -300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -300 }}>
            <div className="os-ie-sidebar-header">
              <h3>Favorites</h3>
              <button onClick={() => setShowBookmarks(false)}><X size={14} /></button>
            </div>
            <div className="os-ie-sidebar-content">
              {bookmarks.length === 0 ? (
                <p className="os-ie-empty">No favorites yet. Click the star to add.</p>
              ) : (
                bookmarks.map((bm, i) => (
                  <div key={i} className="os-ie-bookmark" onClick={() => go(bm.url)}>
                    <Globe size={14} />
                    <span>{bm.title}</span>
                    <button onClick={(e) => { e.stopPropagation(); removeBookmark(bm.url); }}><X size={10} /></button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showHistory && (
            <motion.div className="os-ie-sidebar" initial={{ opacity: 0, x: -300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -300 }}>
              <div className="os-ie-sidebar-header">
                <div className="os-ie-sidebar-title">
                  <h3>History</h3>
                  <button onClick={clearHistory} title="Clear History"><X size={12} /></button>
                </div>
                <button onClick={() => setShowHistory(false)}><X size={14} /></button>
              </div>
              <div className="os-ie-sidebar-content">
                {historyList.length === 0 ? (
                  <p className="os-ie-empty">No history yet.</p>
                ) : (
                  historyList.map((h, i) => (
                    <div key={i} className="os-ie-bookmark" onClick={() => go(h)}>
                      <History size={14} />
                      <span>{h}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSettings && (
            <motion.div className="os-ie-sidebar" initial={{ opacity: 0, x: -300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -300 }}>
              <div className="os-ie-sidebar-header">
                <h3>Settings</h3>
                <button onClick={() => setShowSettings(false)}><X size={14} /></button>
              </div>
              <div className="os-ie-sidebar-content">
                <div className="os-ie-setting">
                  <label>
                    <input type="text" value={IE_HOME} onChange={(e) => localStorage.setItem("ie_homepage", e.target.value)} placeholder="Homepage URL" />
                    <span>Homepage</span>
                  </label>
                </div>
                <div className="os-ie-setting">
                  <label>
                    <select value={searchEngine} onChange={(e) => setSearchEngine(e.target.value)}>
                      <option value="duckduckgo">DuckDuckGo</option>
                      <option value="google">Google</option>
                      <option value="bing">Bing</option>
                      <option value="yahoo">Yahoo</option>
                    </select>
                    <span>Default Search Engine</span>
                  </label>
                </div>
                <div className="os-ie-setting">
                  <label>
                    <input type="checkbox" />
                    <span>Block Pop-ups</span>
                  </label>
                </div>
                <div className="os-ie-setting">
                  <label>
                    <input type="checkbox" checked />
                    <span>Enable JavaScript</span>
                  </label>
                </div>
                <div className="os-ie-setting">
                  <label>
                    <input type="checkbox" />
                    <span>Do Not Track</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>

      {loadError ? (
        <div className="os-ie-error">
          <h3>Cannot display this page</h3>
          <p>The site may be blocking iframe embedding or the URL is invalid.</p>
          <button onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>Open in New Tab</button>
          <button onClick={home}>Go Home</button>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          key={url}
          className="os-ie-iframe"
          src={url}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      <div className="os-ie-statusbar">
        <span>{isLoading ? "Loading..." : loadError ? "Error" : "Done"}</span>
        <span className="os-ie-zone">Internet | Protected Mode: On</span>
        <span className="os-ie-zoom">100%</span>
      </div>
    </div>
  );
}