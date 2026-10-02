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
 constructor(){this.mesh=new MythicMesh.Mesh();this.trees=[];this.shrubs=0;this.seed=39187;this.time=0;this.wind=1;this.leaves=[];this.limit=WildwoodPerformance.mobile?36:72;}
 random(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296;}
 tree(x,z,size=1){const m=this.mesh,r=()=>this.random(),h=(7+r()*2.2)*size;this.trees.push({x,z,h,size});
  m.softLink([x,.1,z],[x+.12*size,h*.72,z-.15*size],.23*size,'#80674c');
  for(let i=0;i<5;i++){const a=i*2.399+r()*.4,start=[x,h*(.35+i*.055),z],end=[x+Math.cos(a)*1.5*size,h*(.7+i*.035),z+Math.sin(a)*1.5*size];m.link(start,end,.11*size,'#8f7452');}
  for(let i=0;i<5;i++){const a=i*2.399,radius=i===4?0:1.35*size,cx=x+Math.cos(a)*radius,cz=z+Math.sin(a)*radius,cy=h*(i===6?.93:.73)+r()*.5;
   m.ellipsoid(cx,cy,cz,(1.25+r()*.35)*size,(1.35+r()*.35)*size,(1.15+r()*.35)*size,palette[i%5],false,WildwoodPerformance.mobile?10:12,7);
   const count=WildwoodPerformance.mobile?12:20;for(let j=0;j<count;j++){const u=r()*6.283,v=Math.acos(r()*2-1);leaf(m,cx+Math.cos(u)*Math.sin(v)*1.5*size,cy+Math.cos(v)*1.5*size,cz+Math.sin(u)*Math.sin(v)*1.5*size,.35+r()*.25,u,(r()-.5)*.7,palette[(j+i)%5],j%3===0);}
  }
  for(let i=0;i<4;i++){const a=i*1.57;m.link([x,.22,z],[x+Math.cos(a)*.65*size,.04,z+Math.sin(a)*.65*size],.1*size,'#80674c');}
 }
 shrub(x,z){this.shrubs++;const m=this.mesh,r=()=>this.random();for(let i=0;i<5;i++){const a=i*2.399+r()*.3,h=.35+r()*.5,end=[x+Math.cos(a)*.35,h,z+Math.sin(a)*.35];m.link([x,.02,z],end,.018,'#64854f',.008);for(let j=1;j<=4;j++){const t=j/4;for(const side of [-1,1])leaf(m,x+(end[0]-x)*t,h*t,z+(end[2]-z)*t,.2+(1-t)*.18,a+side*.85,.3,palette[(i+j)%5]);}}
 }
 staticMesh(){return new Float32Array(this.mesh.data);}
 spawn(p,position){const nearby=this.trees.filter(t=>Math.hypot(t.x-position.x,t.z-position.z)<23),tree=nearby[Math.floor(this.random()*nearby.length)];if(!tree){p.active=false;return;}const a=this.random()*6.283,r=this.random()*2*tree.size;Object.assign(p,{active:true,x:tree.x+Math.cos(a)*r,y:tree.h*(.65+this.random()*.3),z:tree.z+Math.sin(a)*r,vx:0,vy:-.15,vz:0,age:0,rest:0,phase:this.random()*6.283,size:.14+this.random()*.13,color:['#b4bb69','#a8ad59','#bf9d61','#7c9c58'][Math.floor(this.random()*4)]});}
 update(dt,position,weather,advance=true){if(!advance)return;this.time+=dt;const desired=weather==='rain'?1.45:weather==='cloudy'?1.2:.85;this.wind+=(desired-this.wind)*(1-Math.exp(-dt*.5));
  if(this.leaves.length<this.limit){const p={};this.spawn(p,position);this.leaves.push(p);}
  for(const p of this.leaves){if(!p.active||Math.hypot(p.x-position.x,p.z-position.z)>28){this.spawn(p,position);continue;}p.age+=dt;if(p.y<=.08){p.rest+=dt;if(p.rest>4)this.spawn(p,position);continue;}
   const gust=(.7+Math.sin(this.time*.55+p.phase)*.25)*this.wind;p.vx+=(gust*.65-p.vx)*Math.min(1,dt*1.8);p.vz+=(gust*.35+Math.sin(this.time*.9+p.phase)*.3-p.vz)*Math.min(1,dt*1.5);p.vy=Math.max(-.58,p.vy-dt*.45);p.x+=(p.vx+Math.sin(p.age*3+p.phase)*.18)*dt;p.z+=p.vz*dt;p.y=Math.max(.075,p.y+(p.vy+Math.sin(p.age*2+p.phase)*.12)*dt);
  }
 }
 fallingMesh(){const m=new MythicMesh.Mesh();for(const p of this.leaves)if(p.active)leaf(m,p.x,p.y-p.rest*.018,p.z,p.size,p.phase+p.age*.7,p.rest?0:Math.sin(p.age*3+p.phase)*.9,p.color);return new Float32Array(m.data);}
 diagnostics(){return {trees:this.trees.length,shrubs:this.shrubs,minHeight:Math.min(...this.trees.map(t=>t.h)),maxHeight:Math.max(...this.trees.map(t=>t.h)),fallingLeaves:this.leaves.filter(p=>p.active).length,leafLimit:this.limit,wind:this.wind,time:this.time,vertices:this.mesh.data.length/9};}
}
window.WoodlandFoliage=WoodlandFoliage;
})();
