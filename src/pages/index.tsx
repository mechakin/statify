import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";
import { getProviders, signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SpotifyIcon } from "~/components/icons";
import { PageLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { authOptions } from "~/server/auth";

const Home = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: sessionData } = useSession();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || ref.current === null) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        setRotation({ x: -y / 36, y: x / 48 });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Statify</title>
        <meta
          name="description"
          content="Check out all of your spotify stats here!"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content="Statify" />
        <meta
          name="og:description"
          content="Check out all of your spotify stats here!"
        />
        <meta
          property="og:image"
          content={`${
            process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""
          }/api/og-image`}
        />
        <meta
          property="twitter:image"
          content={`${
            process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""
          }/api/og-image`}
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Statify" />
        <meta
          property="twitter:description"
          content="Check out all of your spotify stats here!"
        />
      </Head>
      <PageLayout id="">
        <div className="grid h-screen lg:grid-cols-2">
          <div className="flex flex-col items-center justify-center gap-8">
            <h1 className="text-8xl font-bold leading-tight tracking-tighter lg:leading-[1.1]">
              Statify
            </h1>
            <p className="max-w-lg text-center text-lg text-muted-foreground sm:text-xl">
              Learn more about your Spotify listening history with personalized
              stats and moods for your favorite songs.
            </p>
            {!sessionData &&
              Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  <Button
                    onClick={() => void signIn(provider.id)}
                    size={"lg"}
                    className="text-xl"
                  >
                    Login
                  </Button>
                </div>
              ))}
            {sessionData && (
              <Button size={"lg"} className="text-xl">
                <Link href={`/${sessionData.user.id}`}>View your statify</Link>
              </Button>
            )}
          </div>
          <div
            ref={ref}
            className="m-auto hidden flex-col items-center justify-center lg:flex"
            style={{
              transform: `perspective(500px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transition: "transform 0.1s linear",
            }}
          >
            <SpotifyIcon className="fill-black dark:fill-white lg:w-96" />
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: `/${session.user.id}` } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
