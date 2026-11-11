# Minecraft Chat Bot

Headless Minecraft (Java Edition) bot that joins a server and sends a chat message every 5 minutes. Reconnects automatically if disconnected.

## Setup

```bash
npm install
```

Requires Node.js 18+.

## Run

```bash
# Cracked / offline-mode server
MC_HOST=play.example.com MC_USERNAME=MyBot MC_AUTH=offline node bot.js

# Real Microsoft account (prints a login link/code on first run, then caches the token)
MC_HOST=play.example.com MC_USERNAME=you@example.com MC_AUTH=microsoft node bot.js
```

On Windows PowerShell:

```powershell
$env:MC_HOST="play.example.com"; $env:MC_USERNAME="MyBot"; $env:MC_AUTH="offline"; node bot.js
```

## Options (environment variables)

| Variable | Default | Notes |
|---|---|---|
| `MC_HOST` | `localhost` | Server address |
| `MC_PORT` | `25565` | Server port |
| `MC_USERNAME` | `ChatBot` | Email for Microsoft auth, any name for offline |
| `MC_AUTH` | `microsoft` | `microsoft` or `offline` |
| `MC_VERSION` | auto | e.g. `1.21.1` |
| `CHAT_INTERVAL_MIN` | `5` | Minutes between messages |
| `MC_MESSAGES` | 3 defaults | Pipe-separated, cycled in order |
| `MC_RANDOM_SUFFIX` | `false` | `true` appends ` | ` plus random letters to each message |
| `MC_PASSWORD` | none | Auto-answers AuthMe-style `/login` and `/register` prompts |

## Keep it running

```bash
npm install -g pm2
pm2 start bot.js --name mc-bot
```

Note: many servers prohibit automated chat or AFK bots. Check the rules and get permission before running this on a server you don't own.
