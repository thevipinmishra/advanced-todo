/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        container: {
            center: true,
            padding: '1.5rem'
        },
        fontFamily: {
            sans: ["JetBrains Mono", 'monospace']
        }
    },
  },
  plugins: [],
};
