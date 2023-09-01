import { Plus } from "lucide-react";
import { type GetStaticProps, type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  if (string.length > 18) {
    return string.substring(0, 18) + "...";
  }
  return string;
}

const UserPage: NextPage<{ userId: string }> = ({ userId }) => {
  const { data: sessionData, status } = useSession();
  const [queryEnabled, setQueryEnabled] = useState(true);

  const { data: shortTermData } = api.user.getShortTermUserById.useQuery(
    { id: userId },
    { enabled: queryEnabled }
  );

  const { data: mediumTermData } = api.user.getMediumTermUserById.useQuery(
    { id: userId },
    { enabled: queryEnabled }
  );

  const { data: longTermData } = api.user.getLongTermUserById.useQuery(
    { id: userId },
    { enabled: queryEnabled }
  );

  const { mutate, isLoading } = api.user.createPlaylist.useMutation({
    onSuccess: () => {
      toast({
        title: "Congrats!",
        description: "Playlist successfully created.",
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

  useEffect(() => setQueryEnabled(false), []);

  if (!shortTermData || !mediumTermData || !longTermData) return <NotFound />;

  function onSubmit() {
    mutate({ id: userId });
  }

  function UserSpotifyInfo({ data, timePeriod }: UserSpotifyInfoProps) {
    if (!data) return <div />;

    const isShort = timePeriod === "short";
    const isMedium = timePeriod === "medium";
    const isLong = timePeriod === "long";

    return (
      <>
        <h2 className="pb-2 pt-8 text-2xl font-semibold tracking-tight lg:text-3xl">
          Top Genres
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
          {data.songInfo.map((song) => {
            return (
              <a href={song.uri} key={song.id}>
                <Card className="transition hover:bg-secondary">
                  <CardContent className="pt-4">
                    <Image
                      src={
                        song.album.images[0].url ? song.album.images[0].url : ""
                      }
                      width={200}
                      height={200}
                      alt={song.name ? song.name : "song's name"}
                      className="-mb-4 rounded-md"
                    />
                  </CardContent>
                  <CardHeader>
                    <CardTitle>{song.name}</CardTitle>
                    <CardDescription>
                      {truncateString(song.artists[0].name)}
                    </CardDescription>
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
                    <Image
                      src={artist.images[0].url ? artist.images[0].url : ""}
                      width={artist.images[0].width}
                      height={artist.images[0].height}
                      alt={artist.name ? artist.name : "artist's name"}
                      className="-mb-4 rounded-md"
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
          Your Recommendations
        </h2>
        <div className="flex w-full items-center justify-between pb-4">
          <h3 className="max-w-lg text-lg text-muted-foreground ">
            Taken from your {isShort && "current"} {isMedium && "recent"}{" "}
            {isLong && "all time"} listening activity.
          </h3>
          <Button
            disabled={isLoading}
            onClick={onSubmit}
            className="hidden gap-2 text-base md:flex"
          >
            <Plus />
            Create Playlist
          </Button>
        </div>
        <Button
          disabled={isLoading}
          onClick={onSubmit}
          className="mb-6 flex gap-2 text-base md:hidden"
        >
          <Plus />
          Create Playlist
        </Button>
        <div className="grid grid-cols-2 gap-4 pb-8 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data.recommendationInfo.tracks.map((song) => {
            return (
              <a href={song.uri} key={song.name}>
                <Card className="transition hover:bg-secondary">
                  <CardContent className="pt-4">
                    <Image
                      src={
                        song.album.images[0].url ? song.album.images[0].url : ""
                      }
                      width={song.album.images[0].width}
                      height={song.album.images[0].height}
                      alt={song.name ? song.name : "song's name"}
                      className=" -mb-4 rounded-md"
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

  return (
    <>
      <Head>
        <title>{sessionData?.user.name}&apos;s statify</title>
        <meta
          name="description"
          content={
            sessionData?.user.name
              ? `Check out all of ${sessionData?.user?.name} spotify stats here!`
              : `Check out this user's spotify stats here!`
          }
        />
      </Head>
      <PageLayout>
        <div className="flex items-center justify-center pt-20">
          <div className="flex flex-col items-center lg:flex-row lg:gap-16">
            <Image
              src={sessionData?.user.image ? sessionData?.user.image : ""}
              width={250}
              height={250}
              alt={sessionData?.user.name ? sessionData?.user.name : "user"}
              className="rounded-full"
            />
            <h1 className="pt-2 text-center text-4xl font-bold leading-tight tracking-tighter lg:pt-0 lg:text-5xl lg:leading-[1.1]">
              {sessionData?.user.name}
              {status === "authenticated" && "'s statify"}
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
            </TabsContent>
            <TabsContent value="last-6-months">
              <UserSpotifyInfo data={mediumTermData} timePeriod="medium" />
            </TabsContent>
            <TabsContent value="all-time">
              <UserSpotifyInfo data={longTermData} timePeriod="long" />
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

  await ssg.user.getShortTermUserById.prefetch({ id: userId });
  await ssg.user.getMediumTermUserById.prefetch({ id: userId });
  await ssg.user.getLongTermUserById.prefetch({ id: userId });

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
