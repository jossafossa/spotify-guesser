import { useCallback, useEffect, useState } from "react";
import { Stack } from "../Stack";
import styles from "./Navigation.module.scss";
import {
  faBackward,
  faForward,
  faPause,
  faPlay,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../Button";
import { Count } from "../Count";
import {
  useGetActiveDeviceQuery,
  useGetCurrentPlaybackQuery,
  useNextMutation,
  usePauseMutation,
  usePlayMutation,
  usePreviousMutation,
} from "../../store";
import ConfettiExplosion from "react-confetti-explosion";
import { useTranslation } from "react-i18next";
import { useHistory } from "../HistoryProvider";

export const Navigation = () => {
  const { t } = useTranslation();

  const { history, addToHistory } = useHistory();

  const [positiveEffect, setPositiveEffect] = useState<boolean>(false);
  const [negativeEffect, setNegativeEffect] = useState<boolean>(false);

  const [play] = usePlayMutation();
  const [pause] = usePauseMutation();
  const [next] = useNextMutation();
  const [previous] = usePreviousMutation();

  const { data: device } = useGetActiveDeviceQuery();
  const { data: currentPlayback } = useGetCurrentPlaybackQuery();

  const deviceId = device?.id;
  const isPlaying = currentPlayback?.is_playing;

  const handleDeviceAction = useCallback(
    (action: (deviceId: string) => void) => {
      if (!deviceId) return;
      action(deviceId);
    },
    [deviceId]
  );

  const handleCorrect = useCallback(
    (correct: boolean) => {
      if (!deviceId) return;
      addToHistory(currentPlayback?.item?.id || "", correct);

      handleDeviceAction(next);
      showEffect(correct);
    },
    [deviceId, currentPlayback, addToHistory, handleDeviceAction, next]
  );

  const showEffect = (correct: boolean) => {
    const callback = correct ? setPositiveEffect : setNegativeEffect;

    callback(true);
    setTimeout(() => callback(false), 1000);
  };

  const correctSongs = history.filter((entry) => entry.correct).length;
  const incorrectSongs = history.filter((entry) => !entry.correct).length;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!deviceId) return;

      new Map<string, () => void>([
        ["ArrowLeft", () => handleDeviceAction(previous)],
        ["ArrowRight", () => handleDeviceAction(next)],
        ["ArrowUp", () => handleCorrect(true)],
        ["ArrowDown", () => handleCorrect(false)],
        ["Space", () => handleDeviceAction(isPlaying ? pause : play)],
      ]).get(event.code)?.();
    },
    [
      deviceId,
      handleCorrect,
      isPlaying,
      handleDeviceAction,
      play,
      pause,
      next,
      previous,
    ]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={styles.navigation}>
      <div className={styles.negative}>
        <Stack horizontal gap="large" justify="center" align="center">
          <Count variant="negative" count={incorrectSongs} />

          <Button
            title={t("incorrect_track")}
            variant="negative"
            type="icon"
            size="large"
            onClick={() => handleCorrect(false)}
            disabled={!deviceId}
          >
            {negativeEffect && (
              <ConfettiExplosion particleCount={25} colors={["gray"]} />
            )}
            <FontAwesomeIcon icon={faThumbsDown} />
          </Button>
        </Stack>
      </div>

      <div className={styles.controls}>
        <Stack horizontal gap="large" justify="center" align="center">
          <Button
            title={t("previous_track")}
            type="icon"
            size="large"
            onClick={() => handleDeviceAction(previous)}
            disabled={!deviceId}
          >
            <FontAwesomeIcon icon={faBackward} />
          </Button>

          {isPlaying ? (
            <Button
              title={t("pause_track")}
              type="icon"
              size="large"
              onClick={() => handleDeviceAction(pause)}
              disabled={!deviceId}
            >
              <FontAwesomeIcon icon={faPause} />
            </Button>
          ) : (
            <Button
              title={t("play_track")}
              type="icon"
              size="large"
              onClick={() => handleDeviceAction(play)}
              disabled={!deviceId}
            >
              <FontAwesomeIcon icon={faPlay} />
            </Button>
          )}

          <Button
            title={t("next_track")}
            type="icon"
            size="large"
            onClick={() => handleDeviceAction(next)}
            disabled={!deviceId}
          >
            <FontAwesomeIcon icon={faForward} />
          </Button>
        </Stack>
      </div>

      <div className={styles.positive}>
        <Stack horizontal gap="large" justify="center" align="center">
          <Button
            title={t("correct_track")}
            variant="positive"
            type="icon"
            size="large"
            onClick={() => handleCorrect(true)}
            disabled={!deviceId}
          >
            {positiveEffect && <ConfettiExplosion />}
            <FontAwesomeIcon icon={faThumbsUp} />
          </Button>

          <Count variant="positive" count={correctSongs} />
        </Stack>
      </div>
    </div>
  );
};
