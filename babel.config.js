// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // 1️⃣ Expo preset con soporte para NativeWind
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],

      // 2️⃣ NativeWind como preset (no como plugin)
      "nativewind/babel",
    ],
    plugins: [
      // 3️⃣ Reanimated siempre debe ir aquí y al final
      "react-native-reanimated/plugin",
    ],
  };
};
