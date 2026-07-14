import { parseTodayMenu } from './menu.js';
import { postToSlack } from './slack.js';

const MENU_URL = 'https://csuccs.hu/';

async function main(): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) throw new Error('SLACK_WEBHOOK_URL env var is required');

  const res = await fetch(MENU_URL);
  if (!res.ok) throw new Error(`Failed to fetch ${MENU_URL}: ${res.status}`);
  const html = await res.text();

  const menu = parseTodayMenu(html, new Date());
  if (!menu) {
    console.log('No lunch menu today (weekend or page layout changed) — skipping Slack post.');
    return;
  }

  await postToSlack(webhookUrl, menu);
  console.log('Posted to Slack:', menu.day);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
