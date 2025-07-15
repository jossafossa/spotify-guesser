import { SpotifyHeartbeat } from "./SpotifyHeartbeat/SpotifyHeartbeat";
import {
  createApi,
  fetchBaseQuery,
  setupListeners,
} from "@reduxjs/toolkit/query/react";
import { configureStore } from "@reduxjs/toolkit";
import {
  Device,
  Devices,
  PlaybackState,
  SpotifyApi,
  UserProfile,
} from "@spotify/web-api-ts-sdk";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const redirectUri = window.location.protocol + "//" + window.location.host;

//current url is the redirect URI

export const api = SpotifyApi.withUserAuthorization(clientId, redirectUri, [
  "user-read-playback-state",
  "user-modify-playback-state",
]);

const swallowError = async <T>(
  callback: () => T
): Promise<T | { error: string }> => {
  try {
    return await callback();
  } catch {
    return { error: "asd" };
  }
};

// Define a service using a base URL and expected endpoints
export const spotifyApi = createApi({
  reducerPath: "spotifyApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Playback", "Device"],
  endpoints: (builder) => {
    return {
      getProfile: builder.query<UserProfile, void>({
        queryFn: async () => {
          const data = await api.currentUser.profile();
          return { data };
        },
      }),
      getCurrentPlayback: builder.query<PlaybackState | null, void>({
        queryFn: async () => {
          const data = await api.player.getCurrentlyPlayingTrack();
          return { data };
        },
        providesTags: ["Playback"],
      }),
      getDevices: builder.query<Devices, void>({
        queryFn: async () => {
          const data = await api.player.getAvailableDevices();
          return { data };
        },
        providesTags: ["Device"],
      }),
      getActiveDevice: builder.query<Device | undefined, void>({
        queryFn: async () => {
          const devices = await api.player.getAvailableDevices();
          const activeDevice = devices.devices.find((d) => d.is_active);
          return { data: activeDevice };
        },
        providesTags: ["Device"],
      }),
      play: builder.mutation<void, string>({
        queryFn: async (deviceId) => {
          await api.player.startResumePlayback(deviceId);
          return { data: undefined };
        },
        invalidatesTags: ["Playback"],
      }),
      pause: builder.mutation<void, string>({
        queryFn: async (deviceId) => {
          await api.player.pausePlayback(deviceId);
          return { data: undefined };
        },
        invalidatesTags: ["Playback"],
      }),
      next: builder.mutation<void, string>({
        queryFn: async (deviceId) => {
          await swallowError(() => api.player.skipToNext(deviceId));
          return { data: undefined };
        },
        invalidatesTags: ["Playback"],
      }),
      previous: builder.mutation<void, string>({
        queryFn: async (deviceId) => {
          await api.player.skipToPrevious(deviceId);
          return { data: undefined };
        },
        invalidatesTags: ["Playback"],
      }),
    };
  },
});

export const store = configureStore({
  reducer: {
    [spotifyApi.reducerPath]: spotifyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(spotifyApi.middleware),
});

setupListeners(store.dispatch);

const heartbeat = new SpotifyHeartbeat(api);

heartbeat.on("ready", () => {
  store.dispatch(spotifyApi.util.invalidateTags(["Device"]));
});

heartbeat.on("not_ready", () => {
  store.dispatch(spotifyApi.util.invalidateTags(["Device"]));
});

heartbeat.on("player_state_changed", ({ playbackState }) => {
  store.dispatch(
    spotifyApi.util.updateQueryData(
      "getCurrentPlayback",
      undefined,
      () => playbackState
    )
  );
});

export const {
  useGetProfileQuery,
  useGetActiveDeviceQuery,
  useGetCurrentPlaybackQuery,
  usePlayMutation,
  usePauseMutation,
  useNextMutation,
  usePreviousMutation,
  useGetDevicesQuery,
} = spotifyApi;

export type RootState = ReturnType<typeof store.getState>;
