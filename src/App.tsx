import { Preview } from "./components/Preview";
import {
  api,
  useGetActiveDeviceQuery,
  useGetCurrentPlaybackQuery,
} from "./store";
import { Button } from "./components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Stack } from "./components/Stack/Stack";
import styles from "./App.module.scss";
import { useTranslation } from "react-i18next";
import { LanguageSwitch } from "./components/LanguageSwitch";
import { skipToken } from "@reduxjs/toolkit/query";
import { Navigation } from "./components/Navigation";
import { useState } from "react";
import { Modal } from "./components/Modal";

function App() {
  const { t } = useTranslation();

  const { data: device, isLoading } = useGetActiveDeviceQuery();

  const { data: currentPlayback } = useGetCurrentPlaybackQuery(
    isLoading ? skipToken : undefined
  );
  const [showHelp, setShowHelp] = useState(false);

  const track = currentPlayback?.item;

  const deviceId = device?.id;

  const handleReload = () => {
    api.logOut();

    window.location.href = window.location.origin + window.location.pathname;
  };

  const getError = () => {
    if (!deviceId) return t("no_device_connected");
    if (isLoading) return t("loading_device");
    if (!track) return t("no_track_playing");
  };

  const error = getError();

  return (
    <main className={styles.screen}>
      {showHelp && (
        <Modal title={t("help_title")} onClose={() => setShowHelp(false)}>
          {t("help_text")}
        </Modal>
      )}
      <header className={styles.header}>
        <Stack horizontal gap="large" justify="between" align="center">
          <LanguageSwitch />

          <Stack horizontal gap="small" align="center">
            <Button
              type="icon"
              onClick={() => setShowHelp(true)}
              title={t("help")}
            >
              <FontAwesomeIcon icon={faQuestion} />
            </Button>

            <Button type="icon" onClick={handleReload} title={t("reload")}>
              <FontAwesomeIcon icon={faRefresh} />
            </Button>
          </Stack>
        </Stack>
      </header>

      <section className={styles.preview}>
        {!error && track ? (
          <Preview track={track} />
        ) : (
          <div className={styles.error}>{error}</div>
        )}
      </section>

      <Stack vertical gap="large" justify="center">
        <Navigation />
      </Stack>
    </main>
  );
}

export default App;
