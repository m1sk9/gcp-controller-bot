# gcp-controller-bot

gcp-controller-bot is a discord bot that controls the Google Cloud resources (Compute Engine only).

> [!IMPORTANT]
>
> This bot is still in development and is not ready for production use.

**Todo:**

- [ ] Add instance launch commands.
- [ ] Add instance shutdown commands.

- [ ] Add instance restart command

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

TODO: Add docker-compose file.

Next, you need to create a [`.env` file][env-file] in the root directory of the project. You can use the `.env.example` file as a template.

```sh
cp .env.example .env
```

Then, you need to fill in the [`.env` file][env-file] with your bot token and guild id, your Google Cloud credentials.

Finally, you can start the bot with the following command:

```sh
docker compose up -d
```

## Usage

TODO: Add usage.

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
