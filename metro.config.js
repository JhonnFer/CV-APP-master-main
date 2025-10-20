// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Envuelve Metro con NativeWind
module.exports = withNativeWind(config, {
  input: "./global.css", // Asegura que lea tu CSS global
});
