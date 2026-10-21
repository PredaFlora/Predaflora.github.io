import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import pb from "../lib/pocketbase";
import { useIsMobile } from "../lib/useIsMobile";
import type { HomeBlock } from "../lib/homeBlocks";

interface Ctx {
  blocks: HomeBlock[];
  forSlot: (slot: string) => HomeBlock[];
  add: (kind: "text" | "photo", slot: string, file?: File) => Promise<HomeBlock>;
  update: (id: string, data: Partial<HomeBlock> | FormData) => Promise<void>;
  remove: (id: string) => Promise<void>;
  move: (id: string, slot: string, beforeId: string | null) => Promise<void>;
}

const HomeBlocksContext = createContext<Ctx | null>(null);
const bySort = (a: HomeBlock, b: HomeBlock) => (a.sort_order || 0) - (b.sort_order || 0);
const opts = { requestKey: null } as const;

export function HomeBlocksProvider({ children }: { children: ReactNode }) {
  const [raw, setBlocks] = useState<HomeBlock[]>([]);
  const mobile = useIsMobile();

  useEffect(() => {
    pb.collection("home_blocks")
      .getFullList<HomeBlock>({ requestKey: null })
      .then(setBlocks)
      .catch(console.error);
  }, []);

  // Consumers see the size/position for the current screen (mobile or desktop)
  const blocks = useMemo(
    () => (mobile ? raw.map((b) => ({ ...b, scale: b.m_scale, offset_x: b.m_offset_x, offset_y: b.m_offset_y })) : raw),
    [raw, mobile],
  );
  const forSlot = useCallback((slot: string) => blocks.filter((b) => b.slot === slot).sort(bySort), [blocks]);
  const rawSlot = (slot: string) => raw.filter((b) => b.slot === slot).sort(bySort);
  const MAP = { scale: "m_scale", offset_x: "m_offset_x", offset_y: "m_offset_y" } as const;

  const add: Ctx["add"] = async (kind, slot, file) => {
    const last = rawSlot(slot).at(-1);
    const fd = new FormData();
    fd.set("kind", kind);
    fd.set("slot", slot);
    fd.set("sort_order", String((last?.sort_order || 0) + 10));
    fd.set("width", kind === "photo" ? "medium" : "large");
    fd.set("align", kind === "photo" ? "center" : "left");
    if (kind === "text") {
      fd.set("heading", "New heading");
      fd.set("body", "Write something here. Click the pencil to edit this text box.");
    }
    if (file) fd.set("image", file);
    const rec = await pb.collection("home_blocks").create<HomeBlock>(fd, opts);
    setBlocks((prev) => [...prev, rec]);
    return rec;
  };

  const update: Ctx["update"] = async (id, data) => {
    let body: Partial<HomeBlock> | FormData = data;
    if (mobile && !(data instanceof FormData)) {
      const m: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(data)) m[MAP[k as keyof typeof MAP] ?? k] = v;
      body = m as Partial<HomeBlock>;
    }
    const rec = await pb.collection("home_blocks").update<HomeBlock>(id, body, opts);
    setBlocks((prev) => prev.map((b) => (b.id === id ? rec : b)));
  };

  const remove: Ctx["remove"] = async (id) => {
    await pb.collection("home_blocks").delete(id, opts);
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const move: Ctx["move"] = async (id, slot, beforeId) => {
    const moving = raw.find((b) => b.id === id);
    if (!moving || beforeId === id) return;
    const target = rawSlot(slot).filter((b) => b.id !== id);
    const at = beforeId ? target.findIndex((b) => b.id === beforeId) : -1;
    target.splice(at < 0 ? target.length : at, 0, moving);
    const next = target.map((b, i) => ({ ...b, slot, sort_order: (i + 1) * 10 }));
    const changed = next.filter((n) => {
      const old = raw.find((b) => b.id === n.id);
      return !old || old.slot !== n.slot || old.sort_order !== n.sort_order;
    });
    setBlocks((prev) => prev.map((b) => next.find((n) => n.id === b.id) ?? b));
    await Promise.all(
      changed.map((n) => pb.collection("home_blocks").update(n.id, { slot: n.slot, sort_order: n.sort_order }, opts)),
    );
  };

  return (
    <HomeBlocksContext.Provider value={{ blocks, forSlot, add, update, remove, move }}>
      {children}
    </HomeBlocksContext.Provider>
  );
}

export function useHomeBlocks() {
  const ctx = useContext(HomeBlocksContext);
  if (!ctx) throw new Error("useHomeBlocks must be used inside HomeBlocksProvider");
  return ctx;
}
