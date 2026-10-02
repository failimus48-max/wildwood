'use strict';
(() => {
class CottageAmbience {
 constructor(){this.lantern=[-5.4,2.18,18.8];this.windows=[[-10,1.7,18.08],[-6,1.7,18.08]];this.flowers=[];const beds=[[-13,21],[-3,21],[17,17],[-19,-8],[-23,-14]];for(let i=0;i<30;i++){const b=beds[i%5],angle=i*2.399;this.flowers.push([b[0]+Math.cos(angle)*(1+i%3*.4),b[1]+Math.sin(angle)*(1+i%4*.25)]);}this.fireflies=Array.from({length:32},(_,i)=>{const b=i<16?[-8,22]:i<24?[-20,-12]:[WildwoodPond.x,WildwoodPond.z];return [b[0]+Math.sin(i*2.4)*5,b[1]+Math.cos(i*1.7)*4];});}
 staticMesh(){const m=new MythicMesh.Mesh();m.ellipsoid(-8,-.75,10.3,7.8,5.1,7.7,'#839e6d',false,28,16);m.ellipsoid(-8,2.75,15.5,3.28,1.35,2.65,'#aa815e',false,24,12);m.box(-8,0,15.55,6.2,3.05,5,'#e5cba1');m.link([-11.12,.05,18.1],[-11.12,3.04,18.1],.12,'#826148');m.link([-4.88,.05,18.1],[-4.88,3.04,18.1],.12,'#826148');m.link([-11.12,3.04,18.1],[-4.88,3.04,18.1],.13,'#826148');
  // Rounded wooden door and a curved door frame.
  m.box(-8,0,18.105,1.4,1.75,.08,'#77845b');m.ellipsoid(-8,1.75,18.105,.7,.66,.045,'#77845b');for(let i=0;i<4;i++)m.link([-8.52+i*.35,.07,18.16],[-8.52+i*.35,1.85,18.16],.018,'#606f4b');for(let i=0;i<16;i++){const a=i/16*Math.PI,b=(i+1)/16*Math.PI;m.link([-8+Math.cos(a)*.78,1.75+Math.sin(a)*.74,18.16],[-8+Math.cos(b)*.78,1.75+Math.sin(b)*.74,18.16],.075,'#8f7353');}m.ellipsoid(-8.45,1.05,18.24,.055,.055,.03,'#d7b56b');m.box(-8,.02,18.85,2,.14,1.25,'#afa68b');m.box(-8,.04,19.7,2.4,.1,.65,'#bfb393');
  for(const p of this.windows){m.ellipsoid(...p,.58,.58,.04,'#8eafa9');for(let i=0;i<24;i++){const a=i/24*6.283,b=(i+1)/24*6.283;m.link([p[0]+Math.cos(a)*.65,p[1]+Math.sin(a)*.65,p[2]+.04],[p[0]+Math.cos(b)*.65,p[1]+Math.sin(b)*.65,p[2]+.04],.075,'#8e7151');}m.link([p[0]-.53,p[1],p[2]+.1],[p[0]+.53,p[1],p[2]+.1],.035,'#8e7151');m.link([p[0],p[1]-.53,p[2]+.1],[p[0],p[1]+.53,p[2]+.1],.035,'#8e7151');m.box(p[0],p[1]-.8,p[2]+.12,1.5,.2,.35,'#9c7855');for(let i=0;i<5;i++)m.ellipsoid(p[0]-.55+i*.28,p[1]-.5,p[2]+.2,.17,.14,.14,i%2?'#afbb81':'#b1a4cb');}
  m.box(-6.5,3.1,14.6,.74,2.1,.74,'#a28b75');m.box(-6.5,5.15,14.6,1,.17,1,'#796b5a');m.box(-6.5,5.3,14.6,.55,.05,.55,'#3d4742');
  const [x,y,z]=this.lantern;m.link([x,y+.75,18.08],[x,y+.75,z],.045,'#584d3d');m.link([x,y+.75,z],[x,y+.22,z],.025,'#584d3d');m.box(x,y-.28,z,.42,.055,.42,'#66513e');m.ellipsoid(x,y+.22,z,.28,.1,.28,'#66513e');for(const a of [-1,1])for(const b of [-1,1])m.link([x+a*.16,y-.23,z+b*.16],[x+a*.16,y+.2,z+b*.16],.027,'#66513e');m.ellipsoid(x,y,z,.16,.23,.16,'#ffd28d',true);
  for(const [x,z] of this.flowers){m.link([x,.03,z],[x,.53,z],.023,'#587861');for(let i=0;i<5;i++){const a=i/5*6.283;m.ellipsoid(x+Math.cos(a)*.12,.54,z+Math.sin(a)*.12,.095,.07,.095,'#263b91',false,8,5);}m.ellipsoid(x,.58,z,.065,.045,.065,'#445ba0',false,8,4);m.ellipsoid(x+.1,.21,z,.13,.035,.08,'#5c825a',false,8,4);}
  return new Float32Array(m.data);
 }
 dynamic(t,day,eye){const m=new MythicMesh.Mesh(),glow=[],night=Math.max(0,1-day*1.7),[x,y,z]=this.lantern;m.ellipsoid(x,y+.02,z,.08,.16,.08,'#fff1c7',true,10,6);const append=d=>{for(const n of d)glow.push(n);};append(MythicMesh.glow(this.lantern,'#ffc786',eye,.9,.12+night*.5));if(night>.01){for(const p of this.windows){m.ellipsoid(p[0],p[1],p[2]+.045,.52,.52,.023,'#e6bf81',true,18,10);m.link([p[0]-.51,p[1],p[2]+.11],[p[0]+.51,p[1],p[2]+.11],.035,'#8e7151');m.link([p[0],p[1]-.51,p[2]+.11],[p[0],p[1]+.51,p[2]+.11],.035,'#8e7151');append(MythicMesh.glow([p[0],p[1],p[2]+.07],'#efc78a',eye,.9,night*.08));}
   for(const [x,z] of this.flowers){m.ellipsoid(x,.59,z,.065,.045,.065,'#81b3ff',true,7,4);append(MythicMesh.glow([x,.56,z],'#376ce4',eye,.35,night*.3));}
   for(let i=0;i<this.fireflies.length;i++){const p=this.fireflies[i],pos=[p[0]+Math.sin(t*.55+i)*.8,.65+(i%5)*.26+Math.sin(t*.9+i*2)*.3,p[1]+Math.cos(t*.4+i)*.7],twinkle=(.4+.6*Math.pow(Math.sin(t*1.2+i),2))*night;m.ellipsoid(...pos,.027,.034,.027,'#ffec9c',true,5,3);append(MythicMesh.glow(pos,'#ffe39c',eye,.13,twinkle*.8));}
  }
  return {solid:new Float32Array(m.data),glow:new Float32Array(glow),night,fireflies:night>.01?this.fireflies.length:0};
 }
 smoke(t,day){const m=new MythicMesh.Mesh();for(let i=0;i<7;i++){const p=(t*.13+i/7)%1,scale=.14+p*.36,x=-6.5+p*1.4+Math.sin(t*.6+i)*p*.16,y=5.4+p*3.5,z=14.6+Math.sin(t*.5+i)*p*.2;m.ellipsoid(x,y,z,scale,scale*.9,scale,day>.4?'#d1d5cb':'#63717b',false,9,5);}return new Float32Array(m.data);}
}
window.CottageAmbience=CottageAmbience;
})();

