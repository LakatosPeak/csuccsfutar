import { describe, expect, it } from 'vitest';
import { parseTodayMenus } from './menu.js';

const FIXTURE_HTML = `
<div id="menu-swiper" class="swiper-wrapper">
  <div class="swiper-slide">
    <div class="col-sm-24">
      <h2>Heti Menü</h2>
      <div class="menu-box">
        <div class="title"><h4 class="uppercase">hétfõ (július 13.)</h4><p>2.890 Ft</p></div>
        <p>Vichyssoise<br>Csirkemellfilé rántva</p>
      </div>
      <div class="menu-box">
        <div class="title"><h4 class="uppercase">kedd (július 14.)</h4><p>2.890 Ft</p></div>
        <p>Bárány csorba<br>Mexikói csirkecomb filé</p>
      </div>
    </div>
  </div>
  <div class="swiper-slide">
    <div class="col-sm-24">
      <h2>Napi 10 perces</h2>
      <div class="menu-box">
        <div class="title"><h4 class="uppercase">hétfõ (július 13.)</h4><p>2250 Ft</p></div>
        <p>Cukkinis, tojásos lecsó</p>
      </div>
      <div class="menu-box">
        <div class="title"><h4 class="uppercase">kedd (július 14.)</h4><p>2250 Ft</p></div>
        <p>Papfojtó tészta</p>
      </div>
    </div>
  </div>
  <div class="swiper-slide">
    <div class="col-sm-24">
      <h2>Napi zöldség püré/krém</h2>
      <div class="menu-box">
        <div class="title"><h4 class="uppercase">hétfõ (július 13.)</h4><p>890 Ft</p></div>
        <p>-</p>
      </div>
      <div class="menu-box">
        <div class="title"><h4 class="uppercase">kedd (július 14.)</h4><p>890 Ft</p></div>
        <p>-</p>
      </div>
    </div>
  </div>
  <div class="swiper-slide">
    <div class="col-sm-24">
      <h2>Kávék, teák</h2>
      <div class="menu-box">
        <div class="title"><h4 class="uppercase">Ristretto</h4><p>500 Ft</p></div>
      </div>
    </div>
  </div>
</div>
`;

describe('parseTodayMenus', () => {
  it('returns all day-varying categories for Monday, skipping empty ones', () => {
    const monday = new Date('2026-07-13T08:00:00Z'); // a Monday
    expect(parseTodayMenus(FIXTURE_HTML, monday)).toEqual([
      {
        category: 'Heti Menü',
        day: 'hétfõ (július 13.)',
        price: '2.890 Ft',
        items: ['Vichyssoise', 'Csirkemellfilé rántva'],
      },
      {
        category: 'Napi 10 perces',
        day: 'hétfõ (július 13.)',
        price: '2250 Ft',
        items: ['Cukkinis, tojásos lecsó'],
      },
      // Napi zöldség püré/krém omitted: only "-" on offer
    ]);
  });

  it('picks the Tuesday row for each category', () => {
    const tuesday = new Date('2026-07-14T08:00:00Z');
    const menus = parseTodayMenus(FIXTURE_HTML, tuesday);
    expect(menus.map((m) => m.category)).toEqual(['Heti Menü', 'Napi 10 perces']);
    expect(menus[0].day).toBe('kedd (július 14.)');
  });

  it('returns empty on weekends', () => {
    const sunday = new Date('2026-07-12T08:00:00Z');
    expect(parseTodayMenus(FIXTURE_HTML, sunday)).toEqual([]);
  });

  it('returns empty if the page layout is missing all daily slides', () => {
    expect(parseTodayMenus('<div id="menu-swiper"></div>', new Date('2026-07-13T08:00:00Z'))).toEqual([]);
  });
});
