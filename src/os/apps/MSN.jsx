import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Bell, Smile, Mic, MoreHorizontal, UserPlus, Settings, X, Minimize2, Maximize2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BOT_RESPONSES = [
  "That's interesting! Tell me more.",
  "I see what you mean.",
  "Hmm, I'm not sure about that.",
  "Cool! 😎",
  "Nice one!",
  "I agree!",
  "That's a great point.",
  "Really? I didn't know that.",
  "Awesome! 👍",
  "Thanks for sharing!",
];

const NUDGE_SOUND = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";

export function MSNWindow({ onClose, onMinimize, onToggleMax, windows, activeId }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: "System", text: "Welcome to MSN Messenger! You're now connected.", time: new Date(), type: "system" },
    { id: 2, sender: "Clippy", text: "Hi there! I'm your AI assistant. How can I help you today?", time: new Date(Date.now() + 1000), type: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState(() => localStorage.getItem("msn_username") || "User" + Math.floor(Math.random() * 1000));
  const [showEmojis, setShowEmojis] = useState(false);
  const [botEnabled, setBotEnabled] = useState(true);
  const [nudgeCount, setNudgeCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(["Clippy", "Ahmed", "Guest_" + Math.floor(Math.random() * 100)]);
  const [activeTab, setActiveTab] = useState("chat");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(new Audio(NUDGE_SOUND));

  useEffect(() => {
    localStorage.setItem("msn_username", username);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function playNudgeSound() {
    try { audioRef.current.currentTime = 0; audioRef.current.play(); } catch {}
  }

  function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    const userMsg = { id: Date.now(), sender: username, text, time: new Date(), type: "user" };
    setMessages((prev) => [...prev, userMsg]);
    if (botEnabled) {
      setTimeout(() => {
        const botMsg = { id: Date.now() + 1, sender: "Clippy", text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)], time: new Date(), type: "bot" };
        setMessages((prev) => [...prev, botMsg]);
        if (activeTab !== "chat") setUnreadCount((c) => c + 1);
      }, 1000 + Math.random() * 2000);
    }
  }

  function handleNudge() {
    setNudgeCount((c) => c + 1);
    playNudgeSound();
    const nudgeMsg = { id: Date.now(), sender: username, text: "📢 *nudges the window*", time: new Date(), type: "nudge" };
    setMessages((prev) => [...prev, nudgeMsg]);
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="os-msn">
      <header className="os-msn-header">
        <div className="os-msn-title">
          <MessageSquare size={16} />
          <span>MSN Messenger</span>
          <span className="os-msn-status">● Online</span>
        </div>
        <div className="os-msn-controls">
          <button onClick={onMinimize} title="Minimize"><Minimize2 size={12} /></button>
          <button onClick={onToggleMax} title="Maximize"><Maximize2 size={12} /></button>
          <button onClick={onClose} title="Close"><X size={12} /></button>
        </div>
      </header>

      <div className="os-msn-tabs">
        <button className={activeTab === "chat" ? "active" : ""} onClick={() => { setActiveTab("chat"); setUnreadCount(0); }}>
          <MessageSquare size={14} /> Chat
          {unreadCount > 0 && <span className="os-msn-badge">{unreadCount}</span>}
        </button>
        <button className={activeTab === "contacts" ? "active" : ""} onClick={() => setActiveTab("contacts")}>
          <UserPlus size={14} /> Contacts
        </button>
        <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
          <Settings size={14} /> Settings
        </button>
      </div>

      {activeTab === "chat" && (
        <div className="os-msn-chat">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`os-msn-message ${msg.type}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="os-msn-msg-header">
                  <strong>{msg.sender}</strong>
                  <span className="os-msn-msg-time">{formatTime(msg.time)}</span>
                </div>
                <div className="os-msn-msg-text">{msg.text}</div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="os-msn-contacts">
          {onlineUsers.map((user) => (
            <div key={user} className="os-msn-contact">
              <span className="os-msn-contact-dot" />
              <span>{user}</span>
              {user !== username && (
                <button onClick={() => { setActiveTab("chat"); setInput(`@${user} `); }}>
                  <MessageSquare size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "settings" && (
        <div className="os-msn-settings">
          <div className="os-msn-setting">
            <label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your name" />
              <span>Display Name</span>
            </label>
          </div>
          <div className="os-msn-setting">
            <label>
              <input type="checkbox" checked={botEnabled} onChange={(e) => setBotEnabled(e.target.checked)} />
              <span>Enable Clippy Bot</span>
            </label>
          </div>
          <div className="os-msn-setting">
            <label>
              <input type="checkbox" checked={true} />
              <span>Play notification sounds</span>
            </label>
          </div>
          <div className="os-msn-setting">
            <button onClick={handleNudge} className="os-msn-nudge-btn">
              <Bell size={14} /> Test Nudge ({nudgeCount})
            </button>
          </div>
        </div>
      )}

      <div className="os-msn-input-bar">
        <div className="os-msn-input-tools">
          <button onClick={() => setShowEmojis(!showEmojis)} title="Emojis"><Smile size={16} /></button>
          <button title="Voice"><Mic size={16} /></button>
          <button onClick={handleNudge} title="Nudge!"><Bell size={16} /></button>
          <button title="More"><MoreHorizontal size={16} /></button>
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
        />
        <button onClick={handleSend} disabled={!input.trim()}><Send size={16} /></button>
      </div>
    </div>
  );
}