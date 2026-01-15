"use client";
import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

// Context to share size and variant across toggle group items
const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
})

// ToggleGroup wraps multiple toggle buttons together
const ToggleGroup = React.forwardRef(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    // Layout for the toggle group
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}>
    
    {/* Provide size and variant to all ToggleGroupItem children */}
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

// Individual toggle button inside the group
const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
  // Get shared settings from the group
  const context = React.useContext(ToggleGroupContext)

  return (
    (
      <ToggleGroupPrimitive.Item
        ref={ref}
        // Use group variant/size unless overridden
        className={cn(
          toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
          }),
          className
        )}
        {...props}>
        {children}
      </ToggleGroupPrimitive.Item>
    )
  );
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

// Export toggle group components
export { ToggleGroup, ToggleGroupItem }
