// i18next-parser.config.js

export default {
  contextSeparator: '_',
  // Key separator used in your translation keys

  createOldCatalogs: false,
  // Save the old catalogs to the `${localesPath}/${lang}_old` directory

  defaultNamespace: 'common',
  // Default namespace used in your i18next config

  defaultValue: (lng, ns, key) => {
    // Returns a default value for the translation key.
    // You can leave it empty for manual translation.
    // For example, return key so you can see the key in your app.
    if (lng === 'en') {
      return key;
    }
    return ''; // Or `[NEEDS TRANSLATION] ${key}`
  },

  indentation: 2,
  // Indentation of the catalog files

  keepRemoved: false,
  // Keep keys from the catalog that are no longer in code

  keySeparator: '.',
  // Key separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three keys involved.

  // see below for more details
  lexers: {
    tsx: ['JavascriptLexer'], // we're writing jsx inside of tsx
    // (optional) HMTLLexer, JavascriptLexer, TypescriptLexer, JsxLexer
    default: ['JavascriptLexer'],
  },

  lineEnding: 'auto',
  // Control the line ending. See options at https://github.com/ryanve/eol

  locales: ['en', 'nl'],
  // An array of the locales in your applications

  namespaceSeparator: ':',
  // Namespace separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`.

  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  // The path where the catalogs will be created.

  input: ['src/**/*.{js,jsx,ts,tsx}'],
  // An array of globs that describe where to look for source files
  // In your case, this is likely `src/App.tsx` or similar.

  sort: true,
  // Sort the translation keys
};