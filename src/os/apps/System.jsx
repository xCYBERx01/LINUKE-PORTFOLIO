import { Trash2, RotateCcw, Gauge, Cpu, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export function TaskManagerWindow({ windows, activeId, onFocus, onClose }) {
  const [tab, setTab] = useState("processes");
  const [cpu, setCpu] = useState(8);
  const [mem, setMem] = useState(34);
  const [cpuHist, setCpuHist] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);

  useEffect(() => {
    const t = setInterval(() => {
      const c = Math.floor(4 + Math.random() * 40);
      const m = Math.floor(28 + Math.random() * 42);
      setCpu(c);
      setMem(m);
      setCpuHist((h) => [...h.slice(-40), c]);
    }, 1200);
    return () => clearInterval(t);
  }, []);

  function endTask(id) {
    if (onClose) onClose(id);
    setSelectedProcess(null);
  }

  return (
    <div className="os-taskmanager">
      <div className="os-tm-tabs">
        <button className={tab === "processes" ? "active" : ""} onClick={() => setTab("processes")}>Processes</button>
        <button className={tab === "performance" ? "active" : ""} onClick={() => setTab("performance")}>Performance</button>
        <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>Users</button>
      </div>
      {tab === "processes" && (
        <>
          <table>
            <thead>
              <tr>
                <th>Window</th>
                <th>Status</th>
                <th>Memory</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {windows.map((w) => {
                const fmt = (w.id.charCodeAt(0) % 900 + 60).toFixed(1);
                return (
                  <tr key={w.id} className={activeId === w.id ? "active" : ""} onClick={() => { onFocus(w.id); setSelectedProcess(w.id); }}>
                    <td>{w.title}</td>
                    <td>{w.minimized ? "Minimized" : "Running"}</td>
                    <td>{fmt} MB</td>
                    <td>
                      <button className="os-tm-endtask" onClick={(e) => { e.stopPropagation(); endTask(w.id); }}>End Task</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="os-tm-footer">
            {selectedProcess && (
              <button className="os-tm-endtask" onClick={() => endTask(selectedProcess)}>End Task</button>
            )}
            {windows.length} process{windows.length === 1 ? "" : "es"} running
          </div>
        </>
      )}
      {tab === "performance" && (
        <div className="os-tm-performance">
          <div className="os-tm-metric">
            <div className="os-meter">
              <div className="os-meter-label"><Gauge size={14} /> CPU</div>
              <div className="os-meter-bar"><div style={{ width: `${cpu}%` }} /></div>
              <span>{cpu}%</span>
            </div>
            <div className="os-tm-spark">
              {cpuHist.map((v, i) => {
                const h = Math.max(3, (v / 60) * 100);
                return <span key={i} style={{ height: `${h}%` }} />;
              })}
            </div>
          </div>
          <div className="os-tm-metric">
            <div className="os-meter">
              <div className="os-meter-label"><Cpu size={14} /> Memory</div>
              <div className="os-meter-bar"><div style={{ width: `${mem}%` }} /></div>
              <span>{mem}%</span>
            </div>
          </div>
        </div>
      )}
      {tab === "users" && (
        <div className="os-tm-users">
          <p className="os-empty">1 active session</p>
          <div className="os-tm-user">
            <Activity size={16} />
            <span>ahmed — Console session active</span>
          </div>
        </div>
      )}
      <div className="os-tm-footer">Mintex Task Manager — {windows.length} process{windows.length === 1 ? "" : "es"} running</div>
    </div>
  );
}

export function SysMonitorWindow() {
  const [mem, setMem] = useState(38);
  const [cpu, setCpu] = useState(12);
  useEffect(() => {
    const t = setInterval(() => {
      setMem(Math.floor(25 + Math.random() * 45));
      setCpu(Math.floor(5 + Math.random() * 40));
    }, 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="os-content os-sysmon">
      <h1>System Monitor</h1>
      <div className="os-meter">
        <div className="os-meter-label"><Gauge size={14} /> CPU</div>
        <div className="os-meter-bar"><div style={{ width: `${cpu}%` }} /></div>
        <span>{cpu}%</span>
      </div>
      <div className="os-meter">
        <div className="os-meter-label"><Cpu size={14} /> Memory</div>
        <div className="os-meter-bar"><div style={{ width: `${mem}%` }} /></div>
        <span>{mem}%</span>
      </div>
      <div className="os-meter">
        <div className="os-meter-label"><Activity size={14} /> Swap</div>
        <div className="os-meter-bar"><div style={{ width: "9%" }} /></div>
        <span>9%</span>
      </div>
      <dl className="os-sysmon-info">
        <div><dt>OS</dt><dd>Mintex Linux 6.6</dd></div>
        <div><dt>Kernel</dt><dd>6.6.1-mintex</dd></div>
        <div><dt>DE</dt><dd>Mintex Shell</dd></div>
        <div><dt>User</dt><dd>ahmed</dd></div>
      </dl>
    </div>
  );
}

const BIN_KEY = "mintex_bin";

export function RecycleBinWindow() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(BIN_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(BIN_KEY, JSON.stringify(items));
  }, [items]);

  function purge() {
    if (confirm("Permanently delete all items in the Trash?")) setItems([]);
  }

  return (
    <div className="os-recyclebin">
      <div className="os-menubar">
        <button onClick={purge}><Trash2 size={14} /> Empty Trash</button>
        <span className="os-menubar-status">{items.length} item{items.length === 1 ? "" : "s"}</span>
      </div>
      <div className="os-recycle-list">
        {items.length === 0 ? (
          <p className="os-empty">Trash is empty.</p>
        ) : (
          items.map((item, i) => (
            <div className="os-recycle-item" key={i}>
              <RotateCcw size={16} />
              <span>{item.name}</span>
              <button
                onClick={() =>
                  setItems(items.filter((_, idx) => idx !== i))
                }
              >
                Restore
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
