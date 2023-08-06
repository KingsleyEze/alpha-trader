module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended"],
  plugins: ["import"],

  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".js", ".vue", ".ts"],
      },
    },
  },
  rules: {
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["Header", "Button", "Card", "Input", "Select", "Option"],
      },
    ],
    "import/no-unresolved": "error",
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        vue: "never",
        ts: "never",
      },
    ],
  },
};
