// Government of India color palette
export const GOV_COLORS = {
  // Primary government colors
  primary: '#1B365D',      // Deep navy blue
  secondary: '#2C5F2D',    // Forest green  
  accent: '#FF7C00',       // Saffron orange
  
  // Status colors
  success: '#388E3C',      // Green for approved/success
  warning: '#F57C00',      // Orange for pending/warning
  danger: '#D32F2F',       // Red for rejected/danger
  info: '#1976D2',         // Blue for information
  
  // Neutral colors
  background: '#F8F9FA',   // Light gray background
  surface: '#FFFFFF',      // White surface
  text: {
    primary: '#1B365D',    // Dark blue for headings
    secondary: '#5A5A5A',  // Gray for body text
    muted: '#8E8E8E',      // Light gray for captions
    white: '#FFFFFF'       // White text
  },
  
  // Border colors
  border: {
    light: '#E0E0E0',      // Light border
    medium: '#BDBDBD',     // Medium border
    dark: '#757575'        // Dark border
  },
  
  // Chart colors (professional and accessible)
  chart: [
    '#1B365D',  // Navy blue
    '#2C5F2D',  // Forest green
    '#FF7C00',  // Saffron orange
    '#1976D2',  // Blue
    '#388E3C',  // Green
    '#F57C00',  // Orange
    '#7B1FA2',  // Purple
    '#C2185B'   // Pink
  ]
};

// Chart configuration
export const CHART_CONFIG = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  grid: {
    strokeDasharray: '3 3',
    stroke: GOV_COLORS.border.light
  },
  tooltip: {
    contentStyle: {
      backgroundColor: GOV_COLORS.surface,
      border: `1px solid ${GOV_COLORS.border.medium}`,
      borderRadius: '4px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  }
};

// Typography scale
export const TYPOGRAPHY = {
  heading: {
    h1: 'text-3xl font-bold text-gov-primary',
    h2: 'text-2xl font-semibold text-gov-primary', 
    h3: 'text-xl font-medium text-gov-primary',
    h4: 'text-lg font-medium text-gov-text-primary'
  },
  body: {
    large: 'text-base text-gov-text-secondary',
    medium: 'text-sm text-gov-text-secondary',
    small: 'text-xs text-gov-text-muted'
  }
};

// Spacing scale
export const SPACING = {
  xs: '0.5rem',
  sm: '1rem', 
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem'
};