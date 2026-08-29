import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Search, MoreHorizontal, Pin, PinOff } from "lucide-react";
import { desktopApps } from "../registry";

const TILE_SIZES = {
  small: { w: 1, h: 1 },
  medium: { w: 2, h: 2 },
  wide: { w: 4, h: 2 },
  large: { w: 4, h: 4 },
};

const TILE_COLORS = [
  "#0078d7", "#e81123", "#009933", "#ff8c00", "#aa00ff", "#00bcf2", "#d83b01", "#107c10",
];

function restoreIcons(tiles) {
  const apps = desktopApps();
  const iconMap = new Map(apps.map(a => [a.appId, a.icon]));
  return tiles.map(t => ({ ...t, icon: iconMap.get(t.appId) || iconMap.get(t.id) }));
}

export function TileGrid({ open, onClose, onOpen }) {
  const [tiles, setTiles] = useState(() => {
    const saved = localStorage.getItem("mintex_tiles");
    if (saved) {
      try { return restoreIcons(JSON.parse(saved)); } catch {}
    }
    const apps = desktopApps();
    return apps.slice(0, 20).map((app, i) => ({
      id: app.appId,
      appId: app.appId,
      label: app.label,
      icon: app.icon,
      size: i < 4 ? "wide" : i < 8 ? "medium" : "small",
      color: TILE_COLORS[i % TILE_COLORS.length],
      x: i % 8,
      y: Math.floor(i / 8),
      pinned: i < 6,
      live: i < 3,
    }));
  });
  const [showAllApps, setShowAllApps] = useState(false);
  const [search, setSearch] = useState("");
  const [draggedTile, setDraggedTile] = useState(null);
  const [editingTile, setEditingTile] = useState(null);
  const [newTileSize, setNewTileSize] = useState("medium");

  useEffect(() => {
    const tilesToSave = tiles.map(({ icon, ...rest }) => rest);
    localStorage.setItem("mintex_tiles", JSON.stringify(tilesToSave));
  }, [tiles]);

  const allApps = desktopApps();
  const tileMap = new Map(tiles.map(t => [t.id, t]));
  const pinnedTiles = tiles.filter(t => t.pinned).sort((a, b) => a.y * 8 + a.x - (b.y * 8 + b.x));
  const otherTiles = tiles.filter(t => !t.pinned).sort((a, b) => a.y * 8 + a.x - (b.y * 8 + b.x));

  function handleTileClick(tile) {
    if (!editingTile) onOpen(tile.appId);
  }

  function handleTileContextMenu(e, tile) {
    e.preventDefault();
    setEditingTile(tile);
  }

  function togglePin(tileId) {
    setTiles(prev => prev.map(t => t.id === tileId ? { ...t, pinned: !t.pinned } : t));
  }

  function unpinTile(tileId) {
    setTiles(prev => prev.map(t => t.id === tileId ? { ...t, pinned: false } : t));
  }

  function removeTile(tileId) {
    setTiles(prev => prev.filter(t => t.id !== tileId));
  }

  function resizeTile(tileId, size) {
    setTiles(prev => prev.map(t => t.id === tileId ? { ...t, size } : t));
  }

  function addTile(app) {
    if (tiles.some(t => t.id === app.appId)) return;
    const newTile = {
      id: app.appId,
      appId: app.appId,
      label: app.label,
      icon: app.icon,
      size: "medium",
      color: TILE_COLORS[tiles.length % TILE_COLORS.length],
      x: tiles.length % 8,
      y: Math.floor(tiles.length / 8),
      pinned: false,
      live: false,
    };
    setTiles(prev => [...prev, newTile]);
    setShowAllApps(false);
  }

  function saveTileEdit() {
    setEditingTile(null);
  }

  const pinnedCols = 8;
  const tileWidth = 120;
  const tileHeight = 120;
  const gap = 8;

  function getTileStyle(tile) {
    const size = TILE_SIZES[tile.size] || TILE_SIZES.medium;
    return {
      gridColumn: `span ${size.w}`,
      gridRow: `span ${size.h}`,
      background: tile.color,
    };
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="os-tilegrid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="os-tilegrid-header">
            <div className="os-tilegrid-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search apps, settings, web..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="os-tilegrid-user">
              <span>Ahmed</span>
              <button onClick={onClose} className="os-tilegrid-close"><X size={16} /></button>
            </div>
          </div>

          <div className="os-tilegrid-content">
            <div className="os-tilegrid-section">
              <div className="os-tilegrid-section-header">
                <h3>Pinned</h3>
                <button onClick={() => setShowAllApps(true)}>
                  <span>All apps</span>
                  <ChevronRight size={12} />
                </button>
              </div>
              <div
                className="os-tilegrid-grid"
                style={{
                  gridTemplateColumns: `repeat(${8}, ${tileWidth}px)`,
                  gap,
                }}
              >
                {pinnedTiles.map((tile) => (
                  <motion.div
                    key={tile.id}
                    className="os-tile"
                    style={getTileStyle(tile)}
                    onClick={() => handleTileClick(tile)}
                    onContextMenu={(e) => handleTileContextMenu(e, tile)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="os-tile-content">
                      <tile.icon size={tile.size === "small" ? 24 : tile.size === "medium" ? 48 : 64} className="os-tile-icon" />
                      <span className="os-tile-label">{tile.label}</span>
                      {tile.live && <span className="os-tile-live-badge">LIVE</span>}
                    </div>
                    <div className="os-tile-actions">
                      <button onClick={(e) => { e.stopPropagation(); togglePin(tile.id); }} title="Unpin from Start">
                        <PinOff size={12} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); resizeTile(tile.id, "wide"); }} title="Resize">
                        <span style={{fontSize: 10}}>⬜</span>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); removeTile(tile.id); }} title="Uninstall">
                        <span style={{fontSize: 10}}>✕</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {showAllApps && (
              <motion.div
                className="os-tilegrid-allapps"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="os-tilegrid-section-header">
                  <h3>All Apps</h3>
                  <button onClick={() => setShowAllApps(false)}><ChevronLeft size={12} /> Back</button>
                </div>
                <div className="os-tilegrid-allapps-search">
                  <Search size={16} />
                  <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="os-tilegrid-allapps-grid">
                  {allApps
                    .filter(app => app.label.toLowerCase().includes(search.toLowerCase()))
                    .filter(app => !tileMap.has(app.appId))
                    .map((app) => (
                      <div
                        key={app.appId}
                        className="os-tilegrid-allapp-item"
                        onClick={() => addTile(app)}
                      >
                        <app.icon size={32} />
                        <span>{app.label}</span>
                        <span className="os-tilegrid-add-btn">+</span>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {editingTile && (
                <motion.div
                  className="os-tilegrid-edit-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="os-tilegrid-edit-dialog"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                  >
                    <h3>Tile Options</h3>
                    <p><strong>{editingTile.label}</strong></p>
                    <div className="os-tilegrid-edit-option">
                      <label>
                        <input type="checkbox" checked={editingTile.pinned} onChange={() => togglePin(editingTile.id)} />
                        Pin to Start
                      </label>
                    </div>
                    <div className="os-tilegrid-edit-option">
                      <label>
                        <input type="checkbox" checked={editingTile.live} onChange={(e) => setTiles(prev => prev.map(t => t.id === editingTile.id ? { ...t, live: e.target.checked } : t))} />
                        Live Tile
                      </label>
                    </div>
                    <div className="os-tilegrid-edit-option">
                      <label>Size:
                        <select value={editingTile.size} onChange={(e) => resizeTile(editingTile.id, e.target.value)}>
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="wide">Wide</option>
                          <option value="large">Large</option>
                        </select>
                      </label>
                    </div>
                    <div className="os-tilegrid-edit-option">
                      <label>Color:
                        <select value={editingTile.color} onChange={(e) => setTiles(prev => prev.map(t => t.id === editingTile.id ? { ...t, color: e.target.value } : t))}>
                          {TILE_COLORS.map(c => <option key={c} value={c} style={{background: c}} />)}
                        </select>
                      </label>
                    </div>
                    <div className="os-tilegrid-edit-buttons">
                      <button onClick={saveTileEdit}>Done</button>
                      <button onClick={() => { removeTile(editingTile.id); setEditingTile(null); }} className="danger">Uninstall</button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}