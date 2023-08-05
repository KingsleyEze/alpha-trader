module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended"],
  rules: {
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["Header", "Button", "Card", "Input", "Select", "Option"],
      },
    ],
  },
};
