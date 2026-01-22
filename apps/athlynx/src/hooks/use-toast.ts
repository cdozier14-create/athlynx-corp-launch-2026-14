import { useState, useCallback } from "react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastState {
  toasts: Toast[];
}

let toastCount = 0;

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  const toast = useCallback(({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = String(++toastCount);
    
    setState((prev) => ({
      toasts: [...prev.toasts, { id, title, description, variant }],
    }));

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setState((prev) => ({
        toasts: prev.toasts.filter((t) => t.id !== id),
      }));
    }, 5000);

    // Also show as alert for now (simple implementation)
    if (variant === "destructive") {
      console.error(`${title}: ${description}`);
    } else {
      console.log(`${title}: ${description}`);
    }
    
    return { id };
  }, []);

  const dismiss = useCallback((id: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== id),
    }));
  }, []);

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  };
}
