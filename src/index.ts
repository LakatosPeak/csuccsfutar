import { parseTodayMenus } from './menu.js';
import { postToSlack } from './slack.js';

const MENU_URL = 'https://csuccs.hu/';

async function main(): Promise<void> {
  const token = process.env.SLACK_TOKEN;
  const channel = process.env.SLACK_CHANNEL_ID;

  const res = await fetch(MENU_URL);
  if (!res.ok) throw new Error(`Failed to fetch ${MENU_URL}: ${res.status}`);
  const html = await res.text();

  const menus = parseTodayMenus(html, new Date());
  if (menus.length === 0) {
    console.log('No daily offers today (weekend or none listed) — skipping Slack post.');
    return;
  }

  if (!token || !channel) {
    console.log('SLACK_TOKEN/SLACK_CHANNEL_ID not set — dry run, printing menu instead:\n');
    for (const menu of menus) {
      console.log(`${menu.category} (${menu.price})`);
      menu.items.forEach((i) => console.log(`  - ${i}`));
    }
    return;
  }

  await postToSlack(token, channel, menus);
  console.log('Posted to Slack:', menus.map((m) => m.category).join(', '));
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
