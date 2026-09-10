import { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppContext from "../AppContext";

export function Notification() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { notifications, addNotification, removeNotification } = useContext(AppContext);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AnimatePresence>
      {notifications.map((notif, index) => (
        <motion.div
          key={notif.id}
          className="os-notification"
          onClick={() => {
            if (notif.action) notif.action();
            removeNotification(notif.id);
          }}
          initial={{ opacity: 0, x: screenWidth <= 600 ? 0 : 400, y: screenWidth <= 600 ? -100 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: screenWidth <= 600 ? 0 : 400, y: screenWidth <= 600 ? -100 : 0, transition: { duration: 0.3 } }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          style={{ bottom: index * 90 + 20 }}
        >
          <div className="os-notification-icon">
            {notif.icon ? <notif.icon size={20} /> : null}
          </div>
          <div className="os-notification-content">
            <strong>{notif.title}</strong>
            <span>{notif.message}</span>
          </div>
          <button className="os-notification-close" onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}>×</button>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}