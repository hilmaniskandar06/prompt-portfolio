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
                google: {
                    blue: "#4285F4",
                    red: "#EA4335",
                    yellow: "#FBBC05",
                    green: "#34A853",
                },
                background: "#FFFFFF",
                foreground: "#202124",
                muted: "#5F6368",
                border: "#DADCE0",
            },
            fontFamily: {
                sans: ["Inter", "Roboto", "system-ui", "sans-serif"],
            },
            boxShadow: {
                card: "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
                "card-hover": "0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)",
                elevated: "0 4px 6px -1px rgba(60, 64, 67, 0.1), 0 2px 4px -1px rgba(60, 64, 67, 0.06)",
            },
            borderRadius: {
                DEFAULT: "8px",
                lg: "12px",
                xl: "16px",
            },
        },
    },
    plugins: [],
};

export default config;
