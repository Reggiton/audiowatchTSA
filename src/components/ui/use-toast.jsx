// Inspired by react-hot-toast library
import { useState, useEffect } from "react";

// Maximum number of toasts allowed at once
const TOAST_LIMIT = 20;

// Delay before a dismissed toast is fully removed
const TOAST_REMOVE_DELAY = 1000000;

// All possible actions for the toast reducer
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

// Counter used to generate unique toast IDs
let count = 0;

// Generates a unique ID for each toast
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

// Stores timeout IDs for toast removal
const toastTimeouts = new Map();

// Adds a toast to the removal queue after a delay
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// Clears a toast from the removal queue
const _clearFromRemoveQueue = (toastId) => {
  const timeout = toastTimeouts.get(toastId);
  if (timeout) {
    clearTimeout(timeout);
    toastTimeouts.delete(toastId);
  }
};

// Reducer that controls how toast state changes
export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        // Add new toast to the front and limit total count
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        // Update an existing toast by ID
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // Queue toast(s) for removal after animation finishes
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        // Mark toast(s) as closed
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }

    case actionTypes.REMOVE_TOAST:
      // Remove all toasts
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      // Remove a single toast by ID
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// List of subscribers that listen for toast state changes
const listeners = [];

// Global in-memory toast state
let memoryState = { toasts: [] };

// Dispatch function that updates state and notifies listeners
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Function to create and show a new toast
function toast({ ...props }) {
  const id = genId();

  // Update this toast
  const update = (props) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  // Dismiss this toast
  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  // Add the toast to state
  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      // Auto-dismiss when closed
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

// React hook to access toast state and actions
function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    // Subscribe to toast updates
    listeners.push(setState);
    return () => {
      // Unsubscribe on unmount
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    // Dismiss a toast by ID
    dismiss: (toastId) =>
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

// Export toast hook and toast creator
export { useToast, toast };
