import { cn } from "@/lib/utils"

// Skeleton component
// Used as a loading placeholder while content is being fetched
function Skeleton({
  className,
  ...props
}) {
  return (
    (
      <div
        // animate-pulse gives the loading shimmer effect
        // bg-primary/10 keeps it subtle and theme-aware
        className={cn("animate-pulse rounded-md bg-primary/10", className)}
        {...props}
      />
    )
  );
}

// Export for reuse across the app (cards, lists, sidebar, etc.)
export { Skeleton }
