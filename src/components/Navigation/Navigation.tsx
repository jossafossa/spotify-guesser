import { useState } from "react";
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

export const Navigation = () => {
  const { t } = useTranslation();

  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
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

  const handlePlay = () => deviceId && play(deviceId);
  const handlePause = () => deviceId && pause(deviceId);
  const handleNext = () => deviceId && next(deviceId);
  const handlePrevious = () => deviceId && previous(deviceId);

  const handleCorrect = () => {
    if (!deviceId) return;
    setCorrectCount(correctCount + 1);
    next(deviceId);
    showPositiveEffect();
  };

  const handleInCorrect = () => {
    if (!deviceId) return;
    setIncorrectCount(incorrectCount + 1);
    next(deviceId);
    showNegativeEffect();
  };

  const tooltip = undefined;

  const showPositiveEffect = () => {
    setPositiveEffect(true);
    setTimeout(() => setPositiveEffect(false), 1000);
  };

  const showNegativeEffect = () => {
    setNegativeEffect(true);
    setTimeout(() => setNegativeEffect(false), 1000);
  };

  return (
    <div className={styles.navigation}>
      <div className={styles.negative}>
        <Stack horizontal gap="large" justify="center" align="center">
          <Count variant="negative" count={incorrectCount} />

          <Button
            title={t("incorrect_track")}
            variant="negative"
            type="icon"
            size="large"
            onClick={handleInCorrect}
            disabled={!deviceId}
            tooltip={tooltip}
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
            onClick={handlePrevious}
            disabled={!deviceId}
            tooltip={tooltip}
          >
            <FontAwesomeIcon icon={faBackward} />
          </Button>

          {isPlaying ? (
            <Button
              title={t("pause_track")}
              type="icon"
              size="large"
              onClick={handlePause}
              disabled={!deviceId}
              tooltip={tooltip}
            >
              <FontAwesomeIcon icon={faPause} />
            </Button>
          ) : (
            <Button
              title={t("play_track")}
              type="icon"
              size="large"
              onClick={handlePlay}
              disabled={!deviceId}
              tooltip={tooltip}
            >
              <FontAwesomeIcon icon={faPlay} />
            </Button>
          )}

          <Button
            title={t("next_track")}
            type="icon"
            size="large"
            onClick={handleNext}
            disabled={!deviceId}
            tooltip={tooltip}
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
            onClick={handleCorrect}
            disabled={!deviceId}
            tooltip={tooltip}
          >
            {positiveEffect && <ConfettiExplosion />}
            <FontAwesomeIcon icon={faThumbsUp} />
          </Button>

          <Count variant="positive" count={correctCount} />
        </Stack>
      </div>
    </div>
  );
};
