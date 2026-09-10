import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

export function DraggableIcon({ item, onDragStop, onSelect, onOpen, onContextMenu, selected, disabled = false }) {
  const Icon = item.icon;
  const active = selected === item.key;
  const [position, setPosition] = useState({ x: item.x || 0, y: item.y || 0 });

  useEffect(() => {
    if (item.x !== undefined && item.y !== undefined) {
      setPosition({ x: item.x, y: item.y });
    }
  }, [item.x, item.y]);

  function handleStop(e, data) {
    onDragStop(item.key, data.x, data.y);
  }

  function handleClick(e) {
    e.stopPropagation();
    onSelect(item.key);
  }

  function handleDoubleClick() {
    onOpen(item);
  }

  function handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, item);
  }

  if (disabled) {
    return (
      <div
        className={active ? "os-dt-icon selected" : "os-dt-icon"}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <span className="os-dt-tile"><Icon size={30} /></span>
        <span className="os-dt-label">{item.label}</span>
      </div>
    );
  }

  return (
    <Draggable
      axis="both"
      handle=".os-dt-tile"
      grid={[10, 10]}
      position={position}
      onStop={handleStop}
      disabled={active}
      bounds=".os-desktop-icons"
    >
      <div
        className={active ? "os-dt-icon selected" : "os-dt-icon"}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <span className="os-dt-tile"><Icon size={30} /></span>
        <span className="os-dt-label">{item.label}</span>
      </div>
    </Draggable>
  );
}