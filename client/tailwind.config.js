/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        accent: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.6s ease-out",
        "slide-left": "slideLeft 0.6s ease-out",
        "slide-right": "slideRight 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        "bounce-subtle": "bounceSubtle 0.6s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "float-medium": "floatMedium 6s ease-in-out infinite",
        "float-fast": "floatFast 4s ease-in-out infinite",
        "wave-flow": "waveFlow 10s linear infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "particle-float": "particleFloat 15s linear infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "rotate-hue": "rotateHue 20s linear infinite",
        "mesh-morph": "meshMorph 12s ease-in-out infinite",
        "hexagon-spin": "hexagonSpin 15s linear infinite",
        "grid-pulse": "gridPulse 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(180deg)" },
        },
        floatMedium: {
          "0%, 100%": { transform: "translateX(0px) translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateX(30px) translateY(-30px) rotate(120deg)" },
          "66%": { transform: "translateX(-20px) translateY(20px) rotate(240deg)" },
        },
        floatFast: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px) scale(1)" },
          "25%": { transform: "translateY(-15px) translateX(15px) scale(1.1)" },
          "75%": { transform: "translateY(15px) translateX(-15px) scale(0.9)" },
        },
        waveFlow: {
          "0%, 100%": { transform: "translateX(-100%) skewX(0deg)", opacity: "0.1" },
          "50%": { transform: "translateX(100%) skewX(-5deg)", opacity: "0.3" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        particleFloat: {
          "0%": { transform: "translateY(0px) translateX(0px) scale(0)", opacity: "0" },
          "10%": { opacity: "1", transform: "scale(1)" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-100vh) translateX(50px) scale(0)", opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.1", transform: "scale(1)" },
          "50%": { opacity: "0.3", transform: "scale(1.05)" },
        },
        rotateHue: {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        meshMorph: {
          "0%, 100%": { 
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            transform: "rotate(0deg) scale(1)"
          },
          "25%": { 
            borderRadius: "30% 70% 40% 60% / 50% 60% 40% 50%",
            transform: "rotate(90deg) scale(1.1)"
          },
          "50%": { 
            borderRadius: "70% 30% 60% 40% / 40% 70% 30% 60%",
            transform: "rotate(180deg) scale(0.9)"
          },
          "75%": { 
            borderRadius: "40% 60% 70% 30% / 30% 40% 60% 70%",
            transform: "rotate(270deg) scale(1.05)"
          },
        },
        hexagonSpin: {
          "0%": { transform: "rotate(0deg) scale(1)", opacity: "0.1" },
          "50%": { transform: "rotate(180deg) scale(1.2)", opacity: "0.2" },
          "100%": { transform: "rotate(360deg) scale(1)", opacity: "0.1" },
        },
        gridPulse: {
          "0%, 100%": { opacity: "0.05", transform: "scale(1)" },
          "50%": { opacity: "0.15", transform: "scale(1.02)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium: "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        strong: "0 8px 30px -5px rgba(0, 0, 0, 0.15), 0 20px 25px -8px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
