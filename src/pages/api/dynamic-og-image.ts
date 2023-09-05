import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";
import React from "react";

export const config = {
  runtime: "edge",
};

export default function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get("userid");
  const username = searchParams.get("username")

  if (!userId || !username) {
    const element = React.createElement(
      "div",
      {},
      "visit with ?userid= and ?username="
    );

    return new ImageResponse(element, {
      width: 1200,
      height: 630,
    });
  }

  const element = React.createElement(
    "div",
    {
      style: {
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#030711",
        fontSize: 80,
        letterSpacing: -5,
        fontWeight: 700,
        textAlign: "center",
        paddingTop: 75,
      },
    },
    React.createElement(
      "img",
      {
        alt: `${username}'s profile picture`,
        height: 300,
        quality: 100,
        width: 300,
        src: `https://i.scdn.co/image/${userId}`,
        style: { borderRadius: 9999 },
      },
    ),
    React.createElement(
      "p",
      {
        style: { backgroundClip: "text", color: "#E1E7EF",    
      },
      },
      `${username}'s statify`
    )
  );
  return new ImageResponse(element, {
    width: 1200,
    height: 630,
  });
}
