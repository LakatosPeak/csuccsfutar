import type { DailyMenu } from './menu.js';

export async function postToSlack(webhookUrl: string, menu: DailyMenu): Promise<void> {
  const text = `*Csüccs napi menü — ${menu.day}* (${menu.price})\n${menu.items.join('\n')}`;

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Slack webhook failed: ${res.status} ${await res.text()}`);
  }
}
