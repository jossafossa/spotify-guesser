import { useTranslation } from "react-i18next";
import { Stack } from "../Stack";
import styles from "./Preview.module.scss";
import placeholder from "../../assets/images/placeholder.svg";
import { useEffect, useState } from "react";
import { RevealButton } from "../RevealButton";
import { Track, TrackItem } from "@spotify/web-api-ts-sdk";
import { Button } from "../Button";
import classNames from "classnames";
import { BlurryImage } from "../BlurryImage";

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
      <BlurryImage
        className={styles.picture}
        imageclassName={styles.image}
        src={coverVisible || isVisible ? image : placeholder}
        alt={name}
      >
        {!isVisible && (
          <RevealButton
            onClick={() => setCoverVisible(!coverVisible)}
            isVisible={coverVisible}
            size="large"
            className={styles.imageButton}
          />
        )}
      </BlurryImage>

      <h2 className={styles.title}>
        {nameVisible || isVisible ? name : t("song_name")}
        {!isVisible && (
          <span className={styles.revealButton}>
            <RevealButton
              onClick={() => setNameVisible(!nameVisible)}
              isVisible={nameVisible}
              className={styles.revealButton}
            />
          </span>
        )}
      </h2>

      <h4 className={classNames(styles.title, styles.subtitle)}>
        {artistVisible || isVisible ? artist : t("artist_name")}
        {!isVisible && (
          <span className={styles.revealButton}>
            <RevealButton
              onClick={() => setArtistVisible(!artistVisible)}
              isVisible={artistVisible}
            />
          </span>
        )}
      </h4>

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
