import { describe, expect, it } from 'vitest';
import { buildSlackBlocks } from './slack.js';
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
