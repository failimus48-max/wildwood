'use strict';
(() => {
class ShallowWater {
 constructor(){this.center=[15,5];this.radius=4.3;this.depth=.25;this.elapsed=0;this.ripples=[];this.droplets=[];this.distance=0;this.lastPosition=null;this.lastJump=0;this.wading=false;this.splashCount=0;}
 contains(x,z){return Math.hypot(x-this.center[0],z-this.center[1])<this.radius-.1;}
 height(x,z){let y=this.depth+Math.sin(x*.9+this.elapsed*1.7)*.012+Math.cos(z*1.1-this.elapsed*1.4)*.009;for(const r of this.ripples){const d=Math.hypot(x-r.x,z-r.z),front=r.age*1.2;y+=Math.sin(d*8-r.age*7)*Math.exp(-Math.pow(d-front,2)*9)*.015*(1-r.age/2.5);}return y;}
 splash(x,z,strength=.65){this.splashCount++;this.ripples.push({x,z,age:0,strength});for(let i=0;i<Math.round(10*strength);i++){const angle=Math.random()*6.283,speed=(.25+Math.random()*.65)*strength;this.droplets.push({x,y:this.height(x,z)+.025,z,vx:Math.cos(angle)*speed,vz:Math.sin(angle)*speed,vy:(1.6+Math.random()*1.8)*strength,age:0,size:.04+Math.random()*.035});}if(this.ripples.length>18)this.ripples.shift();}
 update(dt,actor,advance=true){this.elapsed+=dt;const inside=this.contains(actor.x,actor.z);this.wading=inside&&actor.jumpY<this.depth;
  if(advance){if(this.wading&&actor.moving&&this.lastPosition){const dist=Math.hypot(actor.x-this.lastPosition[0],actor.z-this.lastPosition[1]);if(dist<2)this.distance+=dist;if(this.distance>.55){this.distance=0;const side=(this.splashCount%2?1:-1)*.26*actor.size;this.splash(actor.x+Math.cos(actor.yaw)*side,actor.z-Math.sin(actor.yaw)*side,.6);}}if(inside&&this.lastJump>0&&actor.jumpY===0)this.splash(actor.x,actor.z,1.5);this.lastJump=actor.jumpY;this.lastPosition=[actor.x,actor.z];}
  this.ripples.forEach(r=>r.age+=dt);this.ripples=this.ripples.filter(r=>r.age<2.5);for(const p of this.droplets){p.age+=dt;p.vy-=7.5*dt;p.x+=p.vx*dt;p.z+=p.vz*dt;p.y+=p.vy*dt;if(p.y<this.height(p.x,p.z))p.age=2;}this.droplets=this.droplets.filter(p=>p.age<1.4);
 }
 surface(){const m=new MythicMesh.Mesh(),rings=10,segments=48,point=(r,i)=>{const angle=i/segments*6.283,x=this.center[0]+Math.cos(angle)*r,z=this.center[1]+Math.sin(angle)*r;return [x,this.height(x,z),z];};for(let ring=0;ring<rings;ring++)for(let i=0;i<segments;i++){const r=ring/rings*this.radius,s=(ring+1)/rings*this.radius;m.triangle(point(r,i),point(s,i+1),point(s,i),'#75bbc5');m.triangle(point(r,i),point(r,i+1),point(s,i+1),'#75bbc5');}
  for(const ripple of this.ripples){const radius=.1+ripple.age*1.2,width=.045*(1-ripple.age/2.5),fade=1-ripple.age/2.5,col=[.55+.3*fade,.76+.17*fade,.8+.15*fade];for(let i=0;i<40;i++){const point=(r,a)=>{const x=ripple.x+Math.cos(a)*r,z=ripple.z+Math.sin(a)*r;return [x,this.height(x,z)+.009,z];},a=i/40*6.283,b=(i+1)/40*6.283;if(Math.hypot(ripple.x-this.center[0],ripple.z-this.center[1])+radius>this.radius)continue;m.triangle(point(radius,a),point(radius+width,b),point(radius+width,a),col);m.triangle(point(radius,a),point(radius,b),point(radius+width,b),col);}}
  return new Float32Array(m.data);
 }
 particles(){const m=new MythicMesh.Mesh();for(const p of this.droplets)m.ellipsoid(p.x,p.y,p.z,p.size,p.size*1.6,p.size,'#c3e9ed',false,6,4);return new Float32Array(m.data);}
 diagnostics(){return {wading:this.wading,depth:this.depth,splashes:this.splashCount,ripples:this.ripples.length,droplets:this.droplets.length};}
}
window.ShallowWater=ShallowWater;
})();
