"use client";
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

// App-level toaster wrapper
// Syncs toast theme with Next Themes (light / dark / system)
const Toaster = ({
  ...props
}) => {
  // Get current theme from next-themes
  const { theme = "system" } = useTheme()

  return (
    (<Sonner
      // Pass theme directly to Sonner
      theme={theme}

      // Base class for targeting toaster styles
      className="toaster group"

      // Custom Tailwind classes for toast styling
      toastOptions={{
        classNames: {
          // Main toast container
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",

          // Toast description text
          description: "group-[.toast]:text-muted-foreground",

          // Primary action button
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",

          // Cancel / secondary button
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}

      // Forward any additional props
      {...props} />)
  );
}

// Export Toaster component
export { Toaster }
