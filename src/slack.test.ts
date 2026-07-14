import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildSlackBlocks, postToSlack } from './slack.js';
import type { DailyMenu } from './menu.js';

describe('buildSlackBlocks', () => {
  it('renders a header plus one section per category', () => {
    const menus: DailyMenu[] = [
      { category: 'Heti Menü', day: 'kedd (július 14.)', price: '2.890 Ft', items: ['Leves', 'Főétel'] },
      { category: 'Napi 10 perces', day: 'kedd (július 14.)', price: '2250 Ft', items: ['Tészta'] },
    ];

    const blocks = buildSlackBlocks(menus);

    expect(blocks[0]).toEqual({
      type: 'header',
      text: { type: 'plain_text', text: 'Csüccs napi ajánlat — kedd (július 14.)' },
    });
    expect(blocks).toHaveLength(1 + menus.length * 2); // header + (divider + section) per category
    expect(blocks[2]).toEqual({
      type: 'section',
      text: { type: 'mrkdwn', text: '*Heti Menü* (2.890 Ft)\n• Leves\n• Főétel' },
    });
  });
});

describe('postToSlack', () => {
  const menus: DailyMenu[] = [
    { category: 'Heti Menü', day: 'kedd (július 14.)', price: '2.890 Ft', items: ['Leves'] },
  ];

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a bearer token and channel to chat.postMessage', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await postToSlack('xoxp-token', 'C123', menus);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://slack.com/api/chat.postMessage',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer xoxp-token' }),
      }),
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.channel).toBe('C123');
  });

  it('throws when Slack returns ok:false with HTTP 200 (e.g. channel_not_found)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ok: false, error: 'channel_not_found' }),
      }),
    );

    await expect(postToSlack('xoxp-token', 'C123', menus)).rejects.toThrow('channel_not_found');
  });
});
