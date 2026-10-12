'use strict';
(() => {
class MeadowGroundcover{
 constructor(terrain,stones=[]){this.data=[];this.blades=0;this.plants=0;let seed=524891;const r=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;},blocked=(x,z)=>Math.hypot(x,z)>38||Math.hypot(x,z)<5.9||Math.abs(x)<2.1||Math.abs(z-Math.sin(x*.08)*2)<2.6||Math.hypot(x-21,z-12)<4.9||Math.hypot(x+8,z-18)<8||Math.hypot(x-8,z+8)<3.4||Math.hypot(x-20,z+17)<2||stones.some(s=>Math.hypot(x-s.x,z-s.z)<1.2)||(Math.abs(x+27)<1.2&&z>14&&z<21);
  const vertex=(x,y,z,h,col)=>this.data.push(x,y,z,0,h,.5,...col);
  for(let x=-38;x<38;x+=.8)for(let z=-38;z<38;z+=.8){if(blocked(x,z))continue;const count=WildwoodPerformance.mobile?7:11;for(let i=0;i<count;i++){const xx=x+(r()-.5)*.78,zz=z+(r()-.5)*.78;if(blocked(xx,zz))continue;const base=terrain.sample(xx,zz)+.012,h=.18+r()*.24,w=.025+r()*.025,a=r()*6.283,dx=Math.cos(a)*w,dz=Math.sin(a)*w,bx=Math.cos(a+.5)*h*.2,bz=Math.sin(a+.5)*h*.2,col=[.23+r()*.12,.43+r()*.16,.16+r()*.1];const points=[[xx-dx,base,zz-dz,0],[xx+dx,base,zz+dz,0],[xx+bx+dx*.5,base+h*.58,zz+bz+dz*.5,h*.58],[xx+bx-dx*.5,base+h*.58,zz+bz-dz*.5,h*.58],[xx+bx*1.8,base+h,zz+bz*1.8,h]];for(const k of [0,1,2,0,2,3,3,2,4])vertex(...points[k],col);this.blades++;}
   if(r()<.025){const xx=x+.2,zz=z+.2,base=terrain.sample(xx,zz);for(let j=0;j<5;j++){const a=j*1.257,dx=Math.cos(a)*.16,dz=Math.sin(a)*.16;for(const p of [[xx,base+.04,zz,.04],[xx+dx-dz*.45,base+.14,zz+dz+dx*.45,.14],[xx+dx*1.8,base+.2,zz+dz*1.8,.2],[xx+dx+dz*.45,base+.14,zz+dz-dx*.45,.14]])vertex(...p,[.29,.5,.24]);const start=this.data.length-36;const v=this.data.slice(start);this.data.length=start;for(const k of [0,1,2,0,2,3])this.data.push(...v.slice(k*9,k*9+9));}this.plants++;}
  }this.mesh=new Float32Array(this.data);this.data=null;
 }
 diagnostics(){return {blades:this.blades,lowPlants:this.plants,height:[.18,.42],vertices:this.mesh.length/9};}
}
window.MeadowGroundcover=MeadowGroundcover;
})();
