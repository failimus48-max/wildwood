'use strict';
(() => {
class NightlightBoat {
 constructor(){
  this.name='Nightlight Boat';this.position=[0,-.08,-56.7];this.lastTime=-Infinity;
  const m=new MythicMesh.Mesh(),segments=40,curve=(a,inside,z)=>[Math.cos(a)*3.05,1.85-Math.sin(a)*(inside?1.24:2.05),z*Math.sin(a)**.45];
  // A deep crescent hull, with raised moon horns at the bow and stern.
  for(let i=0;i<segments;i++){const a=i/segments*Math.PI,b=(i+1)/segments*Math.PI;for(const side of [-1,1]){const p=curve(a,false,side*.65),q=curve(b,false,side*.65),r=curve(a,true,side*.65),s=curve(b,true,side*.65);m.triangle(p,q,r,'#ece5c8',true);m.triangle(q,s,r,'#ece5c8',true);m.link(r,s,.027,'#c9aa68',.027,true);}for(const inner of [false,true]){const p=curve(a,inner,-.65),q=curve(b,inner,-.65),r=curve(a,inner,.65),s=curve(b,inner,.65);m.triangle(p,r,q,inner?'#c7b68b':'#d9d9c3',inner);m.triangle(q,r,s,inner?'#c7b68b':'#d9d9c3',inner);}}
  // Deck boards lie inside the crescent bowl, below its gilded rim.
  for(let i=0;i<12;i++)m.box(-1.38+i*.25,.43,0,.23,.08,1.04,i%2?'#a58c62':'#b49b72');
  m.link([0,.5,0],[0,4.42,0],.06,'#ac905b',.038);m.link([0,1.05,0],[2.14,1.12,0],.035,'#ac905b',.025);
  // A softly billowed triangular sail, stitched with a star-shaped crest.
  const sail=(u,v)=>[.10+u*2.12,4.15-u*2.98-v*3.02,.04+Math.sin(u*Math.PI)*Math.sin(v*Math.PI)*.45],n=12;
  for(let i=0;i<n;i++)for(let j=0;j<n-i;j++){const p=sail(i/n,j/n),q=sail((i+1)/n,j/n),r=sail(i/n,(j+1)/n);m.triangle(p,q,r,'#f3e8c9');m.triangle(r,q,p,'#e8dbb8');if(i+j<n-1){const s=sail((i+1)/n,(j+1)/n);m.triangle(q,s,r,'#f3e8c9');m.triangle(r,s,q,'#e8dbb8');}}
  for(const [a,b] of [[[.1,4.15,.04],[2.22,1.17,.04]],[[2.22,1.17,.04],[.1,1.13,.04]],[[.1,1.13,.04],[.1,4.15,.04]]])m.link(a,b,.013,'#bc9e67',.013);
  const star=(x,y,z,r,col)=>{const p=[];for(let i=0;i<8;i++){const a=i*Math.PI/4,k=i%2?r*.26:r;p.push([x+Math.sin(a)*k,y+Math.cos(a)*k,z]);}for(let i=0;i<8;i++)m.triangle([x,y,z],p[i],p[(i+1)%8],col,true);};star(.7,2.15,.48,.3,'#b59860');
  // A warm lantern crowns the mast, beneath a tiny gilded star finial.
  const y=4.72;m.box(0,y-.26,0,.36,.05,.36,'#8b744d');m.box(0,y+.23,0,.42,.06,.42,'#8b744d');for(const x of [-.14,.14])for(const z of [-.14,.14])m.link([x,y-.22,z],[x,y+.23,z],.018,'#8b744d');m.ellipsoid(0,y,0,.105,.20,.105,'#ffe7ae',true,10,7);m.link([0,y+.27,0],[0,y+.47,0],.035,'#b59a60',.02);star(0,y+.56,.01,.14,'#edcf86');
  this.local=new Float32Array(m.data);this.solid=null;
 }
 pose(t){return {bob:Math.sin(t*.68)*.045+Math.sin(t*.83)*.018,roll:Math.sin(t*.52)*.013};}
 dynamic(t,day,eye){const night=Math.max(0,Math.min(1,1-day*1.7)),pose=this.pose(t),cs=Math.cos(pose.roll),sn=Math.sin(pose.roll),point=p=>[p[0]*cs-p[1]*sn,this.position[1]+pose.bob+p[0]*sn+p[1]*cs,this.position[2]+p[2]];
  if(!this.solid||Math.abs(t-this.lastTime)>.08){const data=new Float32Array(this.local);for(let i=0;i<data.length;i+=9){const p=point([data[i],data[i+1],data[i+2]]);data.set(p,i);if(data[i+4]<2){const x=data[i+3],y=data[i+4];data[i+3]=x*cs-y*sn;data[i+4]=x*sn+y*cs;}}const ropes=new MythicMesh.Mesh();for(const side of [-1,1]){const a=[side*2.5,.8,-52.9],b=point([side*2.1,.75,.55]);let prev=a;for(let i=1;i<=8;i++){const u=i/8,p=a.map((v,k)=>v+(b[k]-v)*u-(k===1?Math.sin(u*Math.PI)*.35:0));ropes.link(prev,p,.018,'#c8b388',.018);prev=p;}}const joined=new Float32Array(data.length+ropes.data.length);joined.set(data);joined.set(ropes.data,data.length);this.solid=joined;this.lastTime=t;}
  const glow=[],add=d=>{for(const v of d)glow.push(v);};add(MythicMesh.glow(point([0,4.72,0]),'#ffdda0',eye,.85,.08+night*.45));if(night>.01){add(MythicMesh.glow(point([0,.55,0]),'#e4e9ff',eye,3.3,night*.14));for(const side of [-1,1])add(MythicMesh.glow(point([side*2.82,1.35,0]),'#fff0c4',eye,.55,night*(.23+Math.sin(t*.9+side)**2*.08)));}
  return {solid:this.solid,glow:new Float32Array(glow),night,lantern:point([0,4.72,0]),bob:pose.bob};
 }
 diagnostics(day=1){return {name:this.name,position:[...this.position],mastheadLantern:true,nightGlow:Math.max(0,1-day*1.7),vertices:this.local.length/9,moored:true};}
}
window.NightlightBoat=NightlightBoat;
})();
