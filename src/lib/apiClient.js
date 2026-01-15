/**
 * API Client
 * localStorage-based data persistence layer
 * Provides CRUD operations for: sound_settings, detected_sounds, 
 * onboarding_status, sound_corrections
 */

import { storageService } from './storageService';

// Simple auth state management - stored in memory and localStorage
let currentUser = null;
let isAuthenticated = false;

export const api = {
  // Entity CRUD operations - wraps storageService for data persistence
  entities: {
    // Retrieve all entities of a given type
    list: async (entityType) => {
      return storageService.list(entityType);
    },
    
    // Create a new entity with auto-generated ID and timestamp
    create: async (entityType, data) => {
      return storageService.create(entityType, data);
    },
    
    // Update an existing entity by ID
    update: async (entityType, id, data) => {
      return storageService.update(entityType, id, data);
    },
    
    // Delete an entity by ID
    delete: async (entityType, id) => {
      return storageService.delete(entityType, id);
    },
    
    // Retrieve a single entity by ID
    get: async (entityType, id) => {
      return storageService.get(entityType, id);
    }
  },
  
  // Authentication methods - simplified localStorage-based auth
  auth: {
    // Get current authenticated user
    me: async () => {
      // Return cached user if available
      if (currentUser) {
        return currentUser;
      }
      
      // Check localStorage for saved user
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAuthenticated = true;
        return currentUser;
      }
      
      throw new Error('Not authenticated');
    },
    
    // Clear authentication state and optionally redirect
    logout: (redirectUrl) => {
      currentUser = null;
      isAuthenticated = false;
      localStorage.removeItem('currentUser');
      
      if (redirectUrl) {
        window.location.href = '/';
      }
    },
    
    // Redirect to login page (currently just redirects to home)
    redirectToLogin: (returnUrl) => {
      window.location.href = '/';
    }
  }
};
