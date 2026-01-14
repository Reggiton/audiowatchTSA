// Simplified app params - no longer needs Base44 specific parameters

const getQueryParam = (paramName) => {
  if (typeof window === 'undefined') {
    return null
  }
  
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(paramName)
}

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

// Simple app configuration
export const appParams = {
  appId: import.meta.env.VITE_APP_ID || 'audiowatch',
  appName: import.meta.env.VITE_APP_NAME || 'AudioWatch',
  // Add any other app-specific config you need
}
