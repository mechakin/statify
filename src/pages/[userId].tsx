import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "~/components/ui/button";

const UserPage = () => {
  const { data: sessionData } = useSession();
  const [position, setPosition] = useState("Artists");
  const [mood, setMood] = useState("Happiness");
  const [firstTimeRange, setFirstTimeRange] = useState("Current");
  const [secondTimeRange, setSecondTimeRange] = useState("Current");

  return (
    <>
      <PageLayout>
        <div className="flex items-center justify-center pt-20">
          <div className="flex flex-col items-center md:flex-row md:gap-16">
            <Image
              src={sessionData?.user.image ? sessionData?.user.image : ""}
              width={250}
              height={250}
              alt={sessionData?.user.name ? sessionData?.user.name : "user"}
              className="rounded-full"
            />
            <h1 className="text-center text-6xl font-bold leading-tight tracking-tighter lg:leading-[1.1]">
              {sessionData?.user.name}
              {"'s"} statify
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center">
          <h2 className="pb-2 pt-8 text-4xl font-semibold tracking-tight">
            Top Genres
          </h2>
          <div>
            <Badge className="my-2 mr-4 px-4 py-1 text-lg md:text-xl lg:text-2xl">
              underground hip hop
            </Badge>
            <Badge className="my-2 mr-4 px-4 py-1 text-lg md:text-xl lg:text-2xl">
              hip hop
            </Badge>
            <Badge className="my-2 mr-4 px-4 py-1 text-lg md:text-xl lg:text-2xl">
              alternative hip hop
            </Badge>
            <Badge className="my-2 mr-4 px-4 py-1 text-lg md:text-xl lg:text-2xl">
              glitchcore
            </Badge>
            <Badge className="my-2 mr-4 px-4 py-1 text-lg md:text-xl lg:text-2xl">
              hyperpop
            </Badge>
            <Badge className="my-2 mr-4 px-4 py-1 text-lg md:text-xl lg:text-2xl">
              rap
            </Badge>
            <Badge className="my-2 mr-4 px-4 py-1 text-lg md:text-xl lg:text-2xl">
              alternative hip hop
            </Badge>
            <Badge className="my-2 mr-4 px-4 py-1 text-lg md:text-xl lg:text-2xl">
              glitchbreak
            </Badge>
            <Badge className="my-2 mr-4 px-4 py-1 text-lg md:text-xl lg:text-2xl">
              rock
            </Badge>
            <Badge className="my-2 mr-4 px-4 py-1 text-lg md:text-xl lg:text-2xl">
              cloud rap
            </Badge>
            <Badge className="my-2 mr-4 px-4 py-1 text-lg md:text-xl lg:text-2xl">
              chill breakcore
            </Badge>
          </div>

          <div className="w-full items-end justify-between pb-4 xxs:flex">
            <h2 className="pt-8 text-4xl font-semibold tracking-tight">
              {firstTimeRange} Top {position}
            </h2>
            <div className="pt-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Sort</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={position}
                    onValueChange={setPosition}
                  >
                    <DropdownMenuRadioItem value="Artists">
                      Artists
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Songs">
                      Songs
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Time Range</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={firstTimeRange}
                    onValueChange={setFirstTimeRange}
                  >
                    <DropdownMenuRadioItem value="Current">
                      Current
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Recent">
                      Recent
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="All-Time">
                      All-Time
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pb-4 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <Card>
              <CardContent>
                <Image
                  src={sessionData?.user.image ? sessionData?.user.image : ""}
                  width={200}
                  height={200}
                  alt={sessionData?.user.name ? sessionData?.user.name : "user"}
                  className="-mb-4 rounded-full pt-4"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Artist</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardContent>
                <Image
                  src={sessionData?.user.image ? sessionData?.user.image : ""}
                  width={200}
                  height={200}
                  alt={sessionData?.user.name ? sessionData?.user.name : "user"}
                  className="-mb-4 rounded-full pt-4"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Artist</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardContent>
                <Image
                  src={sessionData?.user.image ? sessionData?.user.image : ""}
                  width={200}
                  height={200}
                  alt={sessionData?.user.name ? sessionData?.user.name : "user"}
                  className="-mb-4 rounded-full pt-4"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Artist</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardContent>
                <Image
                  src={sessionData?.user.image ? sessionData?.user.image : ""}
                  width={200}
                  height={200}
                  alt={sessionData?.user.name ? sessionData?.user.name : "user"}
                  className="-mb-4 rounded-full pt-4"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Artist</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardContent>
                <Image
                  src={sessionData?.user.image ? sessionData?.user.image : ""}
                  width={200}
                  height={200}
                  alt={sessionData?.user.name ? sessionData?.user.name : "user"}
                  className="-mb-4 rounded-full pt-4"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Artist</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="w-full items-end justify-between pb-4 xxs:flex">
            <h2 className="pt-8 text-4xl font-semibold tracking-tight">
              {secondTimeRange} Top Moods
            </h2>
            <p></p>
            <div className="pt-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Sort</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Moods</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={mood} onValueChange={setMood}>
                    <DropdownMenuRadioItem value="Happiness">
                      Happiness
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Danceability">
                      Danceability
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Energy">
                      Energy
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Acousticness">
                      Acousticness
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Time Range</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={secondTimeRange}
                    onValueChange={setSecondTimeRange}
                  >
                    <DropdownMenuRadioItem value="Current">
                      Current
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Recent">
                      Recent
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="All-Time">
                      All-Time
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pb-4 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <Card>
              <CardContent>
                <Image
                  src={sessionData?.user.image ? sessionData?.user.image : ""}
                  width={200}
                  height={200}
                  alt={sessionData?.user.name ? sessionData?.user.name : "user"}
                  className="-mb-4 rounded-full pt-4"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Artist</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardContent>
                <Image
                  src={sessionData?.user.image ? sessionData?.user.image : ""}
                  width={200}
                  height={200}
                  alt={sessionData?.user.name ? sessionData?.user.name : "user"}
                  className="-mb-4 rounded-full pt-4"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Artist</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardContent>
                <Image
                  src={sessionData?.user.image ? sessionData?.user.image : ""}
                  width={200}
                  height={200}
                  alt={sessionData?.user.name ? sessionData?.user.name : "user"}
                  className="-mb-4 rounded-full pt-4"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Artist</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardContent>
                <Image
                  src={sessionData?.user.image ? sessionData?.user.image : ""}
                  width={200}
                  height={200}
                  alt={sessionData?.user.name ? sessionData?.user.name : "user"}
                  className="-mb-4 rounded-full pt-4"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Artist</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardContent>
                <Image
                  src={sessionData?.user.image ? sessionData?.user.image : ""}
                  width={200}
                  height={200}
                  alt={sessionData?.user.name ? sessionData?.user.name : "user"}
                  className="-mb-4 rounded-full pt-4"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Artist</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default UserPage;
