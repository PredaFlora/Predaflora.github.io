import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: P) => <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>;
export const ArrowLeft = (p: P) => <Base {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></Base>;
export const Plus = (p: P) => <Base {...p}><path d="M12 5v14M5 12h14" /></Base>;
export const Close = (p: P) => <Base {...p}><path d="M6 6l12 12M18 6L6 18" /></Base>;
export const Check = (p: P) => <Base {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Base>;
export const Pencil = (p: P) => <Base {...p}><path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" /></Base>;
export const Trash = (p: P) => <Base {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Base>;
export const Upload = (p: P) => <Base {...p}><path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" /></Base>;
export const LogOut = (p: P) => <Base {...p}><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11" /></Base>;
export const Eye = (p: P) => <Base {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Base>;
export const EyeOff = (p: P) => <Base {...p}><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.6 8.4 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2" /></Base>;
export const Camera = (p: P) => <Base {...p}><path d="M4 8h3l2-3h6l2 3h3v11H4V8z" /><circle cx="12" cy="13" r="3.5" /></Base>;
export const Reset = (p: P) => <Base {...p}><path d="M4 4v6h6" /><path d="M4.5 15a8 8 0 1 0 1.9-8.3L4 10" /></Base>;
export const Send = (p: P) => <Base {...p}><path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" /></Base>;

/** A stylised flytrap: two toothed jaws. */
export const Trap = (p: P) => (
  <Base {...p}>
    <path d="M12 21v-7" />
    <path d="M12 14c-4 0-7-3-7-7 3 0 7 2 7 7z" />
    <path d="M12 14c4 0 7-3 7-7-3 0-7 2-7 7z" />
    <path d="M5 7l-1-1.5M7 5.5L6.5 4M17 5.5l.5-1.5M19 7l1-1.5" />
  </Base>
);

/** A simple leaf with midrib. */
export const Leaf = (p: P) => (
  <Base {...p}>
    <path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z" />
    <path d="M5 19L14 10" />
  </Base>
);
