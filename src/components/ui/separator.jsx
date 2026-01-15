// React import
import * as React from "react"

// Radix separator primitive
import * as SeparatorPrimitive from "@radix-ui/react-separator"

// Utility for conditional class names
import { cn } from "@/lib/utils"

// Separator component (horizontal or vertical)
const Separator = React.forwardRef(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative} // Accessibility: marks separator as decorative
      orientation={orientation} // horizontal | vertical
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal"
          ? "h-[1px] w-full"
          : "h-full w-[1px]",
        className
      )}
      {...props} />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

// Export
export { Separator }
