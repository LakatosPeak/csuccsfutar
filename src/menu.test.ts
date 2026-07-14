import { describe, expect, it } from 'vitest';
import { parseTodayMenu } from './menu.js';

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
      <div class="menu-box">
        <div class="title"><h4 class="uppercase">Heti desszert</h4><p>890 Ft</p></div>
        <p>Tonkababos tejberizs</p>
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
    </div>
  </div>
</div>
`;

describe('parseTodayMenu', () => {
  it('picks the Monday row from the weekly menu slide', () => {
    const monday = new Date('2026-07-13T08:00:00Z'); // a Monday
    expect(parseTodayMenu(FIXTURE_HTML, monday)).toEqual({
      day: 'hétfõ (július 13.)',
      price: '2.890 Ft',
      items: ['Vichyssoise', 'Csirkemellfilé rántva'],
    });
  });

  it('picks the Tuesday row', () => {
    const tuesday = new Date('2026-07-14T08:00:00Z');
    expect(parseTodayMenu(FIXTURE_HTML, tuesday)?.day).toBe('kedd (július 14.)');
  });

  it('returns null on weekends', () => {
    const sunday = new Date('2026-07-12T08:00:00Z');
    expect(parseTodayMenu(FIXTURE_HTML, sunday)).toBeNull();
  });

  it('returns null if the weekly slide is missing', () => {
    expect(parseTodayMenu('<div id="menu-swiper"></div>', new Date('2026-07-13T08:00:00Z'))).toBeNull();
  });
});
