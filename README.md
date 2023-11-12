![demo](https://media.discordapp.net/attachments/1106206570091663410/1163612175546458213/demo-1.png?ex=65403549&is=652dc049&hm=6ffce081a06be2c2dee04be19706877a6eebaf39ef70c239fcfcf0c28a4ede08&=&width=954&height=537)

## About

Statify lets you see your top artists, favorite tracks, and what you've been listening to recently, with extra details about each song listed. You can also create and save playlists of recommended songs based on what you already love. 

You can see the website live in action here: [https://youtu.be/DwYvO98_IYk]

## Contributing

To contribute you will first need to fork the repo and make some adjustments to get it up and running on your local machine. Below are the steps to follow for you to get TypeHero to run on your local machine.

1. Create a `env` file
   Provide your values as needed. The .env values can be seen in the `.env.example` file.

2. Configure your database
   You can use PlanetScale to run your database by [following this link.](https://planetscale.com/docs/tutorials/planetscale-quick-start-guide) After creating an account and creating a database, click the big connect button, select connect with Prisma and then copy the `DATABASE_URL` for your `.env` file.

3. Create a new Spotify application
   [Follow this link](https://developer.spotify.com/documentation/web-api/concepts/apps) to create a new app filling the following required details on creation:

   ```
   Website: http://localhost:3000/
   Redirect URI: http://localhost:3000/api/auth/callback/spotify
   ```

   Once completed, you will be redirected to the application page settings. From there, copy the `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` into the `.env` file.

In the end your local `.env` file should look something like the following:

```
DATABASE_URL='mysql://dev:dev@localhost/statify'

# Next Auth
# You can generate a new secret on the command line with:
# openssl rand -base64 32
# https://next-auth.js.org/configuration/options#secret

NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

SPOTIFY_CLIENT_ID="real_client_id"
SPOTIFY_CLIENT_SECRET="real_client_id"
```

5. Install dependencies
   Use pnpm to install dependencies.

   ```
   pnpm install
   ```

6. Push database schema

   ```
   pnpm prisma db push
   ```

7. Running the dev server
   Finally, you can run the dev server:

   ```
   pnpm dev
   ```
