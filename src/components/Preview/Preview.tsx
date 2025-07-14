import { useTranslation } from "react-i18next";
import { Stack } from "../Stack";
import styles from "./Preview.module.scss";
import aiImage from "../../assets/images/not-ai.png";
import { useEffect, useState } from "react";
import { RevealButton } from "../RevealButton";
import { Track, TrackItem } from "@spotify/web-api-ts-sdk";
import { Button } from "../Button";

const isTrack = (item: TrackItem): item is Track => {
  return (
    item && typeof item === "object" && "name" in item && "artists" in item
  );
};
type PreviewProps = {
  track: TrackItem;
  isVisible?: boolean;
};

export const Preview = ({ track }: PreviewProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [coverVisible, setCoverVisible] = useState(false);
  const [artistVisible, setArtistVisible] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);

  useEffect(() => {
    setCoverVisible(false);
    setArtistVisible(false);
    setNameVisible(false);
    setIsVisible(false);
  }, [
    track.id,
    setCoverVisible,
    setArtistVisible,
    setNameVisible,
    setIsVisible,
  ]);

  if (!isTrack(track)) {
    return <div>{t("error_invalid_track_data")}</div>;
  }

  const name = track.name;
  const artist = track.artists[0].name;
  const image = track.album.images[0].url;

  return (
    <Stack vertical gap="medium" align="center">
      <h1>{t("now_playing")}</h1>

      <picture className={styles.image}>
        <img src={coverVisible || isVisible ? image : aiImage} alt={name} />

        {!isVisible && (
          <RevealButton
            onClick={() => setCoverVisible(!coverVisible)}
            isVisible={coverVisible}
            className={styles.imageButton}
          />
        )}
      </picture>

      <Stack horizontal justify="center" align="center" gap="small">
        <h2 className={styles.title}>
          {artistVisible || isVisible ? artist : t("artist_name")}
        </h2>

        {!isVisible && (
          <RevealButton
            onClick={() => setArtistVisible(!artistVisible)}
            isVisible={artistVisible}
          />
        )}
      </Stack>

      <Stack horizontal justify="center" align="center" gap="small">
        <h3 className={styles.title}>
          {nameVisible || isVisible ? name : t("song_name")}
        </h3>

        {!isVisible && (
          <RevealButton
            onClick={() => setNameVisible(!nameVisible)}
            isVisible={nameVisible}
          />
        )}
      </Stack>

      <Stack horizontal gap="large" justify="center">
        <Button
          variant="secondary"
          onClick={() => setIsVisible(!isVisible)}
          size="medium"
        >
          {isVisible ? t("hide_preview") : t("show_preview")}
        </Button>
      </Stack>
    </Stack>
  );
};
