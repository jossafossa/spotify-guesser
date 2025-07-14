import { useTranslation } from "react-i18next";
import { Select } from "../Select";

export const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <Select onChange={handleLanguageChange} value={i18n.language}>
      <option value="en">English</option>
      <option value="nl">Nederlands</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
      <option value="es">Español</option>
    </Select>
  );
};
