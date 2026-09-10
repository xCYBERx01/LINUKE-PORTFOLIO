import { useEffect, useRef, useState } from "react";
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, AlertCircle } from "lucide-react";

const PLAYLIST = [
  { artist: "Periphery", title: "Demo Track", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { artist: "SoundHelix", title: "Song 1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { artist: "SoundHelix", title: "Song 3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { artist: "SoundHelix", title: "Song 8", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
];

export function MediaPlayerWindow() {
  const mountRef = useRef(null);
  const webampRef = useRef(null);
  const audioRef = useRef(null);
  const [webampReady, setWebampReady] = useState(false);
  const [webampFailed, setWebampFailed] = useState(false);
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Try Webamp, fallback to native
  useEffect(() => {
    let disposed = false;
    async function init() {
      try {
        const { default: Webamp } = await import("webamp");
        if (disposed) return;
        const webamp = new Webamp({
          initialTracks: PLAYLIST.map((p) => ({ metaData: { artist: p.artist, title: p.title }, url: p.url })),
        });
        webampRef.current = webamp;
        await webamp.renderWhenReady(mountRef.current);
        if (!disposed) setWebampReady(true);
      } catch (e) {
        console.error("WebAmp failed", e);
        setWebampFailed(true);
      }
    }
    init();
    return () => { disposed = true; try { webampRef.current?.dispose(); } catch {} };
  }, []);

  // native fallback controls
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrentTime(a.currentTime);
    const onDur = () => setDuration(a.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onDur);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => { a.removeEventListener("timeupdate", onTime); a.removeEventListener("loadedmetadata", onDur); a.removeEventListener("play", onPlay); a.removeEventListener("pause", onPause); };
  }, [webampFailed, webampReady]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play(); else a.pause();
  }
  function skip(dir) {
    const n = (track + dir + PLAYLIST.length) % PLAYLIST.length;
    setTrack(n);
    setTimeout(() => audioRef.current?.play(), 100);
  }

  // if Webamp ready, show it + playlist note; if failed, show native player (always show native as secondary)
  return (
    <div className="os-media" style={{ display: "flex", flexDirection: "column", gap: 0, background: "#1e1e1e", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 8, padding: "8px 10px", background: "#2d2d2d", borderBottom: "1px solid #333", alignItems: "center" }}>
        <Music size={16} color="#E95420" />
        <span style={{ fontSize: 12, color: "#aaa" }}>{webampReady ? "Winamp (Webamp) — classic skin" : webampFailed ? "Native player — Webamp offline, using HTML5" : "Loading Webamp…"}</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#666" }}>{PLAYLIST.length} tracks</span>
      </div>

      {/* Webamp mount — keep visible when ready */}
      <div ref={mountRef} className="os-media-mount" style={{ display: webampReady ? "block" : "none" }} />

      {/* Native fallback / companion playlist */}
      <div style={{ display: webampReady ? "none" : "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {webampFailed && (
          <div style={{ display: "flex", gap: 8, padding: "8px 10px", background: "#2a1a0a", color: "#ffcc80", fontSize: 11, borderBottom: "1px solid #333" }}>
            <AlertCircle size={14} /> Webamp engine failed to load (likely offline). Using fallback player — all tracks stream via HTML5.
          </div>
        )}
        <div style={{ display: "flex", gap: 0, flex: 1, minHeight: 0 }}>
          <div style={{ width: 200, borderRight: "1px solid #333", overflowY: "auto", background: "#1a1a1a" }}>
            {PLAYLIST.map((p, i) => (
              <button key={i} onClick={() => { setTrack(i); setTimeout(() => audioRef.current?.play(), 50); }} style={{ width: "100%", textAlign: "left", padding: "10px 12px", background: i === track ? "#E95420" : "transparent", color: i === track ? "#fff" : "#aaa", border: 0, borderBottom: "1px solid #222", cursor: "pointer" }}>
                <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{p.artist}</div>
              </button>
            ))}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16, gap: 12 }}>
            <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{PLAYLIST[track].title} — {PLAYLIST[track].artist}</div>
            <audio ref={audioRef} src={PLAYLIST[track].url} preload="metadata" style={{ width: "100%", maxWidth: 360 }} controls={false} />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => skip(-1)} style={{ width: 36, height: 36, display: "grid", placeItems: "center", background: "#2d2d2d", border: "1px solid #444", borderRadius: 8, color: "#ddd", cursor: "pointer" }}><SkipBack size={16} /></button>
              <button onClick={togglePlay} style={{ width: 44, height: 44, display: "grid", placeItems: "center", background: "#E95420", border: 0, borderRadius: 50, color: "#fff", cursor: "pointer" }}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
              <button onClick={() => skip(1)} style={{ width: 36, height: 36, display: "grid", placeItems: "center", background: "#2d2d2d", border: "1px solid #444", borderRadius: 8, color: "#ddd", cursor: "pointer" }}><SkipForward size={16} /></button>
            </div>
            <div style={{ width: "100%", maxWidth: 360, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "#888", fontVariantNumeric: "tabular-nums" }}>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")}</span>
              <input type="range" min={0} max={duration || 100} value={currentTime} onChange={(e) => { const v = Number(e.target.value); if (audioRef.current) { audioRef.current.currentTime = v; setCurrentTime(v); } }} style={{ flex: 1, accentColor: "#E95420" }} />
              <span style={{ fontSize: 11, color: "#888", fontVariantNumeric: "tabular-nums" }}>{Math.floor((duration || 0) / 60)}:{String(Math.floor((duration || 0) % 60)).padStart(2, "0")}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#888", fontSize: 12 }}>
              <Volume2 size={14} /><input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(Number(e.target.value))} style={{ width: 100, accentColor: "#E95420" }} />
            </div>
          </div>
        </div>
      </div>

      {/* When Webamp is ready, still show tiny native controls as companion */}
      {webampReady && (
        <div style={{ padding: "6px 10px", background: "#1a1a1a", borderTop: "1px solid #333", fontSize: 11, color: "#666", display: "flex", justifyContent: "space-between" }}>
          <span>Also available as native playlist — close Webamp to switch</span>
          <span>{PLAYLIST[track].title}</span>
        </div>
      )}
    </div>
  );
}
