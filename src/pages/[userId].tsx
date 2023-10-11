/* eslint-disable @next/next/no-img-element */
import { Plus } from "lucide-react";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import NotFound from "~/components/not-found";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { toast } from "~/components/ui/use-toast";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api, type RouterOutputs } from "~/utils/api";

type SpotifyData = RouterOutputs["user"]["getShortTermUserById"];

type UserSpotifyInfoProps = {
  data: SpotifyData;
  timePeriod: "short" | "medium" | "long";
};

function truncateString(string: string) {
  if (string.length > 40) {
    return string.substring(0, 40) + "...";
  }
  return string;
}

const UserPage: NextPage<{ userId: string }> = ({ userId }) => {
  const { data: userData } = api.user.getUserInfoById.useQuery({ id: userId });

  const { data: shortTermData, isLoading: shortTermDataIsLoading } =
    api.user.getShortTermUserById.useQuery({
      id: userId,
    });

  const { data: mediumTermData, isLoading: mediumTermDataIsLoading } =
    api.user.getMediumTermUserById.useQuery({ id: userId });

  const { data: longTermData, isLoading: longTermDataIsLoading } =
    api.user.getLongTermUserById.useQuery({ id: userId });

  const { mutate, isLoading } = api.user.createPlaylist.useMutation({
    onSuccess: () => {
      toast({
        title: "Congrats!",
        description: "Playlist successfully created in Spotify.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  if (!userData) return <NotFound />;

  function onSubmit(uris: string[]) {
    mutate({ id: userId, uris: uris });
  }

  function UserSpotifyInfo({ data, timePeriod }: UserSpotifyInfoProps) {
    if (!data) return <div />;

    const isShort = timePeriod === "short";
    const isMedium = timePeriod === "medium";
    const isLong = timePeriod === "long";

    return (
      <>
        <h2 className="pb-2 pt-8 text-2xl font-semibold tracking-tight lg:text-3xl">
          Your Top Genres
        </h2>
        <div>
          {data.genreInfo.map((genre) => (
            <Badge
              key={genre}
              className="my-2 mr-4 px-4 py-1 text-lg lg:text-xl"
            >
              {genre}
            </Badge>
          ))}
        </div>

        <h2 className="pt-8 text-2xl font-semibold tracking-tight lg:text-3xl">
          Your Top Songs
        </h2>
        <div className="flex w-full items-center justify-between pb-4">
          <h3 className="max-w-lg text-lg text-muted-foreground lg:pt-1">
            {isShort && "Taken from the last month."}
            {isMedium && "Taken from the last 6 months."}
            {isLong && "Taken from your all time listening history."}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-4 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data.songInfo.slice(0, 5).map((song) => {
            return (
              <a href={song.uri} key={song.id}>
                <Card className="transition hover:bg-secondary">
                  <CardContent className="pt-4">
                    <img
                      src={
                        song.album.images[0].url ? song.album.images[0].url : ""
                      }
                      width={200}
                      height={200}
                      alt={song.name ? song.name : "song's name"}
                      className="-mb-4"
                    />
                  </CardContent>
                  <CardHeader>
                    <CardTitle>{truncateString(song.name)}</CardTitle>
                    <CardDescription>{song.artists[0].name}</CardDescription>
                  </CardHeader>
                </Card>
              </a>
            );
          })}
        </div>
        <h2 className="pt-8 text-2xl font-semibold tracking-tight lg:text-3xl">
          Your Top Artists
        </h2>
        <div className="flex w-full items-center justify-between pb-4">
          <h3 className="max-w-lg text-center text-lg text-muted-foreground lg:pt-1">
            {isShort && "Taken from the last month."}
            {isMedium && "Taken from the last 6 months."}
            {isLong && "Taken from your all time listening history."}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 pb-8 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data.artistInfo.map((artist) => {
            return (
              <a href={artist.uri} key={artist.name}>
                <Card className="transition hover:bg-secondary">
                  <CardContent className="pt-4">
                    <img
                      src={artist.images[0].url ? artist.images[0].url : ""}
                      width={artist.images[0].width}
                      height={artist.images[0].height}
                      alt={artist.name ? artist.name : "artist's name"}
                      className="-mb-4"
                    />
                  </CardContent>
                  <CardHeader>
                    <CardTitle>{artist.name}</CardTitle>
                    <CardDescription>Artist</CardDescription>
                  </CardHeader>
                </Card>
              </a>
            );
          })}
        </div>
        <h2 className="pt-8 text-2xl font-semibold tracking-tight lg:text-3xl">
          Your Happiest Songs
        </h2>
        <div className="flex w-full items-center justify-between pb-4">
          <h3 className="max-w-lg text-center text-lg text-muted-foreground lg:pt-1">
            {isShort && "Taken from the last month."}
            {isMedium && "Taken from the last 6 months."}
            {isLong && "Taken from your all time listening history."}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-8 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...data.songInfo]
            .sort(
              (a, b) => (b.moodInfo?.valence ?? 0) - (a.moodInfo?.valence ?? 0)
            )
            .slice(0, 5)
            .map((song) => {
              return (
                <a href={song.uri} key={song.id}>
                  <Card className="transition hover:bg-secondary">
                    <CardContent className="pt-4">
                      <img
                        src={
                          song.album.images[0].url
                            ? song.album.images[0].url
                            : ""
                        }
                        width={200}
                        height={200}
                        alt={song.name ? song.name : "song's name"}
                        className="-mb-4"
                      />
                    </CardContent>
                    <CardHeader>
                      <CardTitle>{truncateString(song.name)}</CardTitle>
                      <CardDescription>{song.artists[0].name}</CardDescription>
                      <div className="flex items-center justify-center pt-2">
                        <p className="mr-2 text-sm text-muted-foreground">
                          {song.moodInfo?.valence}%
                        </p>
                        <Progress value={song.moodInfo?.valence} />
                      </div>
                    </CardHeader>
                  </Card>
                </a>
              );
            })}
        </div>
        <h2 className="pt-8 text-2xl font-semibold tracking-tight lg:text-3xl">
          Your Most Energetic Songs
        </h2>
        <div className="flex w-full items-center justify-between pb-4">
          <h3 className="max-w-lg text-center text-lg text-muted-foreground lg:pt-1">
            {isShort && "Taken from the last month."}
            {isMedium && "Taken from the last 6 months."}
            {isLong && "Taken from your all time listening history."}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 pb-8 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...data.songInfo]
            .sort(
              (a, b) => (b.moodInfo?.energy ?? 0) - (a.moodInfo?.energy ?? 0)
            )
            .slice(0, 5)
            .map((song) => {
              return (
                <a href={song.uri} key={song.id}>
                  <Card className="transition hover:bg-secondary">
                    <CardContent className="pt-4">
                      <img
                        src={
                          song.album.images[0].url
                            ? song.album.images[0].url
                            : ""
                        }
                        width={200}
                        height={200}
                        alt={song.name ? song.name : "song's name"}
                        className="-mb-4"
                      />
                    </CardContent>
                    <CardHeader>
                      <CardTitle>{truncateString(song.name)}</CardTitle>
                      <CardDescription>{song.artists[0].name}</CardDescription>
                      <div className="flex items-center justify-center pt-2">
                        <p className="mr-2 text-sm text-muted-foreground">
                          {song.moodInfo?.energy}%
                        </p>
                        <Progress value={song.moodInfo?.energy} />
                      </div>
                    </CardHeader>
                  </Card>
                </a>
              );
            })}
        </div>
        <h2 className="pt-8 text-2xl font-semibold tracking-tight lg:text-3xl">
          Your Most Danceable Songs
        </h2>
        <div className="flex w-full items-center justify-between pb-4">
          <h3 className="max-w-lg text-center text-lg text-muted-foreground lg:pt-1">
            {isShort && "Taken from the last month."}
            {isMedium && "Taken from the last 6 months."}
            {isLong && "Taken from your all time listening history."}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 pb-8 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...data.songInfo]
            .sort(
              (a, b) =>
                (b.moodInfo?.danceability ?? 0) -
                (a.moodInfo?.danceability ?? 0)
            )
            .slice(0, 5)
            .map((song) => {
              return (
                <a href={song.uri} key={song.id}>
                  <Card className="transition hover:bg-secondary">
                    <CardContent className="pt-4">
                      <img
                        src={
                          song.album.images[0].url
                            ? song.album.images[0].url
                            : ""
                        }
                        width={200}
                        height={200}
                        alt={song.name ? song.name : "song's name"}
                        className="-mb-4"
                      />
                    </CardContent>
                    <CardHeader>
                      <CardTitle>{truncateString(song.name)}</CardTitle>
                      <CardDescription>{song.artists[0].name}</CardDescription>
                      <div className="flex items-center justify-center pt-2">
                        <p className="mr-2 text-sm text-muted-foreground">
                          {song.moodInfo?.danceability}%
                        </p>
                        <Progress value={song.moodInfo?.danceability} />
                      </div>
                    </CardHeader>
                  </Card>
                </a>
              );
            })}
        </div>
        <h2 className="pt-8 text-2xl font-semibold tracking-tight lg:text-3xl">
          Your Recommendations
        </h2>
        <div className="flex w-full items-center justify-between pb-4">
          <h3 className="max-w-lg text-lg text-muted-foreground ">
            Taken from your {isShort && "current"} {isMedium && "recent"}{" "}
            {isLong && "all time"} listening activity.
          </h3>
          <Button
            disabled={isLoading}
            onClick={() =>
              onSubmit(data.recommendationInfo.tracks.map((track) => track.uri))
            }
            className="hidden gap-2 text-base md:flex"
          >
            <Plus />
            Create Playlist
          </Button>
        </div>
        <Button
          disabled={isLoading}
          onClick={() =>
            onSubmit(data.recommendationInfo.tracks.map((track) => track.uri))
          }
          className="mb-6 flex gap-2 text-base md:hidden"
        >
          <Plus />
          Create Playlist
        </Button>

        <div className="grid grid-cols-2 gap-4 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data.recommendationInfo.tracks.map((song) => {
            return (
              <a href={song.uri} key={song.name}>
                <Card className="transition hover:bg-secondary">
                  <CardContent className="pt-4">
                    <img
                      src={
                        song.album.images[0].url ? song.album.images[0].url : ""
                      }
                      width={song.album.images[0].width}
                      height={song.album.images[0].height}
                      alt={song.name ? song.name : "song's name"}
                      className="-mb-4"
                    />
                  </CardContent>
                  <CardHeader>
                    <CardTitle>{truncateString(song.name)}</CardTitle>
                    <CardDescription>{song.artists[0].name}</CardDescription>
                  </CardHeader>
                </Card>
              </a>
            );
          })}
        </div>
      </>
    );
  }

  const url = userData.images[1]?.url;
  const afterImage = url?.split("image/").pop();

  const loading = (
    <>
      <div className="grid min-w-max grid-cols-2 gap-4 pb-2 pt-6 xs:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
        <Skeleton className="w-34 h-12" />
        <Skeleton className="w-34 h-12" />
        <Skeleton className="w-34 h-12" />
        <Skeleton className="w-34 h-12" />
        <Skeleton className="w-34 h-12" />
        <Skeleton className="w-34 h-12" />
        <Skeleton className="w-34 h-12" />
        <Skeleton className="w-34 h-12" />
        <Skeleton className="w-34 h-12" />
        <Skeleton className="w-34 h-12" />
      </div>
      <div className="grid grid-cols-2 gap-4 pb-2 pt-6 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <Skeleton className="h-56 w-52 " />
        <Skeleton className="h-56 w-52 " />
        <Skeleton className="h-56 w-52 " />
        <Skeleton className="h-56 w-52" />
        <Skeleton className="h-56 w-52 " />
      </div>
      <div className="grid grid-cols-2 gap-4 pb-2 pt-6 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <Skeleton className="h-56 w-52 " />
        <Skeleton className="h-56 w-52 " />
        <Skeleton className="h-56 w-52 " />
        <Skeleton className="h-56 w-52" />
        <Skeleton className="h-56 w-52 " />
      </div>
      <div className="grid grid-cols-2 gap-4 pb-8 pt-6 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <Skeleton className="h-56 w-52" />
        <Skeleton className="h-56 w-52" />
        <Skeleton className="h-56 w-52" />
        <Skeleton className="h-56 w-52" />
        <Skeleton className="h-56 w-52" />
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>{`${userData.display_name}'s statify`}</title>
        <meta
          name="description"
          content={
            userData.display_name
              ? `Check out ${userData.display_name}'s Spotify stats with Statify.`
              : "Check out this user's Spotify stats here!"
          }
        />
        <meta name="og:title" content="Statify" />
        <meta
          name="og:description"
          content={
            userData.display_name
              ? `Check out ${userData.display_name}'s Spotify stats with Statify.`
              : "Check out this user's Spotify stats here!"
          }
        />
        {afterImage && (
          <meta
            property="og:image"
            content={`${
              process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""
            }/api/dynamic-og-image/?userid=${afterImage}&username=${
              userData.display_name
            }`}
          />
        )}
      </Head>
      <PageLayout id={userId}>
        <div className="flex items-center justify-center pt-20">
          <div className="flex flex-col items-center lg:flex-row lg:gap-16">
            <img
              src={userData.images[1]?.url ? userData.images[1]?.url : ""}
              width={250}
              height={250}
              alt={userData.display_name ? userData.display_name : "user"}
              className="rounded-full"
            />
            <h1 className="pt-2 text-center text-4xl font-bold leading-tight tracking-tighter lg:pt-0 lg:text-5xl lg:leading-[1.1]">
              {userData.display_name}
              {"'s statify"}
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center">
          <h2 className="pb-4 pt-8 text-2xl font-semibold tracking-tight lg:text-3xl">
            Sort By
          </h2>
          <Tabs defaultValue="last-month">
            <TabsList className="px-2 py-6">
              <TabsTrigger value="last-month" className="text-md lg:text-xl">
                Last Month
              </TabsTrigger>
              <TabsTrigger value="last-6-months" className="text-md lg:text-xl">
                Last 6 Months
              </TabsTrigger>
              <TabsTrigger value="all-time" className="text-md lg:text-xl">
                All Time
              </TabsTrigger>
            </TabsList>
            <TabsContent value="last-month">
              <UserSpotifyInfo data={shortTermData} timePeriod="short" />
              {shortTermDataIsLoading && loading}
            </TabsContent>
            <TabsContent value="last-6-months">
              <UserSpotifyInfo data={mediumTermData} timePeriod="medium" />
              {mediumTermDataIsLoading && loading}
            </TabsContent>
            <TabsContent value="all-time">
              <UserSpotifyInfo data={longTermData} timePeriod="long" />
              {longTermDataIsLoading && loading}
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </>
  );
};

export default UserPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const userId = context.params?.userId;

  if (typeof userId !== "string") {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  await ssg.user.getUserInfoById.prefetch({ id: userId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      userId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
