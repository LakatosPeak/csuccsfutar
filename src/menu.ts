import * as cheerio from 'cheerio';

export interface DailyMenu {
  category: string;
  day: string;
  price: string;
  items: string[];
}

const DAILY_CATEGORIES = ['Heti Menü', 'Napi 10 perces', 'Napi zöldség püré/krém'];

/** Picks today's row from each day-varying slide. Empty on weekends or if a category has nothing on offer. */
export function parseTodayMenus(html: string, date: Date): DailyMenu[] {
  const weekday = date.getDay(); // 0=Sun..6=Sat
  if (weekday === 0 || weekday === 6) return [];

  const $ = cheerio.load(html);
  const menus: DailyMenu[] = [];

  for (const category of DAILY_CATEGORIES) {
    const slide = $('#menu-swiper .swiper-slide')
      .filter((_, el) => $(el).find('h2').first().text().trim() === category)
      .first();

    const box = slide.find('.menu-box').eq(weekday - 1); // Monday=1 -> index 0
    if (!box.length) continue;

    const day = box.find('.title h4').text().replace(/\s+/g, ' ').trim();
    const price = box.find('.title p').text().trim();
    const itemsHtml = box.children('p').first().html() ?? '';
    const items = itemsHtml
      .split(/<br\s*\/?>/i)
      .map((s) => s.replace(/<[^>]+>/g, '').trim())
      .filter((s) => s && s !== '-');

    if (day && items.length > 0) {
      menus.push({ category, day, price, items });
    }
  }

  return menus;
}
