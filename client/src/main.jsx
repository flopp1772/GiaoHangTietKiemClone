// ==============================|| THIRD PARTY IMPORTS ||==============================

// React core imports
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Routing
import { BrowserRouter } from "react-router-dom";

// State Management
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ==============================|| PROJECT IMPORTS ||==============================

// Components
import App from './App.jsx';
import ThemeCustomization from './mantisAdmin/themes';
import ScrollTop from './mantisAdmin/components/ScrollTop';

// Styles
import './index.css';

// ==============================|| CONFIGURATION ||==============================

/**
 * QueryClient Configuration
 * - Manages server state and caching
 * - Handles data fetching, caching, and synchronization
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable automatic refetching on window focus
      retry: 1, // Only retry failed requests once
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    },
  },
});

// ==============================|| APP RENDERING ||==============================

/**
 * Root Component Structure:
 * 1. StrictMode - Development mode checks
 * 2. QueryClientProvider - React Query context
 * 3. ThemeCustomization - Theme provider
 * 4. ScrollTop - Scroll behavior
 * 5. BrowserRouter - Routing
 * 6. App - Main application component
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeCustomization>
        <ScrollTop>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ScrollTop>
      </ThemeCustomization>
    </QueryClientProvider>
  </StrictMode>
);
