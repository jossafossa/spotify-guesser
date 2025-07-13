import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  // Use the Http backend to load translations from your /public folder
  .use(HttpApi)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Default language
    lng: "en",
    // Fallback language if a translation is missing
    fallbackLng: "en",
    // Define the namespaces you will be using
    ns: ["common"],
    // Default namespace
    defaultNS: "common",

    // Debugging output in the console
    debug: true,

    // Backend options for i18next-http-backend
    backend: {
      // Path where translations will be loaded from
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    // React-specific options
    react: {
      // Use Suspense for lazy-loading translations
      useSuspense: true,
    },
  });

export default i18n;
