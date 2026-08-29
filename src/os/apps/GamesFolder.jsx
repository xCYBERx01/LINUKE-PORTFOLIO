import { useState } from "react";
import { Grid2x2, Bird, Ghost, Car, MousePointer2 } from "lucide-react";

const GAMES = [
  { id: "minesweeper", label: "Minesweeper", icon: Grid2x2, description: "Classic mine hunting game" },
  { id: "flappy", label: "Flappy Bird", icon: Bird, description: "Tap to fly through pipes" },
  { id: "pacman", label: "Pac-Man", icon: Ghost, description: "Eat dots, avoid ghosts" },
  { id: "crossy", label: "Crossy Road", icon: Car, description: "Cross roads, avoid traffic" },
];

export function GamesFolderWindow({ onOpenApp }) {
  const [view, setView] = useState("grid");

  return (
    <div className="os-games-folder">
      <div className="os-games-toolbar">
        <h2>Games</h2>
        <div className="os-games-view-toggle">
          <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} title="Grid view"><Grid2x2 size={14} /></button>
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} title="List view"><MousePointer2 size={14} /></button>
        </div>
      </div>
      <div className={`os-games-content ${view}`}>
        {GAMES.map((game) => (
          <div key={game.id} className="os-game-item" onClick={() => onOpenApp(game.id)}>
            <div className="os-game-item-icon">
              <game.icon size={32} />
            </div>
            <div className="os-game-item-info">
              <strong>{game.label}</strong>
              <span>{game.description}</span>
            </div>
            <button className="os-game-item-play" onClick={(e) => { e.stopPropagation(); onOpenApp(game.id); }}>
              Play
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}