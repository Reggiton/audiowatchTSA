// Import React
import * as React from "react"

// Used to create class variants
import { cva } from "class-variance-authority"

// Utility to combine class names
import { cn } from "@/lib/utils"

// Define styles and variants for the alert
const alertVariants = cva(
  // Base styles for all alerts
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        // Default alert style
        default: "bg-background text-foreground",

        // Style for error / destructive alerts
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },

    // Default variant
    defaultVariants: {
      variant: "default",
    },
  }
)

// Main Alert component
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert" // Accessibility role
    className={cn(alertVariants({ variant }), className)}
    {...props} />
))

Alert.displayName = "Alert"

// Title text for the alert
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props} />
))

AlertTitle.displayName = "AlertTitle"

// Description text for the alert
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props} />
))

AlertDescription.displayName = "AlertDescription"

// Export components
export { Alert, AlertTitle, AlertDescription }
