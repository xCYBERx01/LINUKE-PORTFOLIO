import { useState, useEffect } from "react";
import { Sparkles, RotateCcw, Heart, Star, Zap, Moon, Sun, Cloud, BookOpen, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FORTUNES = [
  { category: "general", icon: Sparkles, text: "A pleasant surprise is waiting for you." },
  { category: "general", icon: Star, text: "Your hard work will soon pay off." },
  { category: "general", icon: Heart, text: "Love and friendship will brighten your day." },
  { category: "general", icon: Zap, text: "An exciting opportunity is coming your way." },
  { category: "general", icon: BookOpen, text: "Knowledge you seek will find you." },
  { category: "love", icon: Heart, text: "Someone is thinking of you right now." },
  { category: "love", icon: Heart, text: "A new romance is on the horizon." },
  { category: "love", icon: Heart, text: "Your heart knows the way. Trust it." },
  { category: "career", icon: Zap, text: "A promotion or raise is in your future." },
  { category: "career", icon: Star, text: "Your skills will be recognized soon." },
  { category: "career", icon: BookOpen, text: "New skills will open unexpected doors." },
  { category: "wealth", icon: Zap, text: "Unexpected income is heading your way." },
  { category: "wealth", icon: Star, text: "Invest wisely and prosperity follows." },
  { category: "health", icon: Moon, text: "Rest and recovery are your best medicine." },
  { category: "health", icon: Sun, text: "Energy and vitality are returning to you." },
  { category: "travel", icon: Cloud, text: "A journey will bring new perspectives." },
  { category: "travel", icon: Sun, text: "Adventure awaits around the corner." },
  { category: "advice", icon: BookOpen, text: "Listen to your intuition today." },
  { category: "advice", icon: MessageSquare, text: "Speak your truth with kindness." },
  { category: "advice", icon: Sparkles, text: "Small steps lead to big changes." },
];

const CATEGORIES = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "love", label: "Love", icon: Heart },
  { id: "career", label: "Career", icon: Zap },
  { id: "wealth", label: "Wealth", icon: Star },
  { id: "health", label: "Health", icon: Moon },
  { id: "travel", label: "Travel", icon: Cloud },
  { id: "advice", label: "Advice", icon: BookOpen },
];

export function FortuneTeller() {
  const [currentFortune, setCurrentFortune] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mintex_fortune_history")) || []; } catch { return []; }
  });
  const [animating, setAnimating] = useState(false);
  const [dailyFortune, setDailyFortune] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("mintex_daily_fortune");
    if (saved) {
      try {
        const { date, fortune } = JSON.parse(saved);
        if (date === new Date().toDateString()) {
          setDailyFortune(fortune);
          return;
        }
      } catch {}
    }
    const fortune = getRandomFortune();
    setDailyFortune(fortune);
    localStorage.setItem("mintex_daily_fortune", JSON.stringify({ date: new Date().toDateString(), fortune }));
  }, []);

  function getRandomFortune(category = "all") {
    let pool = category === "all" ? FORTUNES : FORTUNES.filter(f => f.category === category);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function tellFortune() {
    setAnimating(true);
    setTimeout(() => {
      const fortune = getRandomFortune(selectedCategory);
      setCurrentFortune(fortune);
      setHistory(prev => [fortune, ...prev.slice(0, 9)]);
      localStorage.setItem("mintex_fortune_history", JSON.stringify(history));
      setAnimating(false);
    }, 800);
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem("mintex_fortune_history");
  }

  return (
    <div className="os-fortune">
      <div className="os-fortune-header">
        <div className="os-fortune-title">
          <Sparkles size={24} />
          <h2>Fortune Teller</h2>
        </div>
        <div className="os-fortune-category">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={selectedCategory === cat.id ? "active" : ""}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <cat.icon size={14} /> {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="os-fortune-main">
        <div className="os-fortune-daily">
          <h3>🌅 Daily Fortune</h3>
          <div className={`os-fortune-card daily ${animating ? "shaking" : ""}`}>
            <div className="os-fortune-icon">
              {dailyFortune?.icon && <dailyFortune.icon size={32} />}
            </div>
            <p className="os-fortune-text">{dailyFortune?.text || "Click the crystal ball to reveal your fortune..."}</p>
          </div>
        </div>

        <div className="os-fortune-crystal" onClick={tellFortune}>
          <motion.div
            className="os-crystal-ball"
            animate={{ rotate: animating ? 360 : 0, scale: animating ? 1.1 : 1 }}
            transition={{ duration: animating ? 0.8 : 0 }}
          >
            <Sparkles size={48} />
          </motion.div>
          <button className="os-fortune-ask-btn" onClick={tellFortune} disabled={animating}>
            {animating ? (
              <>
                <span className="os-spinner" /> Consulting the stars...
              </>
            ) : (
              "Ask the Crystal Ball"
            )}
          </button>
        </div>

        <AnimatePresence>
          {currentFortune && (
            <motion.div
              className="os-fortune-result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className={`os-fortune-card result ${currentFortune.category}`}>
                <div className="os-fortune-icon">
                  <currentFortune.icon size={32} />
                </div>
                <p className="os-fortune-text">{currentFortune.text}</p>
                <span className="os-fortune-category-tag">{currentFortune.category}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="os-fortune-history">
        <div className="os-fortune-history-header">
          <h3>📜 Recent Fortunes</h3>
          {history.length > 0 && (
            <button onClick={clearHistory} className="os-fortune-clear">Clear History</button>
          )}
        </div>
        <div className="os-fortune-history-list">
          {history.length === 0 ? (
            <p className="os-fortune-empty">No fortunes yet. Ask the crystal ball!</p>
          ) : (
            history.map((f, i) => (
              <motion.div
                key={i}
                className={`os-fortune-history-item ${f.category}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <f.icon size={16} />
                <span>{f.text}</span>
                <span className="os-fortune-time">{new Date().toLocaleTimeString()}</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}