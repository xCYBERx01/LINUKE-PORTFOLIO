import { useState, useEffect, useRef } from "react";
import {
  Send,
  MessageSquare,
  Bell,
  Smile,
  UserPlus,
  Settings,
  X,
  Mail,
  ExternalLink,
  Phone,
  MapPin,
} from "lucide-react";
import { CONTACT } from "../data";

const BOT_RESPONSES = [
  "That's interesting! Tell me more.",
  "I see what you mean.",
  "Hmm, I'm not sure about that.",
  "Cool!",
  "Nice one!",
  "I agree!",
  "That's a great point.",
  "Really? I didn't know that.",
  "Awesome!",
  "Thanks for sharing!",
];

export default function Contact() {
  const [activeTab, setActiveTab] = useState("info");
  const [messages, setMessages] = useState([
    { id: 1, sender: "System", text: "Welcome to Chat! You're now connected.", time: new Date(), type: "system" },
    { id: 2, sender: "Ahmed", text: "Hi there! Feel free to reach out about projects or collaborations.", time: new Date(Date.now() + 1000), type: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState(() => localStorage.getItem("contact_username") || "Guest");
  const [botEnabled, setBotEnabled] = useState(true);
  const [onlineUsers] = useState(["Ahmed", "Guest"]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    const userMsg = { id: Date.now(), sender: username, text, time: new Date(), type: "user" };
    setMessages((prev) => [...prev, userMsg]);
    if (botEnabled) {
      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          sender: "Ahmed",
          text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
          time: new Date(),
          type: "bot",
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 1000 + Math.random() * 2000);
    }
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="contact">
      <div className="contact-tabs">
        <button className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>
          <Mail size={14} /> Contact Info
        </button>
        <button className={activeTab === "chat" ? "active" : ""} onClick={() => setActiveTab("chat")}>
          <MessageSquare size={14} /> Chat
        </button>
        <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
          <Settings size={14} /> Settings
        </button>
      </div>

      {activeTab === "info" && (
        <div className="contact-info">
          <div className="contact-avatar">
            <div className="contact-avatar-circle">AA</div>
            <h2>Ahmed Irfan Akrami</h2>
            <p>Robotics & Embedded Systems Engineer</p>
          </div>
          <div className="contact-links">
            <a href={`mailto:${CONTACT.email}`} className="contact-link">
              <Mail size={16} />
              <div>
                <span className="contact-link-label">Email</span>
                <span className="contact-link-value">{CONTACT.email}</span>
              </div>
            </a>
            <a href={`https://${CONTACT.github}`} target="_blank" rel="noreferrer" className="contact-link">
              <ExternalLink size={16} />
              <div>
                <span className="contact-link-label">GitHub</span>
                <span className="contact-link-value">{CONTACT.github}</span>
              </div>
            </a>
            <div className="contact-link">
              <MapPin size={16} />
              <div>
                <span className="contact-link-label">Location</span>
                <span className="contact-link-value">India</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "chat" && (
        <div className="contact-chat">
          <div className="contact-chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`contact-msg ${msg.type}`}>
                <div className="contact-msg-header">
                  <strong>{msg.sender}</strong>
                  <span>{formatTime(msg.time)}</span>
                </div>
                <div className="contact-msg-text">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="contact-chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
            />
            <button onClick={handleSend} disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="contact-settings">
          <div className="contact-setting">
            <label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  localStorage.setItem("contact_username", e.target.value);
                }}
                placeholder="Your name"
              />
              <span>Display Name</span>
            </label>
          </div>
          <div className="contact-setting">
            <label>
              <input
                type="checkbox"
                checked={botEnabled}
                onChange={(e) => setBotEnabled(e.target.checked)}
              />
              <span>Enable Auto-Reply</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
