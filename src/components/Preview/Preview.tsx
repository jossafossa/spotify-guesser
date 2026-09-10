import { useTranslation } from "react-i18next";
import { Stack } from "../Stack";
import styles from "./Preview.module.scss";
import placeholder from "../../assets/images/placeholder.svg";
import { PropsWithChildren, useState } from "react";
import { RevealButton } from "../RevealButton";
import { Track, TrackItem } from "@spotify/web-api-ts-sdk";
import { Button } from "../Button";
import { Clickable } from "../Clickable";
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

const TITLE_CAP = 55;
const ARTIST_CAP = 70;

type RevealProps = PropsWithChildren<{
  title: string;
  isInteractive: boolean;
  onToggle: () => void;
  className?: string;
}>;

// Turns its whole content into a reveal target instead of only the eye icon.
// Once the full preview is shown there is nothing left to reveal, so the
// content is rendered bare.
const Reveal = ({
  title,
  isInteractive,
  onToggle,
  className,
  children,
}: RevealProps) => {
  if (!isInteractive) return <>{children}</>;

  return (
    <Clickable
      className={classNames(styles.reveal, className)}
      title={title}
      onClick={onToggle}
    >
      {children}
    </Clickable>
  );
};

const capStringTo = (string: string, amountOfChars: number) => {
  return string.length > amountOfChars
    ? string.slice(0, amountOfChars) + "..."
    : string;
};

export const Preview = ({ track }: PreviewProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [coverVisible, setCoverVisible] = useState(false);
  const [artistVisible, setArtistVisible] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const [revealedTrackId, setRevealedTrackId] = useState(track.id);

  // Reset while rendering instead of in an effect: an effect only runs after
  // paint, so the new track would be shown for a frame with the reveal state
  // of the previous one.
  if (revealedTrackId !== track.id) {
    setRevealedTrackId(track.id);
    setCoverVisible(false);
    setArtistVisible(false);
    setNameVisible(false);
    setIsVisible(false);
  }

  if (!isTrack(track)) {
    return <div>{t("error_invalid_track_data")}</div>;
  }

  const name = track.name;
  const artist = track.artists.map((a) => a.name).join(", ");
  const image = track.album.images[0].url;

  return (
    <Stack vertical gap="medium" align="center">
      <Reveal
        title={t("reveal_cover")}
        isInteractive={!isVisible}
        onToggle={() => setCoverVisible(!coverVisible)}
        className={styles.coverReveal}
      >
        <BlurryImage
          className={styles.picture}
          imageclassName={styles.image}
          src={coverVisible || isVisible ? image : placeholder}
          alt={name}
        >
          {!isVisible && (
            <RevealButton
              isVisible={coverVisible}
              size="large"
              className={styles.imageButton}
            />
          )}
        </BlurryImage>
      </Reveal>

      <h2 className={styles.title}>
        <Reveal
          title={t("reveal_song_name")}
          isInteractive={!isVisible}
          onToggle={() => setNameVisible(!nameVisible)}
        >
          {nameVisible || isVisible
            ? capStringTo(name, TITLE_CAP)
            : t("song_name")}
          {!isVisible && (
            <span className={styles.revealButton}>
              <RevealButton isVisible={nameVisible} />
            </span>
          )}
        </Reveal>
      </h2>

      <h3 className={classNames(styles.title, styles.subtitle)}>
        <Reveal
          title={t("reveal_artist")}
          isInteractive={!isVisible}
          onToggle={() => setArtistVisible(!artistVisible)}
        >
          {artistVisible || isVisible
            ? capStringTo(artist, ARTIST_CAP)
            : t("artist_name")}
          {!isVisible && (
            <span className={styles.revealButton}>
              <RevealButton isVisible={artistVisible} />
            </span>
          )}
        </Reveal>
      </h3>

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
