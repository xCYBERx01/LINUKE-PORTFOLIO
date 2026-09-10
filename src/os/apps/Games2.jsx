import { useEffect, useRef, useState } from "react";

/* ============================================================
   FLAPPY BIRD
============================================================ */
export function FlappyBird() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const stateRef = useRef({ y: 300, vy: 0, pipes: [], score: 0, over: false, started: false, frame: 0 });

  function reset() {
    stateRef.current = { y: 300, vy: 0, pipes: [], score: 0, over: false, started: false, frame: 0 };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    function startLoop() {
      cancelAnimationFrame(rafRef.current);
      const s = stateRef.current;
      const loop = (t) => {
        const dt = Math.min((t - (lastRef.current || t)) / 16.6, 2.5);
        lastRef.current = t;
        s.frame++;
        const sp = 3;
        s.vy += 0.45 * dt;
        s.y += s.vy * dt;
        if (s.started) {
          if (s.frame % 95 === 0) {
            const gap = 150 + Math.random() * 40;
            const topH = 40 + Math.random() * (H - gap - 120);
            s.pipes.push({ x: W + 30, top: topH, gap, passed: false });
          }
          s.pipes.forEach((p) => { p.x -= sp * dt; });
          s.pipes = s.pipes.filter((p) => p.x > -60);
          s.pipes.forEach((p) => {
            const hitP =
              p.x < 70 && p.x + 55 > 30 &&
              (s.y < p.top || s.y + 26 > p.top + p.gap);
            if (hitP) { s.over = true; return; }
            if (!p.passed && p.x + 55 < 30) { p.passed = true; s.score++; }
          });
        }
        if (s.y < 0) { s.y = 0; s.vy = 0; }
        const hitGround = s.y + 26 > H - 40;
        if (hitGround) {
          s.y = H - 40 - 26;
          if (s.started) s.over = true;
        }

        // draw
        ctx.fillStyle = "#0f1a2b";
        ctx.fillRect(0, 0, W, H);
        // parallax stars
        for (let i = 0; i < 40; i++) {
          const sx = (i * 73 + s.frame) % W;
          const sy = (i * 41) % (H - 120);
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.fillRect(sx, sy, 2, 2);
        }
        // pipes
        s.pipes.forEach((p) => {
          ctx.fillStyle = "#2f6f6a";
          ctx.fillRect(p.x, 0, 50, p.top);
          ctx.fillRect(p.x, p.top + p.gap, 50, H - p.top - p.gap - 40);
          ctx.fillStyle = "#47a899";
          ctx.fillRect(p.x - 4, p.top - 18, 58, 18);
          ctx.fillRect(p.x - 4, p.top + p.gap, 58, 18);
        });
        // ground
        ctx.fillStyle = "#23402f";
        ctx.fillRect(0, H - 40, W, 40);
        ctx.fillStyle = "#345c42";
        for (let i = 0; i < 60; i++) ctx.fillRect(((i * 20) + s.frame) % W, H - 40, 10, 40);
        // bird
        ctx.save();
        ctx.translate(50, s.y + 13);
        ctx.rotate(Math.min(Math.max(s.vy * 0.08, -0.4), 0.9));
        ctx.fillStyle = "#f6c453";
        ctx.beginPath();
        ctx.arc(0, 0, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e0a63b";
        ctx.beginPath();
        ctx.arc(0, 2, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(6, -3, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e86a3c";
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(22, 3);
        ctx.lineTo(10, 7);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // score / overlays
        ctx.fillStyle = "#fff";
        ctx.font = "bold 22px monospace";
        ctx.textAlign = "center";
        if (!s.started && !s.over) {
          ctx.fillText("Click / Space to flap", W / 2, H / 2 - 40);
        }
        ctx.fillText(String(s.score), W / 2, 40);
        if (s.over) {
          ctx.fillStyle = "rgba(0,0,0,0.55)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 24px monospace";
          ctx.fillText("Game Over — Score " + s.score, W / 2, H / 2 - 10);
          ctx.font = "15px monospace";
          ctx.fillText("Click / Space to restart", W / 2, H / 2 + 24);
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }
    startLoop();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        const s = stateRef.current;
        if (s.over) { reset(); }
        s.vy = -7;
        s.started = true;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="os-game os-flappy" onClick={() => { const s = stateRef.current; if (s.over) reset(); s.vy = -7; s.started = true; }}>
      <canvas ref={canvasRef} width={600} height={420} />
      <p className="os-game-hint">Click or press Space to flap · avoid pipes</p>
    </div>
  );
}

/* ============================================================
   PAC-MAN
============================================================ */
const PAC_MAZE = [
  "####################",
  "#........##........#",
  "#.####.#.##.#.####.#",
  "#o....#.#..#.#....o#",
  "#.####.#.##.#.####.#",
  "#..................#",
  "#.####.##..##.####.#",
  "#.#..##.o..o.##..#.#",
  "#.#..##.##.##.##..#.#",
  "#......######......#",
  "#.#..##.o..o.##..#.#",
  "#.#..##.##.##.##..#.#",
  "#.####.##..##.####.#",
  "#..................#",
  "####################",
];

function buildPacWalls() {
  const walls = [];
  const dots = [];
  const power = [];
  for (let r = 0; r < PAC_MAZE.length; r++) {
    for (let c = 0; c < PAC_MAZE[r].length; c++) {
      const ch = PAC_MAZE[r][c];
      if (ch === "#") walls.push({ r, c });
      else if (ch === "o") power.push({ r, c });
      else if (ch === ".") dots.push({ r, c });
    }
  }
  return { walls, dots, power };
}

export function Pacman() {
  const [, setTick] = useState(0);
  const gameRef = useRef(null);

  function init() {
    const { walls, dots, power } = buildPacWalls();
    return {
      walls,
      dots,
      power,
      pac: { r: 7, c: 1, dir: "r", mouth: 0 },
      ghosts: [
        { r: 7, c: 9, dir: "l", color: "#ff4b4b" },
        { r: 5, c: 9, dir: "r", color: "#ffb3d1" },
        { r: 9, c: 9, dir: "r", color: "#6bd6ff" },
        { r: 7, c: 11, dir: "l", color: "#ff9d4b" },
      ],
      score: 0,
      lives: 3,
      over: false,
      won: false,
      frame: 0,
      powerTimer: 0,
    };
  }

  useEffect(() => {
    gameRef.current = init();
    const int = setInterval(() => {
      const g = gameRef.current;
      if (g.over || g.won) { setTick((t) => t + 1); return; }
      stepGhosts(g);
      setTick((t) => t + 1);
    }, 320);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    function onKey(e) {
      const dirs = { ArrowUp: "u", ArrowDown: "d", ArrowLeft: "l", ArrowRight: "r", w: "u", s: "d", a: "l", d: "r" };
      const d = dirs[e.key];
      if (!d) return;
      e.preventDefault();
      const g = gameRef.current;
      if (!g || g.over || g.won) return;
      g.pac.dir = d;
      movePac(g, d);
      setTick((t) => t + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function isWall(g, r, c) {
    return g.walls.some((w) => w.r === r && w.c === c);
  }

  function movePac(g, dir) {
    let nr = g.pac.r, nc = g.pac.c;
    if (dir === "u") nr--;
    else if (dir === "d") nr++;
    else if (dir === "l") nc--;
    else if (dir === "r") nc++;
    if (dir === "l" && nc < 0) nc = g.walls[0].c - 1;
    if (!isWall(g, nr, nc)) {
      g.pac.r = nr;
      g.pac.c = nc;
    }
    const di = g.dots.findIndex((d) => d.r === g.pac.r && d.c === g.pac.c);
    if (di >= 0) { g.dots.splice(di, 1); g.score += 10; }
    const pi = g.power.findIndex((d) => d.r === g.pac.r && d.c === g.pac.c);
    if (pi >= 0) { g.power.splice(pi, 1); g.score += 50; g.powerTimer = 60; }
    if (g.dots.length === 0 && g.power.length === 0) { g.won = true; }
  }

  function stepGhosts(g) {
    g.frame++;
    if (g.frame % 2 !== 0) return;
    g.powerTimer = Math.max(0, (g.powerTimer || 0) - 1);
    const frightened = g.powerTimer > 0;
    g.ghosts.forEach((gh) => {
      if (frightened) {
        const dr = g.pac.r - gh.r;
        const dc = g.pac.c - gh.c;
        let opts = [];
        if (!isWall(g, gh.r + 1, gh.c)) opts.push([gh.r + 1, gh.c, "d"]);
        if (!isWall(g, gh.r - 1, gh.c)) opts.push([gh.r - 1, gh.c, "u"]);
        if (!isWall(g, gh.r, gh.c + 1)) opts.push([gh.r, gh.c + 1, "r"]);
        if (!isWall(g, gh.r, gh.c - 1)) opts.push([gh.r, gh.c - 1, "l"]);
        if (opts.length) {
          const away = opts.sort((a, b) => ((b[0] - dr) ** 2 + (b[1] - dc) ** 2) - ((a[0] - dr) ** 2 + (a[1] - dc) ** 2))[0];
          gh.r = away[0]; gh.c = away[1]; gh.dir = away[2];
        }
      } else {
        const dr = g.pac.r - gh.r;
        const dc = g.pac.c - gh.c;
        const dd = Math.abs(dr) > Math.abs(dc) ? (dr > 0 ? "d" : "u") : (dc > 0 ? "r" : "l");
        const preferred = [dd, gh.dir, opp(gh.dir)];
        let moved = false;
        for (const d of preferred) {
          let nr = gh.r, nc = gh.c;
          if (d === "u") nr--;
          else if (d === "d") nr++;
          else if (d === "l") nc--;
          else if (d === "r") nc++;
          if (nc < 0) nc = g.walls[0].c - 1;
          if (!isWall(g, nr, nc)) { gh.r = nr; gh.c = nc; gh.dir = d; moved = true; break; }
        }
        if (!moved) {
          for (const d of ["u", "d", "l", "r"]) {
            let nr = gh.r, nc = gh.c;
            if (d === "u") nr--;
            else if (d === "d") nr++;
            else if (d === "l") nc--;
            else if (d === "r") nc++;
            if (nc < 0) nc = g.walls[0].c - 1;
            if (!isWall(g, nr, nc)) { gh.r = nr; gh.c = nc; gh.dir = d; break; }
          }
        }
      }
    });
    g.ghosts.forEach((gh) => {
      if (gh.r === g.pac.r && gh.c === g.pac.c) {
        if (frightened) {
          gh.r = 7; gh.c = 9; gh.dir = "l";
          g.score += 200;
        } else {
          g.lives--;
          if (g.lives <= 0) { g.over = true; }
          else { g.pac.r = 7; g.pac.c = 1; g.pac.dir = "r"; }
        }
      }
    });
  }

  function opp(d) {
    return d === "u" ? "d" : d === "d" ? "u" : d === "l" ? "r" : "l";
  }

  function restart() {
    gameRef.current = init();
    setTick(0);
  }

  const g = gameRef.current;

  return (
    <div className="os-game os-pacman">
      {g && (
        <>
          <div className="os-pac-head">
            <span>Score {String(g.score).padStart(4, "0")}</span>
            <span>Lives {"♥".repeat(g.lives)}</span>
          </div>
          <div className="os-pac-board">
            {PAC_MAZE.map((row, r) => (
              <div className="os-pac-row" key={r}>
                {row.split("").map((ch, c) => {
                  const isWall = ch === "#";
                  const isDot = ch === ".";
                  const isPower = ch === "o";
                  const hasPac = g.pac.r === r && g.pac.c === c;
                  const ghost = g.ghosts.find((gh) => gh.r === r && gh.c === c);
                  return (
                    <div className={`os-pac-cell ${isWall ? "wall" : isDot ? "dot" : isPower ? "power" : ""}`} key={c}>
                      {hasPac && <div className="os-pac-pac"><span className={g.pac.dir} /></div>}
                      {ghost && !hasPac && <div className="os-pac-ghost" style={{ background: g.powerTimer > 0 ? "#5b6bd6" : ghost.color }} />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {g.over && (
            <div className="os-game-overlay">
              <h2>GAME OVER</h2>
              <p>Score {g.score}</p>
              <button onClick={restart}>Restart</button>
            </div>
          )}
          {g.won && (
            <div className="os-game-overlay">
              <h2>YOU WIN!</h2>
              <p>Score {g.score}</p>
              <button onClick={restart}>Play Again</button>
            </div>
          )}
          {!g.over && !g.won && <p className="os-game-hint">Arrow / WASD to move · grab all dots · avoid ghosts</p>}
        </>
      )}
    </div>
  );
}

/* ============================================================
   CROSSY ROAD
============================================================ */
const CROSS_LANES = [
  { dir: 1, speed: 1.4, type: "car" },
  { dir: -1, speed: 2.0, type: "truck" },
  { dir: 1, speed: 1.0, type: "car" },
  { dir: -1, speed: 2.6, type: "car" },
  { dir: 1, speed: 1.8, type: "log" },
  { dir: -1, speed: 1.2, type: "log" },
  { dir: 1, speed: 2.2, type: "log" },
];

export function CrossyRoad() {
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const [ui, setUi] = useState({ score: 0, over: false, won: false });

  const BOARD_ROWS = 15;
  const START_Y = 14;
  const GOAL_Y = 0;
  const laneOf = (y) => y - 4;
  const inLane = (y) => {
    const l = laneOf(y);
    return l >= 0 && l < CROSS_LANES.length;
  };

  function init() {
    return {
      p: { x: 5, y: START_Y },
      cars: CROSS_LANES.map((lane, li) => ({
        lane: li,
        x: lane.dir === 1 ? -6 : 15,
        len: lane.type === "truck" ? 1.6 : 1.1,
      })),
      dist: 0,
      over: false,
      won: false,
      frame: 0,
    };
  }

  useEffect(() => {
    stateRef.current = init();
    const g = stateRef.current;
    const loop = () => {
      const d = (Date.now() - (lastRef.current || Date.now())) / 16.6;
      lastRef.current = Date.now();
      g.frame++;
      CROSS_LANES.forEach((lane, li) => {
        const c = g.cars.find((c) => c.lane === li);
        if (!c) return;
        c.x += lane.dir * lane.speed * d;
        if (lane.dir === 1 && c.x > 16) c.x = -6;
        if (lane.dir === -1 && c.x < -6) c.x = 16;
      });
      if (collide(g)) g.over = true;
      const cur = { score: g.dist, over: g.over, won: g.won };
      setUi((u) => (u.score !== cur.score || u.over !== cur.over || u.won !== cur.won ? cur : u));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function collide(g) {
    if (!inLane(g.p.y)) return false;
    const car = g.cars.find((c) => c.lane === laneOf(g.p.y));
    if (!car) return false;
    return car.x - car.len / 2 < g.p.x + 0.35 && car.x + car.len / 2 > g.p.x - 0.35;
  }

  function move(dx, dy) {
    const g = stateRef.current;
    if (!g || g.over || g.won) return;
    const nx = g.p.x + dx;
    const ny = g.p.y + dy;
    if (ny < GOAL_Y) return;
    if (ny > BOARD_ROWS - 1) return;
    if (nx < 0 || nx > 9) return;
    g.p.x = nx;
    g.p.y = ny;
    if (ny === GOAL_Y) g.won = true;
    g.dist = Math.max(g.dist, START_Y - ny);
    if (collide(g)) g.over = true;
  }

  function restart() {
    stateRef.current = init();
    setUi({ score: 0, over: false, won: false });
  }

  useEffect(() => {
    function onKey(e) {
      const map = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
      const m = map[e.key];
      if (!m) return;
      e.preventDefault();
      move(m[0], m[1]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const g = stateRef.current;
  const isLogRow = (y) => inLane(y) && CROSS_LANES[laneOf(y)].type === "log";
  const isGoalRow = (y) => y === GOAL_Y;
  const carAt = (x, y) => {
    if (!inLane(y)) return null;
    const car = g && g.cars.find((c) => c.lane === laneOf(y));
    if (!car) return null;
    const cx = Math.round(car.x);
    if (x >= cx - 1 && x <= cx + 1) return CROSS_LANES[laneOf(y)].type;
    return null;
  };

  if (!g) return null;

  return (
    <div className="os-game os-crossy" onClick={() => move(0, -1)}>
      <div className="os-crossy-head">
        <span>Score {ui.score}</span>
        {ui.won ? <span>Goal!</span> : ui.over ? <span>Oops!</span> : <span>Reach the top</span>}
      </div>
      <div className="os-crossy-board">
        {Array.from({ length: BOARD_ROWS }, (_, y) => {
          const isLog = isLogRow(y);
          const isGoal = isGoalRow(y);
          return (
            <div className={`os-crossy-row ${isLog ? "log" : isGoal ? "goal" : "road"}`} key={y}>
              {Array.from({ length: 10 }, (_, x) => {
                const isPlayer = g.p.y === y && g.p.x === x;
                const kind = carAt(x, y);
                return (
                  <div className={`os-crossy-cell ${isLog ? "log" : kind ? "car" : isGoal ? "goal" : ""}`} key={x}>
                    {isPlayer && <div className="os-crossy-player" />}
                    {kind === "car" && <div className="os-crossy-car" />}
                    {kind === "truck" && <div className="os-crossy-truck" />}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {ui.over && (
        <div className="os-game-overlay">
          <h2>SPLAT!</h2>
          <p>You got hit. Score {ui.score}</p>
          <button onClick={restart}>Restart</button>
        </div>
      )}
      {ui.won && (
        <div className="os-game-overlay">
          <h2>YOU CROSSED!</h2>
          <p>Score {ui.score}</p>
          <button onClick={restart}>Play Again</button>
        </div>
      )}
      <p className="os-game-hint">Arrow / WASD to hop · click to hop forward · dodge cars</p>
    </div>
  );
}
