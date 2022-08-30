module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: "eslint:recommended",
  overrides: [],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "no-unused-vars": "off",
    "no-use-before-define": "off",
    "react/react-in-jsx-scope": "off",
    "no-var": "error",
    quotes: ["warn", "double"],
    "no-extra-semi": "error",
    "linebreak-style": ["error", "unix"],
    "array-bracket-spacing": [2, "never"],
    "comma-dangle": [2, "never"],
    "comma-spacing": [2, { before: false, after: true }],
    "comma-style": [2, "last"],
    "computed-property-spacing": [2, "never"]
  }
};
