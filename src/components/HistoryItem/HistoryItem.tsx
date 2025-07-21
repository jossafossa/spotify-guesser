import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Track } from "@spotify/web-api-ts-sdk";
import styles from "./HistoryItem.module.scss";

type HistoryItemProps = {
  track: Track;
  correct?: boolean;
};

export const HistoryItem = ({ track, correct = false }: HistoryItemProps) => {
  return (
    <article className={styles.historyItem}>
      <header>
        <img
          className={styles.image}
          src={track.album.images[0]?.url}
          alt={track.name}
        />
      </header>
      <section className="track-info">
        <h2>{track.name}</h2>
        <p>{track.artists.map((artist) => artist.name).join(", ")}</p>
      </section>
      <footer>
        {correct ? (
          <FontAwesomeIcon icon={faCheck} className={styles.correct} />
        ) : (
          <FontAwesomeIcon icon={faClose} className={styles.incorrect} />
        )}
      </footer>
    </article>
  );
};
