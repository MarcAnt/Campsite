/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      keyframes: {
        fadein: {
          "0%": {
            // opacity: 0,
            transform: "scaleY(0px)",
          },
          "100%": {
            // opacity: 1,
            transform: "scaleY(10px)",
          },
        },
      },
      animation: {
        fadeIn: "fadein 1s ease-in-out",
      },
    },
  },
  plugins: [],
};
