import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "off-white": "#FDFBF7",
        "game-board": "#D8E2DC",
        "monopoly-green": "#2ECC71",
        "monopoly-dark-green": "#27AE60",
        "monopoly-blue": "#3498DB",
        "monopoly-dark-blue": "#2980B9",
        "monopoly-red": "#FF4757",
        "monopoly-dark-red": "#C0392B",
        "monopoly-yellow": "#F1C40F",
        "monopoly-pink": "#FF69B4",
        "monopoly-orange": "#E67E22",
        "dark-blue": "#2C3E50",
        "text-main": "#2C3E50",
        "text-light": "#5D6D7E",
        "silver": "#BDC3C7",
        "gold": "#F39C12",
        "money-1": "#FAD7A0",
        "money-5": "#F5B7B1",
        "money-10": "#AED6F1",
        "money-20": "#ABEBC6",
        "money-50": "#D2B4DE",
        "money-100": "#F9E79F",
        "money-500": "#E67E22",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-fredoka)", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 40px -5px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
        button: "0 6px 0px 0px rgba(0,0,0,0.2)",
        "button-hover": "0 3px 0px 0px rgba(0,0,0,0.2)",
        floating:
          "0 30px 60px -12px rgba(0, 0, 0, 0.3), 0 18px 36px -18px rgba(0, 0, 0, 0.3)",
        piece: "5px 10px 15px rgba(0,0,0,0.2)",
        "piece-lg": "10px 20px 30px rgba(0,0,0,0.25)",
      },
      backgroundImage: {
        "money-pattern":
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0icmdiYSgwLDAsMCwwLjA1KSIvPjwvc3ZnPg==')",
      },
      animation: {
        "spin-slow": "spin-slow 8s linear infinite",
        gradient: "gradient 3s linear infinite",
      },
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
