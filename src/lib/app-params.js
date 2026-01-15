/**
 * Application Parameters
 * Simple app configuration without external dependencies
 * Provides URL query parameter utilities and app metadata
 */

// Extract URL query parameter by name
const getQueryParam = (paramName) => {
  if (typeof window === 'undefined') {
    return null
  }
  
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(paramName)
}

// Remove query parameter from URL without page reload
const removeQueryParam = (paramName) => {
  if (typeof window === 'undefined') {
    return
  }
  
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.delete(paramName)
  
  const newUrl = `${window.location.pathname}${
    urlParams.toString() ? `?${urlParams.toString()}` : ""
  }${window.location.hash}`
  
  window.history.replaceState({}, document.title, newUrl)
}

// Application configuration - can be overridden via environment variables
export const appParams = {
  appId: import.meta.env.VITE_APP_ID || 'audiowatch',
  appName: import.meta.env.VITE_APP_NAME || 'AudioWatch',
  // Add any other app-specific config you need
}
