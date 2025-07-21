import { Preview } from "./components/Preview";
import { useGetActiveDeviceQuery, useGetCurrentPlaybackQuery } from "./store";
import { Stack } from "./components/Stack/Stack";
import styles from "./App.module.scss";
import { useTranslation } from "react-i18next";
import { skipToken } from "@reduxjs/toolkit/query";
import { Navigation } from "./components/Navigation";
import { HistoryProvider } from "./components/HistoryProvider";
import { Header } from "./components/Header";

function App() {
  const { t } = useTranslation();

  const { data: device, isLoading } = useGetActiveDeviceQuery();

  const { data: currentPlayback } = useGetCurrentPlaybackQuery(
    isLoading ? skipToken : undefined
  );

  const track = currentPlayback?.item;

  const deviceId = device?.id;

  const getError = () => {
    if (!deviceId) return t("no_device_connected");
    if (isLoading) return t("loading_device");
    if (!track) return t("no_track_playing");
  };

  const error = getError();

  return (
    <HistoryProvider>
      <main className={styles.screen}>
        <header className={styles.header}>
          <Header />
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
    </HistoryProvider>
  );
}

export default App;
