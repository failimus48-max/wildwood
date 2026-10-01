'use strict';
(() => {
const stones=[
 {x:-17,z:6,title:'The Listening Grove',color:'#a7d9b9',poem:'The moss remembers every rain,\nThe roots keep watch beneath the sky.\nLay down the weight you need not name,\nAnd let the little lights drift by.'},
 {x:-23,z:-10,title:'The Unhurried Path',color:'#c1b3eb',poem:'No crown awaits beyond the trees,\nNo bell will bid your feet be fast.\nGo softly with the wandering breeze;\nA moment held is never past.'},
 {x:-5,z:-22,title:'The Moonseed',color:'#b9d3f4',poem:'A seed of silver sleeps below,\nWhere daylight leaves its golden thread.\nThe dark is not the end of glow;\nThe stars are gardens overhead.'},
 {x:21,z:-19,title:'The Name of Light',color:'#edc69c',poem:'You need not burn like distant suns,\nNor turn the winter fields to gold.\nOne little flame beside you runs,\nAnd warms the road when nights are cold.'},
 {x:28,z:3,title:'The Shallow Song',color:'#94d8e1',poem:'The water wears a thousand rings,\nThen lays them gently on the shore.\nEach footstep wakes a song it sings;\nNo wave has walked this way before.'},
 {x:13,z:20,title:'The Lantern',color:'#f1d092',poem:'Beyond the hill, a window glows,\nA thread of smoke unknots the blue.\nWherever your small spirit goes,\nThe door remembers room for you.'},
 {x:-20,z:25,title:'The Snow Dream',color:'#d7e6ef',poem:'The snow lets every branch forget\nThe heavy names the summer knew.\nBe still; the world is dreaming yet,\nAnd saves a softer place for you.'},
 {x:0,z:29,title:'The Wild Within',color:'#dea7d2',poem:'A feather, antler, velvet paw,\nA wish the waking world has missed.\nBecome the wonder that you saw;\nYour gentlest wish may yet exist.'}
];
function rune(m,stone,glowing){const col=glowing?stone.color:'#536a69',x=stone.x,z=stone.z+.45;const line=(a,b)=>m.link([x+a[0],a[1],z],[x+b[0],b[1],z],.026,col,.026,glowing);line([0,.75],[0,2.12]);line([0,1.8],[-.35,1.43]);line([0,1.8],[.35,1.43]);line([0,1.15],[-.27,.92]);line([0,1.15],[.27,.92]);line([-.21,2.12],[.21,2.12]);}
class RunestoneGarden {
 constructor(){this.stones=stones;}
 staticMesh(){const m=new MythicMesh.Mesh();for(const stone of stones){m.disk(stone.x,.02,stone.z,1.6,'#b5bb94');m.ellipsoid(stone.x,1.22,stone.z,.85,1.45,.45,'#929f95',false,13,9);m.ellipsoid(stone.x-.58,.16,stone.z+.16,.55,.18,.38,'#758e65',false,9,5);m.ellipsoid(stone.x+.4,.23,stone.z-.1,.46,.25,.32,'#7f986b',false,9,5);rune(m,stone,false);}return new Float32Array(m.data);}
 dynamic(day,eye){const m=new MythicMesh.Mesh(),g=[];for(const stone of stones){rune(m,stone,true);for(const v of MythicMesh.glow([stone.x,1.45,stone.z+.48],stone.color,eye,.7,.025+(1-day)*.075))g.push(v);}return {solid:new Float32Array(m.data),glow:new Float32Array(g)};}
 nearest(x,z){return stones.find(s=>Math.hypot(s.x-x,s.z-z)<2.7)||null;}
}
window.RunestoneGarden=RunestoneGarden;
})();
