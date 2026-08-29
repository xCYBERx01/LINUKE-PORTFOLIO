import { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, MessageSquare, Heart, X } from "lucide-react";
import AppContext from "../AppContext";

const CROC_TIPS = [
  "Tap my left eye — love. Right eye — trick!",
  "Hold right eye 0.8s → angry, left → yawn.",
  "FACE idle drifts eyes; INFO has 7 pages.",
  "Try Files → hardware/software or Terminal → 'projects'.",
];

const CROC_THOUGHTS = [
  "Daily thought: The best way to predict the future is to invent it.",
  "Psst — like this? Star github.com/xCYBERx01 ⭐",
  "It looks like you're exploring — need a tip?",
  "Share this OS with a hardware friend!",
  "Make it work, make it right, make it fast.",
];

function FaceV053({ expression, blinking, eyeX, eyeY, now }) {
  const isSleepy = expression === "sleepy";
  if (isSleepy) {
    const y = 28 + Math.sin(now / 800) * 2;
    const z1 = ((now / 1500) % 1);
    const z2 = (((now + 750) / 1500) % 1);
    return (
      <svg viewBox="0 0 128 64" width="100%" height="100%" style={{ display: "block" }}>
        <rect width={128} height={64} rx={3} fill="#000" />
        <rect x={20} y={y} width={28} height={4} rx={2} fill="#fff" />
        <rect x={80} y={y} width={28} height={4} rx={2} fill="#fff" />
        {z1 > 0.1 && <text x={95 + Math.sin(z1 * 5) * 3} y={25 - z1 * 15} fill="#4fc3f7" fontSize="6" fontFamily="monospace">z</text>}
        {z2 > 0.1 && <text x={105 + Math.cos(z2 * 5) * 3} y={15 - z2 * 20} fill="#4fc3f7" fontSize="10" fontFamily="monospace">Z</text>}
      </svg>
    );
  }
  let eyeW = 28, eyeH = 22, leftX = 20, rightX = 80, eyeYPos = 16;
  let drawPupils = true;
  let lookX = eyeX, lookY = eyeY;
  if (expression === "idle") { eyeH = 20 + Math.sin(now / 500) * 2; eyeW = 26; }
  if (expression === "happy") { eyeH = 14; eyeYPos = 20; }
  else if (expression === "love") { eyeW = 32; eyeH = 32; eyeYPos = 10; leftX = 16; rightX = 80; }
  else if (expression === "proud") { eyeH = 14; eyeYPos = 20; }
  else if (expression === "excited" || expression === "surprised") { eyeW = 28; eyeH = 28; eyeYPos = 12; }
  else if (expression === "suspicious") { eyeH = 8; eyeYPos = 20; }
  else if (expression === "yawn") { eyeH = 4; eyeYPos = 22; drawPupils = false; }
  else if (expression === "dizzy") { drawPupils = false; }
  else if (expression === "shy") { eyeYPos = 20; eyeH = 18; lookY = 4; lookX = (now % 2000 > 1000) ? -2 : 2; }
  else if (expression === "confused") { drawPupils = false; }

  return (
    <svg viewBox="0 0 128 64" width="100%" height="100%" style={{ display: "block" }}>
      <rect width={128} height={64} rx={3} fill="#000" />
      {/* cyber-blue eyebrows */}
      {expression === "angry" && <g stroke="#4fc3f7" strokeWidth={1.2} strokeLinecap="round"><line x1={leftX} y1={10} x2={leftX + 22} y2={18} /><line x1={rightX + 6} y1={18} x2={rightX + 28} y2={10} /></g>}
      {expression === "proud" && <g stroke="#4fc3f7" strokeWidth={1.2} strokeLinecap="round"><line x1={leftX} y1={16} x2={leftX + 22} y2={10} /><line x1={rightX + 6} y1={10} x2={rightX + 28} y2={16} /></g>}
      {expression === "curious" && <g stroke="#4fc3f7" strokeWidth={1.2} strokeLinecap="round"><line x1={leftX} y1={10} x2={leftX + 20} y2={8} /></g>}
      {blinking ? (
        <>
          <rect x={leftX} y={26} width={eyeW} height={4} rx={2} fill="#4fc3f7" />
          <rect x={rightX} y={26} width={eyeW} height={4} rx={2} fill="#4fc3f7" />
        </>
      ) : expression === "dizzy" ? (
        <>
          <circle cx={leftX + 14} cy={24} r={10} fill="none" stroke="#4fc3f7" strokeWidth={1.2} /><circle cx={leftX + 14} cy={24} r={4} fill="none" stroke="#4fc3f7" strokeWidth={1} />
          <circle cx={rightX + 14} cy={24} r={10} fill="none" stroke="#4fc3f7" strokeWidth={1.2} /><circle cx={rightX + 14} cy={24} r={4} fill="none" stroke="#4fc3f7" strokeWidth={1} />
        </>
      ) : expression === "confused" ? (
        <>
          <rect x={leftX} y={16} width={20} height={20} rx={6} fill="#4fc3f7" /><rect x={rightX} y={12} width={30} height={30} rx={8} fill="#4fc3f7" />
          <circle cx={leftX + 10 + lookX} cy={26 + lookY} r={4} fill="#000" /><circle cx={rightX + 15 + lookX} cy={27 + lookY} r={6} fill="#000" />
        </>
      ) : (
        <>
          <rect x={leftX} y={eyeYPos} width={eyeW} height={eyeH} rx={8} fill="#4fc3f7" />
          <rect x={rightX} y={eyeYPos} width={eyeW} height={eyeH} rx={8} fill="#4fc3f7" />
          {drawPupils && (
            <>
              {(() => {
                let s = 6; if (expression === "surprised") s = 4; if (expression === "love") s = 10;
                return (
                  <>
                    <circle cx={leftX + eyeW / 2 + lookX} cy={eyeYPos + eyeH / 2 + lookY} r={s} fill="#000" />
                    <circle cx={rightX + eyeW / 2 + lookX} cy={eyeYPos + eyeH / 2 + lookY} r={s} fill="#000" />
                    {expression === "love" && (
                      <>
                        <circle cx={leftX + eyeW / 2 + lookX - 3} cy={eyeYPos + eyeH / 2 + lookY - 3} r={3} fill="#fff" />
                        <circle cx={rightX + eyeW / 2 + lookX - 3} cy={eyeYPos + eyeH / 2 + lookY - 3} r={3} fill="#fff" />
                      </>
                    )}
                  </>
                );
              })()}
            </>
          )}
        </>
      )}
      {(() => {
        const cx = 64;
        if (expression === "happy" || expression === "proud") return <g stroke="#4fc3f7" strokeWidth={1.2} strokeLinecap="round" fill="none"><line x1={56} y1={50} x2={60} y2={54} /><line x1={60} y1={54} x2={68} y2={54} /><line x1={68} y1={54} x2={72} y2={50} /></g>;
        if (expression === "love" || expression === "excited") return <path d="M58 50 L70 50 L64 56 Z" fill="#4fc3f7" />;
        if (expression === "yawn") return <g><circle cx={cx} cy={50} r={8} fill="#4fc3f7" /><circle cx={cx} cy={50} r={4} fill="#000" /></g>;
        if (expression === "surprised") return <circle cx={cx} cy={52} r={5} fill="none" stroke="#4fc3f7" strokeWidth={1.2} />;
        if (expression === "angry" || expression === "suspicious") return <g stroke="#4fc3f7" strokeWidth={1.2} strokeLinecap="round" fill="none"><line x1={54} y1={53} x2={64} y2={49} /><line x1={64} y1={49} x2={74} y2={53} /></g>;
        if (expression === "confused") return <g stroke="#4fc3f7" strokeWidth={1.2} strokeLinecap="round" fill="none"><line x1={56} y1={52} x2={60} y2={50} /><line x1={60} y1={50} x2={64} y2={54} /><line x1={64} y1={54} x2={68} y2={52} /></g>;
        if (expression === "hungry") return <circle cx={cx} cy={53} r={3} fill="none" stroke="#4fc3f7" strokeWidth={1.2} />;
        return <g stroke="#4fc3f7" strokeWidth={1.2} strokeLinecap="round" fill="none"><line x1={58} y1={52} x2={64} y2={53} /><line x1={64} y1={53} x2={70} y2={52} /></g>;
      })()}
    </svg>
  );
}

