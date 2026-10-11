import { useEffect } from "react";

// Keep keyboard navigation inside the open drawer and return to its trigger.
export default function useDialogFocus(open, dialogRef, onClose, triggerRef) {
  useEffect(() => {
    if (!open) return undefined;
    const trigger = triggerRef?.current || document.activeElement;
    const dialog = dialogRef.current;
    const focusable = () => [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(element => element.getClientRects().length);
    focusable()[0]?.focus();
    const handleKey = event => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab") return;
      const elements = focusable();
      if (!elements.length) { event.preventDefault(); return; }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); trigger?.focus(); };
  }, [open, dialogRef, onClose, triggerRef]);
}
