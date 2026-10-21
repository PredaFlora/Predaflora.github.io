import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSiteContent } from "../contexts/SiteContentContext";

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

export default function EditModeBar() {
  const { isEditing, setIsEditing } = useSiteContent();
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);

  if (!isEditing) return null;

  if (hidden) {
    return (
      <button
        onClick={() => setHidden(false)}
        className="fixed bottom-3 right-3 z-50 flex items-center gap-2 rounded-full border border-amber bg-night/95 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-amber shadow-lg transition hover:bg-amber hover:text-night"
      >
        <PencilIcon />
        Show edit bar
      </button>
    );
  }

  const exit = () => {
    setIsEditing(false);
    navigate("/admin");
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t-2 border-amber bg-night/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber text-night">
            <PencilIcon />
          </span>
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber">Edit Mode</span>
            <p className="font-mono text-[10px] text-fog">Click any highlighted text or photo to edit it. On the homescreen you can add, move, resize and delete text boxes and photos.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHidden(true)}
            className="rounded-full border border-bone/30 bg-night px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition hover:border-bone"
          >
            Hide bar
          </button>
          <button
            onClick={exit}
            className="flex items-center gap-2 rounded-full border border-bone/30 bg-night px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition hover:border-bone"
          >
            <CloseIcon />
            Exit edit mode
          </button>
        </div>
      </div>
    </div>
  );
}
