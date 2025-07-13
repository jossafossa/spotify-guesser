import { useEffect, useState } from "react";
import { Preview } from "./components/Preview";
import {
  api,
  useGetActiveDeviceQuery,
  useGetCurrentPlaybackQuery,
  useNextMutation,
  usePauseMutation,
  usePlayMutation,
  usePreviousMutation,
} from "./store";
import { Button } from "./components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faForward,
  faPause,
  faPlay,
  faRefresh,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { Stack } from "./components/Stack/Stack";
import styles from "./App.module.scss";
import { useTranslation } from "react-i18next";
import { LanguageSwitch } from "./components/LanguageSwitch";
import { Count } from "./components/Count";
import { skipToken } from "@reduxjs/toolkit/query";

function App() {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const { t } = useTranslation();

  const { data: device, isLoading } = useGetActiveDeviceQuery();

  const { data: currentPlayback } = useGetCurrentPlaybackQuery(
    isLoading ? skipToken : undefined
  );
  const [play] = usePlayMutation();
  const [pause] = usePauseMutation();
  const [next] = useNextMutation();
  const [previous] = usePreviousMutation();
  const track = currentPlayback?.item;

  useEffect(() => {
    setIsVisible(false);
  }, [track?.id]);

  const deviceId = device?.id;

  const isPlaying = currentPlayback?.is_playing;

  const handleCorrect = () => {
    if (!deviceId) return;
    setCorrectCount(correctCount + 1);
    next(deviceId);
  };

  const handleInCorrect = () => {
    if (!deviceId) return;
    setIncorrectCount(incorrectCount + 1);
    previous(deviceId);
  };

  const handleReload = () => {
    api.logOut();
    window.location.reload();
  };

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <LanguageSwitch />
        <Button onClick={handleReload}>
          <FontAwesomeIcon icon={faRefresh} />
        </Button>
      </header>
      <section className={styles.preview}>
        {track ? (
          <Preview track={track} isVisible={isVisible} />
        ) : (
          t("no_track_playing")
        )}
      </section>
      {deviceId && (
        <Stack vertical gap="large" justify="center">
          <Stack horizontal gap="large" justify="center">
            <Button
              variant="secondary"
              onClick={() => setIsVisible(!isVisible)}
              size="large"
            >
              {isVisible ? t("hide_preview") : t("show_preview")}
            </Button>
          </Stack>
          <Stack horizontal gap="large" justify="center" align="center">
            <Count variant="negative">{incorrectCount}</Count>
            <Button
              variant="negative"
              type="icon"
              size="large"
              onClick={handleInCorrect}
            >
              <FontAwesomeIcon icon={faThumbsDown} />
            </Button>

            <Button type="icon" size="large" onClick={() => previous(deviceId)}>
              <FontAwesomeIcon icon={faBackward} />
            </Button>
            {isPlaying ? (
              <Button type="icon" size="large" onClick={() => pause(deviceId)}>
                <FontAwesomeIcon icon={faPause} />
              </Button>
            ) : (
              <Button type="icon" size="large" onClick={() => play(deviceId)}>
                <FontAwesomeIcon icon={faPlay} />
              </Button>
            )}
            <Button type="icon" size="large" onClick={() => next(deviceId)}>
              <FontAwesomeIcon icon={faForward} />
            </Button>

            <Button
              variant="positive"
              type="icon"
              size="large"
              onClick={handleCorrect}
            >
              <FontAwesomeIcon icon={faThumbsUp} />
            </Button>

            <Count variant="positive">{correctCount}</Count>
          </Stack>
        </Stack>
      )}
    </main>
  );
}

export default App;
