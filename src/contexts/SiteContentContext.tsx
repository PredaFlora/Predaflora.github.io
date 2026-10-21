import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import pb from "../lib/pocketbase";
import { useIsMobile } from "../lib/useIsMobile";
import { CONTENT_DEFAULTS, type ContentKey, type ContentRecord } from "../lib/siteContent";

type ContentMap = Record<ContentKey, string>;
type IdsMap = Partial<Record<ContentKey, string>>;

export interface TextStyle { scale: number; offset_x: number; offset_y: number; hidden: boolean }
interface StyleRec extends TextStyle {
  id: string; key: string;
  m_scale: number; m_offset_x: number; m_offset_y: number; m_hidden: boolean;
}

interface CtxValue {
  content: ContentMap;
  ids: IdsMap;
  saveContent: (key: ContentKey, value: string) => Promise<void>;
  styles: Record<string, TextStyle>;
  saveStyle: (key: string, patch: Partial<TextStyle>) => Promise<void>;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
}

const SiteContentContext = createContext<CtxValue>({
  content: CONTENT_DEFAULTS,
  ids: {},
  saveContent: async () => {},
  styles: {},
  saveStyle: async () => {},
  isEditing: false,
  setIsEditing: () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentMap>(CONTENT_DEFAULTS);
  const [ids, setIds] = useState<IdsMap>({});
  // Desktop and mobile layout are stored side by side; consumers only see the current screen's values
  const [both, setBoth] = useState<Record<string, { d: TextStyle; m: TextStyle }>>({});
  const [styleIds, setStyleIds] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const mobile = useIsMobile();
  const styles = useMemo(() => {
    const s: Record<string, TextStyle> = {};
    for (const [k, v] of Object.entries(both)) s[k] = mobile ? v.m : v.d;
    return s;
  }, [both, mobile]);

  useEffect(() => {
    pb.collection("text_styles")
      .getFullList<StyleRec>({ requestKey: null })
      .then((recs) => {
        const s: Record<string, { d: TextStyle; m: TextStyle }> = {};
        const i: Record<string, string> = {};
        for (const r of recs) {
          s[r.key] = {
            d: { scale: r.scale || 100, offset_x: r.offset_x, offset_y: r.offset_y, hidden: !!r.hidden },
            m: { scale: r.m_scale || 100, offset_x: r.m_offset_x, offset_y: r.m_offset_y, hidden: !!r.m_hidden },
          };
          i[r.key] = r.id;
        }
        setBoth(s);
        setStyleIds(i);
      })
      .catch(console.error);
  }, []);

  const saveStyle = async (key: string, patch: Partial<TextStyle>) => {
    const base = { scale: 100, offset_x: 0, offset_y: 0, hidden: false };
    const cur = both[key] ?? { d: base, m: base };
    const next = { d: cur.d, m: cur.m };
    if (mobile) next.m = { ...cur.m, ...patch };
    else next.d = { ...cur.d, ...patch };
    setBoth((prev) => ({ ...prev, [key]: next }));
    const body = {
      ...next.d,
      m_scale: next.m.scale, m_offset_x: next.m.offset_x, m_offset_y: next.m.offset_y, m_hidden: next.m.hidden,
    };
    const id = styleIds[key];
    if (id) {
      await pb.collection("text_styles").update(id, body, { requestKey: null });
    } else {
      const rec = await pb.collection("text_styles").create<StyleRec>({ key, ...body }, { requestKey: null });
      setStyleIds((prev) => ({ ...prev, [key]: rec.id }));
    }
  };

  useEffect(() => {
    pb.collection("site_content")
      .getFullList<ContentRecord>({ requestKey: null })
      .then((recs) => {
        const vals = { ...CONTENT_DEFAULTS };
        const idMap: IdsMap = {};
        for (const r of recs) {
          if (r.key in CONTENT_DEFAULTS) {
            vals[r.key] = r.value;
            idMap[r.key] = r.id;
          }
        }
        setContent(vals);
        setIds(idMap);
      })
      .catch(console.error);
  }, []);

  const saveContent = async (key: ContentKey, value: string) => {
    const existingId = ids[key];
    if (existingId) {
      await pb.collection("site_content").update(existingId, { value });
    } else {
      const rec = await pb.collection("site_content").create<ContentRecord>({ key, value });
      setIds((prev) => ({ ...prev, [key]: rec.id }));
    }
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SiteContentContext.Provider value={{ content, ids, saveContent, styles, saveStyle, isEditing, setIsEditing }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export const useSiteContent = () => useContext(SiteContentContext);
