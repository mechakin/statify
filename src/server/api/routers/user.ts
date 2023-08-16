import axios, { type AxiosResponse } from "axios";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

type SongData = {
  items: [
    {
      album: {
        images: [
          {
            height: number;
            url: string;
            width: number;
          }
        ];
      };
      artists: [
        {
          name: string;
        }
      ];
      id: string;
      name: string;
      popularity: number;
      uri: string;
    }
  ];
};

type ArtistData = {
  items: [
    {
      name: string;
      popularity: number;
      genres: string[];
      images: [
        {
          height: number;
          url: string;
          width: number;
        }
      ];
      id: string;
      uri: string;
    }
  ];
};

type MoodData = {
  audio_features: [
    {
      id: string;
      danceability: number;
      energy: number;
      valence: number;
    }
  ];
};

type RecommendationData = {
  tracks: [
    {
      artists: [
        {
          name: string;
        }
      ];
      album: {
        images: [
          {
            height: number;
            url: string;
            width: number;
          }
        ];
      };
      name: string;
      uri: string;
    }
  ];
};

type TimePeriod = "short" | "medium" | "long";

async function getUserData(timePeriod: TimePeriod, accessToken: string) {
  const responseTopSongs: AxiosResponse<SongData> = await axios.get(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${timePeriod}_term&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const songInfo = responseTopSongs.data.items;
  const songIds = songInfo.map((song) => song.id).join(",");

  const responseSongMoods: AxiosResponse<MoodData> = await axios.get(
    `https://api.spotify.com/v1/audio-features?ids=${songIds}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const moodInfo = responseSongMoods.data;

  moodInfo.audio_features.forEach((mood) => {
    mood.danceability = +(mood.danceability * 100).toFixed(0);
    mood.energy = +(mood.energy * 100).toFixed(0);
    mood.valence = +(mood.valence * 100).toFixed(0);
  });

  const mergedSongInfo = songInfo.map((song) => ({
    ...song,
    moodInfo: moodInfo.audio_features.find((track) => track.id === song.id),
  }));

  const responseTopArtists: AxiosResponse<ArtistData> = await axios.get(
    `https://api.spotify.com/v1/me/top/artists?time_range=${timePeriod}_term&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const artistInfo = responseTopArtists.data.items;
  const artistIds = artistInfo.map((artist) => artist.id).join(",");

  const genreCounts: { [genre: string]: number } = {};

  artistInfo.forEach((artist) => {
    artist.genres.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  const genres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre);

  const sortedGenres = genres.slice(0, 10);

  const responseRecommendations: AxiosResponse<RecommendationData> =
    await axios.get(
      `https://api.spotify.com/v1/recommendations?limit=15&seed_artists=${artistIds}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

  const recommendationInfo = responseRecommendations.data;

  return {
    songInfo: mergedSongInfo,
    artistInfo,
    genreInfo: sortedGenres,
    recommendationInfo: recommendationInfo,
  };
}

export const userRouter = createTRPCRouter({
  getShortTermUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx }) => {
      const account = await ctx.prisma.account.findFirst({
        where: { userId: ctx.session?.user.id },
      });

      if (!account?.access_token) return;

      const { songInfo, artistInfo, genreInfo, recommendationInfo } =
        await getUserData("short", account?.access_token);

      return {
        songInfo,
        artistInfo,
        genreInfo,
        recommendationInfo,
      };
    }),
  getMediumTermUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx }) => {
      const account = await ctx.prisma.account.findFirst({
        where: { userId: ctx.session?.user.id },
      });

      if (!account?.access_token) return;

      const { songInfo, artistInfo, genreInfo, recommendationInfo } =
        await getUserData("medium", account?.access_token);

      return {
        songInfo,
        artistInfo,
        genreInfo,
        recommendationInfo,
      };
    }),
  getLongTermUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx }) => {
      const account = await ctx.prisma.account.findFirst({
        where: { userId: ctx.session?.user.id },
      });

      if (!account?.access_token) return;

      const { songInfo, artistInfo, genreInfo, recommendationInfo } =
        await getUserData("long", account?.access_token);

      return {
        songInfo,
        artistInfo,
        genreInfo,
        recommendationInfo,
      };
    }),
});
