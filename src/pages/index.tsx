import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn, useSession } from "next-auth/react";
import Head from "next/head";
import React, { useState, useEffect, useRef } from "react";
import { SpotifyIcon } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { PageLayout } from "~/components/layout";
import { getServerSession } from "next-auth";
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
        <title>statify</title>
        <meta
          name="description"
          content="gather all of your spotify stats here"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        {!sessionData && (
          <div className="grid h-screen lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center gap-8">
              <h1 className="text-8xl font-bold leading-tight tracking-tighter lg:leading-[1.1]">
                Statify
              </h1>
              <p className="max-w-lg text-center text-lg text-muted-foreground sm:text-xl">
                Learn more about your Spotify listening history with
                personalized stats and moods for your favorite songs.
              </p>
              {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  <Button
                    onClick={() => void signIn(provider.id)}
                    className="text-xl"
                  >
                    Login
                  </Button>
                </div>
              ))}
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
        )}
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
