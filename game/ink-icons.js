'use strict';
(() => {
const path=d=>`<path d="${d}"/>`,circle=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}"/>`;
const star=path('M16 3l3 10 10 3-10 3-3 10-3-10-10-3 10-3z M16 7v18 M7 16h18');
const sun=circle(16,16,6)+path('M16 2v4m0 20v4M2 16h4m20 0h4M6 6l3 3m14 14 3 3M6 26l3-3M23 9l3-3');
const cloud=path('M7 23c-8-1-5-12 2-11 0-10 15-12 17-2 8-1 9 12 1 13z M8 25h15');
const feather=path('M6 27L22 7M8 23C-1 12 17-2 25 4c8 6-1 19-14 20M12 17l-1-7m5 3 8-1M16 20l8-3');
const wing=path('M16 25C7 23 3 17 3 5l8 6-2-7 12 12-3-1 6 10M5 12l7 5m-5 1 7 4m-3 1 5 3');
const bat=path('M2 6l11 7 3-5 3 5L30 6l-2 18-6-4-3 5-3-3-3 3-3-5-6 4z M4 9l9 8-3 3M28 9l-9 8 3 3M16 10v15');
const flame=path('M18 2c3 9-5 9 0 15 3-2 4-4 4-7 13 14 4 22-6 20C3 29 3 18 11 12c-1 6 2 6 2 6-2-7 6-9 5-16z M16 21c-7 5-1 10 3 6');
const icons={star,clear:sun,sun,cloudy:cloud,auto:star,feather,angel:wing,phoenix:wing,bat,fairy:path('M16 28V9m0 9C1 18 0 1 9 4c5 2 6 9 7 14zm0 0C31 18 32 1 23 4c-5 2-6 9-7 14zM16 20C1 15 3 31 11 27zm0 0c15-5 13 11 5 7z'),butterfly:path('M16 27V10m0 8C6-3-5 8 6 20c-6 12 7 11 10-2zm0 0C26-3 37 8 26 20c6 12-7 11-10-2zM13 5l3 5 3-5'),dragon:bat,none:circle(16,16,11)+path('M8 24L24 8'),flame,
 moon:path('M23 3C2 5 2 28 21 28c5 0 8-3 9-7C13 26 8 10 23 3z'),dawn:path('M3 23h26M7 20a9 9 0 0118 0M16 3v6M4 10l4 4m16 0 4-4M8 27h16'),dusk:path('M3 23h26M7 20a9 9 0 0118 0M16 3v8m-3-3 3 3 3-3M4 10l4 4m16 0 4-4M8 27h16'),rain:cloud+path('M9 26l-2 4m10-4-2 4m10-4-2 4'),snow:path('M16 2v28M4 9l24 14M4 23L28 9M12 5l4 4 4-4M12 27l4-4 4 4M5 14l5-1-1-5M23 24l-1-5 5-1M5 18l5 1-1 5M23 8l-1 5 5 1'),mist:path('M3 10c7-5 11 5 18 0s9 0 9 0M2 16c7-5 11 5 18 0s9 0 9 0M3 22c7-5 11 5 18 0s9 0 9 0'),
 home:path('M3 15L16 4l13 11M7 12v16h18V12M13 28V18h6v10M5 30h22M22 8V3h4v9'),help:circle(16,16,13)+path('M11 10c0-7 13-6 11 1-1 4-6 3-6 9m0 4v1'),pause:path('M9 5h4v22H9zM19 5h4v22h-4z'),close:path('M7 7l18 18M25 7L7 25'),reset:path('M8 10a11 11 0 111 14M8 3v8H1'),sound:path('M4 12h6l8-7v22l-8-7H4zM22 10c5 3 5 9 0 12m4-16c8 6 8 14 0 20'),muted:path('M4 12h6l8-7v22l-8-7H4zM23 12l7 8m0-8-7 8'),run:path('M5 22c-3-9 2-15 8-10l4-3 5 2 5-4 2 8-4 5-8 1-4 5H6z M7 26l-2 4m11-7 2 7M2 19l4 2'),jump:path('M3 24q13-29 26 0M6 12l1 6-6-1M25 12l-1 6 6-1M13 24l3-6 3 6z'),talk:path('M3 5h26v18H15l-8 6v-6H3z M8 11h16M8 16h11'),map:circle(16,16,11)+path('M16 1l4 11 11 4-11 4-4 11-4-11L1 16l11-4zM16 8v16M8 16h16')};
function animal(id){let face;
 if(['bunny','spiritbunny','jackalope','chimerabunny'].includes(id))face=path('M9 15C1-5 12-4 13 13M19 13c1-17 12-18 6 2M7 15c-8 15 25 22 24 3-1-7-13-9-24-3M12 21h1m8 0h1M14 25l2 2 2-2');
 else if(['deer','unicorn','pegasus','kirin'].includes(id))face=path('M9 13L3 8l3 10m17-5 6-5-3 10M10 12c-3 4-1 10 4 17h4c5-7 7-13 4-17zM12 18h1m6 0h1M14 26h4')+path(id==='deer'?'M10 12L7 3M7 8L3 4m4 2 4-4M22 12l3-9m0 5 4-4m-4 2-4-4':'M14 12L16 1l2 11');
 else if(['owl','phoenix','gryphon'].includes(id))face=path('M5 7l7 4h8l7-4v14C23 34 9 34 5 21zM14 21l2 4 2-4M11 26l-2 2m12-2 2 2')+circle(11,17,4)+circle(21,17,4)+path('M11 16v2m10-2v2');
 else if(['cat','tiger','snowleopard'].includes(id))face=path('M5 15L4 3l9 7h6l9-7-1 12c11 22-33 22-22 0zM9 18h3m8 0h3M14 23l2 2 2-2M16 25l-4 2m4-2 4 2M2 22l8 1M1 26l9-1m12-2 8-1m-8 3 9 1');
 else if(id==='bear')face=circle(7,8,4)+circle(25,8,4)+path('M7 11c-8 23 26 25 23 4C28 2 11 2 7 11M10 17h2m8 0h2M12 24q4-9 8 0M14 23l2 2 2-2');
 else if(id==='axolotl')face=path('M8 13C1 33 31 33 24 13 21 7 11 7 8 13zM10 18h1m10 0h1M12 24q4 4 8 0M7 13L1 7m6 11-6-1m6 6-5 5m23-15 6-6m-6 11 6-1m-6 6 5 5');
 else if(id==='bat')face=bat+circle(13,17,1)+circle(19,17,1);
 else if(id==='dragon')face=path('M3 20l8-8-1-9 8 6 8-5-2 12 6 6-6 6H11zM18 16h2M24 24h3M4 25l7 3M16 9l-2-5');
 else if(['otter','ferret'].includes(id))face=path('M5 11c-3-9 7-9 9-3h4c2-6 12-6 9 3 10 23-34 23-22 0zM10 17h2m8 0h2M14 23l2 2 2-2M16 25l-4 2m4-2 4 2');
 else face=path('M5 16L3 3l10 8h6L29 3l-2 13 4 5-13 9h-4L1 21zM7 6l3 7m15-7-3 7M8 18l5 2m11-2-5 2M14 25l2 2 2-2M5 23l5 1m17-1-5 1');
 if(id==='tiger')face+=path('M10 11l3 4m9-4-3 4M5 17l4 3m18-3-4 3');if(['jackalope','chimerabunny'].includes(id))face+=path('M5 14L2 3m0 5 4-3M27 14l3-11m0 5-4-3');return face;
}
function svg(id){return `<svg class="ink-icon" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[id]||animal(id)}</svg>`;}
function decorate(){for(const [id,icon] of Object.entries({help:'help',pause:'pause','map-toggle':'map','close-modal':'close'})){const b=document.getElementById(id);b.setAttribute('aria-label',b.getAttribute('aria-label')||b.title||'Close dialog');b.innerHTML=svg(icon);}
 for(const [id,icon] of Object.entries({wardrobe:'feather',home:'home'}))document.getElementById(id).insertAdjacentHTML('afterbegin',svg(icon));document.querySelector('.brand-icon').innerHTML=svg('star');document.querySelector('#world-settings span').innerHTML=svg('sun');
 const buttons=document.querySelectorAll('.touch-actions button');for(const b of buttons){const name=b.id==='touch-skies'?'sun':b.dataset.key==='shift'?'run':b.dataset.key===' '?'jump':'talk';b.insertAdjacentHTML('afterbegin',svg(name));}}
window.WildwoodIcons={svg,decorate};
})();
