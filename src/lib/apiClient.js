import { storageService } from './storageService';

// Simple auth state management
let currentUser = null;
let isAuthenticated = false;

export const api = {
  entities: {
    list: async (entityType) => {
      return storageService.list(entityType);
    },
    
    create: async (entityType, data) => {
      return storageService.create(entityType, data);
    },
    
    update: async (entityType, id, data) => {
      return storageService.update(entityType, id, data);
    },
    
    delete: async (entityType, id) => {
      return storageService.delete(entityType, id);
    },
    
    get: async (entityType, id) => {
      return storageService.get(entityType, id);
    }
  },
  
  auth: {
    me: async () => {
      if (currentUser) {
        return currentUser;
      }
      
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAuthenticated = true;
        return currentUser;
      }
      
      throw new Error('Not authenticated');
    },
    
    logout: (redirectUrl) => {
      currentUser = null;
      isAuthenticated = false;
      localStorage.removeItem('currentUser');
      
      if (redirectUrl) {
        window.location.href = '/';
      }
    },
    
    redirectToLogin: (returnUrl) => {
      window.location.href = '/';
    }
  }
};
