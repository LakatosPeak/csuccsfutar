import type { DailyMenu } from './menu.js';

export function buildSlackBlocks(menus: DailyMenu[]): object[] {
  const day = menus[0]?.day ?? '';
  const blocks: object[] = [
    { type: 'header', text: { type: 'plain_text', text: `Csüccs napi ajánlat — ${day}` } },
  ];

  for (const menu of menus) {
    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${menu.category}* (${menu.price})\n${menu.items.map((i) => `• ${i}`).join('\n')}`,
      },
    });
  }

  return blocks;
}

export async function postToSlack(webhookUrl: string, menus: DailyMenu[]): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `Csüccs napi ajánlat — ${menus[0]?.day ?? ''}`, // fallback for notification previews
      blocks: buildSlackBlocks(menus),
    }),
  });

  if (!res.ok) {
    throw new Error(`Slack webhook failed: ${res.status} ${await res.text()}`);
  }
}
