'use strict';
(() => {
 const touch=window.WildwoodTouch={x:0,z:0};
 const layer=document.createElement('div');layer.id='mobile-controls';
 layer.innerHTML='<div id="touch-stick" aria-label="Movement joystick"><span></span></div><div class="touch-actions"><button data-key="shift" aria-label="Hold to run">Run</button><button data-key=" " aria-label="Jump">Jump</button><button data-key="e" aria-label="Interact">Talk / read</button><button id="touch-skies">Skies</button></div>';
 document.body.append(layer);
 const stick=document.getElementById('touch-stick'),nub=stick.querySelector('span');let pointer=null;
 const reset=()=>{touch.x=touch.z=0;nub.style.transform='translate(0,0)';pointer=null;};
 function move(e){const r=stick.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dz=e.clientY-r.top-r.height/2,l=Math.hypot(dx,dz),scale=l>42?42/l:1;touch.x=l<6?0:dx*scale/42;touch.z=l<6?0:dz*scale/42;nub.style.transform=`translate(${dx*scale}px,${dz*scale}px)`;}
 stick.onpointerdown=e=>{e.preventDefault();pointer=e.pointerId;stick.setPointerCapture(pointer);move(e);};
 stick.onpointermove=e=>{if(e.pointerId===pointer)move(e);};stick.onpointerup=reset;stick.onpointercancel=reset;stick.onlostpointercapture=reset;
 const held=new Set();function key(k,type){window.dispatchEvent(new KeyboardEvent(type,{key:k,bubbles:true}));}
 for(const button of layer.querySelectorAll('[data-key]')){const k=button.dataset.key;button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);held.add(k);key(k,'keydown');};const release=()=>{held.delete(k);key(k,'keyup');};button.onpointerup=release;button.onpointercancel=release;button.onlostpointercapture=release;}
 document.getElementById('touch-skies').onclick=()=>document.getElementById('world-settings').click();
 const clear=()=>{reset();for(const k of held)key(k,'keyup');held.clear();};window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
 new MutationObserver(()=>{const open=!document.getElementById('modal').hidden;layer.hidden=open;if(open)clear();}).observe(document.getElementById('modal'),{attributes:true,attributeFilter:['hidden']});
 layer.hidden=!document.getElementById('modal').hidden;
})();
