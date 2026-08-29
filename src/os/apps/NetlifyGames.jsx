import { useState } from "react";
import { X, Maximize2, Minimize2, ExternalLink, RefreshCw } from "lucide-react";

const NETLIFY_GAMES = {
  flappy: {
    url: "https://mintex-flappy.netlify.app",
    label: "Flappy Bird",
    icon: "🐦",
  },
  pacman: {
    url: "https://mintex-pacman.netlify.app",
    label: "Pac-Man",
    icon: "👻",
  },
  crossy: {
    url: "https://mintex-crossy.netlify.app",
    label: "Crossy Road",
    icon: "🐔",
  },
};

export function NetlifyGameWindow({ gameId, onClose, onMinimize, onToggleMax }) {
  const game = NETLIFY_GAMES[gameId];
  const [maximized, setMaximized] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  if (!game) return null;

  return (
    <div className={`os-netlify-game ${maximized ? "maximized" : ""}`}>
      <header className="os-netlify-game-titlebar">
        <div className="os-netlify-game-title">
          <span style={{ fontSize: "18px" }}>{game.icon}</span>
          <span>{game.label}</span>
        </div>
        <div className="os-netlify-game-controls">
          <button onClick={onMinimize} title="Minimize"><Minimize2 size={12} /></button>
          <button onClick={() => setMaximized(!maximized)} title={maximized ? "Restore" : "Maximize"}>
            {maximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
          <button onClick={onClose} title="Close"><X size={12} /></button>
        </div>
      </header>
      <div className="os-netlify-game-toolbar">
        <button onClick={() => setIframeKey(k => k + 1)} title="Reload"><RefreshCw size={14} /></button>
        <a href={game.url} target="_blank" rel="noopener noreferrer" title="Open in new tab">
          <ExternalLink size={14} />
        </a>
        <span className="os-netlify-game-url">{game.url}</span>
      </div>
      <iframe
        key={iframeKey}
        className="os-netlify-game-iframe"
        src={game.url}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        allow="fullscreen"
      />
    </div>
  );
}

export function NetlifyGamesLauncher({ onOpenApp }) {
  return (
    <div className="os-netlify-launcher">
      <h3>Netlify-Hosted Games</h3>
      <p className="os-netlify-note">These games are hosted on Netlify and loaded via iframe for better performance and isolation.</p>
      <div className="os-netlify-game-cards">
        {Object.entries(NETLIFY_GAMES).map(([id, game]) => (
          <div key={id} className="os-netlify-game-card" onClick={() => onOpenApp(id)}>
            <span className="os-netlify-card-icon">{game.icon}</span>
            <strong>{game.label}</strong>
            <small>Hosted on Netlify</small>
          </div>
        ))}
      </div>
    </div>
  );
}