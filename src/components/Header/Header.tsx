import {
  faAt,
  faHistory,
  faQuestion,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";
import { LanguageSwitch } from "../LanguageSwitch";
import { Stack } from "../Stack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "../../store";
import { Modal } from "../Modal";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useHistory } from "../HistoryProvider";
import { History } from "../History";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const HelpFooter = () => {
  const { t } = useTranslation();

  return (
    <Stack gap="small" align="center">
      <Button
        href="https://github.com/jossafossa/spotify-guesser"
        variant="secondary"
        type="icon"
        title="GitHub Repository"
      >
        <FontAwesomeIcon icon={faGithub} />
      </Button>

      <Button
        href="https://www.jossafossa.nl"
        variant="secondary"
        type="icon"
        title={t("author")}
      >
        <FontAwesomeIcon icon={faAt} />
      </Button>
    </Stack>
  );
};

export const Header = () => {
  const { t } = useTranslation();
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { history } = useHistory();

  const handleReload = () => {
    api.logOut();

    window.location.href = window.location.origin + window.location.pathname;
  };

  return (
    <Stack horizontal gap="large" justify="between" align="center">
      {showHelp && (
        <Modal
          title={t("help_title")}
          onClose={() => setShowHelp(false)}
          footer={<HelpFooter />}
        >
          {t("help_text")}
        </Modal>
      )}

      {showHistory && (
        <Modal title={t("history")} onClose={() => setShowHistory(false)}>
          <History history={history} />
        </Modal>
      )}

      <LanguageSwitch />

      <Stack horizontal gap="small" align="center">
        <Button
          type="icon"
          onClick={() => setShowHistory(true)}
          title={t("history")}
        >
          <FontAwesomeIcon icon={faHistory} />
        </Button>

        <Button type="icon" onClick={() => setShowHelp(true)} title={t("help")}>
          <FontAwesomeIcon icon={faQuestion} />
        </Button>

        <Button type="icon" onClick={handleReload} title={t("reload")}>
          <FontAwesomeIcon icon={faRefresh} />
        </Button>
      </Stack>
    </Stack>
  );
};
