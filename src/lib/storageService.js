// Local storage service to replace entity system
// Provides simple CRUD operations for app data

const STORAGE_KEYS = {
  ONBOARDING_STATUS: 'audiowatch_onboarding',
  SOUND_SETTINGS: 'audiowatch_settings',
  DETECTED_SOUNDS: 'audiowatch_detections',
  SOUND_CORRECTIONS: 'audiowatch_corrections'
}

// Helper to generate unique IDs
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Generic storage operations
const getItems = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading from storage:', error)
    return []
  }
}

const setItems = (key, items) => {
  try {
    localStorage.setItem(key, JSON.stringify(items))
    return true
  } catch (error) {
    console.error('Error writing to storage:', error)
    return false
  }
}

// Onboarding Status Operations
export const onboardingStatus = {
  list: () => {
    return getItems(STORAGE_KEYS.ONBOARDING_STATUS)
  },
  
  create: (data) => {
    const items = getItems(STORAGE_KEYS.ONBOARDING_STATUS)
    const newItem = {
      id: generateId(),
      ...data,
      created_at: new Date().toISOString()
    }
    items.push(newItem)
    setItems(STORAGE_KEYS.ONBOARDING_STATUS, items)
    return newItem
  },
  
  update: (id, data) => {
    const items = getItems(STORAGE_KEYS.ONBOARDING_STATUS)
    const index = items.findIndex(item => item.id === id)
    if (index !== -1) {
      items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() }
      setItems(STORAGE_KEYS.ONBOARDING_STATUS, items)
      return items[index]
    }
    return null
  }
}

// Sound Settings Operations
export const soundSettings = {
  list: () => {
    return getItems(STORAGE_KEYS.SOUND_SETTINGS)
  },
  
  create: (data) => {
    const items = getItems(STORAGE_KEYS.SOUND_SETTINGS)
    const newItem = {
      id: generateId(),
      ...data,
      created_at: new Date().toISOString()
    }
    items.push(newItem)
    setItems(STORAGE_KEYS.SOUND_SETTINGS, items)
    return newItem
  },
  
  update: (id, data) => {
    const items = getItems(STORAGE_KEYS.SOUND_SETTINGS)
    const index = items.findIndex(item => item.id === id)
    if (index !== -1) {
      items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() }
      setItems(STORAGE_KEYS.SOUND_SETTINGS, items)
      return items[index]
    }
    return null
  }
}

// Detected Sounds Operations
export const detectedSounds = {
  list: (sortBy = '-timestamp', limit = null) => {
    let items = getItems(STORAGE_KEYS.DETECTED_SOUNDS)
    
    // Sort by timestamp (descending by default)
    items.sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime()
      const bTime = new Date(b.timestamp).getTime()
      return sortBy.startsWith('-') ? bTime - aTime : aTime - bTime
    })
    
    if (limit) {
      items = items.slice(0, limit)
    }
    
    return items
  },
  
  create: (data) => {
    const items = getItems(STORAGE_KEYS.DETECTED_SOUNDS)
    const newItem = {
      id: generateId(),
      ...data,
      created_at: new Date().toISOString()
    }
    items.push(newItem)
    setItems(STORAGE_KEYS.DETECTED_SOUNDS, items)
    return newItem
  },
  
  update: (id, data) => {
    const items = getItems(STORAGE_KEYS.DETECTED_SOUNDS)
    const index = items.findIndex(item => item.id === id)
    if (index !== -1) {
      items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() }
      setItems(STORAGE_KEYS.DETECTED_SOUNDS, items)
      return items[index]
    }
    return null
  },
  
  delete: (id) => {
    const items = getItems(STORAGE_KEYS.DETECTED_SOUNDS)
    const filtered = items.filter(item => item.id !== id)
    setItems(STORAGE_KEYS.DETECTED_SOUNDS, filtered)
    return { success: true, id }
  }
}

// Sound Corrections Operations
export const soundCorrections = {
  list: () => {
    return getItems(STORAGE_KEYS.SOUND_CORRECTIONS)
  },
  
  create: (data) => {
    const items = getItems(STORAGE_KEYS.SOUND_CORRECTIONS)
    const newItem = {
      id: generateId(),
      ...data,
      created_at: new Date().toISOString()
    }
    items.push(newItem)
    setItems(STORAGE_KEYS.SOUND_CORRECTIONS, items)
    return newItem
  }
}

// Export as entities object for easier migration
export const entities = {
  OnboardingStatus: onboardingStatus,
  SoundSettings: soundSettings,
  DetectedSound: detectedSounds,
  SoundCorrection: soundCorrections
}
