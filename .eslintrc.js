module.exports = {
  "parser": "babel-eslint",
  "extends": [
    // "airbnb-base",
    "airbnb",
    "prettier"
  ],
  "env": {
    "browser": true,
    "node": true,
    "commonjs": true,
    "es6": true,
    "jest": true
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "prettier/prettier": "error",
    "react/jsx-filename-extension": [  //推荐使用jsx代替js
      "error",
      {
        "extensions": [
          ".js",
          ".jsx"
        ]
      }
    ],
    // "react/prefer-stateless-function": 0,
    "no-plusplus": 0,
    "no-console": 0,
    "no-constant-condition": ["error", { "checkLoops": false }],
    "class-methods-use-this": 0,
    "no-restricted-syntax": 0,
    "react/forbid-prop-types": 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'no-nested-ternary': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/no-array-index-key': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/prefer-stateless-function': 0,  // 只允许用函数组件声明
    'react/destructuring-assignment': 0,
    "linebreak-style": [0 ,"error", "windows"],
    "consistent-return": 0,
    "prefer-destructuring": 0,
    "import/prefer-default-export": 0,
    "no-param-reassign": 0,
    "import/named": 0,
    'import/no-extraneous-dependencies': 0,
    'no-unused-expressions': 0,
    'react/no-access-state-in-setstate': 0,
    'react/prop-types': 0,
    'react/jsx-wrap-multilines': 0,
    'func-names': 0,
    'no-undef': 0,
    'react/react-in-jsx-scope': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'array-callback-return': 0,
    'no-return-assign': 0,
    'no-loop-func': 0,
    'no-shadow': 0,
    'react/no-string-refs': 0,
    'no-useless-escape': 0,
    'no-underscore-dangle': 0,
    'no-extend-native': 0,
    'no-case-declarations': 0,
    'prefer-rest-params': 0,
    'radix': 0,
    'react/jsx-indent': 0
  },
  "plugins": [
    "react",
    "prettier"
  ],
  "globals": {
    "document": true,
    "navigator": true,
    "window":true,
    "node":true
  },
  "settings": {
    "import/resolver": {
      "node": {
         "extensions": [".js",".jsx"]
      }
    }
  }
};