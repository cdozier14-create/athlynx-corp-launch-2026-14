/**
 * ATHLYNX Global Theme
 * Stunning Blue/White Color Scheme
 */

export const ATHLYNX_THEME = {
  // Background Colors - Navy Blue Gradient
  background: {
    primary: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 25%, #0f2847 50%, #0a1e38 75%, #061424 100%)',
    secondary: '#0a1628',
    card: 'rgba(15, 40, 71, 0.6)',
    cardHover: 'rgba(15, 40, 71, 0.8)',
  },
  
  // Text Colors
  text: {
    primary: '#ffffff',
    secondary: '#94a3b8',
    accent: '#06b6d4', // Cyan
    muted: '#64748b',
  },
  
  // Brand Colors
  brand: {
    cyan: '#06b6d4',
    blue: '#3b82f6',
    navy: '#0a1628',
    white: '#ffffff',
  },
  
  // Glow Effects - That Sexy Color!
  glow: {
    cyan: 'rgba(6, 182, 212, 0.4)',
    blue: 'rgba(59, 130, 246, 0.4)',
    cyanStrong: 'rgba(6, 182, 212, 0.6)',
    blueStrong: 'rgba(59, 130, 246, 0.6)',
  },
  
  // Border Colors
  border: {
    default: 'rgba(6, 182, 212, 0.3)',
    hover: 'rgba(6, 182, 212, 0.6)',
    active: '#06b6d4',
  },
  
  // Button Styles
  button: {
    primary: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500',
    primaryHover: 'hover:from-cyan-400 hover:via-blue-400 hover:to-cyan-400',
    secondary: 'bg-slate-800/60 border-2 border-cyan-500/30',
    secondaryHover: 'hover:border-cyan-400',
  },
  
  // Shadow Effects
  shadow: {
    glow: 'shadow-2xl shadow-cyan-500/30',
    glowStrong: 'shadow-2xl shadow-cyan-500/50',
    card: 'shadow-xl shadow-black/20',
  },
};

// CSS Classes for easy use
export const THEME_CLASSES = {
  // Page Container
  pageContainer: 'min-h-screen relative text-white overflow-x-hidden',
  
  // Background
  backgroundGradient: 'absolute inset-0',
  backgroundOverlay: 'absolute inset-0 opacity-40',
  
  // Cards
  card: 'bg-slate-800/60 backdrop-blur-sm border-2 border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-6 hover:scale-105 transition-all',
  cardSimple: 'bg-slate-800/60 backdrop-blur-sm border-2 border-cyan-500/30 rounded-2xl p-6',
  
  // Buttons
  buttonPrimary: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white font-bold px-6 py-3 rounded-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all',
  buttonSecondary: 'bg-slate-800/60 border-2 border-cyan-500/30 hover:border-cyan-400 text-white font-bold px-6 py-3 rounded-lg transition-all',
  
  // Text
  heading: 'text-white font-black text-4xl md:text-6xl tracking-tight',
  subheading: 'text-cyan-400 text-xl md:text-2xl font-bold',
  body: 'text-gray-300 text-base',
  
  // App Icons
  appIcon: 'relative w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-transform',
  appIconGlow: 'absolute inset-0 blur-xl opacity-40 group-hover:opacity-60 transition-opacity',
};

// Inline Styles (for style prop)
export const THEME_STYLES = {
  background: {
    background: ATHLYNX_THEME.background.primary,
  },
  
  glowOverlay: {
    background: 'radial-gradient(ellipse at top center, rgba(59, 130, 246, 0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom center, rgba(6, 182, 212, 0.1) 0%, transparent 60%)',
  },
};
