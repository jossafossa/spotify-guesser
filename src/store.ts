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
  ItemTypes,
  Market,
  MaxInt,
  Page,
  PlaybackState,
  SearchResults,
  SimplifiedPlaylist,
  SpotifyApi,
  UserProfile,
} from "@spotify/web-api-ts-sdk";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const redirectUri = window.location.protocol + "//" + window.location.host;

//current url is the redirect URI
console.log(redirectUri);

console.log(import.meta.env);

export const api = SpotifyApi.withUserAuthorization(clientId, redirectUri, [
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
  "user-read-email",
  "user-read-private",
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

type SearchOptions<T extends readonly ItemTypes[]> = {
  q: string; // The search query
  type: T; // The types of items to search for
  market?: Market; // Optional market code
  limit?: MaxInt<50>; // Optional limit (default: 20, max: 50)
  offset?: number; // Optional offset for pagination
  include_external?: string; // Optional inclusion of external content
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
      search: (<T extends ItemTypes[]>() => {
        return builder.query<SearchResults<T>, SearchOptions<T>>({
          queryFn: async ({
            q,
            type,
            market,
            limit,
            offset,
            include_external,
          }: SearchOptions<T>) => {
            const data = await api.search(
              q,
              type,
              market,
              limit,
              offset,
              include_external
            );

            return { data };
          },
        });
      })(),
      getPlayLists: builder.query<
        Page<SimplifiedPlaylist>,
        {
          limit?: MaxInt<50>;
          offset?: number;
        }
      >({
        queryFn: async ({ limit, offset }) => {
          const data = await api.currentUser.playlists.playlists(limit, offset);
          return { data };
        },
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
  console.log("Player state changed", playbackState);
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
  useSearchQuery,
  useGetDevicesQuery,
  useGetPlayListsQuery,
} = spotifyApi;

export type RootState = ReturnType<typeof store.getState>;
