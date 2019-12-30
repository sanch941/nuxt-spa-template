module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint',
        allowImportExportEverywhere: true
    },
    extends: [
        '@nuxtjs',
        'prettier',
        'prettier/vue',
        'plugin:prettier/recommended',
        'plugin:nuxt/recommended',
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    plugins: ['prettier'],
    // add your custom rules here
    rules: {
        'nuxt/no-cjs-in-config': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-vars': 1,
        'promise/param-names': 0
    }
};
