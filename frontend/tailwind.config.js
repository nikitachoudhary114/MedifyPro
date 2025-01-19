/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-bg": "#8851f8",
      },
    },
  },
  daisyui: {
    // Enable light and dark themes with custom colors
    themes: [
      {
        light: {
          primary: "#6b7280", // Grayish for primary
          secondary: "#1f2937", // Blackish for secondary
          border: "#6b7280",
          neutral: "#3d4451",
          "base-100": "#ffffff",
        },
        dark: {
          primary: "#4b5563", // Grayish primary for dark mode
          secondary: "#f59e0b", // Whiteish for secondary in dark mode
          border: "#f3f4f6",
          neutral: "#1e293b",
          "base-100": "#0f172a",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}
