import { useMemo, useState, useEffect, useRef } from "react";
import { Flag, Bomb } from "lucide-react";

const ROWS = 10;
const COLS = 10;
const MINES = 12;

function buildGrid() {
  const grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, adjacent: 0, revealed: false, flagged: false })),
  );
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!grid[r][c].mine) {
      grid[r][c].mine = true;
      placed++;
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c].mine) continue;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc].mine) n++;
        }
      grid[r][c].adjacent = n;
    }
  }
  return grid;
}

export default function Minesweeper() {
  const [grid, setGrid] = useState(buildGrid);
  const [status, setStatus] = useState("playing"); // playing | won | lost
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  const flags = useMemo(
    () => grid.flat().filter((c) => c.flagged).length,
    [grid],
  );

  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [status]);

  function reveal(r, c) {
    if (status !== "playing" || grid[r][c].revealed || grid[r][c].flagged) return;
    const next = grid.map((row) => row.map((cell) => ({ ...cell })));
    if (next[r][c].mine) {
      next.forEach((row) => row.forEach((cell) => { if (cell.mine) cell.revealed = true; }));
      setGrid(next);
      setStatus("lost");
      return;
    }
    const stack = [[r, c]];
    while (stack.length) {
      const [cr, cc] = stack.pop();
      const cell = next[cr][cc];
      if (cell.revealed) continue;
      cell.revealed = true;
      if (cell.adjacent === 0) {
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const nr = cr + dr, nc = cc + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !next[nr][nc].revealed && !next[nr][nc].mine)
              stack.push([nr, nc]);
          }
      }
    }
    setGrid(next);
    const won = next.flat().every((cell) => cell.revealed || cell.mine);
    if (won) setStatus("won");
  }

  function toggleFlag(r, c, e) {
    e.preventDefault();
    if (status !== "playing" || grid[r][c].revealed) return;
    const next = grid.map((row) => row.map((cell) => ({ ...cell })));
    next[r][c].flagged = !next[r][c].flagged;
    setGrid(next);
  }

  function reset() {
    setGrid(buildGrid());
    setStatus("playing");
    setTime(0);
  }

  const face = status === "lost" ? "☹" : status === "won" ? "😎" : "🙂";

  return (
    <div className="os-minesweeper">
      <div className="os-ms-head">
        <span className="os-ms-counter">{String(MINES - flags).padStart(3, "0")}</span>
        <button className="os-ms-face" onClick={reset}>{face}</button>
        <span className="os-ms-counter">{String(time).padStart(3, "0")}</span>
      </div>
      <div className="os-ms-grid">
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              className={[
                "os-ms-cell",
                cell.revealed ? "revealed" : "",
                cell.revealed && cell.mine ? "mine" : "",
                `adj-${cell.adjacent}`,
              ].join(" ")}
              onClick={() => reveal(r, c)}
              onContextMenu={(e) => toggleFlag(r, c, e)}
            >
              {cell.revealed && cell.mine ? <Bomb size={14} /> : cell.flagged ? <Flag size={14} /> : cell.revealed && cell.adjacent > 0 ? cell.adjacent : ""}
            </button>
          )),
        )}
      </div>
      <div className="os-ms-footer">
        {status === "won" ? "You win! Mines cleared." : status === "lost" ? "Boom! Click the face to retry." : "Left-click reveal · right-click flag"}
      </div>
    </div>
  );
}

