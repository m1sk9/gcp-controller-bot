# gcp-controller-bot

[![build](https://github.com/m1sk9/gcp-controller-bot/actions/workflows/build.yaml/badge.svg)](https://github.com/m1sk9/gcp-controller-bot/actions/workflows/build.yaml)
[![Release gcp-controller-bot](https://github.com/m1sk9/gcp-controller-bot/actions/workflows/release.yaml/badge.svg)](https://github.com/m1sk9/gcp-controller-bot/actions/workflows/release.yaml)

gcp-controller-bot is a discord bot that controls the Google Cloud resources (Compute Engine only).

## Installation

### For Bun

gcp-controller supports Bun v1.0.29 or higher.

Node.js doesn't support.

You can install dependencies with the following command:

```sh
bun install --production
```

Next, you need to create a [`.env` file][env-file] in the root directory of the project. You can use the `.env.example` file as a template.

```sh
cp .env.example .env
```

Then, you need to fill in the [`.env` file][env-file] with your bot token and guild id, your Google Cloud credentials.

Finally, you can start the bot with the following command:

```sh
bun start
```

### For Docker

First, you need to docker compose file.

(You can also obtain and run the Compose files from this repository with curl.)

```yaml
services:
  bot:
    image: ghcr.io/m1sk9/gcp-controller-bot:v0
    restart: always
    env_file:
      - .env
    volumes:
      - ./.env-files:/.env-files
```

Next, you need to create a [`.env` file][env-file] in the root directory of the project. You can use the `.env.example` file as a template.

```sh
cp .env.example .env
```

Then, you need to fill in the [`.env` file][env-file] with your bot token and guild id, your Google Cloud credentials.

Finally, you can start the bot with the following command:

```sh
docker compose up -d
```

## Environment Variables

This table shows the environment variables that you need to set:

| Key | Description |
| --- | ----------- |
| `DISCORD_API_TOKEN` | Your discord bot token. |
| `DISCORD_GUILD_ID` | Your discord guild id. |
| `WHITELIST_USERS` | IDs of users allowed to use the command. (separated by commas) |
| `GCP_PROJECT_ID` | Your Google Cloud project id. |
| `GOOGLE_APPLICATION_CREDENTIALS` | The path to your Google Cloud credentials file. |

[env-file]: #environment-variables
