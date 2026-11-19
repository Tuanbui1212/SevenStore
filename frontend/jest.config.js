module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "^axios$": "<rootDir>/node_modules/axios/dist/node/axios.cjs",
    "^react-router-dom$": "<rootDir>/node_modules/react-router-dom/dist/index.js",
    "^react-router/dom$": "<rootDir>/node_modules/react-router/dist/development/dom-export.js",
    "^react-router$": "<rootDir>/node_modules/react-router/dist/development/index.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg|JPG)$": "<rootDir>/src/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "<rootDir>/node_modules/react-scripts/config/jest/babelTransform.js",
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\](?!axios|react-router|react-router-dom).+\\.(js|jsx|mjs|cjs|ts|tsx)$",
  ],
  resetMocks: true,
};
