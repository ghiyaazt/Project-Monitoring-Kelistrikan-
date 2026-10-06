import React from 'react';
import { AppProvider } from '../context/AppContext';

/**
 * Providers component
 * Wraps the app with all necessary context providers
 * - AppContext for global state (theme, user, etc.)
 * 
 * Future: Add QueryClient, Router, etc. here
 */
interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
}
