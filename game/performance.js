'use strict';
(() => {
 const mobile=matchMedia('(pointer:coarse)').matches||/Android/i.test(navigator.userAgent);
 window.WildwoodPerformance={mobile,targetFps:mobile?30:60,pixelRatioCap:mobile?1.25:1.6,meshSegments:mobile?18:32,meshRings:mobile?10:24,npcInterval:mobile?1/12:1/24,frames:0,averageDrawMs:0};
})();
