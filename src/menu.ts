import * as cheerio from 'cheerio';

export interface DailyMenu {
  day: string;
  price: string;
  items: string[];
}

const WEEKLY_SLIDE_HEADING = 'Heti Menü';

/** Picks today's row from the "Heti Menü" slide. Returns null on weekends or if the page layout changed. */
export function parseTodayMenu(html: string, date: Date): DailyMenu | null {
  const weekday = date.getDay(); // 0=Sun..6=Sat
  if (weekday === 0 || weekday === 6) return null;

  const $ = cheerio.load(html);
  const weeklySlide = $('#menu-swiper .swiper-slide')
    .filter((_, el) => $(el).find('h2').first().text().trim() === WEEKLY_SLIDE_HEADING)
    .first();

  const box = weeklySlide.find('.menu-box').eq(weekday - 1); // Monday=1 -> index 0
  if (!box.length) return null;

  const day = box.find('.title h4').text().replace(/\s+/g, ' ').trim();
  const price = box.find('.title p').text().trim();
  const itemsHtml = box.children('p').first().html() ?? '';
  const items = itemsHtml
    .split(/<br\s*\/?>/i)
    .map((s) => s.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  if (!day || items.length === 0) return null;
  return { day, price, items };
}
