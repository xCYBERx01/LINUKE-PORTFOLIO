import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Search, X, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const ICONS_PER_PAGE = 20;
const EDGE_ZONE = 80;
const EDGE_DELAY = 650;
const STORAGE_KEY = "mintex_appicons_order";

const bannedApps = ["recycle", "trash"];

function getId(icon) { return icon.appId || icon.name || icon.id; }

function loadOrder(defaultIcons) {
  const filtered = defaultIcons.filter(
    (app) => { const id = getId(app); return id && id[0] !== "0" && !bannedApps.includes(id.toLowerCase()); }
  );

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return filtered;

    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) return filtered;

    const savedSet = new Set(saved);
    const merged = saved
      .map((id) => filtered.find((i) => getId(i) === id))
      .filter(Boolean);
    const newIcons = filtered.filter((i) => !savedSet.has(getId(i)));
    return [...merged, ...newIcons];
  } catch {
    return filtered;
  }
}

function saveOrder(icons) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(icons.map((i) => getId(i))));
  } catch {}
}

function SortableIcon({ icon, onOpen }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: getId(icon) });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        visibility: isDragging ? "hidden" : "visible",
      }}
      className="os-appicon-icon"
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onOpen(icon)}
    >
      <div className="os-appicon-img-wrap">
        <icon.icon size={32} />
      </div>
      <p>{icon.label}</p>
    </div>
  );
}

function DragGhost({ icon }) {
  return (
    <div className="os-appicon-icon is-ghost">
      <div className="os-appicon-img-wrap">
        <icon.icon size={32} />
      </div>
      <p>{icon.label}</p>
    </div>
  );
}

