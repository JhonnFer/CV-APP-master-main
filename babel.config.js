// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      "nativewind/babel", // Debe estar aquí, como un preset
    ],
    plugins: [
      "react-native-reanimated/plugin", 
      // Si tienes otros plugins, van aquí.
    ],
  };
};