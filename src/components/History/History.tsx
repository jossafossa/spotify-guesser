import { skipToken } from "@reduxjs/toolkit/query";
import { useGetTracksQuery } from "../../store";
import { HistoryItem } from "../HistoryItem";
import { Spinner } from "../Spinner";
import { Stack } from "../Stack";

type HistoryRecordProps = {
  history: { trackId: string; timestamp: number; correct: boolean }[];
};

export const History = ({ history }: HistoryRecordProps) => {
  const tracksIds = history.map((entry) => entry.trackId);
  const { data: tracks } = useGetTracksQuery(
    tracksIds.length > 0 ? tracksIds : skipToken
  );

  if (!tracks) {
    return <Spinner />;
  }

  const historyItems = tracks.map((track) => {
    const historyEntry = history.find((entry) => entry.trackId === track.id);
    return {
      track,
      correct: historyEntry ? historyEntry.correct : false,
    };
  });

  return history.length === 0 ? (
    <p>No history available.</p>
  ) : (
    <Stack vertical gap="small">
      {historyItems.map(({ track, correct }, index) => (
        <HistoryItem key={index} track={track} correct={correct} />
      ))}
    </Stack>
  );
};
