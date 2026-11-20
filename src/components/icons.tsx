type P = { className?: string };

const base = "shrink-0";

export function GoogleIcon({ className = "size-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

function Stroke({ className = "size-5", children }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className}`}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const TimelineIcon = (p: P) => (
  <Stroke {...p}><path d="M12 3v18" /><circle cx="12" cy="7" r="2" /><circle cx="12" cy="17" r="2" /><path d="M14 7h5M5 17h5" /></Stroke>
);
export const PulseIcon = (p: P) => (
  <Stroke {...p}><path d="M3 12h4l3-7 4 14 3-7h4" /></Stroke>
);
export const PhotoIcon = (p: P) => (
  <Stroke {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5-5-8 8" /></Stroke>
);
export const LockIcon = (p: P) => (
  <Stroke {...p}><rect x="4" y="11" width="16" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Stroke>
);
export const PlusIcon = (p: P) => (
  <Stroke {...p}><path d="M12 5v14M5 12h14" /></Stroke>
);
export const ArrowLeftIcon = (p: P) => (
  <Stroke {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></Stroke>
);
export const ArrowRightIcon = (p: P) => (
  <Stroke {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Stroke>
);
export const ExternalIcon = (p: P) => (
  <Stroke {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" /></Stroke>
);
export const CalendarIcon = (p: P) => (
  <Stroke {...p}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></Stroke>
);
export const PencilIcon = (p: P) => (
  <Stroke {...p}><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="m13.5 6.5 4 4" /></Stroke>
);
