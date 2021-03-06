module.exports = {
    "env": {
        "node": true,
        "browser": true,
    },
    "extends": "airbnb-base",
    "globals": {
        "describe": true,
        "it": true,
    },
    "rules": {
        "no-underscore-dangle": "off",
        "object-curly-newline": "off",
        "no-confusing-arrow": "off",
        "no-prototype-builtins": "off",
        "class-methods-use-this": "off",
        "prefer-rest-params": "off",
    }
};