export function AppDrawer({ open, onClose, onOpen, apps }) {
  const [items, setItems] = useState(() => loadOrder(apps));
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const axisLocked = useRef(null);
  const edgeTimer = useRef(null);
  const edgeDir = useRef(null);

  useEffect(() => {
    setItems((prev) => {
      const filtered = apps.filter(
        (app) => { const id = getId(app); return id && id[0] !== "0" && !bannedApps.includes(id.toLowerCase()); }
      );
      const prevIds = new Set(prev.map((i) => getId(i)));
      const newIds = new Set(filtered.map((i) => getId(i)));
      const hasChanges =
        filtered.length !== prev.length ||
        filtered.some((i) => !prevIds.has(getId(i))) ||
        prev.some((i) => !newIds.has(getId(i)));
      if (!hasChanges) return prev;
      const merged = prev.filter((i) => newIds.has(getId(i)));
      const newIcons = filtered.filter((i) => !prevIds.has(getId(i)));
      return [...merged, ...newIcons];
    });
  }, [apps]);

  useEffect(() => {
    saveOrder(items);
  }, [items]);

  const isSearching = search.trim().length > 0;
  const visible = isSearching
    ? items.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()))
    : items;
  const totalPages = Math.max(1, Math.ceil(visible.length / ICONS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);

  useEffect(() => {
    if (currentPage >= totalPages) setCurrentPage(Math.max(0, totalPages - 1));
  }, [totalPages, currentPage]);
  const activeIcon = activeId ? items.find((i) => getId(i) === activeId) ?? null : null;
  const pageItems = visible.slice(
    safeCurrentPage * ICONS_PER_PAGE,
    (safeCurrentPage + 1) * ICONS_PER_PAGE
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const clearEdge = useCallback(() => {
    clearTimeout(edgeTimer.current);
    edgeTimer.current = null;
    edgeDir.current = null;
  }, []);

  const handleDragMove = useCallback(
    ({ activatorEvent, delta }) => {
      const clientX =
        activatorEvent?.clientX != null ? activatorEvent.clientX + (delta?.x ?? 0) : null;
      if (clientX === null) return;

      const W = window.innerWidth;
      let dir = null;
      if (clientX < EDGE_ZONE) dir = "left";
      else if (clientX > W - EDGE_ZONE) dir = "right";

      if (dir !== edgeDir.current) {
        clearEdge();
        if (dir) {
          edgeDir.current = dir;
          edgeTimer.current = setTimeout(() => {
            setCurrentPage((p) => {
              if (dir === "right" && p < totalPages - 1) return p + 1;
              if (dir === "left" && p > 0) return p - 1;
              return p;
            });
            clearEdge();
          }, EDGE_DELAY);
        }
      }
    },
    [totalPages, clearEdge]
  );

  const handleDragStart = ({ active }) => setActiveId(active.id);
  const handleDragCancel = useCallback(() => {
    clearEdge();
    setActiveId(null);
  }, [clearEdge]);

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      clearEdge();
      setActiveId(null);
      if (!over || active.id === over.id) return;

      setItems((prev) => {
        const oldIdx = prev.findIndex((i) => getId(i) === active.id);
        const newIdx = prev.findIndex((i) => getId(i) === over.id);
        if (oldIdx === -1 || newIdx === -1) return prev;
        const next = arrayMove(prev, oldIdx, newIdx);
        saveOrder(next);
        return next;
      });
    },
    [clearEdge]
  );

  const onTouchStart = (e) => {
    if (activeId) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    axisLocked.current = null;
  };

  const onTouchMove = (e) => {
    if (activeId || touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!axisLocked.current) {
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5)
        axisLocked.current = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
    }
    if (axisLocked.current !== "h") return;
    e.stopPropagation();
    setIsSwiping(true);
    const resist = 0.25;
    const capped =
      (dx < 0 && safeCurrentPage === totalPages - 1) || (dx > 0 && safeCurrentPage === 0)
        ? dx * resist
        : dx;
    setDragOffset(capped);
  };

  const onTouchEnd = () => {
    if (!isSwiping) return;
    const t = window.innerWidth * 0.2;
    if (dragOffset < -t && safeCurrentPage < totalPages - 1) setCurrentPage((p) => p + 1);
    else if (dragOffset > t && safeCurrentPage > 0) setCurrentPage((p) => p - 1);
    setDragOffset(0);
    setIsSwiping(false);
    touchStartX.current = null;
  };

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight") setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
      if (e.key === "ArrowLeft") setCurrentPage((p) => Math.max(p - 1, 0));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [totalPages, onClose]);

  if (!open) return null;

  return (
    <motion.div
      className="os-appdrawer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="os-appdrawer-backdrop" onClick={onClose} />

      <div className="os-appdrawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="os-appdrawer-toolbar">
          <div className="os-appdrawer-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search apps…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(0);
              }}
              autoFocus
            />
            {search && (
              <button className="os-appdrawer-search-clear" onClick={() => { setSearch(""); setCurrentPage(0); }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div
          className="os-appdrawer-body"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {!activeId && safeCurrentPage > 0 && (
            <button
              className="os-appdrawer-arrow os-appdrawer-arrow-left"
              onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => Math.max(p - 1, 0)); }}
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {!activeId && safeCurrentPage < totalPages - 1 && (
            <button
              className="os-appdrawer-arrow os-appdrawer-arrow-right"
              onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => Math.min(p + 1, totalPages - 1)); }}
            >
              <ChevronRight size={24} />
            </button>
          )}

          {activeId && safeCurrentPage > 0 && <div className="os-appdrawer-edge-hint os-appdrawer-edge-left" />}
          {activeId && safeCurrentPage < totalPages - 1 && <div className="os-appdrawer-edge-hint os-appdrawer-edge-right" />}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={visible.map((i) => getId(i))} strategy={rectSortingStrategy}>
              <div
                className="os-appdrawer-grid-wrap"
                style={{
                  transform: `translateX(${dragOffset}px)`,
                  transition: isSwiping ? "none" : "transform 0.28s ease",
                }}
              >
                <div className={`os-appdrawer-grid${isSearching ? " searching" : ""}`}>
                  {pageItems.length > 0 ? (
                    pageItems.map((icon) => (
                      <SortableIcon
                        key={getId(icon)}
                        icon={icon}
                        onOpen={() => {
                          onClose();
                          onOpen(icon.appId);
                        }}
                      />
                    ))
                  ) : (
                    <div className="os-appdrawer-empty">
                      <p>No apps found</p>
                      <small>Try a different search term</small>
                    </div>
                  )}
                </div>
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={{ side: 0 }}>
              {activeIcon ? <DragGhost icon={activeIcon} /> : null}
            </DragOverlay>
          </DndContext>
        </div>

        <div className="os-appdrawer-statusbar">
          <span className="os-appdrawer-status">
            {activeId ? `Moving: ${activeIcon?.label || activeId}` : `${visible.length} app${visible.length !== 1 ? "s" : ""}`}
          </span>
          {totalPages > 1 && (
            <div className="os-appdrawer-pages">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`os-appdrawer-page-dot${i === safeCurrentPage ? " active" : ""}`}
                  onClick={() => setCurrentPage(i)}
                  title={`Page ${i + 1}`}
                />
              ))}
            </div>
          )}
          <span className="os-appdrawer-range">
            {visible.length === 0
              ? "0"
              : `${safeCurrentPage * ICONS_PER_PAGE + 1}–${Math.min((safeCurrentPage + 1) * ICONS_PER_PAGE, visible.length)}`}
          </span>
        </div>
      </div>
    </motion.div>
  );
}