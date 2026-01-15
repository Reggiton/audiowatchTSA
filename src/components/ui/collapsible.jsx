"use client" // Client component

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

// Main collapsible wrapper
const Collapsible = CollapsiblePrimitive.Root

// Trigger to open/close collapsible
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

// Collapsible content
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

// Export components
export { Collapsible, CollapsibleTrigger, CollapsibleContent }
