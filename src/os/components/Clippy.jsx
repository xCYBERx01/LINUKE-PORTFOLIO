import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, MessageSquare, Heart } from "lucide-react";
import AppContext from "../AppContext";

const CLIPPY_TIPS = [
  "Welcome to Mintex Linux! Press ⌘+R to open the Run dialog.",
  "Right-click on the desktop for more options.",
  "Drag icons to rearrange them. Your layout is saved automatically.",
  "Open the App Store (📦) to install more apps.",
  "The Task Manager (📊) lets you end stuck tasks.",
  "Try the games: Flappy Bird, Pac-Man, and Crossy Road!",
  "Use the Start Menu (🪟) to search all apps.",
  "Your wallpaper and theme are saved in Settings.",
  "Middle-click or Ctrl+Click on taskbar apps to close them quickly.",
  "The Trash (🗑️) keeps deleted items — you can restore them!",
];

const CLIPPY_MESSAGES = [
  "It looks like you're trying to be productive. Want a tip?",
  "Hey there! Need help with something?",
  "Pro tip: Double-click titlebars to maximize windows.",
  "Did you know? You can create folders by right-clicking the desktop.",
  "Linux tip: The Terminal is your friend. Try 'open terminal'!",
];

export function Clippy() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  const timerRef = useRef(null);
  const showTimerRef = useRef(null);
  const { addNotification } = useContext(AppContext);

  useEffect(() => {
    const dismissed = localStorage.getItem("mintex_clippy_dismissed");
    if (!dismissed) {
      showTimerRef.current = setTimeout(() => {
        setVisible(true);
        setMessage(CLIPPY_MESSAGES[Math.floor(Math.random() * CLIPPY_MESSAGES.length)]);
      }, 10000);
    }
    return () => {
      clearTimeout(showTimerRef.current);
      clearTimeout(timerRef.current);
    };
  }, []);

  function showNextTip() {
    setTipIndex((i) => (i + 1) % CLIPPY_TIPS.length);
    setMessage(CLIPPY_TIPS[tipIndex]);
  }

  function dismiss() {
    setVisible(false);
    localStorage.setItem("mintex_clippy_dismissed", "true");
    clearTimeout(timerRef.current);
  }

  function showRandomTip() {
    setMessage(CLIPPY_MESSAGES[Math.floor(Math.random() * CLIPPY_MESSAGES.length)]);
    timerRef.current = setTimeout(() => {
      if (visible) setMessage("Need anything else?");
    }, 5000);
  }

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="os-clippy"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      >
        <div className="os-clippy-character">
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="clippyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a90d9" />
                <stop offset="100%" stopColor="#2c5aa0" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="75" rx="35" ry="20" fill="url(#clippyGrad)" />
            <ellipse cx="50" cy="45" rx="25" ry="22" fill="url(#clippyGrad)" />
            <ellipse cx="50" cy="20" rx="18" ry="18" fill="url(#clippyGrad)" />
            <ellipse cx="35" cy="15" rx="5" ry="6" fill="#1a3a5c" />
            <ellipse cx="65" cy="15" rx="5" ry="6" fill="#1a3a5c" />
            <path d="M40 30 Q50 35 60 30" stroke="#1a3a5c" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M30 55 Q50 70 70 55" stroke="url(#clippyGrad)" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M30 60 Q50 75 70 60" stroke="url(#clippyGrad)" strokeWidth="8" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <div className="os-clippy-balloon">
          <p>{message}</p>
          <div className="os-clippy-buttons">
            <button onClick={showNextTip}><Lightbulb size={14} /> Tip</button>
            <button onClick={showRandomTip}><MessageSquare size={14} /> Chat</button>
            <button onClick={() => { addNotification({ title: "Clippy", message: "You're awesome! ❤️", duration: 2000 }); }}><Heart size={14} /> Like</button>
          </div>
        </div>
        <button className="os-clippy-close" onClick={dismiss}><X size={12} /></button>
      </motion.div>
    </AnimatePresence>
  );
}