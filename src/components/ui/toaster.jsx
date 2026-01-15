import { useToast } from "@/components/ui/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

// Main toaster component that renders all active toasts
export function Toaster() {
  // Get current toasts from the toast hook
  const { toasts } = useToast();

  return (
    // Provider that controls toast positioning and behavior
    <ToastProvider>
      {/* Render each toast */}
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            {/* Text content of the toast */}
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>

            {/* Optional action button (e.g. Undo) */}
            {action}

            {/* Close (X) button */}
            <ToastClose />
          </Toast>
        );
      })}

      {/* Container where toasts appear on screen */}
      <ToastViewport />
    </ToastProvider>
  );
}
