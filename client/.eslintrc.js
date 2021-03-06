module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:jsx-a11y/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module",
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname,
    "alwaysTryTypes": true
  },
  "plugins": [
    "react",
    "@typescript-eslint",
    "react-hooks",
    "import"
  ],
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [
        ".ts",
        ".tsx"
      ]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": __dirname + '/tsconfig.json'
      }
    }
  },
  "rules": {
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": [
      "error"
    ],
    "react/jsx-filename-extension": [
      "warn",
      {
        "extensions": [
          ".tsx"
        ]
      }
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "ts": "never",
        "tsx": "never"
      }
    ],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": [
      "error"
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true
      }
    ],
    "max-len": [
      "warn",
      {
        "code": 95
      }
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "import/prefer-default-export": "off",
    "react/prop-types": "off",
    "array-bracket-spacing": [
      2,
      "never"
    ],
    "array-callback-return": 2,
    "arrow-body-style": 0,
    "arrow-parens": [
      2,
      "always"
    ],
    "arrow-spacing": [
      2,
      {
        "before": true,
        "after": true
      }
    ],
    "block-scoped-var": 2,
    "brace-style": [
      2,
      "1tbs",
      {
        "allowSingleLine": false
      }
    ],
    "capitalized-comments": 0,
    "class-methods-use-this": 0,
    "comma-dangle": [
      2,
      "always-multiline"
    ],
    "comma-spacing": [
      2,
      {
        "before": false,
        "after": true
      }
    ],
    "comma-style": [
      2,
      "last"
    ],
    "computed-property-spacing": [
      2,
      "never"
    ],
    "consistent-return": 1,
    "consistent-this": [
      2,
      "self"
    ],
    "constructor-super": 2,
    "curly": [
      2,
      "all"
    ],
    "dot-location": [
      2,
      "object"
    ],
    "dot-notation": 2,
    "eqeqeq": [
      2,
      "smart"
    ],
    "func-call-spacing": [
      2,
      "never"
    ],
    "func-name-matching": 0,
    "func-names": 2,
    "func-style": [
      2,
      "declaration",
      {
        "allowArrowFunctions": true
      }
    ],
    "import/order": [
      "error",
      {
        "newlines-between": "always-and-inside-groups",
        "groups": [
          "builtin",
          "external",
          [
            "internal",
            "parent"
          ],
          "sibling",
          "index"
        ]
      }
    ],
    "jsx-quotes": [
      2,
      "prefer-single"
    ],
    "key-spacing": [
      2,
      {
        "beforeColon": false,
        "afterColon": true,
        "mode": "strict"
      }
    ],
    "keyword-spacing": [
      2,
      {
        "before": true,
        "after": true,
        "overrides": {}
      }
    ],
    "line-comment-position": 0,
    "linebreak-style": 2,
    "lines-around-comment": [
      2,
      {
        "beforeBlockComment": true,
        "beforeLineComment": true,
        "allowBlockStart": true,
        "allowBlockEnd": true
      }
    ],
    "max-nested-callbacks": [
      2,
      {
        "max": 2
      }
    ],
    "max-statements-per-line": [
      2,
      {
        "max": 1
      }
    ],
    "multiline-ternary": [
      1,
      "never"
    ],
    "new-cap": 2,
    "new-parens": 2,
    "newline-before-return": 0,
    "newline-per-chained-call": 0,
    "no-alert": 2,
    "no-array-constructor": 2,
    "no-await-in-loop": 2,
    "no-caller": 2,
    "no-case-declarations": 2,
    "no-class-assign": 2,
    "no-compare-neg-zero": 2,
    "no-cond-assign": [
      2,
      "except-parens"
    ],
    "no-confusing-arrow": 2,
    "no-console": 2,
    "no-const-assign": 2,
    "no-constant-condition": 2,
    "no-debugger": 2,
    "no-div-regex": 2,
    "no-dupe-args": 2,
    "no-dupe-class-members": 2,
    "no-dupe-keys": 2,
    "no-duplicate-case": 2,
    "no-duplicate-imports": [
      2,
      {
        "includeExports": true
      }
    ],
    "no-else-return": 2,
    "no-empty": 2,
    "no-empty-function": 2,
    "no-empty-pattern": 2,
    "no-eval": 2,
    "no-ex-assign": 2,
    "no-extend-native": 2,
    "no-extra-bind": 2,
    "no-extra-label": 2,
    "no-extra-parens": 0,
    "no-extra-semi": 2,
    "no-fallthrough": 2,
    "no-floating-decimal": 2,
    "no-func-assign": 2,
    "no-global-assign": 2,
    "no-implicit-coercion": 2,
    "no-implicit-globals": 0,
    "no-implied-eval": 2,
    "no-inner-declarations": 0,
    "no-invalid-regexp": 2,
    "no-irregular-whitespace": 2,
    "no-iterator": 2,
    "no-labels": 2,
    "no-lone-blocks": 2,
    "no-lonely-if": 2,
    "no-loop-func": 2,
    "no-magic-numbers": [
      0,
      {
        "ignore": [
          -1,
          0,
          1,
          2
        ],
        "enforceConst": true,
        "detectObjects": true
      }
    ],
    "no-mixed-operators": [
      2,
      {
        "allowSamePrecedence": false
      }
    ],
    "no-mixed-spaces-and-tabs": 2,
    "no-multi-assign": 2,
    "no-multi-spaces": [
      2,
      {
        "exceptions": {
          "Property": false
        }
      }
    ],
    "no-multi-str": 0,
    "no-multiple-empty-lines": [
      2,
      {
        "max": 1
      }
    ],
    "no-native-reassign": 2,
    "no-negated-condition": 2,
    "no-nested-ternary": 2,
    "no-new": 2,
    "no-new-func": 2,
    "no-new-object": 2,
    "no-new-symbol": 2,
    "no-new-wrappers": 2,
    "no-octal-escape": 2,
    "no-param-reassign": 2,
    "no-process-env": 0,
    "no-process-exit": 2,
    "no-proto": 2,
    "no-redeclare": 2,
    "no-return-assign": [
      2,
      "always"
    ],
    "no-return-await": 2,
    "no-script-url": 2,
    "no-self-assign": [
      2,
      {
        "props": true
      }
    ],
    "no-self-compare": 2,
    "no-sequences": 2,
    "no-spaced-func": 2,
    "no-tabs": 0,
    "no-template-curly-in-string": 2,
    "no-ternary": 0,
    "no-this-before-super": 2,
    "no-throw-literal": 2,
    "no-trailing-spaces": [
      2,
      {
        "skipBlankLines": false
      }
    ],
    "no-undef-init": 2,
    "no-undefined": 2,
    "no-underscore-dangle": 2,
    "no-unexpected-multiline": 2,
    "no-unmodified-loop-condition": 2,
    "no-unneeded-ternary": [
      2,
      {
        "defaultAssignment": false
      }
    ],
    "no-unreachable": 2,
    "no-unsafe-finally": 2,
    "no-unsafe-negation": 2,
    "no-unused-expressions": 2,
    "no-unused-vars": [
      2,
      {
        "vars": "all",
        "args": "after-used"
      }
    ],
    "no-useless-computed-key": 2,
    "no-useless-concat": 2,
    "no-useless-constructor": 2,
    "no-useless-escape": 2,
    "no-useless-rename": 2,
    "no-useless-return": 2,
    "no-var": 0,
    "no-void": 2,
    "no-warning-comments": 1,
    "no-whitespace-before-property": 2,
    "no-with": 2,
    "object-curly-newline": 0,
    "object-curly-spacing": [
      2,
      "never"
    ],
    "object-property-newline": [
      2,
      {
        "allowMultiplePropertiesPerLine": true
      }
    ],
    "react/jsx-boolean-value": [
      2,
      "always"
    ],
    "react/jsx-closing-bracket-location": [
      2,
      {
        "location": "tag-aligned"
      }
    ],
    "react/jsx-curly-spacing": [
      2,
      "never"
    ],
    "react/jsx-equals-spacing": [
      2,
      "never"
    ],
    "react/jsx-first-prop-new-line": [
      2,
      "multiline"
    ],
    "react/jsx-handler-names": 0,
    "react/jsx-indent": [
      2,
      4
    ],
    "react/jsx-indent-props": [
      2,
      4
    ],
    "react/jsx-key": 2,
    "react/jsx-max-props-per-line": [
      2,
      {
        "maximum": 1
      }
    ],
    "react/jsx-no-bind": 0,
    "react/jsx-no-comment-textnodes": 2,
    "react/jsx-no-duplicate-props": [
      2,
      {
        "ignoreCase": false
      }
    ],
    "react/jsx-no-literals": 0,
    "react/jsx-no-target-blank": 2,
    "react/jsx-no-undef": 2,
    "react/jsx-pascal-case": 2,
    "react/jsx-tag-spacing": [
      2,
      {
        "closingSlash": "never",
        "beforeSelfClosing": "never",
        "afterOpening": "never"
      }
    ],
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "react/jsx-wrap-multilines": 2,
    "react/no-array-index-key": 1,
    "react/no-children-prop": 2,
    "react/no-danger": 0,
    "react/no-danger-with-children": 2,
    "react/no-deprecated": 1,
    "react/no-did-mount-set-state": 2,
    "react/no-did-update-set-state": 2,
    "react/no-direct-mutation-state": 2,
    "react/no-find-dom-node": 1,
    "react/no-is-mounted": 2,
    "react/no-multi-comp": [
      2,
      {
        "ignoreStateless": true
      }
    ],
    "react/no-render-return-value": 2,
    "react/no-set-state": 0,
    "react/no-string-refs": 0,
    "react/no-unescaped-entities": 2,
    "react/no-unknown-property": 2,
    "react/no-unused-prop-types": [
      1,
      {
        "skipShapeProps": true
      }
    ],
    "react/prefer-es6-class": 2,
    "react/prefer-stateless-function": 2,
    "react/require-default-props": 0,
    "react/require-optimization": 1,
    "react/require-render-return": 2,
    "react/self-closing-comp": 2,
    "react/sort-comp": 0,
    "react/style-prop-object": 2,
    "semi": [
      2,
      "always"
    ],
    "semi-spacing": [
      2,
      {
        "before": false,
        "after": true
      }
    ],
    "sort-imports": 0,
    "sort-keys": 0,
    "space-before-blocks": [
      2,
      "always"
    ],
    "space-before-function-paren": [
      2,
      {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "always"
      }
    ],
    "space-in-parens": [
      2,
      "never"
    ],
    "space-infix-ops": 2,
    "space-unary-ops": [
      2,
      {
        "words": true,
        "nonwords": false
      }
    ],
    "symbol-description": 2,
    "template-curly-spacing": [
      2,
      "never"
    ],
    "valid-typeof": [
      2,
      {
        "requireStringLiterals": false
      }
    ],
    "vars-on-top": 0,
    "wrap-iife": [
      2,
      "outside"
    ],
    "wrap-regex": 2,
    "yoda": [
      2,
      "never",
      {
        "exceptRange": false,
        "onlyEquality": false
      }
    ]
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "parserOptions": {
        "alwaysTryTypes": true,
        "project": ["./tsconfig.json"],
        "tsconfigRootDir": __dirname,
      }
    }
  ]
}
