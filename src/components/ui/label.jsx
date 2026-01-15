// React import
import * as React from "react"

// Radix label primitive
import * as LabelPrimitive from "@radix-ui/react-label"

// Used for variant-based classes
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Label styles
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

// Label component
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

// Export
export { Label }
