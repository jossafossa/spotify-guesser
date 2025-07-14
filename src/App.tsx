import { useEffect, useState } from "react";
import { Preview } from "./components/Preview";
import {
  api,
  useGetActiveDeviceQuery,
  useGetCurrentPlaybackQuery,
} from "./store";
import { Button } from "./components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Stack } from "./components/Stack/Stack";
import styles from "./App.module.scss";
import { useTranslation } from "react-i18next";
import { LanguageSwitch } from "./components/LanguageSwitch";
import { skipToken } from "@reduxjs/toolkit/query";
import { Navigation } from "./components/Navigation";

function App() {
  const { t } = useTranslation();

  const { data: device, isLoading } = useGetActiveDeviceQuery();

  const { data: currentPlayback } = useGetCurrentPlaybackQuery(
    isLoading ? skipToken : undefined
  );

  const track = currentPlayback?.item;

  useEffect(() => {
    setIsVisible(false);
  }, [track?.id]);

  const deviceId = device?.id;

  const handleReload = () => {
    api.logOut();
    window.location.reload();
  };

  const getError = () => {
    if (!deviceId) return t("no_device_connected");
    if (isLoading) return t("loading_device");
    if (!track) return t("no_track_playing");
  };

  console.log({ deviceId: !deviceId, track });

  const error = getError();

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <Stack horizontal gap="large" justify="between" align="center">
          <LanguageSwitch />
          <Button type="icon" onClick={handleReload}>
            <FontAwesomeIcon icon={faRefresh} />
          </Button>
        </Stack>
      </header>

      <section className={styles.preview}>
        {!error && track ? (
          <Preview track={track} isVisible={isVisible} />
        ) : (
          error
        )}
      </section>

      <Stack vertical gap="large" justify="center">
        <Navigation />
      </Stack>
    </main>
  );
}

export default App;