export default function Croc() {
  const [visible, setVisible] = useState(true);
  const [expression, setExpression] = useState("idle");
  const [balloonVisible, setBalloonVisible] = useState(false);
  const [balloonMsg, setBalloonMsg] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  const [tilt, setTilt] = useState(0);
  const { addNotification } = useContext(AppContext);
  const eyeRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const blinkingRef = useRef(false);
  const blinkStartRef = useRef(0);
  const nextBlinkRef = useRef(4000);
  const nextLookRef = useRef(0);
  const expressionUntilRef = useRef(0);
  const [eye, setEye] = useState({ x: 0, y: 0 });
  const [blinking, setBlinking] = useState(false);
  const [now, setNow] = useState(Date.now());

  function beep(f, d) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "square"; o.frequency.value = f; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.05, ctx.currentTime); o.start(); setTimeout(() => { o.stop(); ctx.close(); }, d);
    } catch {}
  }
  function setExpressionFor(e, d) { setExpression(e); expressionUntilRef.current = Date.now() + d; }

  function showNextTip() {
    const m = CROC_TIPS[tipIndex % CROC_TIPS.length];
    setBalloonMsg(m); setBalloonVisible(true); setTipIndex((i) => i + 1);
    setExpressionFor("curious", 1200); beep(1600, 70);
  }
  function showThought() {
    const m = CROC_THOUGHTS[Math.floor(Math.random() * CROC_THOUGHTS.length)];
    setBalloonMsg(m); setBalloonVisible(true);
    setExpressionFor("curious", 1200); beep(1600, 70);
  }
  function handleLike() {
    addNotification({ title: "Croc", message: "You're awesome! ❤️", duration: 2500 });
    window.open("https://github.com/xCYBERx01", "_blank");
    setExpressionFor("love", 1500); beep(800, 80);
  }

  // balloon first show
  useEffect(() => {
    const dismissed = localStorage.getItem("mintex_croc_dismissed");
    if (!dismissed || Date.now() - parseInt(dismissed, 10) > 3600000) {
      const t = setTimeout(() => {
        setBalloonMsg(CROC_THOUGHTS[Math.floor(Math.random() * CROC_THOUGHTS.length)]);
        setBalloonVisible(true);
      }, 10000);
      return () => clearTimeout(t);
    }
  }, []);

  // cursor follow when idle — eyes track mouse
  useEffect(() => {
    function onMove(e) {
      if (expression !== "idle" && expression !== "hungry") return;
      if (balloonVisible) return; // don't chase while balloon open
      const el = document.querySelector(".os-croc-faceonly");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = ((e.clientX - cx) / (window.innerWidth * 0.5)) * 6;
      const dy = ((e.clientY - cy) / (window.innerHeight * 0.5)) * 3;
      eyeRef.current.tx = Math.max(-6, Math.min(6, dx));
      eyeRef.current.ty = Math.max(-3, Math.min(3, dy));
      nextLookRef.current = Date.now() + 800; // pause random drift while tracking
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [expression, balloonVisible]);

  // 33ms face engine
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now(); setNow(t);
      if (expression !== "idle" && expression !== "hungry" && t > expressionUntilRef.current) setExpression("idle");
      if ((expression === "idle" || expression === "hungry") && !blinkingRef.current && t >= nextBlinkRef.current) {
        blinkingRef.current = true; blinkStartRef.current = t; setBlinking(true);
      }
      if (blinkingRef.current && t - blinkStartRef.current > 160) {
        blinkingRef.current = false; setBlinking(false); nextBlinkRef.current = t + (2500 + Math.random() * 3500);
      }
      // only random drift if not recently driven by cursor
      if ((expression === "idle" || expression === "hungry") && t >= nextLookRef.current) {
        eyeRef.current.tx = Math.floor(Math.random() * 9) - 4;
        eyeRef.current.ty = Math.floor(Math.random() * 5) - 2;
        nextLookRef.current = t + (1500 + Math.random() * 2000);
      }
      if (expression !== "idle" && expression !== "hungry") { eyeRef.current.tx = 0; eyeRef.current.ty = 0; }
      eyeRef.current.x += (eyeRef.current.tx - eyeRef.current.x) * 0.15;
      eyeRef.current.y += (eyeRef.current.ty - eyeRef.current.y) * 0.15;
      setEye({ x: Math.round(eyeRef.current.x), y: Math.round(eyeRef.current.y) });
    }, 33);
    return () => clearInterval(id);
  }, [expression]);

  function doTilt(dir) {
    setTilt(dir);
    setTimeout(() => setTilt(0), 320);
  }

  function handleEyeClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeft = x < rect.width / 2;
    // keep picture — tilt towards click
    doTilt(isLeft ? -8 : 8);
    if (isLeft) { setExpressionFor("love", 1500); beep(800, 80); }
    else {
      setExpressionFor("excited", 1400);
      eyeRef.current.tx = -6; setTimeout(() => { eyeRef.current.tx = 6; }, 100); setTimeout(() => { eyeRef.current.tx = 0; }, 200);
      try { beep(900, 120); } catch {}
    }
    // also show thought occasionally
    if (Math.random() < 0.35) showThought();
  }

  function handleRightClick(e) {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeft = x < rect.width / 2;
    doTilt(isLeft ? -6 : 6);
    if (isLeft) { setExpressionFor("yawn", 2000); beep(400, 200); }
    else { setExpressionFor("angry", 1500); beep(200, 180); }
  }

  if (!visible) return null;

  return (
    <div className="os-croc os-croc--borderless">
      <AnimatePresence>
        {balloonVisible && (
          <motion.div
            className="os-croc-balloon"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <p>{balloonMsg}</p>
            <div className="os-croc-balloon-actions">
              <button onClick={showNextTip}><Lightbulb size={14} /> Tip</button>
              <button onClick={showThought}><MessageSquare size={14} /> Thought</button>
              <button onClick={handleLike}><Heart size={14} /> Like</button>
            </div>
            <button className="os-croc-balloon-close" onClick={() => { setBalloonVisible(false); localStorage.setItem("mintex_croc_dismissed", Date.now().toString()); }}><X size={12} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="os-croc-faceonly"
        animate={{ rotate: tilt }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        onClick={handleEyeClick}
        onContextMenu={handleRightClick}
        title="Left eye → love • Right eye → trick • Right-click → yawn/angry • Click tilts"
        style={{ cursor: "pointer" }}
      >
        <div className="os-croc-oled os-croc-oled--face">
          <FaceV053 expression={expression} blinking={blinking} eyeX={eye.x} eyeY={eye.y} now={now} />
        </div>
      </motion.div>
    </div>
  );
}
