import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function RightClickMenu({ visible, x, y, items, onClose, onAction, type = "desktop", target = null }) {
  const menuRef = useRef(null);
  const timerRef = useRef(null);
  const [showArrange, setShowArrange] = useState(false);

  useEffect(() => {
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("contextmenu", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("contextmenu", handleClickOutside);
    };
  }, [visible]);

  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      onClose();
    }
  }

  function handleArrangeHover() {
    timerRef.current = setTimeout(() => setShowArrange(true), 300);
  }

  function handleArrangeLeave() {
    clearTimeout(timerRef.current);
  }

  if (!visible) return null;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const menuWidth = 180;
  const menuHeight = items.length * 28 + (type === "icon" ? 40 : 0);

  const top = Math.min(y, screenHeight - menuHeight - 10);
  const left = Math.min(x, screenWidth - menuWidth - 10);

  return (
    <motion.div
      ref={menuRef}
      className="os-rightclick-menu"
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`os-rightclick-item ${item.divider ? "divider" : ""} ${item.disabled ? "disabled" : ""}`}
          onClick={() => {
            if (!item.disabled && item.action) {
              item.action();
              onClose();
            }
          }}
          onMouseEnter={item.label === "Arrange By" ? handleArrangeHover : undefined}
          onMouseLeave={item.label === "Arrange By" ? handleArrangeLeave : undefined}
        >
          {item.divider ? (
            <hr />
          ) : (
            <>
              <span>{item.label}</span>
              {item.label === "Arrange By" && <span className="os-rightclick-arrow">▸</span>}
            </>
          )}
        </motion.div>
      ))}
      {showArrange && type === "desktop" && (
        <motion.div
          className="os-rightclick-submenu"
          style={{ top: items.findIndex(i => i.label === "Arrange By") * 28, left: "100%" }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          onMouseEnter={handleArrangeHover}
          onMouseLeave={handleArrangeLeave}
        >
          <div className="os-rightclick-item" onClick={() => { onAction("arrange", "name"); onClose(); }}>By Name</div>
          <div className="os-rightclick-item" onClick={() => { onAction("arrange", "type"); onClose(); }}>By Type</div>
          <div className="os-rightclick-item" onClick={() => { onAction("arrange", "date"); onClose(); }}>By Date</div>
          <div className="os-rightclick-item" onClick={() => { onAction("arrange", "size"); onClose(); }}>By Size</div>
        </motion.div>
      )}
    </motion.div>
  );
}