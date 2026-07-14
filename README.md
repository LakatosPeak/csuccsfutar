# Csüccsfutár 2.0

Fetches today's lunch offers from [csuccs.hu](https://csuccs.hu/) and posts them to a Slack channel
via `chat.postMessage`, using a Slack **user token** so messages post as you (no bot user/seat
needed). Meant to run on a schedule (Railway cron), not as a long-lived service.

## Setup

```
npm install
cp .env.example .env   # fill in SLACK_TOKEN and SLACK_CHANNEL_ID
```

To get those two values:
1. https://api.slack.com/apps → **Create New App** → **From an app manifest** → your workspace →
   paste:
   ```json
   {
     "display_information": { "name": "Csüccsfutár" },
     "oauth_config": { "scopes": { "user": ["chat:write"] } },
     "settings": { "org_deploy_enabled": false, "socket_mode_enabled": false, "token_rotation_enabled": false }
   }
   ```
2. **Basic Information** → **Install App** → **Install to Workspace** (authorizes it to post as you).
3. **OAuth & Permissions** → copy the **User OAuth Token** (`xoxp-...`) → `SLACK_TOKEN`.
4. In Slack, right-click the target channel → **View channel details** → copy the channel ID
   (`C...`) → `SLACK_CHANNEL_ID`. You must be a member of that channel.

## Run

```
npm run build && node --env-file=.env dist/index.js
```

Without `SLACK_TOKEN`/`SLACK_CHANNEL_ID` set, it prints the menu to the console instead of posting
(dry run).

## Test / lint

```
npm test
npm run lint
```

## Deploy

- `main` — development branch, CI runs on push/PR.
- `railway` — the branch Railway's service tracks. Railway config lives in `railway.json`
  (cron schedule, build/start commands). Set `SLACK_TOKEN` and `SLACK_CHANNEL_ID` in the Railway
  service's environment variables.

## How it works

The day-varying offers on csuccs.hu (Heti Menü, Napi 10 perces, Napi zöldség püré/krém) are
server-rendered as `.menu-box` rows (Monday–Friday) inside the `#menu-swiper` slides.
`src/menu.ts` picks today's row from each by weekday index, skipping categories with nothing on
offer (`-`) or on weekends. `src/slack.ts` renders the result as Slack Block Kit sections and posts
via `chat.postMessage`.
