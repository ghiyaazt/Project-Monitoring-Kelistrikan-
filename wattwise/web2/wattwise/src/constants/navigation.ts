/**
 * Navigation Configuration
 * Defines the main navigation menu structure for the application
 */

import React from 'react';

// All available pages in the application
export type Page = 
  | "dashboard" 
  | "daftar-kos" 
  | "penghuni" 
  | "laporan-keuangan" 
  | "pengaturan" 
  | "profil" 
  | "kamar-list" 
  | "detail-kamar";

// Pages that appear in the main navigation menu
export type NavigationPage = "dashboard" | "daftar-kos" | "penghuni" | "laporan-keuangan";

export interface NavigationItem {
  id: NavigationPage;
  label: string;
  icon: React.ReactNode;
}

/**
 * Main navigation menu items
 * Each item represents a top-level page in the application
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: React.createElement(
      'svg',
      { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.75 },
      React.createElement('rect', { x: "3", y: "3", width: "7", height: "7", rx: "1.5" }),
      React.createElement('rect', { x: "14", y: "3", width: "7", height: "7", rx: "1.5" }),
      React.createElement('rect', { x: "14", y: "14", width: "7", height: "7", rx: "1.5" }),
      React.createElement('rect', { x: "3", y: "14", width: "7", height: "7", rx: "1.5" })
    ),
  },
  {
    id: "daftar-kos",
    label: "Kosku",
    icon: React.createElement(
      'svg',
      { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.75 },
      React.createElement('path', { 
        strokeLinecap: "round", 
        strokeLinejoin: "round", 
        d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      })
    ),
  },
  {
    id: "penghuni",
    label: "Penghuni",
    icon: React.createElement(
      'svg',
      { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.75 },
      React.createElement('path', { 
        strokeLinecap: "round", 
        strokeLinejoin: "round", 
        d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      })
    ),
  },
  {
    id: "laporan-keuangan",
    label: "Laporan Keuangan",
    icon: React.createElement(
      'svg',
      { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.75 },
      React.createElement('path', { 
        strokeLinecap: "round", 
        strokeLinejoin: "round", 
        d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      })
    ),
  },
];
