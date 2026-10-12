'use strict';
(() => {
const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
class WoodlandTerrain{
 constructor(stones=[]){this.hills=[[-25,-24,4.8,10],[17,27,3.8,9],[28,-6,3.4,9],[-30,5,2.8,7],[9,-28,3.5,8]];this.clearings=[[-8,17,11],[21,12,6.3],[20,-17,6],[8,-8,4.5],[-20,-12,3],[-27,14,5.5],...stones.map(s=>[s.x,s.z,2.3])];}
 height(x,z){const radius=Math.hypot(x,z);if(radius>40.5)return 0;let y=0;for(const [cx,cz,h,w] of this.hills)y+=h*Math.exp(-((x-cx)**2+(z-cz)**2)/(w*w));y+=.16*(Math.sin(x*.57+z*.23)+Math.cos(z*.49-x*.18));let mask=smooth(2.5,5,Math.abs(x))*smooth(2.7,5,Math.abs(z-Math.sin(x*.08)*2))*smooth(5.5,9,radius)*(1-smooth(34,40,radius));for(const [cx,cz,r] of this.clearings)mask*=smooth(r,r+3,Math.hypot(x-cx,z-cz));y*=mask;
  // Low banks cover alternating sections of the ancient oak's exposed roots.
  for(let i=0;i<9;i++){const a=i*.698,cx=-27+Math.cos(a)*3.6,cz=14+Math.sin(a)*3.6;y+=(.22+i%3*.09)*Math.exp(-((x-cx)**2+(z-cz)**2)/.7)*(z>14?smooth(1.1,1.7,Math.abs(x+27)):1);}
  return Math.max(0,y);
 }
 sample(x,z){if(Math.abs(x)>42||Math.abs(z)>42)return 0;if(!this.grid){this.grid=new Float32Array(173*173);for(let i=0;i<173;i++)for(let j=0;j<173;j++)this.grid[i*173+j]=this.height(i*.5-43,j*.5-43);}const gx=(x+43)*2,gz=(z+43)*2,i=Math.floor(gx),j=Math.floor(gz),u=gx-i,v=gz-j,a=this.grid[i*173+j],b=this.grid[(i+1)*173+j],c=this.grid[i*173+j+1],d=this.grid[(i+1)*173+j+1];return (a*(1-u)+b*u)*(1-v)+(c*(1-u)+d*u)*v;}
 warp(data){const out=data instanceof Float32Array?data:new Float32Array(data);for(let i=0;i<out.length;i+=9)out[i+1]+=this.sample(out[i],out[i+2]);return out;}
 mesh(){const m=[],step=WildwoodPerformance.mobile?1.8:1.2,pt=(x,z)=>{const y=this.height(x,z),dx=(this.height(x+.1,z)-this.height(x-.1,z))/.2,dz=(this.height(x,z+.1)-this.height(x,z-.1))/.2,l=Math.hypot(dx,1,dz),patch=(Math.sin(x*.29+z*.13)+Math.cos(z*.37-x*.19))*.025;return [x,y+.006,z,-dx/l,1/l,-dz/l,.48+patch-y*.013,.61+patch-y*.012,.31+patch-y*.008];};for(let x=-40.5;x<40.5;x+=step)for(let z=-40.5;z<40.5;z+=step){const a=pt(x,z),b=pt(x+step,z),c=pt(x,z+step),d=pt(x+step,z+step);for(const tri of [[a,c,b],[b,c,d]])if(tri.every(v=>Math.hypot(v[0],v[2])<=40.5))for(const v of tri)m.push(...v);}this.vertices=m.length/9;return new Float32Array(m);}
 diagnostics(x,z){return {groundHeight:this.height(x,z),hills:this.hills.length,vertices:this.vertices||0};}
}
window.WoodlandTerrain=WoodlandTerrain;
})();
