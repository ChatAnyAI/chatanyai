process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const eslintConfig = {
  //  extends: [require.resolve('eslint-config-react-app/base')],
  plugins: [
    "eslint-plugin-unused-imports"
  ],
  rules: {
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
          "warn",
          {
              "vars": "all",
              "varsIgnorePattern": "^_",
              "args": "after-used",
              "argsIgnorePattern": "^_",
          },
      ]
  },
};

module.exports = eslintConfig;
