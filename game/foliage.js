'use strict';
(() => {
const palette=['#648751','#789854','#8da962','#a1b773','#557a52'];
// Folded, pointed leaf blades: four faces and a pale midrib rather than flat squares.
function leaf(m,x,y,z,size,yaw,tilt,color,vein=false){
 const c=Math.cos(yaw),s=Math.sin(yaw),p=(u,v,w)=>[x+(u*c-w*s)*size,y+(v+u*tilt)*size,z+(u*s+w*c)*size];
 const a=p(-.65,0,0),b=p(.65,0,0),l=p(0,0,.3),r=p(0,0,-.3),mid=p(0,.12,0);
 for(const v of [[a,l,mid],[l,b,mid],[b,r,mid],[r,a,mid]])m.triangle(...v,color);
 if(vein)m.triangle(p(-.55,.014,.018),p(.56,.024,0),p(0,.135,-.018),'#b7c684');
}
class WoodlandFoliage{
 constructor(){this.mesh=new MythicMesh.Mesh();this.trees=[];this.shrubs=0;this.individualLeaves=0;this.flowers={lavender:0,whiteTulips:0};this.seed=39187;this.time=0;this.wind=1;this.leaves=[];this.limit=WildwoodPerformance.mobile?36:72;}
 random(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296;}
 treeLeaf(x,y,z,size,yaw,tilt,type){const m=this.mesh,r=()=>this.random(),c=Math.cos(yaw),sn=Math.sin(yaw),width=(type==='willow'||type==='spruce'?.11:.25)+r()*.09,skew=(r()-.5)*.16,fold=.05+r()*.13,co=type==='flowering'&&r()<.24?[.91+r()*.08,.62+r()*.18,.69+r()*.18]:type==='spruce'?[.22+r()*.12,.39+r()*.13,.29+r()*.1]:[.28+r()*.22,.42+r()*.23,.22+r()*.16];
  const pt=(u,w,v=0)=>[x+(u*c-w*sn)*size,y+(u*tilt+v)*size,z+(u*sn+w*c)*size],outline=[pt(-.62,0)];const steps=type==='oak'?4:type==='willow'||type==='spruce'?1:2;for(let side=0;side<2;side++)for(let j=1;j<=steps;j++){const t=j/(steps+1),u=side===0?-.62+t*1.3:.68-t*1.3,profile=Math.sin(t*Math.PI)*(type==='oak'?(j%2?.82:1.18):1),w=(side===0?1:-1)*width*profile+skew*t;outline.push(pt(u,w,(r()-.5)*.035));if(side===0&&j===steps)outline.push(pt(.68,0));}const mid=pt(skew,0,fold);for(let j=0;j<outline.length;j++)m.triangle(outline[j],outline[(j+1)%outline.length],mid,co);if(type!=='spruce')m.triangle(pt(-.52,.009,.018),pt(.58,0,.018),pt(skew,-.012,fold+.008),co.map(v=>Math.min(1,v+.14)));this.individualLeaves++;}
 tree(x,z,size=1,type){const m=this.mesh,r=()=>this.random();type=type||['willow','dead','deciduous','oak','spruce','flowering'][this.trees.length%6];const h=(7+r()*2.2)*size,bark=type==='dead'?'#8a8271':type==='flowering'?'#92745f':'#80674c';this.trees.push({x,z,h,size,type});
  const lean=(r()-.5)*.45*size;m.softLink([x,.1,z],[x+lean,h*(type==='spruce'?.96:.75),z-.15*size],(type==='oak'?.32:.22)*size,bark);
  if(type==='spruce'){for(let tier=0;tier<9;tier++){const y=h*(.22+tier*.075),reach=(2.3-tier*.22)*size;for(let arm=0;arm<5;arm++){const a=arm*1.257+tier*.58+r()*.25,end=[x+Math.cos(a)*reach,y-.22,z+Math.sin(a)*reach];m.link([x,y+.15,z],end,.06*size,bark,.012);const n=WildwoodPerformance.mobile?4:6;for(let j=0;j<n;j++){const t=(j+.2)/n;for(const side of [-1,1])this.treeLeaf(x+(end[0]-x)*t,y-.22*t,z+(end[2]-z)*t,(.45+(1-t)*.35)*size,a+side*.85,-.16,'spruce');}}}}
  else{const arms=type==='oak'?9:7;for(let i=0;i<arms;i++){const a=i*2.399+r()*.5,reach=(type==='oak'?2.7:type==='willow'?2.3:1.9)*size*(.65+r()*.35),y=h*(.48+r()*.3),joint=[x+Math.cos(a)*reach*.5,y,z+Math.sin(a)*reach*.5],tip=[x+Math.cos(a)*reach,y+(.6+r()*.8)*size,z+Math.sin(a)*reach];m.link([x+lean*.5,h*.4,z],joint,.13*size,bark,.07);m.link(joint,tip,.07*size,bark,.018);
   if(type==='dead'){for(let k=0;k<3;k++)m.link(tip,[tip[0]+(r()-.5)*.8,tip[1]+.3+r()*.7,tip[2]+(r()-.5)*.8],.025,bark,.003);continue;}
   if(type==='willow'){for(let strand=0;strand<2;strand++){const sx=tip[0]+(r()-.5)*.9,sz=tip[2]+(r()-.5)*.9,drop=(1.7+r()*1.7)*size;let previous=[sx,tip[1],sz];for(let j=1;j<=7;j++){const q=[sx+Math.sin(j*.4+a)*.25,tip[1]-drop*j/7,sz+Math.cos(j*.35+a)*.2];m.link(previous,q,.012,'#7a8856',.009);for(const side of [-1,1])this.treeLeaf(q[0],q[1],q[2],(.48+r()*.2)*size,a+side*.7,-.9-r()*.5,'willow');previous=q;}}}
   else{const count=WildwoodPerformance.mobile?22:32;for(let j=0;j<count;j++){const t=r(),u=r()*6.283,spread=Math.sqrt(r())*(type==='oak'?1.25:1)*size;this.treeLeaf(joint[0]+(tip[0]-joint[0])*t+Math.cos(u)*spread,joint[1]+(tip[1]-joint[1])*t+(r()-.4)*1.3*size,joint[2]+(tip[2]-joint[2])*t+Math.sin(u)*spread,(.55+r()*.45)*size,u,(r()-.5)*1.2,type);}}
  }}
  for(let i=0;i<4;i++){const a=i*1.57;m.link([x,.22,z],[x+Math.cos(a)*.65*size,.04,z+Math.sin(a)*.65*size],.1*size,bark);}
 }
 giantOak(x,z){this.tree(x,z,2,'oak');this.giant={x,z,door:'boarded',height:this.trees.at(-1).h};const m=this.mesh;
  m.link([x,0,z],[x+.1,8,z],1.35,'#80674c',1.25);for(let i=0;i<7;i++){const a=i*.898;m.softLink([x+Math.cos(a)*.6,.45,z+Math.sin(a)*.6],[x+Math.cos(a)*2.1,.03,z+Math.sin(a)*2.1],.25,'#796149');}
  const y=.1,front=z+1.37,p=(u,v,d=0)=>[x+u,y+v,front+d];m.triangle(p(-.7,0),p(.7,0),p(.7,1.9),'#3b3028');m.triangle(p(-.7,0),p(.7,1.9),p(-.7,1.9),'#3b3028');
  for(let i=0;i<10;i++){const a=i*Math.PI/10,b=(i+1)*Math.PI/10;m.triangle(p(0,1.9),p(Math.cos(a)*.7,1.9+Math.sin(a)*.7),p(Math.cos(b)*.7,1.9+Math.sin(b)*.7),'#3b3028');}
  for(let i=0;i<5;i++){const u=-.56+i*.28;m.link(p(u,.1,.025),p(u,2.0+Math.sqrt(Math.max(0,.49-u*u)),.025),.07,'#665239',.055);}
  for(const [v,slope] of [[.6,.2],[1.35,-.32],[2,.15]]){const a=p(-.86,v,.13),b=p(.86,v+slope,.13),c=p(.86,v+slope+.22,.13),d=p(-.86,v+.22,.13);m.triangle(a,b,c,'#b09468');m.triangle(a,c,d,'#b09468');for(const u of [-.65,.65])m.ellipsoid(...p(u,v+.11+(u+.86)/1.72*slope,.15),.035,.035,.015,'#55483b',false,5,3);}
 }
 shrub(x,z){this.shrubs++;const m=this.mesh,r=()=>this.random();for(let i=0;i<5;i++){const a=i*2.399+r()*.3,h=.35+r()*.5,end=[x+Math.cos(a)*.35,h,z+Math.sin(a)*.35];m.link([x,.02,z],end,.018,'#64854f',.008);for(let j=1;j<=4;j++){const t=j/4;for(const side of [-1,1])leaf(m,x+(end[0]-x)*t,h*t,z+(end[2]-z)*t,.2+(1-t)*.18,a+side*.85,.3,palette[(i+j)%5]);}}
 }
 flowerPatch(x,z,type){const m=this.mesh;for(let i=0;i<3;i++){const a=i*2.399,cx=x+Math.cos(a)*.22,cz=z+Math.sin(a)*.22,h=.55+this.random()*.22;
  m.link([cx,.02,cz],[cx,h,cz],.017,'#537b50',.009);
  if(type==='lavender'){this.flowers.lavender++;for(let j=0;j<4;j++){const y=h-.03+j*.075,r=.065-j*.009;m.ellipsoid(cx,y,cz,r,.085,r,j%2?'#a792c8':'#8064ab',false,6,4);}for(const side of [-1,1])leaf(m,cx,h*.35,cz,.28,a+side,.7,'#799784');}
  else{this.flowers.whiteTulips++;for(let j=0;j<5;j++){const angle=j*6.283/5;m.ellipsoid(cx+Math.cos(angle)*.075,h+.09,cz+Math.sin(angle)*.075,.075,.16,.075,j%2?'#fff7e5':'#eeeede',false,7,5);}m.ellipsoid(cx,h+.07,cz,.065,.055,.065,'#e6ce80',false,6,3);for(const side of [-1,1])leaf(m,cx,h*.3,cz,.48,a+side*.8,1.1,'#668e5a');}
 }}
 staticMesh(){return new Float32Array(this.mesh.data);}
 spawn(p,position){const nearby=this.trees.filter(t=>t.type!=='dead'&&Math.hypot(t.x-position.x,t.z-position.z)<23),tree=nearby[Math.floor(this.random()*nearby.length)];if(!tree){p.active=false;return;}const a=this.random()*6.283,r=this.random()*2*tree.size;Object.assign(p,{active:true,type:tree.type,x:tree.x+Math.cos(a)*r,y:tree.h*(.65+this.random()*.3),z:tree.z+Math.sin(a)*r,vx:0,vy:-.15,vz:0,age:0,rest:0,phase:this.random()*6.283,size:.14+this.random()*.13,color:['#b4bb69','#a8ad59','#bf9d61','#7c9c58'][Math.floor(this.random()*4)]});}
 update(dt,position,weather,advance=true){if(!advance)return;this.time+=dt;const desired=weather==='rain'?1.45:weather==='cloudy'?1.2:.85;this.wind+=(desired-this.wind)*(1-Math.exp(-dt*.5));
  if(this.leaves.length<this.limit){const p={};this.spawn(p,position);this.leaves.push(p);}
  for(const p of this.leaves){if(!p.active||Math.hypot(p.x-position.x,p.z-position.z)>28){this.spawn(p,position);continue;}p.age+=dt;if(p.y<=.08){p.rest+=dt;if(p.rest>4)this.spawn(p,position);continue;}
   const gust=(.7+Math.sin(this.time*.55+p.phase)*.25)*this.wind;p.vx+=(gust*.65-p.vx)*Math.min(1,dt*1.8);p.vz+=(gust*.35+Math.sin(this.time*.9+p.phase)*.3-p.vz)*Math.min(1,dt*1.5);p.vy=Math.max(-.58,p.vy-dt*.45);p.x+=(p.vx+Math.sin(p.age*3+p.phase)*.18)*dt;p.z+=p.vz*dt;p.y=Math.max(.075,p.y+(p.vy+Math.sin(p.age*2+p.phase)*.12)*dt);
  }
 }
 fallingMesh(){const m=new MythicMesh.Mesh();for(const p of this.leaves)if(p.active)leaf(m,p.x,p.y-p.rest*.018,p.z,p.size,p.phase+p.age*.7,p.rest?0:Math.sin(p.age*3+p.phase)*.9,p.color);return new Float32Array(m.data);}
 diagnostics(){return {trees:this.trees.length,shrubs:this.shrubs,individualLeaves:this.individualLeaves,treeTypes:Object.fromEntries(['willow','dead','deciduous','oak','spruce','flowering'].map(type=>[type,this.trees.filter(t=>t.type===type).length])),flowers:{...this.flowers},giantOak:this.giant?{...this.giant}:null,minHeight:Math.min(...this.trees.map(t=>t.h)),maxHeight:Math.max(...this.trees.map(t=>t.h)),fallingLeaves:this.leaves.filter(p=>p.active).length,leafLimit:this.limit,wind:this.wind,time:this.time,vertices:this.mesh.data.length/9};}
}
window.WoodlandFoliage=WoodlandFoliage;
})();
