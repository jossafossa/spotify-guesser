import { PlaybackState, type SpotifyApi } from "@spotify/web-api-ts-sdk";
import { EventHandler } from "./EventHandler";

type SpotifyHeartbeatOptions = {
  tickInterval?: number;
};

type SpotifyHearthbeatEventOptions = {
  ready?: boolean;
  playbackState?: PlaybackStateResponse;
};

type PlaybackStateResponse = PlaybackState | undefined;

type SpotifyHearthbeatEventType =
  | "ready"
  | "not_ready"
  | "tick"
  | "player_state_changed"
  | "play"
  | "pause";

class SpotifyHearthbeatEvent extends Event {
  ready: boolean | undefined;
  playbackState: PlaybackStateResponse;

  constructor(
    type: SpotifyHearthbeatEventType,
    { ready, playbackState }: SpotifyHearthbeatEventOptions = {}
  ) {
    super(type);
    this.ready = ready;
    this.playbackState = playbackState;
  }
}

export class SpotifyHeartbeat extends EventHandler<SpotifyHearthbeatEvent> {
  #api: SpotifyApi;
  #latestTrack: PlaybackStateResponse;
  #tickInterval: number;
  #ready: boolean = false;

  constructor(
    api: SpotifyApi,
    { tickInterval = 2000 }: SpotifyHeartbeatOptions = {}
  ) {
    super();

    this.#api = api;
    this.#tickInterval = tickInterval;

    this.#startClock();
  }

  #startClock() {
    setInterval(async () => {
      try {
        await this.tick();
        this.dispatchEvent(new SpotifyHearthbeatEvent("tick"));
      } catch (error) {
        console.error("Error during tick:", error);
      }
    }, this.#tickInterval);
  }

  didPlaybackStateChange = (
    previous: PlaybackStateResponse,
    current: PlaybackStateResponse
  ): boolean => {
    if (!previous || !current) return true;

    return (
      previous.is_playing !== current.is_playing ||
      previous.item?.id !== current.item?.id ||
      previous.repeat_state !== current.repeat_state ||
      previous.shuffle_state !== current.shuffle_state
    );
  };

  async tick() {
    const playbackState = await this.#api.player.getCurrentlyPlayingTrack();

    if (this.#hasSwitchedToActive(playbackState)) {
      this.#ready = true;
      this.dispatchEvent(new SpotifyHearthbeatEvent("ready", { ready: true }));
    }

    if (this.#hasSwitchedToInactive(playbackState)) {
      this.#ready = false;
      this.dispatchEvent(
        new SpotifyHearthbeatEvent("not_ready", { ready: false })
      );
    }

    if (this.#hasSwitchedTrack(playbackState)) {
      this.#latestTrack = playbackState || null;
      this.dispatchEvent(
        new SpotifyHearthbeatEvent("player_state_changed", {
          playbackState: playbackState ?? undefined,
        })
      );
    }
  }

  #hasSwitchedTrack(playbackState: PlaybackStateResponse) {
    if (!this.#latestTrack || !playbackState) {
      return this.#latestTrack !== playbackState;
    }

    return (
      this.#latestTrack.is_playing !== playbackState.is_playing ||
      this.#latestTrack.item?.id !== playbackState.item?.id ||
      this.#latestTrack.repeat_state !== playbackState.repeat_state ||
      this.#latestTrack.shuffle_state !== playbackState.shuffle_state
    );
  }

  #hasSwitchedToInactive(playbackState: PlaybackStateResponse) {
    return playbackState === null && this.#ready === true;
  }

  #hasSwitchedToActive(playbackState: PlaybackStateResponse) {
    return playbackState !== null && this.#ready === false;
  }
}
