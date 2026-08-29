import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function MarioWelcome({ onComplete }) {
  const [phase, setPhase] = useState("enter");
  const [showDialog, setShowDialog] = useState(false);
  const marioRef = useRef(null);
  const questionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("run");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "run") {
      const timer = setTimeout(() => {
        setPhase("jump");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "jump") {
      const timer = setTimeout(() => {
        setPhase("grow");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "grow") {
      const timer = setTimeout(() => {
        setShowDialog(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  function handleContinue() {
    setShowDialog(false);
    setPhase("exit");
    setTimeout(() => onComplete(), 500);
  }

  if (phase === "exit") return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="os-mario-welcome"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="os-mario-scene">
          <div className="os-mario-ground" />
          <motion.div
            ref={marioRef}
            className={`os-mario ${phase === "grow" ? "big" : ""} ${phase === "jump" ? "jumping" : ""}`}
            animate={{
              x: phase === "run" || phase === "jump" || phase === "grow" ? "calc(100vw - 120px)" : -80,
              y: phase === "jump" ? -120 : phase === "grow" ? -40 : 0,
              scale: phase === "grow" ? 1.5 : 1,
            }}
            transition={{
              x: { duration: phase === "run" ? 2 : 1, ease: "linear" },
              y: { duration: 0.5, ease: "easeOut" },
              scale: { duration: 0.3, ease: "easeOut" },
            }}
          >
            <div className="os-mario-hat" />
            <div className="os-mario-face">
              <div className="os-mario-mustache" />
              <div className="os-mario-eyes">
                <span className="os-mario-eye" />
                <span className="os-mario-eye" />
              </div>
            </div>
            <div className="os-mario-body">
              <div className="os-mario-overalls" />
              <div className="os-mario-arms">
                <span className="os-mario-arm" />
                <span className="os-mario-arm" />
              </div>
            </div>
            <div className="os-mario-legs">
              <span className="os-mario-leg" />
              <span className="os-mario-leg" />
            </div>
          </motion.div>
          <motion.div
            ref={questionRef}
            className="os-mario-question"
            animate={{ scale: phase === "grow" ? 1 : 0.5, opacity: phase === "grow" ? 1 : 0 }}
            transition={{ delay: 1.2, duration: 0.3, type: "spring", stiffness: 150, damping: 10 }}
          >
            <span>?</span>
          </motion.div>
          <motion.div
            className="os-mario-coins"
            animate={{ opacity: phase === "grow" ? 1 : 0 }}
            transition={{ delay: 1.3, staggerChildren: 0.1 }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.span
                key={i}
                className="os-mario-coin"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -60, opacity: 1 }}
                exit={{ y: -80, opacity: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                🪙
              </motion.span>
            ))}
          </motion.div>
        </div>

        <AnimatePresence>
          {showDialog && (
            <motion.div
              className="os-mario-dialog-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="os-mario-dialog"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
              >
                <div className="os-mario-dialog-header">
                  <span>🍄 Welcome to Mintex Linux!</span>
                  <button className="os-mario-dialog-close" onClick={handleContinue}><X size={16} /></button>
                </div>
                <div className="os-mario-dialog-content">
                  <p>Mario has grown and collected coins for you!</p>
                  <p>Your Linux desktop is ready to explore.</p>
                  <ul>
                    <li>🎮 Games folder with Flappy Bird, Pac-Man, Crossy Road</li>
                    <li>📁 Files, Terminal, Browser, Calendar & more</li>
                    <li>🛒 App Store for installing new apps</li>
                    <li>🎨 Customizable wallpapers & themes</li>
                  </ul>
                </div>
                <button className="os-mario-dialog-btn" onClick={handleContinue}>
                  Let's-a go!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}