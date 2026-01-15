/**
 * Pages Configuration
 * Defines all app routes and page component mappings
 * Specifies the main/home page and available navigation paths
 */

import History from './pages/History'
import Home from './pages/Home'
import Settings from './pages/Settings'
import SoundLibrary from './pages/SoundLibrary'

// Map of route paths to page components
export const PAGES = {
    "History": History,
    "Home": Home,
    "Settings": Settings,
    "SoundLibrary": SoundLibrary,
}

// Main configuration object for app routing
export const pagesConfig = {
    mainPage: "Home", // Default/landing page
    Pages: PAGES,     // All available pages
}
