import { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCw, AlertTriangle } from "lucide-react";
import AppContext from "../AppContext";

const PATCH_VERSION = "2.1.0";
const STORAGE_KEY = "mintex_patch_dismissed";

export function PatchNotification() {
  const [visible, setVisible] = useState(false);
  const { addNotification } = useContext(AppContext);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed || dismissed !== PATCH_VERSION) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, PATCH_VERSION);
  }

  function remindLater() {
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="os-patch-notification"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      >
        <div className="os-patch-icon">
          <AlertTriangle size={28} />
        </div>
        <div className="os-patch-content">
          <strong>System Update Available</strong>
          <span>Mintex Linux {PATCH_VERSION} is ready to install. New features: App Store, Run Dialog, Enhanced Task Manager, and more!</span>
        </div>
        <div className="os-patch-actions">
          <button className="os-patch-btn-primary" onClick={() => { addNotification({ title: "Updating...", message: "Downloading and installing updates", duration: 5000 }); dismiss(); }}>
            <RotateCw size={14} /> Install Now
          </button>
          <button className="os-patch-btn-secondary" onClick={remindLater}>Remind Me Later</button>
          <button className="os-patch-btn-dismiss" onClick={dismiss}><X size={14} /></button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}