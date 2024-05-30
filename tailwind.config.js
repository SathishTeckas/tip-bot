const defaultTheme = require("tailwindcss/defaultConfig");
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  important: true,
  theme: {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      blackBackground: "#1D202B",
      textBackground: "#063F46",
      navBarBackground: "#B3D1D1",
      greenBackground: "#063F46",
      greenText: "#48B545",
      textBackgroundLight: "#C3DADA",
      textColorWhite: "#EBEFEC",
      textColorBlack: "#1D202B",
      green1: "#21807080",
      backgroundColorLight: "#DAE8E8",
      backgroundColorLight2: "rgba(6, 63, 70, 0.05)",
      indigo: colors.indigo,
      black: colors.black,
      slate: colors.slate,
      green: colors.green,
      blue: colors.blue,
      cyan: colors.cyan,
      red: colors.red,
      logoColor: "#89F050",
      primary: "#3B81F6",
      white: "#ffffff",
      text: {
        DEFAULT: "#1F2937",
        light: "#6C7281",
      },
      light: {
        DEFAULT: "#FAFBFC",
        lighter: "#F3F4F6",
      },
    },
    extend: {},
  },
  plugins: [],
};
