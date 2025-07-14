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

export const Navigation = () => {
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);

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
  };

  const handleInCorrect = () => {
    if (!deviceId) return;
    setIncorrectCount(incorrectCount + 1);
    previous(deviceId);
  };

  const tooltip = undefined;

  return (
    <div className={styles.navigation}>
      <div className={styles.negative}>
        <Stack horizontal gap="large" justify="center" align="center">
          <Count variant="negative">{incorrectCount}</Count>

          <Button
            variant="negative"
            type="icon"
            size="large"
            onClick={handleInCorrect}
            disabled={!deviceId}
            tooltip={tooltip}
          >
            <FontAwesomeIcon icon={faThumbsDown} />
          </Button>
        </Stack>
      </div>

      <div className={styles.controls}>
        <Stack horizontal gap="large" justify="center" align="center">
          <Button
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
            variant="positive"
            type="icon"
            size="large"
            onClick={handleCorrect}
            disabled={!deviceId}
            tooltip={tooltip}
          >
            <FontAwesomeIcon icon={faThumbsUp} />
          </Button>

          <Count variant="positive">{correctCount}</Count>
        </Stack>
      </div>
    </div>
  );
};
