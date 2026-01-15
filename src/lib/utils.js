/**
 * Utility Functions
 * Helper functions for Tailwind class merging and environment detection
 */

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Merge Tailwind CSS classes intelligently, resolving conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 

// Detect if app is running inside an iframe
export const isIframe = window.self !== window.top;
