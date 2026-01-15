/**
 * Storage Service
 * Wrapper around localStorage for data persistence
 * Handles JSON serialization, ID generation, and error handling
 * Provides CRUD operations for entity storage
 */

// Generate unique ID using timestamp and random string
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const storageService = {
  // Retrieve all entities of a specific type from localStorage
  list: async (entityType) => {
    const key = `entities_${entityType}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  
  // Create new entity with auto-generated ID and timestamps
  create: async (entityType, data) => {
    const key = `entities_${entityType}`;
    const items = await storageService.list(entityType);
    
    const newItem = {
      ...data,
      id: data.id || generateId(), // Use provided ID or generate new one
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
    
    return newItem;
  },
  
  // Update existing entity by ID, preserving original ID and created_at
  update: async (entityType, id, data) => {
    const key = `entities_${entityType}`;
    const items = await storageService.list(entityType);
    
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    items[index] = {
      ...items[index],
      ...data,
      id: items[index].id, // Preserve original ID
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem(key, JSON.stringify(items));
    
    return items[index];
  },
  
  // Delete entity by ID
  delete: async (entityType, id) => {
    const key = `entities_${entityType}`;
    const items = await storageService.list(entityType);
    
    const filteredItems = items.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filteredItems));
    
    return { success: true };
  },
  
  // Retrieve single entity by ID
  get: async (entityType, id) => {
    const items = await storageService.list(entityType);
    const item = items.find(item => item.id === id);
    
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    return item;
  }
};
