/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Ensures Tailwind scans all relevant files
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'], // Custom font for modern design
      },
      animation: {
        float: 'float 6s ease-in-out infinite', // Floating animation for interactive elements
        fadeUp: 'fadeUp 0.5s ease-out forwards', // Fade-up animation for smooth transitions
        slideIn: 'slideIn 0.3s ease-out forwards', // Slide-in animation for dynamic UI
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))', // Radial gradient for modern backgrounds
      },
      backdropBlur: {
        xs: '2px', // Extra small blur for subtle effects
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