'use strict';
(() => {
class NightlightBoat {
 constructor(){
  this.name='Nightlight Boat';this.position=[0,-.08,-56.7];this.lastTime=-Infinity;
  const m=new MythicMesh.Mesh(),segments=WildwoodPerformance.mobile?40:48,bezier=(a,b,c,d,t)=>a*(1-t)**3+3*b*(1-t)**2*t+3*c*(1-t)*t*t+d*t**3;
  // Upright crescent: a tall back curves around a broad, open lower seat.
  const curve=(t,inside,z)=>[bezier(.65,inside?-1.65:-3.8,inside?-1.25:-3.6,2.7,t),bezier(5.3,inside?4.35:5.2,inside?.9:-2.2,.85,t),z*Math.sin(t*Math.PI)**.35];
  for(let i=0;i<segments;i++){const a=i/segments,b=(i+1)/segments;for(const side of [-1,1]){const p=curve(a,false,side*.78),q=curve(b,false,side*.78),r=curve(a,true,side*.78),v=curve(b,true,side*.78);m.triangle(p,q,r,'#bde9fa',true);m.triangle(q,v,r,'#bde9fa',true);m.link(r,v,.027,'#82b9d5',.027,true);}for(const inner of [false,true]){const p=curve(a,inner,-.78),q=curve(b,inner,-.78),r=curve(a,inner,.78),v=curve(b,inner,.78);m.triangle(p,r,q,inner?'#91bbce':'#a6cede',inner);m.triangle(q,r,v,inner?'#91bbce':'#a6cede',inner);}}
  // A wide cushioned bench nestles inside the lower moon; its center is the usable seat.
  for(let i=0;i<12;i++)m.box(-.72+i*.25,1.02,0,.23,.12,1.40,i%2?'#84a8ba':'#9bbdcf');
  m.ellipsoid(.65,1.17,0,1.37,.10,.73,'#d5f0ff',false,24,12);
  this.seat=[.65,1.25,.03];this.lanternLocal=[2.25,5.42,0];
  m.link([2.25,1.1,0],[2.25,5.18,0],.06,'#779db6',.038);m.link([2.25,2.05,0],[3.62,2.12,0],.035,'#779db6',.025);
  // A softly billowed triangular sail, stitched with a star-shaped crest.
  const sail=(u,v)=>[2.35+u*1.32,4.85-u*2.68-v*2.72,.04+Math.sin(u*Math.PI)*Math.sin(v*Math.PI)*.45],n=12;
  for(let i=0;i<n;i++)for(let j=0;j<n-i;j++){const p=sail(i/n,j/n),q=sail((i+1)/n,j/n),r=sail(i/n,(j+1)/n);m.triangle(p,q,r,'#d5efff');m.triangle(r,q,p,'#bad9ef');if(i+j<n-1){const s=sail((i+1)/n,(j+1)/n);m.triangle(q,s,r,'#d5efff');m.triangle(r,s,q,'#bad9ef');}}
  for(const [a,b] of [[[2.35,4.85,.04],[3.67,2.17,.04]],[[3.67,2.17,.04],[2.35,2.13,.04]],[[2.35,2.13,.04],[2.35,4.85,.04]]])m.link(a,b,.013,'#8db8d2',.013);
  const star=(x,y,z,r,col)=>{const p=[];for(let i=0;i<8;i++){const a=i*Math.PI/4,k=i%2?r*.26:r;p.push([x+Math.sin(a)*k,y+Math.cos(a)*k,z]);}for(let i=0;i<8;i++)m.triangle([x,y,z],p[i],p[(i+1)%8],col,true);};star(2.75,3.15,.48,.22,'#8bc8e8');
  // An icy-blue lantern crowns the mast, beneath a silver-blue star finial.
  const y=5.42,x0=2.25;m.box(x0,y-.26,0,.36,.05,.36,'#6e91ac');m.box(x0,y+.23,0,.42,.06,.42,'#6e91ac');for(const x of [-.14,.14])for(const z of [-.14,.14])m.link([x+x0,y-.22,z],[x+x0,y+.23,z],.018,'#6e91ac');m.ellipsoid(x0,y,0,.105,.20,.105,'#dcf6ff',true,10,7);m.link([x0,y+.27,0],[x0,y+.47,0],.035,'#8ebcda',.02);star(x0,y+.56,.01,.14,'#c5edff');
  // A second lantern hangs inside the moon from its uppermost horn.
  this.tipLanternLocal=[.68,4.46,.14];
  m.link([.65,5.30,0],[.68,5.30,.14],.018,'#8ebcda',.018);
  for(let i=0;i<5;i++){const y=5.25-i*.10,z=.14,w=.027;const loop=[[.68,y+.055,z],[.68+w,y,z],[.68,y-.055,z],[.68-w,y,z]],inner=loop.map(p=>[.68+(p[0]-.68)*.58,y+(p[1]-y)*.72,z]);for(let j=0;j<4;j++){const k=(j+1)%4;m.triangle(loop[j],inner[j],loop[k],'#8ebcda',true);m.triangle(loop[k],inner[j],inner[k],'#8ebcda',true);}}
  const [lx,ly,lz]=this.tipLanternLocal;m.box(lx,ly-.25,lz,.40,.05,.40,'#6e91ac');m.ellipsoid(lx,ly+.25,lz,.26,.085,.26,'#8ebcda',false,12,6);m.link([lx,ly+.30,lz],[lx,4.80,lz],.018,'#8ebcda',.018);
  for(const x of [-.16,.16])for(const z of [-.16,.16])m.link([lx+x,ly-.22,lz+z],[lx+x,ly+.23,lz+z],.018,'#6e91ac',.018);
  m.ellipsoid(lx,ly,lz,.13,.20,.13,'#dcf6ff',true,12,8);
  this.local=new Float32Array(m.data);this.solid=null;
 }
 seatPosition(t){const p=this.pose(t),cs=Math.cos(p.roll),sn=Math.sin(p.roll),[x,y,z]=this.seat;return [x*cs-y*sn,this.position[1]+p.bob+x*sn+y*cs,this.position[2]+z];}
 pose(t){return {bob:Math.sin(t*.68)*.045+Math.sin(t*.83)*.018,roll:Math.sin(t*.52)*.013};}
 dynamic(t,day,eye){const night=Math.max(0,Math.min(1,1-day*1.7)),pose=this.pose(t),cs=Math.cos(pose.roll),sn=Math.sin(pose.roll),point=p=>[p[0]*cs-p[1]*sn,this.position[1]+pose.bob+p[0]*sn+p[1]*cs,this.position[2]+p[2]];
  if(!this.solid||Math.abs(t-this.lastTime)>.08){const data=new Float32Array(this.local);for(let i=0;i<data.length;i+=9){const p=point([data[i],data[i+1],data[i+2]]);data.set(p,i);if(data[i+4]<2){const x=data[i+3],y=data[i+4];data[i+3]=x*cs-y*sn;data[i+4]=x*sn+y*cs;}}const ropes=new MythicMesh.Mesh();for(const side of [-1,1]){const a=[side*2.5,.8,-52.9],b=point([side*2.1,.75,.55]);let prev=a;for(let i=1;i<=8;i++){const u=i/8,p=a.map((v,k)=>v+(b[k]-v)*u-(k===1?Math.sin(u*Math.PI)*.35:0));ropes.link(prev,p,.018,'#abc5d3',.018);prev=p;}}const joined=new Float32Array(data.length+ropes.data.length);joined.set(data);joined.set(ropes.data,data.length);this.solid=joined;this.lastTime=t;}
  const glow=[],add=d=>{for(const v of d)glow.push(v);};add(MythicMesh.glow(point(this.lanternLocal),'#a5e4ff',eye,.85,.08+night*.45));add(MythicMesh.glow(point(this.tipLanternLocal),'#b1e9ff',eye,.95,.08+night*.5));if(night>.01){add(MythicMesh.glow(point([0,.55,0]),'#9cdcff',eye,3.3,night*.14));for(const side of [-1,1])add(MythicMesh.glow(point(side<0?[.65,5.3,0]:[2.7,.85,0]),'#b1e9ff',eye,.55,night*(.23+Math.sin(t*.9+side)**2*.08)));}
  return {solid:this.solid,glow:new Float32Array(glow),night,lantern:point(this.lanternLocal),tipLantern:point(this.tipLanternLocal),bob:pose.bob};
 }
 diagnostics(day=1){return {name:this.name,position:[...this.position],mastheadLantern:true,crescentTipLantern:[...this.tipLanternLocal],uprightCrescent:true,seat:[...this.seat],nightGlow:Math.max(0,1-day*1.7),vertices:this.local.length/9,moored:true};}
}
window.NightlightBoat=NightlightBoat;
})();
