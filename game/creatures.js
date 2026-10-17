'use strict';
(() => {
const normalize=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);},subtract=(a,b)=>a.map((x,i)=>x-b[i]),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
const sphereTables=new Map();
function sphereTable(seg,rings){const key=seg+':'+rings;if(!sphereTables.has(key)){const table=[];for(let j=0;j<=rings;j++)for(let i=0;i<=seg;i++){const a=i/seg*Math.PI*2,b=j/rings*Math.PI;table.push([Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)]);}sphereTables.set(key,table);}return sphereTables.get(key);}
class Mesh {
 constructor(position=[0,0,0],yaw=0,size=1){this.data=[];this.position=position;this.yaw=yaw;this.size=size;}
 point(p){const c=Math.cos(this.yaw),s=Math.sin(this.yaw),k=this.size;return [this.position[0]+(p[0]*c+p[2]*s)*k,this.position[1]+p[1]*k,this.position[2]+(-p[0]*s+p[2]*c)*k];}
 triangle(a,b,c,color,emissive=false){a=this.point(a);b=this.point(b);c=this.point(c);const n=emissive?[0,3,0]:normalize(cross(subtract(b,a),subtract(c,a))),co=typeof color==='string'?rgb(color):color;for(const p of [a,b,c])this.data.push(...p,...n,...co);}
 box(x,y,z,w,h,d,col,emit=false){const v=[[x-w/2,y,z-d/2],[x+w/2,y,z-d/2],[x+w/2,y+h,z-d/2],[x-w/2,y+h,z-d/2],[x-w/2,y,z+d/2],[x+w/2,y,z+d/2],[x+w/2,y+h,z+d/2],[x-w/2,y+h,z+d/2]];for(const f of [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]]){this.triangle(v[f[0]],v[f[1]],v[f[2]],col,emit);this.triangle(v[f[0]],v[f[2]],v[f[3]],col,emit);}}
 ellipsoid(x,y,z,rx,ry,rz,col,emit=false,seg=18,rings=10){seg=Math.min(seg,WildwoodPerformance.meshSegments);rings=Math.min(rings,WildwoodPerformance.meshRings);const co=rgb(col),cs=Math.cos(this.yaw),sn=Math.sin(this.yaw),vertices=sphereTable(seg,rings).map(u=>{const pos=this.point([x+rx*u[0],y+ry*u[1],z+rz*u[2]]),n=normalize([u[0]/(rx||1),u[1]/(ry||1),u[2]/(rz||1)]);return [...pos,...(emit?[0,3,0]:[n[0]*cs+n[2]*sn,n[1],-n[0]*sn+n[2]*cs]),...co];});for(let j=0;j<rings;j++)for(let i=0;i<seg;i++){const a=j*(seg+1)+i,b=a+1,c=a+seg+1,d=c+1;for(const v of [a,b,c,b,d,c])this.data.push(...vertices[v]);}}
 loft(sections,col){const seg=Math.min(22,WildwoodPerformance.meshSegments),co=rgb(col),cs=Math.cos(this.yaw),sn=Math.sin(this.yaw),vertices=[];for(let j=0;j<sections.length;j++)for(let i=0;i<=seg;i++){const a=i/seg*6.283,q=sections[j],prev=sections[Math.max(0,j-1)],next=sections[Math.min(sections.length-1,j+1)],p=[Math.cos(a)*q[2],q[1]+Math.sin(a)*q[3],q[0]],n=normalize(cross([-Math.sin(a)*q[2],Math.cos(a)*q[3],0],[Math.cos(a)*(next[2]-prev[2]),next[1]-prev[1]+Math.sin(a)*(next[3]-prev[3]),next[0]-prev[0]]));vertices.push([...this.point(p),n[0]*cs+n[2]*sn,n[1],-n[0]*sn+n[2]*cs,...co.map(v=>v*(.97+.03*Math.sin(a*3+q[0]*4)))]);}for(let j=0;j<sections.length-1;j++)for(let i=0;i<seg;i++){const a=j*(seg+1)+i,b=a+seg+1;for(const k of [a,b,a+1,a+1,b,b+1])this.data.push(...vertices[k]);}}

 softLink(a,b,r,col){const n=normalize(subtract(b,a)),x=normalize(cross(n,Math.abs(n[1])>.9?[1,0,0]:[0,1,0])),y=cross(n,x),mid=a.map((v,i)=>(v+b[i])/2),length=Math.hypot(...subtract(b,a))/2+.06,co=rgb(col),cs=Math.cos(this.yaw),sn=Math.sin(this.yaw),seg=WildwoodPerformance.mobile?8:12,rings=WildwoodPerformance.mobile?6:8,vertices=sphereTable(seg,rings).map(u=>{const pos=this.point(mid.map((v,k)=>v+n[k]*u[1]*length+(x[k]*u[0]+y[k]*u[2])*r)),normal=normalize(n.map((v,k)=>v*u[1]/length+(x[k]*u[0]+y[k]*u[2])/r));return [...pos,normal[0]*cs+normal[2]*sn,normal[1],-normal[0]*sn+normal[2]*cs,...co];});for(let j=0;j<rings;j++)for(let i=0;i<seg;i++){const a=j*(seg+1)+i,b=a+1,c=a+seg+1,d=c+1;for(const v of [a,b,c,b,d,c])this.data.push(...vertices[v]);}}

 link(a,b,r,col,end=r,emit=false){const n=normalize(subtract(b,a)),x=normalize(cross(n,Math.abs(n[1])>.9?[1,0,0]:[0,1,0])),y=cross(n,x),p=(origin,radius,i)=>origin.map((v,k)=>v+radius*(x[k]*Math.cos(i/8*6.283)+y[k]*Math.sin(i/8*6.283)));for(let i=0;i<8;i++){const u=p(a,r,i),v=p(a,r,i+1),w=p(b,end,i),q=p(b,end,i+1);this.triangle(u,w,v,col,emit);this.triangle(v,w,q,col,emit);this.triangle(b,q,w,col,emit);}}
 disk(x,y,z,r,col){for(let i=0;i<40;i++){const a=i/40*6.283,b=(i+1)/40*6.283;this.triangle([x,y,z],[x+Math.cos(b)*r,y,z+Math.sin(b)*r],[x+Math.cos(a)*r,y,z+Math.sin(a)*r],col);}}
 ring(x,y,z,r,col){for(let i=0;i<24;i++){const a=i/24*6.283,b=(i+1)/24*6.283;this.link([x+Math.cos(a)*r,y,z+Math.sin(a)*r],[x+Math.cos(b)*r,y,z+Math.sin(b)*r],.035,col,.035,true);}}
}
function wings(m,c,t,moving){if(c.wings==='none')return;const size=c.wingSize,col=c.wingColor,accent=c.accentColor,flap=Math.sin(t*(moving?5:1.8))*(moving?.45:.16);for(const side of [-1,1]){const p=(x,y,z)=>[side*x*size,1.2+y*size+flap*x/2,z*size-.15],root=p(.35,0,0);
 if(['angel','phoenix'].includes(c.wings)){const joint=p(1,.8,-.1),tip=p(2.6,.5,-.3);m.softLink(root,joint,.2,col);m.softLink(joint,tip,.19,col);for(let i=0;i<8;i++){const u=i/7,start=p(.85+u*1.7,.78-u*.22,-.1),end=p(.65+u*2.2,.2-u*.9,-.55-u*.55);m.softLink(start,end,.17*(1-u*.3),i%3===0?accent:col);}}
 else if(['bat','dragon'].includes(c.wings)){const tips=[p(.7,.95,.1),p(1.8,1.1,-.15),p(2.7,.45,-.4),p(2.2,-.3,-1.05),p(1.1,-.35,-.95)];for(let i=0;i<tips.length-1;i++){const a=tips[i],b=tips[i+1],notch=a.map((v,k)=>(v+b[k])/2+(root[k]-(v+b[k])/2)*.27);m.triangle(root,a,notch,col);m.triangle(root,notch,b,col);m.link(root,a,.065,accent,.022);}m.link(root,tips.at(-1),.065,accent,.025);if(c.wings==='dragon')m.link(tips[2],p(2.9,.55,-.4),.09,accent,0);}
 else {for(const [x,y,z,rx,ry] of c.wings==='butterfly'?[[1.25,.6,0,.85,1],[1.1,-.3,-.15,.65,.55]]:[[1.15,.55,-.1,.48,1.2],[.95,-.3,-.3,.35,.65]]){m.ellipsoid(side*x*size,1.2+y*size+flap, z,rx*size,ry*size,.09,col);m.ellipsoid(side*x*size,1.2+y*size+flap,z+.09,rx*size*.48,ry*size*.5,.035,accent);}}
}}
function tail(m,c,t){const col=c.bodyColor,a=c.accentColor,k=c.tailSize,id=c.animal;let type=c.tail;if(type==='natural')type=['bunny','jackalope','chimerabunny','spiritbunny','bear'].includes(id)?'pom':['dragon','kirin','axolotl','otter'].includes(id)?'dragon':['cat','tiger','snowleopard','ferret','unicorn','pegasus','deer','gryphon'].includes(id)?'long':'fluffy';
 if(id==='phoenix'&&c.tail==='natural'){for(let i=0;i<7;i++){const angle=(i-3)*.14;m.softLink([0,.72,-.6],[Math.sin(angle)*1.6*k,.74+Math.cos(angle)*.25,-.7-Math.cos(angle)*1.3*k],.09*k,i%2?a:col);}return;}
 if(type==='pom')m.ellipsoid(0,.85,-.82,.28*k,.28*k,.28*k,a);
 if(type==='fluffy'||type==='nine'){const count=type==='nine'?9:1;for(let i=0;i<count;i++){const angle=count===1?0:(i-4)*.24,x=Math.sin(angle)*1.7*k,z=-.8-Math.cos(angle)*1.05*k,y=.7+Math.sin(t*1.4+i)*.08+(count===1?0:(i%3)*.1);m.softLink([0,.75,-.55],[x,y,z],.18*k,col);m.ellipsoid(x,y,z,.23*k,.26*k,.38*k,a);}}
 if(type==='long'||type==='dragon'){let prev=[0,.65,-.6];for(let i=1;i<=5;i++){const p=[Math.sin(t*1.8-i*.4)*.12*i,.65-i*.055,-.6-i*.28*k];m.softLink(prev,p,.17*(1-i/7)*k,col);if(type==='dragon')m.link(p,[p[0],p[1]+.25*(1-i/7),p[2]],.1,a,0);prev=p;}}
}
function horns(m,c,headY){const a=c.accentColor,y=headY+.38;if(c.horns==='unicorn'||c.horns==='crystal'){m.link([0,y,.9],[0,y+.9,.97],.15,a,0,c.horns==='crystal');for(let i=0;i<4;i++)m.ring(0,y+i*.14,.91+i*.01,.13-i*.02,c.wingColor);}
 if(c.horns==='twin')for(const s of [-1,1])m.link([s*.3,y,.48],[s*.48,y+.7,.3],.13,a,0);
 if(c.horns==='curled')for(const s of [-1,1]){let prev=[s*.4,y,.45];for(let i=1;i<=9;i++){const angle=i/9*5.3,p=[s*(.45+.25*Math.sin(angle)),y+.22-.26*Math.cos(angle),.4];m.link(prev,p,.095-i*.007,a,.085-i*.007);prev=p;}}
 if(c.horns==='antlers')for(const s of [-1,1]){m.link([s*.27,y,.45],[s*.8,y+1.15,.1],.07,a,.035);for(let i=0;i<3;i++){const p=[s*(.4+i*.15),y+.25+i*.3,.4-i*.08];m.link(p,[s*(.78+i*.2),p[1]+.25,.4],.045,a,.015);}}
}
function details(m,c,headY){const a=c.accentColor,id=c.animal;
 if(c.pattern!=='none'&&id!=='cat'&&!(id==='deer'&&c.pattern==='spots'))for(const side of [-1,1])for(let i=0;i<6;i++){const pony=['unicorn','pegasus','deer','kirin'].includes(id),long=['ferret','otter','axolotl'].includes(id),width=id==='unicorn'?.34:id==='bear'?.58:long?.34:.43,z=-.5+i*.19,y=(id==='unicorn'?1.68:pony?1.03:long?.64:.86)+.1+Math.sin(i*2)*.08,x=side*(width-.02);if(c.pattern==='spots')m.ellipsoid(x,y,z,.04,.1,.09,a,false,6,3);if(c.pattern==='stripes')m.link([x,y-.18,z],[x,y+.18,z+.07],.045,a,.035);if(c.pattern==='stars'){m.link([x,y-.09,z],[x,y+.09,z],.03,a,.03,true);m.link([x,y,z-.09],[x,y,z+.09],.03,a,.03,true);}if(c.pattern==='runes'){m.link([x,y-.09,z],[x,y+.1,z+.07],.025,a,.025,true);m.link([x,y+.1,z+.07],[x,y-.09,z+.13],.025,a,.025,true);}}
 if(c.accessory==='halo')m.ring(0,headY+1.05,.65,.6,'#ffdd83');
 if(c.accessory==='crown'){m.ring(0,headY+.45,.65,.42,'#e4bd6d');for(let i=0;i<5;i++){const angle=i/5*6.283;m.link([Math.cos(angle)*.4,headY+.45,.65+Math.sin(angle)*.4],[Math.cos(angle)*.4,headY+.8,.65+Math.sin(angle)*.4],.09,'#e4bd6d',0);}}
 if(c.accessory==='crystals')for(let i=0;i<4;i++)m.link([0,1.12,-.6+i*.25],[0,1.6,-.6+i*.25],.16,c.wingColor,0,true);
 if(c.accessory==='flowers')for(let i=0;i<7;i++){const angle=i/7*6.283;m.ellipsoid(Math.cos(angle)*.45,headY+.4,.65+Math.sin(angle)*.43,.12,.12,.12,c.wingColor);}
 if(c.accessory==='scarf'){m.ring(0,.98,.54,.43,c.wingColor);m.box(.25,.55,.72,.2,.5,.13,c.wingColor);}
 if(id==='axolotl')for(const side of [-1,1])for(let i=0;i<3;i++){const a=[side*.4,headY-.12+i*.15,.65];m.link(a,[side*(.9-i*.1),headY-.3+i*.3,.62],.07,c.accentColor,.025);}
}
// Sculpted reference fox: separate anatomy keeps the other species unchanged.
function sculptTools(m){
 // Rounded tube surfaces for tapered legs and a continuous curved brush tail.
 const tube=(points,color,frame=null)=>{const seg=WildwoodPerformance.mobile?12:18,verts=[],co=rgb(color),cs=Math.cos(m.yaw),sn=Math.sin(m.yaw);for(let j=0;j<points.length;j++){const q=points[j],prev=points[Math.max(0,j-1)],next=points[Math.min(points.length-1,j+1)],axis=normalize(subtract(next.slice(0,3),prev.slice(0,3))),x=normalize(cross(axis,frame||(Math.abs(axis[1])>.9?[1,0,0]:[0,1,0]))),y=cross(axis,x);for(let i=0;i<=seg;i++){const a=i/seg*6.283,n=x.map((v,k)=>v*Math.cos(a)+y[k]*Math.sin(a));verts.push([...m.point(q.slice(0,3).map((v,k)=>v+n[k]*q[3])),n[0]*cs+n[2]*sn,n[1],-n[0]*sn+n[2]*cs,...co]);}}for(let j=0;j<points.length-1;j++)for(let i=0;i<seg;i++){const a=j*(seg+1)+i,b=a+seg+1;for(const k of [a,b,a+1,a+1,b,b+1])m.data.push(...verts[k]);}};
 // Convex relief with a curved surface, used for ears, eyelids and fur layers.
 const relief=(outline,center,depth,color,emit=false)=>{for(let pass=0;pass<2;pass++)outline=outline.flatMap((p,i)=>{const q=outline[(i+1)%outline.length];return [p.map((v,k)=>v*.9+q[k]*.1),p.map((v,k)=>v*.1+q[k]*.9)];});const rings=4,verts=[],co=rgb(color),cs=Math.cos(m.yaw),sn=Math.sin(m.yaw);for(let j=0;j<=rings;j++){const r=j/rings;for(const p of outline){const v=center.map((v,k)=>v+(p[k]-v)*r);v[2]+=depth*(1-r*r);const n=normalize([(v[0]-center[0])*depth*14,(v[1]-center[1])*depth*14,1]);verts.push([...m.point(v),...(emit?[0,3,0]:[n[0]*cs+n[2]*sn,n[1],-n[0]*sn+n[2]*cs]),...co]);}}const count=outline.length;for(let j=0;j<rings;j++)for(let i=0;i<count;i++){const a=j*count+i,b=j*count+(i+1)%count,d=a+count,e=b+count;for(const k of [a,d,b,b,d,e])m.data.push(...verts[k]);}};
 return {tube,relief};
}
function advanceFoxMotion(p,dt,moving,running){const ease=1-Math.exp(-Math.min(dt,.5)*(moving?6:3)),blend=p.blend+(Number(moving)-p.blend)*ease,run=p.run+(Number(moving&&running)-p.run)*ease;return {blend,run,phase:p.phase+dt*(7+run*3.2)*blend};}
function sculptFox(m,c,t,moving,motion){
 const wolf=c.animal==='wolf',blend=motion?.blend??Number(moving),run=motion?.run??0,phase=motion?.phase??t*8,mix=(a,b)=>a+(b-a)*blend,bob=Math.sin(phase*2)*.035*run;
 const col=c.bodyColor,shade=(h,k)=>'#'+rgb(h).map(v=>Math.round(v*k*255).toString(16).padStart(2,'0')).join(''),inner=shade(col,.52),fur=wolf?c.accentColor:shade(col,.94),h=mix(wolf?2.03:1.91,wolf?1.5:1.42)+bob*.5,z=mix(.22,.64);
 const {tube,relief}=sculptTools(m);
 const seated=[[0,.2,-.18,.12],[0,.55,-.18,wolf?.5:.42],[0,1.0,-.04,wolf?.44:.37],[0,1.43,.08,wolf?.36:.29],[0,1.72,.17,wolf?.25:.19]],standing=[[0,.78,wolf?-1.15:-1.02,.025],[0,.84,-.75,wolf?.43:.34],[0,.9,-.15,wolf?.43:.34],[0,1.08,.42,wolf?.38:.3],[0,1.32,.68,wolf?.24:.18]];
 tube(seated.map((p,j)=>p.map((v,k)=>mix(v,standing[j][k])+(k===1?bob+run*Math.sin(phase)*standing[j][2]*.028:0))),col);
 for(const side of [-1,1]){
  m.ellipsoid(side*mix(.39,.31),mix(.46,.72)+bob,mix(-.24,-.62),mix(wolf?.27:.23,wolf?.22:.17),mix(.4,.24),.28,col);
  for(const front of [-1,1]){const walking=phase+(side*front>0?0:Math.PI),gallop=phase+(front>0?0:Math.PI*.7)+(side>0?.3:0),legPhase=walking+(gallop-walking)*run,stride=Math.sin(legPhase)*(.16+run*.19)*blend,lift=Math.max(0,Math.cos(legPhase))*(.1+run*.13)*blend,footZ=mix(front>0?.37:-.12,front*.62)+stride,hip=[side*(front>0?.25:mix(.34,.31)),mix(front>0?1.26:.55,.87)+bob,mix(front>0?.16:-.27,front*.5)],ankle=[side*(front>0?.23:mix(.39,.31)),.16+lift,footZ],knee=[hip[0],mix(.64,.47)+lift*.35,footZ-.06-front*run*.13*Math.cos(legPhase)];tube([[...hip,front>0?(wolf?.145:.115):(wolf?.2:.17)],[...knee,wolf?.12:.095],[...ankle,wolf?.09:.073]],col);m.ellipsoid(ankle[0],.12+lift,footZ+.055,wolf?.17:.13,.12,wolf?.21:.18,col);for(const toe of [-1,0,1])m.softLink([ankle[0]+toe*.049,.11+lift,footZ+.214],[ankle[0]+toe*.049,.2+lift,footZ+.18],.0045,inner);}
 }
 m.loft([[z-.35,h,.025,.03],[z-.18,h+.03,wolf?.44:.39,.34],[z+.09,h,wolf?.55:.49,wolf?.4:.37],[z+.29,h-.04,wolf?.51:.48,.28],[z+.42,h-.15,wolf?.36:.31,wolf?.23:.2],[z+(wolf?.7:.61),h-(wolf?.23:.28),wolf?.19:.11,wolf?.13:.1],[z+(wolf?.86:.69),h-(wolf?.23:.28),.02,.02]],col);if(wolf)m.loft([[z+.4,h-.255,.24,.08],[z+.59,h-.25,.26,.12],[z+.8,h-.235,.14,.07],[z+.85,h-.23,.035,.025]],c.accentColor);
 for(const side of [-1,1]){
  // Broad cheek blades taper into the small muzzle, as in the supplied sculpture.
  for(let i=0;i<2;i++)relief([[side*.17,h-.02-i*.045,z+.37],[side*(wolf?.63:.56),h-.12-i*.065,z+.23],[side*.45,h-.21-i*.04,z+.3],[side*.16,h-.29,z+.53]],[side*.32,h-.16,z+.36],.05,col);
  const k=c.earSize,base=side*(wolf?.33:.29),tip=side*((wolf?.48:.59)+.08*(k-1)),top=h+(wolf?.72:.88)*k;
  const shape=[[base-side*.15,h+.18,z-.06],[base+side*.22,h+.13,z-.1],[tip+side*.045,top-.09,z-.17],[tip,top,z-.16],[base-side*.08,h+.49,z-.08]];
  relief(shape,[side*.43,h+.43,z-.02],.12,col);const inset=shape.map(p=>[side*.43+(p[0]-side*.43)*.72,h+.43+(p[1]-(h+.43))*.76,p[2]+.055]);relief(inset,[side*.43,h+.43,z+.04],.08,inner);
  // Narrow swept almond eyes; no round toy-like eyeballs.
  const eye=[side*.26,h+.025,z+.405],eyeShape=[[side*.12,h-.065,z+.49],[side*.18,h+.03,z+.46],[side*.29,h+.08,z+.405],[side*.39,h+.055,z+.35],[side*.32,h-.025,z+.41],[side*.2,h-.06,z+.47]];relief(eyeShape,eye,.025,c.eyeColor,c.glowEyes);
 }
 m.ellipsoid(0,h-(wolf?.23:.28),z+(wolf?.865:.689),wolf?.105:.075,wolf?.065:.055,wolf?.045:.04,inner);
 // Overlapping pointed chest plates are modelled fur, rather than a painted bib.
 for(let j=0;j<3;j++){const y=mix(1.5-j*.23,1.07-j*.12)+bob,zz=mix(wolf?.42:.27,wolf?.78:.61),w=(wolf?.33:.26)-j*.035;relief([[-w,y,zz],[-w*.9,y-.15,zz+.035],[-w*.5,y-.2,zz+.06],[0,y-.35,zz+.065],[w*.5,y-.2,zz+.06],[w*.9,y-.15,zz+.035],[w,y,zz],...(wolf?[[w*.65,y+.035,zz-.01],[0,y+.09,zz-.025],[-w*.65,y+.035,zz-.01]]:[])],[0,y-.12,zz+.035],.06,fur);for(const side of [-1,1])relief([[side*w*.75,y-.02,zz],[side*(w+.06),y-.12,zz-.02],[side*(w+.025),y-.19,zz],[side*w*.55,y-.12,zz+.02]],[side*w*.8,y-.11,zz],.035,col);}
 if(wolf)for(const side of [-1,1])for(let j=0;j<3;j++){const y=mix(1.5,1.18)+bob-j*.13,zz=mix(.04,.45),x=side*(.29+j*.03);relief([[x,y,zz],[x+side*.16,y-.16,zz-.08],[x+side*.1,y-.23,zz-.025],[x-side*.1,y-.15,zz+.08]],[x,y-.12,zz+.015],.055,col);}
 if(c.tail==='natural'){const points=[];for(let j=0;j<=16;j++){const u=j/16,a=-1.8+u*3.5,idle=[.19+Math.cos(a)*.55*c.tailSize,.24+Math.sin(u*Math.PI)*.08,-.17+Math.sin(a)*.63*c.tailSize,Math.max(.007,Math.sin(u*Math.PI)*.27*c.tailSize+.065*(1-u))],trail=[Math.sin(phase*.45-u*2)*(.12+run*.055)*u,.74-.25*Math.sin(u*2)+bob*(1-u)+run*Math.sin(phase-u*2)*.065*u,-.86-u*1.85*c.tailSize,Math.max(.007,Math.sin(u*Math.PI)*.26*c.tailSize+.07*(1-u))];points.push(idle.map((v,k)=>mix(v,trail[k])));}tube(points,col);}
}
function sculptCat(m,c,t,moving,motion){
 const {tube,relief}=sculptTools(m),blend=motion?.blend??Number(moving),run=motion?.run??0,phase=motion?.phase??t*7,col=c.bodyColor,a=c.accentColor,bob=Math.sin(phase*2)*(.012+run*.025)*blend,h=1.16+bob,z=.66,seam='#64505e',nose='#b38793';
 // Rounded standing figurine proportions: broad chest, compact back and four substantial legs.
 m.ellipsoid(0,.88+bob,-.15,.43,.46,.76,col,false,28,18);
 m.ellipsoid(0,.91+bob,.33,.37,.43,.39,col,false,24,16);
 for(const side of [-1,1]){
  for(const front of [-1,1]){const walk=phase+(side*front>0?0:Math.PI),gallop=phase+(front>0?0:Math.PI*.7)+(side>0?.2:0),p=walk+(gallop-walk)*run,stride=Math.sin(p)*(.13+run*.15)*blend,lift=Math.max(0,Math.cos(p))*(.08+run*.11)*blend,footZ=front*.51+stride,x=side*.27,hip=[x,.89+bob,front*.43],knee=[x,.48+lift*.35,footZ-(front<0?.085:.025)],ankle=[x,.14+lift,footZ];
   tube([[...hip,front>0?.185:.20],[...knee,.14],[...ankle,.115]],col);
   m.ellipsoid(x,.12+lift,footZ+.065,.15,.12,.18,col,false,20,12);
   for(const toe of [-1,1])m.softLink([x+toe*.049,.055+lift,footZ+.229],[x+toe*.049,.16+lift,footZ+.199],.0035,seam);
  }
 }
 m.ellipsoid(0,h,z,.49,.43,.38,col,false,32,22);
 for(const side of [-1,1]){
  const k=c.earSize,shape=[[side*.18,h+.25,z-.04],[side*.44,h+.19,z-.05],[side*.45,h+.48*k,z-.11],[side*.40,h+.61*k,z-.12],[side*.25,h+.45*k,z-.07]],center=[side*.335,h+.37,z-.035];
  relief(shape,center,.10,col);relief(shape.map(q=>[center[0]+(q[0]-center[0])*.65,center[1]+(q[1]-center[1])*.68,q[2]+.05]),[center[0],center[1],center[2]+.05],.055,'#aa8299');
  // Circular inset eyes, a small button nose and gently rounded muzzle pads.
  m.ellipsoid(side*.205,h+.025,z+.338,.109,.116,.038,seam,false,24,16);
  m.ellipsoid(side*.205,h+.025,z+.365,.091,.098,.026,c.eyeColor,c.glowEyes,24,16);
  m.ellipsoid(side*.09,h-.15,z+.351,.14,.105,.081,col,false,24,14);
 }
 relief([[-.054,h-.11,z+.441],[.054,h-.11,z+.441],[.038,h-.14,z+.452],[0,h-.18,z+.456],[-.038,h-.14,z+.452]],[0,h-.137,z+.451],.012,nose);
 for(const side of [-1,1]){const points=[[0,h-.18,z+.454,.0035],[side*.035,h-.225,z+.438,.0035],[side*.082,h-.242,z+.414,.0035],[side*.115,h-.235,z+.395,.002]];tube(points,seam);}
 if(c.pattern!=='none')for(const side of [-1,1])for(let i=0;i<6;i++){const zz=-.64+i*.19,x=side*(.43*Math.sqrt(1-((zz+.15)/.76)**2)+.003),y=.90+bob;if(c.pattern==='spots')m.ellipsoid(x,y,zz,.022,.055,.065,a,false,8,5);if(c.pattern==='stripes')m.softLink([x,y-.07,zz-.035],[x,y+.07,zz+.035],.025,a);if(c.pattern==='stars'||c.pattern==='runes'){m.softLink([x,y-.06,zz],[x,y+.06,zz],.017,a);m.softLink([x,y,zz-.06],[x,y+(c.pattern==='runes'?.06:0),zz+.06],.017,a);}}
 if(c.tail==='natural'){const points=[];for(let i=0;i<=20;i++){const u=i/20,sway=Math.sin(t*1.2-u*.7)*.025+Math.sin(phase-u*1.4)*.05*blend,yy=1.02+bob+u*1.40*c.tailSize,zz=-.69-.14*Math.sin(u*Math.PI*.7)*c.tailSize,xx=sway*u,r=(.095-.022*u)*c.tailSize;points.push([xx,yy,zz,r]);}tube(points,col);const q=points.at(-1);m.ellipsoid(q[0],q[1],q[2],q[3],q[3],q[3],col,false,18,12);}
}
function sculptBunny(m,c,t,moving,motion){
 const {tube,relief}=sculptTools(m),blend=motion?.blend??Number(moving),run=motion?.run??0,phase=motion?.phase??t*7,mix=(a,b)=>a+(b-a)*blend,col=c.bodyColor,accent=c.accentColor,shade=(hex,k)=>'#'+rgb(hex).map(v=>Math.round(v*k*255).toString(16).padStart(2,'0')).join(''),seam=shade(col,.66),pink='#bd9190',bob=Math.max(0,Math.sin(phase*2))*(.035+run*.045)*blend,h=mix(1.46,1.2)+bob,z=mix(.16,.49);
 m.ellipsoid(0,mix(.68,.61)+bob,mix(-.12,-.23),.35,mix(.56,.38),mix(.35,.61),col);
 m.ellipsoid(0,mix(1.02,.84)+bob,mix(.03,.32),.28,.36,.26,col);
 for(const side of [-1,1]){
  m.ellipsoid(side*.29,mix(.37,.4)+bob,mix(-.18,-.53),.23,.31,.28,col);
  for(const front of [-1,1]){const gait=phase+(front>0?0:Math.PI*.7)+(side>0?.14:0),stride=Math.sin(gait)*(.13+run*.08)*blend,lift=Math.max(0,Math.cos(gait))*(.08+run*.06)*blend,footZ=mix(front>0?.33:-.08,front*.49)+stride,hip=[side*(front>0?.2:.28),mix(front>0?.91:.39,front>0?.72:.49)+bob,mix(front>0?.16:-.23,front*.35)],ankle=[hip[0],.12+lift,footZ];tube([[...hip,front>0?.105:.13],[hip[0],mix(.47,.32)+lift*.4,footZ-.04,.085],[...ankle,.065]],col);m.ellipsoid(hip[0],.11+lift,footZ+.04,front>0?.12:.15,.115,front>0?.15:.23,col);for(const toe of [-1,0,1])m.softLink([hip[0]+toe*.041,.09+lift,footZ+(front>0?.178:.25)],[hip[0]+toe*.041,.175+lift,footZ+(front>0?.153:.22)],.004,seam);}
 }
 // The head is deliberately taller than it is wide, with restrained cheek fur.
 m.ellipsoid(0,h,z,.455,.49,.355,col,false,28,18);
 m.ellipsoid(0,h-.24,z+.265,.225,.175,.14,col);
 for(const side of [-1,1]){
  for(let j=0;j<2;j++)relief([[side*.28,h-.095-j*.04,z+.255],[side*.445,h-.17-j*.042,z+.135],[side*.355,h-.24-j*.025,z+.205],[side*.19,h-.29,z+.29]],[side*.31,h-.19,z+.23],.035,col);
  // Tall leaf-shaped ears have a rounded outer rim and inset inner panels.
  const k=c.earSize,tilt=Math.sin(phase)*.012*blend,base=side*.21,tip=side*(.59+tilt),top=h+.43+1.02*k;
  const outline=[[base-side*.095,h+.22,z-.025],[base+side*.16,h+.24,z-.055],[side*.65,h+.35+.58*k,z-.13],[side*.66,h+.35+.96*k,z-.15],[tip,top,z-.15],[side*.29,h+.38+.76*k,z-.11],[base-side*.075,h+.4,z-.01]],center=[side*.39,h+.36+.4*k,z-.005];relief(outline,center,.085,col);
  relief(outline.map(p=>[center[0]+(p[0]-center[0])*.67,center[1]+(p[1]-center[1])*.78,p[2]+.055]),[center[0],center[1],center[2]+.055],.055,pink);
  const eyeOutline=[[side*.105,h-.11,z+.34],[side*.13,h+.04,z+.35],[side*.225,h+.085,z+.307],[side*.285,h+.065,z+.257],[side*.273,h-.035,z+.27],[side*.19,h-.095,z+.323]];relief(eyeOutline,[side*.193,h-.017,z+.324],.018,c.eyeColor,c.glowEyes);
  m.ellipsoid(side*.085,h-.26,z+.372,.1,.078,.039,col);
 }
 relief([[-.056,h-.235,z+.414],[.056,h-.235,z+.414],[.063,h-.259,z+.418],[0,h-.307,z+.421],[-.063,h-.259,z+.418]],[0,h-.261,z+.418],.018,pink);
 for(const side of [-1,1])m.softLink([0,h-.3,z+.407],[side*.045,h-.334,z+.393],.0045,seam);
 for(let j=0;j<2;j++){const y=mix(1.02-j*.19,.85-j*.12)+bob,zz=mix(.27,.49),w=.22-j*.025;relief([[-w,y,zz],[-w*.85,y-.13,zz+.03],[-w*.47,y-.16,zz+.05],[0,y-.29,zz+.055],[w*.47,y-.16,zz+.05],[w*.85,y-.13,zz+.03],[w,y,zz]],[0,y-.105,zz+.035],.045,col);for(const side of [-1,1])relief([[side*w*.72,y-.01,zz],[side*(w+.035),y-.12,zz],[side*(w+.016),y-.17,zz+.012],[side*w*.55,y-.12,zz+.03]],[side*w*.8,y-.1,zz+.01],.025,col);}
 if(c.tail==='natural')m.ellipsoid(0,mix(.47,.57)+bob,mix(-.48,-.92),.18*c.tailSize,.19*c.tailSize,.19*c.tailSize,accent);
}
// Two-bone limb solver in the deer's sagittal plane. The cannon and pastern remain below the carpus/hock.
function deerRig({blend=0,run=0,phase=0}={}){
 const bob=Math.sin(phase*2)*(.012+run*.022)*blend,legs=[];
 const joint=(root,target,upper,lower,bend)=>{const dy=target[1]-root[1],dz=target[2]-root[2],distance=Math.hypot(dy,dz),d=Math.min(upper+lower-.00001,Math.max(Math.abs(upper-lower)+.00001,distance)),along=(upper*upper-lower*lower+d*d)/(2*d),out=Math.sqrt(Math.max(0,upper*upper-along*along));return [root[0],root[1]+dy/distance*along-dz/distance*out*bend,root[2]+dz/distance*along+dy/distance*out*bend];};
 for(const side of [-1,1])for(const front of [-1,1]){const phaseOffset=side*front>0?0:Math.PI,gait=phase+phaseOffset,stride=Math.sin(gait)*(.14+run*.10)*blend,lift=Math.max(0,Math.cos(gait))*(.075+run*.085)*blend,x=side*(front>0?.205:.225),footZ=(front>0?.52:-.60)+stride,ankle=[x,.17+lift,footZ],root=[x,(front>0?1.36:1.42)+bob,(front>0?.48:-.57)+stride*(front>0?.3:.12)],distal=[x,(front>0?.56:.63)+lift*.6,footZ-.025],upper=front>0?.35:.40,lower=front>0?.50:.48,middle=joint(root,distal,upper,lower,front>0?1:-1);legs.push({side,front,root,middle,distal,ankle,lift,footZ,upper,lower});}
 const torso=[[-.86,1.30,.025,.06],[-.74,1.30,.22,.27],[-.55,1.27,.31,.31],[-.28,1.23,.35,.34],[.02,1.23,.36,.36],[.28,1.24,.32,.35],[.47,1.29,.235,.29],[.60,1.34,.045,.12]].map(q=>[q[0],q[1]+bob,q[2],q[3]]);
 return {legs,torso,bob};
}
function sculptDeer(m,c,t,moving,motion){
 const {tube,relief}=sculptTools(m),blend=motion?.blend??Number(moving),run=motion?.run??0,phase=motion?.phase??t*7,col=c.bodyColor,a=c.accentColor,hoof='#5d5149',rig=deerRig({blend,run,phase}),{bob,torso}=rig,h=1.94+bob*.45,z=.64;
 // A level-backed ribcage, deep chest and tapered croup replace the stretched sphere.
 m.loft(torso,col);
 tube([[0,1.31+bob,.35,.23],[0,1.53+bob,.43,.18],[0,1.72+bob,.53,.155],[0,h-.17,z-.055,.14]],col);
 for(const leg of rig.legs){const {front,root,middle,distal,ankle,lift,footZ}=leg;
  const anchor=[leg.side*(front>0?.12:.10),(front>0?1.46:1.39)+bob,front>0?.30:-.54],points=[[...anchor,.025],[...root,front>0?.10:.12],[...middle,front>0?.085:.095],[...distal,.068],[...ankle,.063]],skin=[];
  // Soft figurine-like curves around the unchanged shoulder, knee and hock joints.
  for(let i=0;i<points.length-1;i++)for(let j=0;j<3;j++){const u=j/3,p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];skin.push(p1.map((v,k)=>.5*((2*v)+(-p0[k]+p2[k])*u+(2*p0[k]-5*v+4*p2[k]-p3[k])*u*u+(-p0[k]+3*v-3*p2[k]+p3[k])*u*u*u)));}skin.push(points[points.length-1]);tube(skin,col);
  // Muscle tapers out of the torso; the rear hock has a narrow, near-vertical cannon below it.
  if(front<0){const axis=normalize(subtract(middle,root)),back=[0,-axis[2],axis[1]],upper=root.map((v,k)=>v+back[k]*.065),lower=middle.map((v,k)=>v+back[k]*.045);m.softLink(upper,lower,.165,col);}
  for(const toe of [-1,1])m.ellipsoid(ankle[0]+toe*.047,.105+lift,footZ+.045,.048,.105,.125,hoof,false,14,10);
 }
 // Surface-following ventral coat patch, with the side spots remaining above its edge.
 const white='#f5f0e7',patch=(sections,from,to)=>{const steps=14,verts=[],co=rgb(white),cs=Math.cos(m.yaw),sn=Math.sin(m.yaw);for(let row=0;row<sections.length;row++)for(let j=0;j<=steps;j++){const q=sections[row],prev=sections[Math.max(0,row-1)],next=sections[Math.min(sections.length-1,row+1)],angle=from+(to-from)*j/steps,x=q[2]*Math.cos(angle),y=q[3]*Math.sin(angle),n=normalize(cross([-Math.sin(angle)*q[2],Math.cos(angle)*q[3],0],[Math.cos(angle)*(next[2]-prev[2]),next[1]-prev[1]+Math.sin(angle)*(next[3]-prev[3]),next[0]-prev[0]]));verts.push([...m.point([x,q[1]+y,q[0]]),n[0]*cs+n[2]*sn,n[1],-n[0]*sn+n[2]*cs,...co]);}for(let i=0;i<sections.length-1;i++)for(let j=0;j<steps;j++){const a=i*(steps+1)+j,b=a+steps+1;for(const k of [a,b,a+1,a+1,b,b+1])m.data.push(...verts[k]);}};
 patch(torso.slice(1,-1).map(q=>[q[0],q[1],q[2]*1.009,q[3]*1.009]),-2.72,-.42);
 m.loft([[z-.3,h,.025,.03],[z-.15,h+.025,.3,.32],[z+.08,h,.405,.37],[z+.24,h-.07,.34,.28],[z+.35,h-.18,.195,.16],[z+.46,h-.215,.11,.09],[z+.50,h-.215,.018,.02]],col);
 m.loft([[z+.25,h-.22,.14,.075],[z+.35,h-.215,.16,.09],[z+.475,h-.215,.085,.045]],a);m.ellipsoid(0,h-.21,z+.497,.067,.046,.032,hoof);
 for(const side of [-1,1]){
  const ear=[[side*.245,h+.2,z-.07],[side*.44,h+.17,z-.11],[side*.79,h+.4*c.earSize,z-.17],[side*.67,h+.52*c.earSize,z-.17],[side*.38,h+.42,z-.09]],center=[side*.47,h+.315,z-.04];relief(ear,center,.065,col);relief(ear.map(p=>[center[0]+(p[0]-center[0])*.67,center[1]+(p[1]-center[1])*.65,p[2]+.045]),[center[0],center[1],center[2]+.045],.043,'#bc9a89');
  relief([[side*.1,h-.055,z+.37],[side*.15,h+.055,z+.345],[side*.245,h+.075,z+.295],[side*.287,h+.04,z+.26],[side*.24,h-.04,z+.3],[side*.15,h-.075,z+.352]],[side*.197,h+.005,z+.325],.02,c.eyeColor,c.glowEyes);
  relief([[side*.17,h-.15,z+.30],[side*.39,h-.19,z+.17],[side*.3,h-.24,z+.245],[side*.13,h-.27,z+.345]],[side*.255,h-.21,z+.255],.027,col);
 }
 // A small closed throat patch lies against the neck instead of floating fur plates.
 m.ellipsoid(0,1.53+bob,.60,.09,.18,.025,a,false,18,12);
 if(c.pattern==='spots')for(const side of [-1,1])for(let row=0;row<2;row++)for(let j=0;j<5;j++){const zz=-.64+j*.22+(row?.02:0),i=Math.max(0,torso.findIndex((q,k)=>k<torso.length-1&&zz>=q[0]&&zz<=torso[k+1][0])),p=torso[i],q=torso[i+1],u=(zz-p[0])/(q[0]-p[0]),cy=p[1]+(q[1]-p[1])*u,rx=p[2]+(q[2]-p[2])*u,ry=p[3]+(q[3]-p[3])*u,angle=(row===0?.45:-.18)+Math.sin(j*1.8)*.045;m.ellipsoid(side*rx*Math.cos(angle)*1.006,cy+ry*Math.sin(angle),zz,.008,.029+(j%3)*.004,.041,a,false,10,6);}
 if(c.horns==='antlers')for(const side of [-1,1]){const root=[side*.18,h+.27,z-.1],main=[[...root,.045],[side*.25,h+.57,z-.16,.035],[side*.4,h+.83,z-.22,.026],[side*.53,h+1.02,z-.26,.006]];tube(main,'#866b50');tube([[side*.26,h+.6,z-.17,.026],[side*.14,h+.83,z-.04,.017],[side*.115,h+.96,z+.015,.004]],'#866b50');tube([[side*.36,h+.77,z-.2,.022],[side*.59,h+.84,z-.14,.014],[side*.7,h+.95,z-.1,.004]],'#866b50');}
 if(c.tail==='natural'){const tz=-.84,ty=1.29+bob,k=c.tailSize,sections=[[tz-.42*k,ty+.14,.007,.009],[tz-.31*k,ty+.15,.085*k,.095*k],[tz-.16*k,ty+.10,.115*k,.12*k],[tz,ty,.07,.09]];m.loft(sections,col);patch(sections.map(q=>[q[0],q[1],q[2]*1.012,q[3]*1.012]),-2.96,-.18);}
}
function unicornRig({blend=0,run=0,phase=0}={}){
 const rig=deerRig({blend,run,phase});
 for(const leg of rig.legs){leg.root[1]+=.58;leg.distal[1]+=leg.front>0?.31:.33;leg.upper=leg.front>0?.45:.47;leg.lower=leg.front>0?.69:.63;const [x,y,z]=leg.root,dy=leg.distal[1]-y,dz=leg.distal[2]-z,d=Math.hypot(dy,dz),along=(leg.upper**2-leg.lower**2+d*d)/(2*d),out=Math.sqrt(Math.max(0,leg.upper**2-along**2)),bend=leg.front>0?1:-1;leg.middle=[x,y+dy/d*along-dz/d*out*bend,z+dz/d*along+dy/d*out*bend];}
 return rig;
}
function sculptUnicorn(m,c,t,moving,motion){
 const {tube:rawTube,relief}=sculptTools(m),tube=(p,color)=>rawTube(p,color,[1,0,0]),blend=motion?.blend??Number(moving),run=motion?.run??0,phase=motion?.phase??t*7,rig=unicornRig({blend,run,phase}),bob=rig.bob+.58,col=c.bodyColor,mane=c.accentColor,h=2.32+bob,z=.77,hoof='#b4a894',shade=(hex,k)=>'#'+rgb(hex).map(v=>Math.min(255,Math.round(v*k*255)).toString(16).padStart(2,'0')).join('');
 // A slim equine barrel, long chest and smoothly rising deer-like neck.
 m.loft([[-1.02,1.27+bob,.025,.04],[-.83,1.24+bob,.28,.34],[-.57,1.22+bob,.36,.39],[-.22,1.20+bob,.34,.35],[.12,1.23+bob,.34,.39],[.38,1.29+bob,.29,.41],[.59,1.37+bob,.18,.29],[.70,1.42+bob,.025,.08]],col);
 const neck=[];for(let i=0;i<=14;i++){const u=i/14;neck.push([0,1.31+bob+u*.98,.30+u*.43+Math.sin(u*Math.PI)*.10,.285-u*.14]);}tube(neck,col);
 for(const leg of rig.legs){const {side,front,root,middle,distal,ankle,lift,footZ}=leg;const x=side*(front>0?.24:.27),p=[x,root[1],root[2]];const bones=[[x*.75,root[1]+.12,root[2]-.03,.035],[...p,front>0?.105:.15],[x,middle[1],middle[2],.095],[x,distal[1],distal[2],.065],[x,ankle[1],ankle[2],.06]],skin=[];for(let i=0;i<bones.length-1;i++)for(let j=0;j<3;j++){const u=j/3,a=bones[Math.max(0,i-1)],b=bones[i],q=bones[i+1],r=bones[Math.min(bones.length-1,i+2)];skin.push(b.map((v,k)=>.5*(2*v+(-a[k]+q[k])*u+(2*a[k]-5*v+4*q[k]-r[k])*u*u+(-a[k]+3*v-3*q[k]+r[k])*u*u*u)));}skin.push(bones.at(-1));tube(skin,col);m.ellipsoid(x,.105+lift,footZ+.035,.095,.105,.14,hoof,false,14,10);m.softLink([x,.035+lift,footZ+.167],[x,.14+lift,footZ+.165],.0035,shade(hoof,.75));}
 m.loft([[z-.28,h,.02,.03],[z-.12,h+.015,.235,.29],[z+.09,h,.29,.31],[z+.27,h-.075,.25,.24],[z+.45,h-.20,.16,.13],[z+.58,h-.24,.12,.085],[z+.65,h-.24,.025,.028]],col);
 for(const side of [-1,1]){const k=c.earSize,ear=[[side*.13,h+.15,z-.09],[side*.30,h+.15,z-.1],[side*.50,h+.62*k,z-.12],[side*.42,h+.79*k,z-.12],[side*.21,h+.43,z-.06]],center=[side*.30,h+.39,z-.02];relief(ear,center,.07,col);relief(ear.map(p=>[center[0]+(p[0]-center[0])*.57,center[1]+(p[1]-center[1])*.72,p[2]+.047]),[center[0],center[1],center[2]+.047],.04,'#c8aea1');
  relief([[side*.12,h-.055,z+.43],[side*.16,h+.005,z+.40],[side*.23,h+.01,z+.33],[side*.265,h-.025,z+.27],[side*.21,h-.075,z+.38]],[side*.195,h-.03,z+.385],.018,c.eyeColor,c.glowEyes);
  m.ellipsoid(side*.09,h-.22,z+.567,.03,.018,.012,'#b79e90',false,10,6);m.softLink([side*.01,h-.285,z+.618],[side*.095,h-.28,z+.575],.0035,'#b39d8b');
 }
 const strands=WildwoodPerformance.mobile?12:18;
 for(let j=0;j<strands;j++){const f=j/(strands-1),points=[];for(let i=0;i<=9;i++){const u=i/9,y=2.54-u*(1.20+f*.04),v=Math.max(0,Math.min(1,(y-1.31)/.98)),r=.285-v*.14,x=(f-.5)*.23+Math.sin(u*7+j*.6)*.012,back=.30+v*.43+Math.sin(v*Math.PI)*.10-r*Math.sqrt(Math.max(0,1-(x/r)**2));points.push([x,y+bob,back-.024-Math.sin(u*5+j)*.009,Math.max(.003,.037*(1-u*.72))]);}tube(points,shade(mane,.94+(j%4)*.025));}
 // A light forelock falls beside the horn rather than hiding the eyes.
 for(let j=0;j<5;j++){const points=[];for(let i=0;i<=7;i++){const u=i/7;points.push([-.15+j*.05+Math.sin(u*3+j)*.016,h+.31-u*.24,z-.02+u*.28,Math.max(.003,.025*(1-u*.8))]);}tube(points,mane);}
 if(c.horns==='unicorn'){const points=[],spiral=[];for(let i=0;i<=48;i++){const u=i/48,r=.105*(1-u),angle=u*Math.PI*12,cy=h+.20+u*.85,cz=z+.24+u*.48;if(i%3===0)points.push([0,cy,cz,Math.max(.002,r)]);spiral.push([Math.cos(angle)*r,cy+Math.sin(angle)*r*.49,cz-Math.sin(angle)*r*.87,Math.max(.002,.010*(1-u))]);}tube(points,'#c1aa7b');tube(spiral,'#9e8962');}
 if(c.tail==='natural')for(let j=0;j<strands;j++){const a=j/strands*Math.PI*2,points=[];for(let i=0;i<=10;i++){const u=i/10;points.push([Math.cos(a)*.095+Math.sin(u*6+j*.32+phase*.3)*.10*u,1.40+bob-u*(1.55+.16*c.tailSize),-.86-u*.40*c.tailSize+Math.sin(u*5+j*.24)*.10,Math.max(.003,(.052-u*.048)*(1+(j%3)*.12))]);}tube(points,shade(mane,.94+(j%4)*.025));}
}
function deerFeatherWings(m,c,t,moving,motion){
 const {tube}=sculptTools(m),k=c.wingSize,blend=motion?.blend??Number(moving),run=motion?.run??0,phase=motion?.phase??t*7,color=c.wingColor,bob=Math.sin(phase*2)*(.012+run*.022)*blend;
 // Rotate from the shoulder with the stride; the feather tips follow with a softer delayed flex.
 const flap=Math.sin(t*1.4)*.025*(1-blend)+Math.sin(phase*2-.45)*(.17+run*.09)*blend,sweep=Math.sin(phase)*.07*blend;
 for(const side of [-1,1]){const p=(x,y,z)=>{const flex=Math.sin(phase*2-.95)*.09*blend*x*x,angle=flap+side*sweep,cs=Math.cos(angle),sn=Math.sin(angle),xx=x*k,yy=y*k;return [side*(.29+xx*cs+yy*sn),1.4+bob+yy*cs-xx*sn+flex,z*k+.14+Math.sin(phase*2-.8)*.055*blend*x];};
  tube([[...p(0,0,0),.09],[...p(.24,.36,-.08),.11],[...p(.51,.72,-.22),.065],[...p(.62,.84,-.29),.008]],color);
  for(let i=0;i<9;i++){const u=i/8,start=p(.12+u*.47,.26+u*.52,-.06-u*.21),end=p(.17+u*.69,.01+u*.66,-.35-u*.22),mid=start.map((v,j)=>(v+end[j])/2);tube([[...start,.035*k],[...mid,(.065-u*.018)*k],[...end,.004]],color);}
  for(let i=0;i<5;i++){const u=i/4,start=p(.05+u*.36,.13+u*.40,-.015-u*.13),end=p(.1+u*.41,.02+u*.35,-.23-u*.12),mid=start.map((v,j)=>(v+end[j])/2);tube([[...start,.025*k],[...mid,.048*k],[...end,.003]],color);}
 }
}
// Low, long-bodied ferret with a level back and a compact rounded face.
function sculptFerret(m,c,t,moving,motion){
 const blend=motion?.blend??Number(moving),run=motion?.run??0,phase=motion?.phase??t*8,bob=Math.sin(phase*2)*(.012+run*.025)*blend,col=c.bodyColor,a=c.accentColor;
 const {tube:rawTube}=sculptTools(m),tube=(p,color)=>rawTube(p,color,[1,0,0]);
 const smooth=points=>{const out=[];for(let j=0;j<points.length-1;j++)for(let k=0;k<4;k++){const u=k/4,p=points[Math.max(0,j-1)],q=points[j],r=points[j+1],s=points[Math.min(points.length-1,j+2)];out.push(q.map((v,i)=>.5*((2*v)+(-p[i]+r[i])*u+(2*p[i]-5*v+4*r[i]-s[i])*u*u+(-p[i]+3*v-3*r[i]+s[i])*u*u*u)));}out.push(points.at(-1));return out;};
 const sections=[[-1.03,.64,.025,.04],[-.88,.75,.255,.27],[-.65,.78,.285,.285],[-.36,.79,.28,.28],[-.04,.79,.27,.275],[.25,.80,.255,.27],[.49,.86,.235,.275],[.67,1.00,.225,.27],[.83,1.17,.245,.265],[1.00,1.21,.255,.245],[1.16,1.13,.22,.19],[1.29,1.05,.13,.105],[1.36,1.03,.008,.025]];
 m.loft(smooth(sections).map(p=>[p[0],p[1]-.20+bob+Math.sin(phase-p[0]*2)*run*.025*blend,p[2],p[3]]),col);
 for(const side of [-1,1]){
  for(const front of [-1,1]){
   const p=phase+(side*front>0?0:Math.PI)+(front<0?run*.65:0),stride=Math.sin(p)*(.09+run*.10)*blend,lift=Math.max(0,Math.cos(p))*(.045+run*.055)*blend,z=front>0?.43:-.77,x=side*(front>0?.18:.245),hip=[x*.55,.56+bob,z],knee=[x+side*.015,.22+lift*.3,z+(front>0?-.035:-.10)],ankle=[x,.085+lift,z+.055+stride];
   tube(smooth([[...hip,front>0?.125:.145],[...knee,front>0?.10:.12],[...ankle,.07]]),col);
   m.ellipsoid(x,.07+lift,z+.12+stride,.095,.07,.145,col,false,20,12);
  }
  const k=c.earSize;m.ellipsoid(side*.185,1.225+bob,.875,.075*k,.105*k,.058*k,col,false,20,14);m.ellipsoid(side*.185,1.225+bob,.922,.038*k,.06*k,.012,a,false,16,10);
  // Rounded dark eyes with two small catchlights for a gentle glossy expression.
  m.ellipsoid(side*.208,.97+bob,1.17,.052,.060,.050,c.eyeColor,c.glowEyes,20,14);
  m.ellipsoid(side*.235,.993+bob,1.207,.012,.014,.009,'#fff9ef',true,10,6);
  m.ellipsoid(side*.239,.953+bob,1.205,.005,.006,.004,'#bfcbd5',true,8,5);
 }
 m.ellipsoid(0,.84+bob,1.353,.040,.03,.016,a,false,14,8);
 if(c.tail==='natural'){
  const points=[];for(let i=0;i<=24;i++){const u=i/24;points.push([Math.sin(t*1.25-u*2.3)*.06*u+Math.sin(phase-u*2)*.07*blend*u,.43+bob*(1-u)-.12*Math.sin(u*Math.PI)+.04*Math.sin(u*Math.PI*2)-.06*u**4,-.91-u*1.23*c.tailSize,Math.max(.018,Math.sin(Math.PI*(.18+u*.82))*.125*c.tailSize)]);}tube(points,col);
 }
}
// Snowy owl figurine: upright facial disc, sloping back and overlapping folded flight feathers.
function sculptOwl(m,c,t,moving,motion){
 const blend=motion?.blend??Number(moving),phase=motion?.phase??t*7,run=motion?.run??0,bob=Math.sin(phase*2)*(.018+run*.018)*blend,col=c.bodyColor,a=c.accentColor;
 const {tube}=sculptTools(m),shade=(h,k)=>'#'+rgb(h).map(v=>Math.round(Math.min(1,v*k)*255).toString(16).padStart(2,'0')).join('');
 // Flattened, rounded feather with an actual raised quill and tapered tip.
 const feather=(start,end,width,depth,color,normal)=>{const axis=normalize(subtract(end,start)),across=normalize(cross(axis,normal)),n=normalize(cross(across,axis)),seg=10,rings=8,verts=[],co=rgb(color),cs=Math.cos(m.yaw),sn=Math.sin(m.yaw);for(let j=0;j<=rings;j++){const u=j/rings,profile=Math.pow(Math.sin(Math.PI*u),.35)*(1-u*.35);for(let i=0;i<=seg;i++){const angle=i/seg*Math.PI*2,xx=Math.cos(angle)*width*profile,zz=Math.sin(angle)*depth*profile,p=start.map((v,k)=>v+(end[k]-v)*u+across[k]*xx+n[k]*zz),nn=normalize(across.map((v,k)=>v*Math.cos(angle)*depth+n[k]*Math.sin(angle)*width));verts.push([...m.point(p),nn[0]*cs+nn[2]*sn,nn[1],-nn[0]*sn+nn[2]*cs,...co]);}}for(let j=0;j<rings;j++)for(let i=0;i<seg;i++){const q=j*(seg+1)+i,r=q+seg+1;for(const k of [q,r,q+1,q+1,r,r+1])m.data.push(...verts[k]);}};
 // A continuous pear-shaped breast rises into the rounded head, without ear tufts.
 tube([[0,.52+bob,-.39,.025],[0,.79+bob,-.18,.30],[0,1.15+bob,.02,.43],[0,1.45+bob,.23,.43],[0,1.78+bob,.39,.34],[0,2.0+bob,.43,.27],[0,2.11+bob,.43,.02]],col,[1,0,0]);
 m.ellipsoid(0,1.87+bob,.44,.355,.36,.32,col,false,24,16);
 for(const side of [-1,1]){
  // Subtle pale facial discs and small blue irises, under a softly lowered brow.
  m.ellipsoid(side*.155,1.86+bob,.704,.164,.218,.055,shade(col,1.025),false,20,14);
  m.ellipsoid(side*.162,1.895+bob,.756,.083,.071,.022,'#6b6a75',false,16,10);
  m.ellipsoid(side*.162,1.892+bob,.777,.061,.057,.014,c.eyeColor,c.glowEyes,16,10);
  m.ellipsoid(side*.157,1.896+bob,.790,.027,.039,.009,'#222939',false,12,8);
  m.ellipsoid(side*.176,1.916+bob,.798,.011,.013,.004,'#f3f5ef',true,8,5);
  m.softLink([side*.08,1.955+bob,.751],[side*.25,1.943+bob,.739],.018,col);
  const stride=Math.sin(phase+(side>0?0:Math.PI))*.15*blend,lift=Math.max(0,Math.cos(phase+(side>0?0:Math.PI)))*.12*blend,x=side*.235;
  tube([[x,.85+bob,-.03,.14],[x,.48+lift*.3,.0+stride*.4,.09],[x,.10+lift,.12+stride,.045]],col,[1,0,0]);
  for(const toe of [-1,0,1]){const root=[x,.075+lift,.13+stride],tip=[x+toe*.12,.045+lift,.36+stride-Math.abs(toe)*.06];m.softLink(root,tip,.034,'#c8ae87');m.link(tip,[tip[0],tip[1]-.015,tip[2]+.035],.018,'#94836a',0);}
  m.softLink([x,.07+lift,.13+stride],[x+side*.055,.045+lift,-.035+stride],.025,'#c8ae87');
  if(c.wings==='angel'){
   const flex=Math.sin(phase*2-.4)*.022*blend,k=c.wingSize,point=(y,z,layer=0)=>[side*(.34+layer+flex),1.30+bob+(y-1.30)*k,-.03+(z+.03)*k];
   // Long primaries, secondaries, then scalloped coverts overlap like the reference.
   for(let i=0;i<7;i++)feather(point(1.47-i*.045,.13-i*.065,.025),point(.35+i*.06,-1.00+i*.055,.015),.105,.038,i%3===0?a:c.wingColor,[side,0,0]);
   for(let i=0;i<6;i++)feather(point(1.54-i*.03,.23-i*.095,.058),point(.78-i*.045,-.45-i*.09,.065),.10,.04,i%2?c.wingColor:a,[side,0,0]);
   for(let row=0;row<2;row++)for(let i=0;i<6;i++)feather(point(1.57-row*.11-i*.065,.24-i*.12,.085+row*.018),point(1.32-row*.13-i*.065,.12-i*.12,.09+row*.018),.077,.025,i%3===0?a:col,[side,0,0]);
  }
 }
 // Short down-curved horn-coloured beak sits between the facial discs.
 tube([[0,1.85+bob,.751,.056],[0,1.76+bob,.831,.045],[0,1.665+bob,.803,.003]],'#bba47d',[1,0,0]);
 if(c.tail==='natural')for(let i=0;i<5;i++)feather([(i-2)*.055,.92+bob,-.36],[(i-2)*.085,.10+bob,-1.12*c.tailSize],.085,.026,i%2?a:c.wingColor,[0,1,0]);
}
function creature(config,{position=[0,0,0],yaw=0,t=0,moving=false,motion=null}={}){const c=WildwoodModel.appearance(config),m=new Mesh(position,yaw,WildwoodModel.bodyScale(c)),id=c.animal,col=c.bodyColor,a=c.accentColor,step=moving?Math.sin(t*12)*.13:0;
 const bird=['owl','phoenix','gryphon'].includes(id),pony=['unicorn','pegasus','deer','kirin'].includes(id),rabbit=['bunny','jackalope','chimerabunny'].includes(id),feline=['cat','tiger','snowleopard'].includes(id),long=['ferret','otter','axolotl'].includes(id),headY=id==='unicorn'?2.90:id==='deer'?1.94:id==='cat'?1.16:id==='wolf'?(2.03-.53*(motion?.blend??Number(moving))):id==='fox'?(1.91-.49*(motion?.blend??Number(moving))):id==='bunny'?(1.46-.26*(motion?.blend??Number(moving))):pony?1.7:bird?1.6:long?1.15:1.35;
 if(id==='spiritbunny'){m.ellipsoid(0,.87,0,.65,.67,.75,col);m.ellipsoid(0,1.48,.53,.68,.58,.55,col);for(const side of [-1,1]){m.ellipsoid(side*.34,2.08,.48,.21,.64*c.earSize,.2,col);m.ellipsoid(side*.34,2.12,.66,.095,.45*c.earSize,.04,a);m.ellipsoid(side*.38,.28,.55,.27,.25,.35,col);m.ellipsoid(side*.4,.24,-.42,.27,.24,.3,col);m.ellipsoid(side*.3,1.59,1.025,.12,.15,.05,c.eyeColor,c.glowEyes);m.ellipsoid(side*.3-.035,1.645,1.073,.039,.046,.015,'#f5ffff',true);m.ellipsoid(side*.48,1.35,.96,.11,.055,.027,'#b4e5ef');}m.ellipsoid(0,1.33,1.08,.26,.17,.1,a);m.ellipsoid(0,1.39,1.177,.07,.05,.025,c.eyeColor);}

 else if(id==='fox'||id==='wolf')sculptFox(m,c,t,moving,motion);
 else if(id==='cat')sculptCat(m,c,t,moving,motion);
 else if(id==='bunny')sculptBunny(m,c,t,moving,motion);
 else if(id==='deer')sculptDeer(m,c,t,moving,motion);
 else if(id==='unicorn')sculptUnicorn(m,c,t,moving,motion);
 else if(id==='owl')sculptOwl(m,c,t,moving,motion);
 else if(id==='ferret')sculptFerret(m,c,t,moving,motion);
 else{
  const trueBird=bird&&id!=='gryphon',canine=['fox','wolf','kitsune','fennec'].includes(id),aquatic=id==='axolotl',bodyY=pony?1.03:long?.64:.86,width=id==='bear'?.58:long?.34:.43,length=long?1.03:pony?.94:.82;
  m.loft([[-length,bodyY,.04,.07],[-length*.7,bodyY,width*.9,trueBird?.56:long?.28:.4],[-.15,bodyY+.04,width,trueBird?.67:long?.28:.43],[.35,bodyY+.11,width*.85,trueBird?.52:long?.3:.44],[.68,headY-.2,width*.5,.3],[.79,headY-.1,.05,.08]],col);
  if(pony)m.softLink([0,1.18,.35],[0,1.64,.6],.24,col);
  if(bird){m.ellipsoid(0,headY,.61,.53,.49,.43,col);if(id==='owl')for(const side of [-1,1])m.ellipsoid(side*.25,headY+.05,1.005,.22,.25,.055,a);m.link([0,headY-.1,1.04],[0,headY-.17,1.31],.115,'#c9a262',0);for(const side of [-1,1]){m.ellipsoid(side*.42,1,-.08,.16,.44,.43,col);for(let j=0;j<4;j++)m.softLink([side*.46,1.22-j*.08,.06],[side*.43,.65-j*.025,-.4-j*.06],.06,a);}}
  else{const hw=pony?.31:rabbit?.47:long?.39:id==='bear'?.5:.44;m.loft([[.27,headY,.04,.08],[.44,headY+.03,hw*.88,.35],[.7,headY+.04,hw,.4],[.91,headY+.02,hw*.82,.31],[1.045,headY-.07,hw*.52,.2],[1.13,headY-.13,.035,.07]],col);const reach=pony?1.47:canine?1.5:long?1.36:1.3;m.loft([[.93,headY-.19,.25,.15],[1.14,headY-.18,.23,.16],[reach-.06,headY-.16,pony?.2:.14,.10],[reach,headY-.13,.05,.045]],a);m.ellipsoid(0,headY-.13,reach+.012,pony?.08:.067,.043,.035,'#394447',false,12,7);for(const side of [-1,1])m.softLink([0,headY-.22,reach-.005],[side*.1,headY-.26,reach-.045],.008,'#53605b');}
  for(const side of [-1,1]){
   for(const front of (trueBird?[0]:[-1,1])){const phase=t*8+(side*(trueBird?1:front)>0?0:Math.PI),stride=moving?Math.sin(phase)*.13:0,lift=moving?Math.max(0,Math.cos(phase))*.10:0,z=trueBird?-.05:front*(long?.65:.48),hip=[side*(pony?.29:.31),bodyY-.1,z],knee=[hip[0],pony?.53:long?.28:.4,z+(front<0?.12:-.08)+stride*.4],ankle=[hip[0],.22+lift,z+stride],footZ=z+stride+.12;
    if(rabbit&&front<0)m.ellipsoid(side*.33,.5,-.48,.27,.34,.32,col);m.softLink(hip,knee,pony?.095:long?.1:.14,col);m.ellipsoid(...knee,pony?.11:.13,.13,.12,col,false,10,6);m.softLink(knee,ankle,pony?.075:.095,col);m.ellipsoid(hip[0],.13+lift,footZ,pony?.15:trueBird?.105:.18,.13,rabbit&&front<0?.32:pony?.19:.24,a,false,14,8);
    if(trueBird||aquatic||id==='gryphon'&&front>0)for(let toe=-1;toe<=1;toe++)m.softLink([hip[0],.09+lift,footZ],[hip[0]+toe*.08,.055+lift,footZ+.2-Math.abs(toe)*.035],.018,trueBird?'#b69563':a);
    else if(!pony)for(let toe=-1;toe<=1;toe++)m.ellipsoid(hip[0]+toe*.065,.12+lift,footZ+.16,.055,.065,.072,a,false,7,4);
    else if(id==='deer'||id==='kirin')m.softLink([hip[0],.045+lift,footZ+.19],[hip[0],.17+lift,footZ+.19],.008,'#66715d');
   }
   const eyeX=side*(pony?.22:trueBird?.25:long?.255:.28),eyeZ=trueBird?1.065:pony?.98:1.018;m.ellipsoid(eyeX,headY+.13,eyeZ,trueBird?.085:.073,.085,.04,c.eyeColor,c.glowEyes,14,8);m.ellipsoid(eyeX-.016,headY+.158,eyeZ+.037,.019,.022,.008,'#f4fbff',true,8,5);
   if(rabbit||id==='bat'){const top=[side*.28,headY+.96*c.earSize,.47];m.softLink([side*.28,headY+.26,.53],top,.115,col);m.softLink([side*.28,headY+.42,.62],[top[0],top[1]-.1,.58],.052,a);}
   else if(id==='bear'||id==='otter')m.ellipsoid(side*.36,headY+.37,.5,.15*c.earSize,.17*c.earSize,.1,col);
   else if(!bird&&!aquatic){const k=c.earSize*(id==='fennec'?1.35:1),base=[side*.3,headY+.23,.5],tip=[side*.37,headY+.68*k,.46],left=[base[0]-.13*k,base[1],.55],right=[base[0]+.13*k,base[1],.55],back=[base[0],base[1],.36];m.triangle(left,right,tip,col);m.triangle(left,tip,back,col);m.triangle(right,back,tip,col);m.triangle([base[0]-.07*k,base[1]+.04,.563],[base[0]+.07*k,base[1]+.04,.563],[tip[0],tip[1]-.08,.475],a);}
   if(feline||long&&!aquatic)for(let j=0;j<3;j++)m.softLink([side*.15,headY-.17+j*.025,1.24],[side*(.36+j*.045),headY-.2+j*.055,1.23],.004,'#d5ddd4');
  }
  if(pony)for(let i=0;i<6;i++)m.ellipsoid(0,1.35+i*.1,.05+i*.05,.12,.18,.11,c.wingColor);
  if(aquatic)for(const side of [-1,1])for(let i=0;i<3;i++){const end=[side*(.76-i*.04),headY-.24+i*.27,.58];m.softLink([side*.38,headY-.15+i*.16,.6],end,.035,a);for(let j=1;j<=3;j++)m.softLink(end,[end[0]+side*.07*j,end[1]+(j-2)*.06,end[2]-.02*j],.012,a);}
 }

 if(!['fox','wolf','cat','bunny','deer','unicorn','owl','ferret'].includes(id)||c.tail!=='natural'){const start=m.data.length;tail(m,c,t);if(id==='unicorn')for(let i=start+1;i<m.data.length;i+=9)m.data[i]+=.58;}if(id==='deer'&&c.wings==='angel')deerFeatherWings(m,c,t,moving,motion);else {const start=m.data.length;if(id==='unicorn'&&c.wings==='angel')deerFeatherWings(m,{...c,wingSize:c.wingSize*1.9},t,moving,motion);else if(id!=='owl'||c.wings!=='angel')wings(m,c,t,moving);if(id==='unicorn')for(let i=start+1;i<m.data.length;i+=9)m.data[i]+=.58;}if((id!=='deer'||c.horns!=='antlers')&&(id!=='unicorn'||c.horns!=='unicorn'))horns(m,c,headY);details(m,c,headY);
 return new Float32Array(m.data);
}
function soul(type,position,t,eye=[4,3,6]){const s=WildwoodModel.souls.find(x=>x.id===type);if(!s)return {solid:new Float32Array(),glow:new Float32Array()};const m=new Mesh(position),g=new Mesh(),color=s.color,co=rgb(color);m.ellipsoid(0,0,0,.19,.22,.19,color,true);m.ellipsoid(0,-.03,.02,.095,.14,.1,'#f5ffff',true);for(let i=0;i<5;i++){const a=t*1.7+i/5*6.283,x=Math.cos(a)*.11,z=Math.sin(a)*.11;m.link([x,-.06,z],[x*.5+Math.sin(t*4+i)*.04,.36+Math.sin(t*3+i)*.08,z*.5],.09,color,0,true);}
 const normal=normalize(subtract(eye,position)),right=normalize(cross([0,1,0],normal)),up=cross(normal,right),p=(r,a)=>position.map((v,k)=>v+r*(right[k]*Math.cos(a)+up[k]*Math.sin(a)));
 for(const [inner,outer,bright1,bright2] of [[0,.28,.55,.32],[.28,.55,.32,.08],[.55,.9,.08,0]])for(let i=0;i<24;i++){const a=i/24*6.283,b=(i+1)/24*6.283,v=[p(inner,a),p(outer,a),p(outer,b),p(inner,b)],colors=[bright1,bright2,bright2,bright1];for(const face of [[0,1,2],[0,2,3]])for(const j of face)g.data.push(...v[j],0,3,0,...co.map(c=>c*colors[j]));}
 for(let i=0;i<5;i++){const phase=(t*.7+i*.2)%1,angle=t+i*1.7,px=Math.sin(angle)*.27*phase,pz=Math.cos(angle)*.27*phase;m.ellipsoid(px,.3+phase*.65,pz,.025*(1-phase),.04*(1-phase),.025*(1-phase),color,true,5,3);}
 return {solid:new Float32Array(m.data),glow:new Float32Array(g.data)};
}
function glow(position,color,eye,radius=1,intensity=.3){const data=[],co=rgb(color),n=normalize(subtract(eye,position)),right=normalize(cross([0,1,0],n)),up=cross(n,right),point=(r,a)=>position.map((v,k)=>v+r*(right[k]*Math.cos(a)+up[k]*Math.sin(a)));for(const [inner,outer,a,b] of [[0,radius*.35,1,.3],[radius*.35,radius,.3,0]])for(let i=0;i<20;i++){const angle=i/20*6.283,next=(i+1)/20*6.283,v=[point(inner,angle),point(outer,angle),point(outer,next),point(inner,next)],brightness=[a,b,b,a];for(const f of [[0,1,2],[0,2,3]])for(const j of f)data.push(...v[j],0,3,0,...co.map(x=>x*brightness[j]*intensity));}return new Float32Array(data);}
function multiply(a,b){const c=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++)for(let k=0;k<4;k++)c[i*4+j]+=a[k*4+j]*b[i*4+k];return c;}
class Preview {
 constructor(canvas,getConfig){this.canvas=canvas;this.getConfig=getConfig;this.yaw=.65;this.pitch=.2;this.zoom=8.5;this.drag=null;this.disposed=false;const gl=canvas.getContext('webgl',{antialias:true,alpha:false});if(!gl)throw Error('3D preview unavailable');this.gl=gl;const shader=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec3 p,n,c;uniform mat4 vp;varying vec3 color;void main(){gl_Position=vp*vec4(p,1.);color=c*(length(n)>2.?1.:(.64+.36*max(dot(normalize(n),normalize(vec3(-.4,1.,.8))),0.)));}'));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec3 color;void main(){gl_FragColor=vec4(color,1.);}'));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));this.program=program;gl.useProgram(program);this.loc={p:gl.getAttribLocation(program,'p'),n:gl.getAttribLocation(program,'n'),c:gl.getAttribLocation(program,'c'),vp:gl.getUniformLocation(program,'vp')};this.buffer=gl.createBuffer();gl.enable(gl.DEPTH_TEST);gl.clearColor(.055,.105,.14,1);
 canvas.addEventListener('pointerdown',e=>{this.drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!this.drag)return;this.yaw-=(e.clientX-this.drag[0])*.012;this.pitch=Math.max(-.15,Math.min(.8,this.pitch+(e.clientY-this.drag[1])*.006));this.drag=[e.clientX,e.clientY];});canvas.addEventListener('pointerup',()=>this.drag=null);canvas.addEventListener('pointercancel',()=>this.drag=null);canvas.addEventListener('wheel',e=>{e.preventDefault();this.zoom=Math.max(5,Math.min(13,this.zoom+e.deltaY*.008));},{passive:false});
 this.tick=time=>{if(this.disposed)return;if(this.lastFrame&&time-this.lastFrame<1000/WildwoodPerformance.targetFps-1){this.frame=requestAnimationFrame(this.tick);return;}this.lastFrame=time;this.draw(time/1000);this.frame=requestAnimationFrame(this.tick);};this.frame=requestAnimationFrame(this.tick);
 }
 draw(t){const gl=this.gl,c=this.canvas,d=Math.min(devicePixelRatio||1,WildwoodPerformance.mobile?1.2:1.5);const w=Math.round(c.clientWidth*d),h=Math.round(c.clientHeight*d);if(w<1||h<1)return;if(c.width!==w||c.height!==h){c.width=w;c.height=h;}gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const config=this.getConfig(),distance=this.zoom*(config.animal==='unicorn'?1.16:config.animal==='wolf'?1.18:1)*(config.wings!=="none"?(config.animal==='deer'&&config.wings==='angel'?1.08:1.22):1)*Math.max(1,config.size)*Math.max(1,config.wingSize*.8),yaw=this.yaw,eye=[Math.sin(yaw)*distance,2+Math.sin(this.pitch)*distance,Math.cos(yaw)*distance],target=[0,config.animal==='unicorn'?1.15:.65,0],z=normalize(subtract(eye,target)),x=normalize(cross([0,1,0],z)),y=cross(z,x),f=1/Math.tan(.72/2),near=.1,far=50,view=new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]),projection=new Float32Array([f/(w/h),0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]);gl.uniformMatrix4fv(this.loc.vp,false,multiply(projection,view));const pedestal=new Mesh();pedestal.disk(0,.01,0,2.35,'#1d3841');pedestal.ring(0,.02,0,2.3,'#668779');pedestal.ring(0,.03,0,1.8,'#3d6762');this.render(new Float32Array(pedestal.data));this.render(creature(config,{yaw:Math.sin(t*.12)*.15,t}));const orb=soul(config.soul,[1.4,1.55+Math.sin(t*2)*.12,.45],t,eye);this.render(orb.solid);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.depthMask(false);this.render(orb.glow);gl.depthMask(true);gl.disable(gl.BLEND);this.error=gl.getError();}
 render(data){if(!data.length)return;const gl=this.gl;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);for(const [k,offset] of [['p',0],['n',12],['c',24]]){gl.enableVertexAttribArray(this.loc[k]);gl.vertexAttribPointer(this.loc[k],3,gl.FLOAT,false,36,offset);}gl.drawArrays(gl.TRIANGLES,0,data.length/9);}
 dispose(){this.disposed=true;cancelAnimationFrame(this.frame);this.gl.deleteBuffer(this.buffer);this.gl.deleteProgram(this.program);const extension=this.gl.getExtension('WEBGL_lose_context');if(extension)extension.loseContext();}
}
window.MythicMesh={Mesh,creature,soul,glow,Preview,advanceFoxMotion,deerRig,unicornRig};
})();
