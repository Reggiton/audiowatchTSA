/**
 * React Query Client Configuration
 * Sets up TanStack Query for data fetching and caching
 * Configures default options for all queries in the application
 */

import { QueryClient } from '@tanstack/react-query';

// Create query client instance with custom defaults
export const queryClientInstance = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            retry: 1, // Only retry failed queries once
        },
    },
});
