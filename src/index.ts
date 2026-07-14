import { parseTodayMenus } from './menu.js';
import { postToSlack } from './slack.js';

const MENU_URL = 'https://csuccs.hu/';

async function main(): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  const res = await fetch(MENU_URL);
  if (!res.ok) throw new Error(`Failed to fetch ${MENU_URL}: ${res.status}`);
  const html = await res.text();

  const menus = parseTodayMenus(html, new Date());
  if (menus.length === 0) {
    console.log('No daily offers today (weekend or none listed) — skipping Slack post.');
    return;
  }

  if (!webhookUrl) {
    console.log('SLACK_WEBHOOK_URL not set — dry run, printing menu instead:\n');
    for (const menu of menus) {
      console.log(`${menu.category} (${menu.price})`);
      menu.items.forEach((i) => console.log(`  - ${i}`));
    }
    return;
  }

  await postToSlack(webhookUrl, menus);
  console.log('Posted to Slack:', menus.map((m) => m.category).join(', '));
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
