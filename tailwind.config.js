/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Ensures Tailwind scans all relevant files
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter,system-ui, s-serif'], // Custom font for modern design
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Modern black and white palette
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#626262',
          900: '#717171',
          950: '#0a0a0a',
        },
        // Accent colors for highlights
        accent: {
          50: '#ff0000',
          100: '#fe0000',
          200: '#ae6fd0',
          300: '#dd3fc0',
          400: '#8f8000',
          500: '#ea5e90',
          600: '#284c70',
          700: '#369a10',
          800: '#759850',
          900: '#0c4000',
        },
      },
      animation: {
        // Smooth fade animations
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.6s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.6s ease-out forwards',
        
        // Floating animations
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        
        // Pulse and glow effects
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        
        // Slide animations
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        
        // Scale animations
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.1)' },
          '10%': { boxShadow: '0 0 0 20px rgba(255, 255, 255, 0.3)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10%)' },
          '10%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10%)' },
          '10%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9, 0.9)', opacity: 0 },
          '10%': { transform: 'scale(1)', opacity: 1 },
        },
        bounceGentle: {
          '0%, 10%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        // Modern gradient patterns
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh':
          'linear-gradient(45deg, transparent 25%, rgba(255, 255, 255, 0.2) 25%, rgba(255, 255, 255, 0.75) 75%, transparent 75%), linear-gradient(45deg, transparent 25%, rgba(255, 255, 255, 0.2) 25%, rgba(255, 255, 255, 0.75) 75%, transparent 75%)',
        'gradient-noise':
          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
      },
      backdropBlur: {
        xs: '2px', // Extra small blur for subtle effects
      },
      boxShadow: {
        glow: '0 0 0 0 rgba(255, 255, 255, 0.1)',
        'glow-lg': '0 0 0 40px rgba(255, 255, 255, 0.15)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
      },
      screens: {
        xs: '375px', // Custom breakpoint for small devices
        sm: '640px', // Small devices
        md: '768px', // Medium devices
        lg: '1024px', // Large devices
        xl: '1280px', // Extra-large devices
        '2xl': '1536px', // Ultra-large devices
      },
    },
  },
  plugins: [],
};