export function PaintWindow() {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#E95420");
  const [tool, setTool] = useState("pen");
  const [size, setSize] = useState(4);
  const [fillMode, setFillMode] = useState(false);
  const downRef = useRef(false);
  const startRef = useRef(null);
  const snapshotRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const palette = ["#000000","#E95420","#4fc3f7","#7bc67e","#ffcb6b","#c678dd","#ffffff","#ff5252","#448aff","#69f0ae"];

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    saveHistory();
  }, []);

  function saveHistory() {
    const c = canvasRef.current;
    if (!c) return;
    setHistory((h) => [...h.slice(-19), c.toDataURL()]);
    setRedoStack([]);
  }

  function restore(dataUrl) {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const img = new Image();
    img.onload = () => { ctx.clearRect(0,0,c.width,c.height); ctx.drawImage(img,0,0); };
    img.src = dataUrl;
  }

  function undo() {
    if (history.length <= 1) return;
    const cur = history[history.length - 1];
    const prev = history[history.length - 2];
    setRedoStack((r) => [...r, cur]);
    setHistory((h) => h.slice(0, -1));
    restore(prev);
  }
  function redo() {
    if (!redoStack.length) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((h) => [...h, next]);
    setRedoStack((r) => r.slice(0, -1));
    restore(next);
  }

  function pos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const sx = canvasRef.current.width / rect.width;
    const sy = canvasRef.current.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy };
  }

  function hexToRgba(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return [r,g,b,255];
  }

  function floodFill(startX, startY, fillHex) {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const w = c.width, h = c.height;
    const img = ctx.getImageData(0,0,w,h);
    const data = img.data;
    const stack = [[Math.floor(startX), Math.floor(startY)]];
    const target = hexToRgba(fillHex);
    const startIdx = (Math.floor(startY)*w + Math.floor(startX))*4;
    const sr = data[startIdx], sg = data[startIdx+1], sb = data[startIdx+2], sa = data[startIdx+3];
    if (sr===target[0] && sg===target[1] && sb===target[2]) return;
    const visited = new Uint8Array(w*h);
    function match(i){ return data[i]===sr && data[i+1]===sg && data[i+2]===sb && data[i+3]===sa; }
    while(stack.length){
      const [x,y]=stack.pop();
      if (x<0||x>=w||y<0||y>=h) continue;
      const idx=(y*w+x); if (visited[idx]) continue; visited[idx]=1;
      const i=idx*4; if (!match(i)) continue;
      data[i]=target[0]; data[i+1]=target[1]; data[i+2]=target[2]; data[i+3]=255;
      stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
    }
    ctx.putImageData(img,0,0);
  }

  function onDown(e) {
    downRef.current = true;
    const { x, y } = pos(e);
    startRef.current = { x, y };
    const c = canvasRef.current;
    snapshotRef.current = c.toDataURL();
    const ctx = c.getContext("2d");
    if (tool === "pen" || tool === "brush" || tool === "eraser") {
      ctx.beginPath(); ctx.moveTo(x,y);
      ctx.fillStyle = tool === "eraser" ? "#ffffff" : color;
      const r = tool === "brush" ? size*1.8 : tool === "eraser" ? size*2 : size/2;
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x,y);
    } else if (tool === "fill") {
      floodFill(x,y,color);
      saveHistory();
      downRef.current = false;
    } else if (tool === "text") {
      const t = prompt("Text to place:", "Hello");
      if (t) { ctx.fillStyle = color; ctx.font = `${14+size}px Inter, sans-serif`; ctx.fillText(t, x, y); saveHistory(); }
      downRef.current = false;
    }
  }

  function onMove(e) {
    if (!downRef.current) return;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const { x, y } = pos(e);
    if (tool === "pen" || tool === "brush" || tool === "eraser") {
      ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
      ctx.lineWidth = tool === "brush" ? size*2.2 : tool === "eraser" ? size*4 : size;
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.lineTo(x,y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x,y);
    } else if (["line","rect","circle"].includes(tool)) {
      // preview shape
      const img = new Image(); img.src = snapshotRef.current;
      img.onload = null;
      // restore snapshot synchronously via image data already saved as dataUrl — use cached image
      // simpler: restore via put from snapshotRef using Image async not ideal — use history snapshot as Image
      // fallback: clear and redraw snapshot via Image
      const snap = new Image(); snap.src = snapshotRef.current;
      // synchronous fallback: draw snapshot if already loaded (dataUrl always loads instantly)
      ctx.clearRect(0,0,c.width,c.height);
      ctx.drawImage(snap,0,0);
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = size;
      const sx = startRef.current.x, sy = startRef.current.y;
      if (tool === "line") { ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(x,y); ctx.stroke(); }
      else if (tool === "rect") {
        if (fillMode) ctx.fillRect(Math.min(sx,x), Math.min(sy,y), Math.abs(x-sx), Math.abs(y-sy));
        else ctx.strokeRect(Math.min(sx,x), Math.min(sy,y), Math.abs(x-sx), Math.abs(y-sy));
      } else if (tool === "circle") {
        const rx = Math.abs(x-sx)/2, ry = Math.abs(y-sy)/2; const cx = (sx+x)/2, cy=(sy+y)/2;
        ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); fillMode ? ctx.fill() : ctx.stroke();
      }
    }
  }

  function onUp(e) {
    if (!downRef.current) return;
    downRef.current = false;
    const ctx = canvasRef.current.getContext("2d");
    ctx.closePath();
    // commit shape final (for line/rect/circle we already drew preview — ensure final draw)
    if (["line","rect","circle"].includes(tool)) {
      const { x, y } = pos(e);
      const c = canvasRef.current;
      // restore snapshot then draw final to avoid double-draw glitch
      const snap = new Image(); snap.src = snapshotRef.current;
      // draw final directly
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = size;
      const sx = startRef.current.x, sy = startRef.current.y;
      // snapshot already contains prior state, preview already drew — just keep it
    }
    saveHistory();
  }

  function clear() {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,c.width,c.height);
    saveHistory();
  }
  function save() {
    const a = document.createElement("a");
    a.download = `mintex-paint-${Date.now()}.png`;
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  }
  function pick(e) {
    const { x, y } = pos(e);
    const d = canvasRef.current.getContext("2d").getImageData(Math.floor(x),Math.floor(y),1,1).data;
    const hex = `#${[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,"0")).join("")}`;
    setColor(hex);
    setTool("pen");
  }

  return (
    <div className="os-paint" onKeyDown={(e)=>{ if(e.ctrlKey&&e.key==='z') undo(); if(e.ctrlKey&&e.key==='y') redo(); }} tabIndex={0}>
      <div className="os-paint-tools">
        <div className="os-paint-group">
          {[
            ["pen","Pen"],["brush","Brush"],["eraser","Eraser"],["fill","Fill"],["line","Line"],["rect","Rect"],["circle","Circle"],["text","Text"],["pick","Pick"]
          ].map(([id,label])=>(
            <button key={id} className={tool===id?"active":""} onClick={()=>setTool(id)} title={label}>{label}</button>
          ))}
        </div>
        <div className="os-paint-group">
          {palette.map(c=>(
            <button key={c} onClick={()=>{setColor(c); setTool("pen");}} style={{ background:c, width:22, height:22, borderRadius:4, border: c===color?"2px solid #E95420":"1px solid #444" }} aria-label={c} />
          ))}
          <input type="color" value={color} onChange={(e)=>{setColor(e.target.value); setTool("pen");}} aria-label="Color" style={{ width:32, height:26, border:0, background:"transparent" }} />
        </div>
        <div className="os-paint-group">
          <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#aaa" }}>Size <input type="range" min={1} max={32} value={size} onChange={(e)=>setSize(Number(e.target.value))} /></label>
          <label style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#aaa" }}><input type="checkbox" checked={fillMode} onChange={(e)=>setFillMode(e.target.checked)} /> Fill</label>
          <button onClick={undo} title="Undo (Ctrl+Z)">↩</button>
          <button onClick={redo} title="Redo (Ctrl+Y)">↪</button>
          <button onClick={clear}>Clear</button>
          <button onClick={save} style={{ background:"#E95420", color:"#fff", borderColor:"#E95420" }}>Save PNG</button>
        </div>
      </div>
      <div style={{ flex:1, display:"grid", placeItems:"center", background:"#0f0f0f", padding:8, overflow:"auto" }}>
        <canvas
          ref={canvasRef}
          width={900}
          height={520}
          className="os-paint-canvas"
          style={{ background:"#fff", border:"1px solid #333", borderRadius:6, maxWidth:"100%", cursor: tool==="pick"?"copy": tool==="fill"?"cell":"crosshair", touchAction:"none" }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={()=>{ downRef.current=false; }}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
          onClick={(e)=>{ if(tool==="pick") pick(e); }}
        />
      </div>
      <div style={{ padding:"4px 8px", fontSize:10, color:"#666", background:"#1a1a1a", borderTop:"1px solid #222" }}>
        Pen/Brush/Eraser drag • Fill click • Text click • Line/Rect/Circle drag • Pick click • {fillMode ? "Fill ON" : "Stroke"} • {color} • {size}px
      </div>
    </div>
  );
}
