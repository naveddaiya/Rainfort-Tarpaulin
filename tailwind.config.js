/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy blue primary
        navy: {
          50: '#e6eef5',
          100: '#ccdde8',
          200: '#99bad1',
          300: '#6698ba',
          400: '#3375a3',
          500: '#1a4d7a', // Main navy
          600: '#153e62',
          700: '#102f4a',
          800: '#0b1f31',
          900: '#051019',
        },
        // Charcoal/Slate secondary
        charcoal: {
          50: '#f5f6f7',
          100: '#e5e7eb',
          200: '#d1d5db',
          300: '#9ca3af',
          400: '#6b7280',
          500: '#4b5563', // Main charcoal
          600: '#374151',
          700: '#2d3748',
          800: '#1f2937',
          900: '#111827',
        },
        // Safety orange accent
        safety: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ff6b00', // Main safety orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Forge — deep dark backgrounds for always-dark sections
        forge: {
          50:  '#e8ecf2',
          100: '#c5cedc',
          200: '#8fa2ba',
          300: '#5a7698',
          400: '#2e4f78',
          500: '#112d52',
          600: '#0d2340',
          700: '#091929',
          800: '#060f18',
          900: '#03080d',
          950: '#020508',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Barlow Condensed', 'system-ui', 'sans-serif'],
        hero: ['Bebas Neue', 'Barlow Condensed', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "reveal-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "reveal-left": {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-10px)" },
        },
        "shimmer": {
          from: { backgroundPosition: "200% 0" },
          to:   { backgroundPosition: "-200% 0" },
        },
        "card-rise": {
          from: { opacity: "0", transform: "translateY(20px) scale(0.98)" },
          to:   { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "stat-pop": {
          "0%":   { transform: "scale(0.92)", opacity: "0" },
          "60%":  { transform: "scale(1.04)", opacity: "1" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "hero-zoom": {
          from: { transform: "scale(1.07)" },
          to:   { transform: "scale(1.0)" },
        },
        "slide-up-fade": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "edge-light": {
          "0%, 100%": { opacity: "0" },
          "50%":       { opacity: "1" },
        },
        "marquee-scroll": {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "reveal-up":   "reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "reveal-left": "reveal-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "float":       "float 4s ease-in-out infinite",
        "shimmer":     "shimmer 1.6s ease-in-out infinite",
        "card-rise":   "card-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "stat-pop":    "stat-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in":        "fade-in 0.4s ease-out both",
        "hero-zoom":      "hero-zoom 9s ease-out forwards",
        "slide-up-fade":  "slide-up-fade 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "marquee-scroll": "marquee-scroll 38s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
