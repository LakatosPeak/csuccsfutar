# Csüccsfutár 2.0

Fetches today's lunch menu from [csuccs.hu](https://csuccs.hu/) and posts it to a Slack channel via
incoming webhook. Meant to run on a schedule (Railway cron), not as a long-lived service.

## Setup

```
npm install
cp .env.example .env   # fill in SLACK_WEBHOOK_URL
```

## Run

```
npm run build && node --env-file=.env dist/index.js
```

## Test / lint

```
npm test
npm run lint
```

## Deploy

- `main` — development branch, CI runs on push/PR.
- `railway` — the branch Railway's service tracks. Railway config lives in `railway.json`
  (cron schedule, build/start commands). Set `SLACK_WEBHOOK_URL` in the Railway service's
  environment variables.

## How it works

The weekly menu on csuccs.hu is server-rendered as five `.menu-box` rows (Monday–Friday) inside
the `#menu-swiper` "Heti Menü" slide. `src/menu.ts` picks today's row by weekday index and returns
`null` on weekends, so the cron run is a no-op on Sat/Sun.
