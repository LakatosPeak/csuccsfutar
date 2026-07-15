import type { DailyMenu } from './menu.js';

export function buildSlackBlocks(menus: DailyMenu[]): object[] {
  const day = menus[0]?.day ?? '';
  const blocks: object[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `:knife_fork_plate: Csüccs menü — ${day}`, emoji: true },
    },
  ];

  for (const menu of menus) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${menu.category}* — ${menu.price}\n${menu.items.map((i) => `• ${i}`).join('\n')}`,
      },
    });
  }

  blocks.push({
    type: 'context',
    elements: [
      { type: 'mrkdwn', text: ':link: <https://csuccs.com|csuccs.com>' },
      { type: 'mrkdwn', text: 'Sent using Csüccsfutár 2.0' },
    ],
  });

  return blocks;
}

export async function postToSlack(token: string, channel: string, menus: DailyMenu[]): Promise<void> {
  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      channel,
      text: `Csüccs menü — ${menus[0]?.day ?? ''}`, // fallback for notification previews
      blocks: buildSlackBlocks(menus),
    }),
  });

  const body = (await res.json()) as { ok: boolean; error?: string };
  if (!res.ok || !body.ok) {
    throw new Error(`Slack chat.postMessage failed: ${res.status} ${body.error ?? JSON.stringify(body)}`);
  }
}
