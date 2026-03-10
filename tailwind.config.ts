import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E2C675",
          dark: "#A8872A",
          metal: "#D4A843",
        },
        black: {
          DEFAULT: "#0A0A0A",
          soft: "#111111",
        },
        card: {
          DEFAULT: "#161616",
          hover: "#1C1C1C",
        },
      },
      fontFamily: {
        headline: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 30px rgba(201, 168, 76, 0.4)",
        "gold-sm": "0 0 15px rgba(201, 168, 76, 0.3)",
        "gold-lg": "0 0 50px rgba(201, 168, 76, 0.5)",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        "float-up": "floatUp 2s ease-in-out forwards",
        "pulse-gold": "goldGlow 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease forwards",
        "spin-slow": "spin 1.5s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(-60px)" },
        },
        goldGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(201, 168, 76, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(201, 168, 76, 0.6)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
