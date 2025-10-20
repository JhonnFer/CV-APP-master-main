// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 🚨 Asegúrate de que withNativeWind envuelva la configuración de Metro
module.exports = withNativeWind(config, {
  // input: './global.css' (Si comentaste todo el contenido del archivo, puedes dejarlo así)
});