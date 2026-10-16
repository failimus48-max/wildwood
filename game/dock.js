'use strict';
(() => {
class DockPier {
 constructor(){
  const m=new MythicMesh.Mesh(),colors=['#a17e58','#ae8d63','#997650','#b09770','#a88a63'];this.colliders=[];
  const plank=(z,width,i)=>{const color=colors[i%colors.length];m.box(0,.06,z,width*2,.12,.38,color);
   // Shallow grain streaks and dark nail heads keep the timber readable without texture files.
   for(let j=0;j<3;j++){const x=Math.sin(i*2.31+j*4.9)*width*.62,len=.35+((i+j)%4)*.17;m.box(x,.181,z+(j-1)*.085,len,.001,.008,j%2?'#927452':'#b59972');}
   for(const side of [-1,1])m.box(side*(width-.16),.182,z,.025,.003,.026,'#655e51');
  };
  let n=0;for(let z=-29.2;z>-47;z-=.4)plank(z,1.85,n++);for(let z=-47.2;z>-53;z-=.4)plank(z,3.1,n++);
  for(const side of [-1,1]){m.box(side*1.35,-.17,-38.1,.16,.23,18.2,'#725c43');m.box(side*2.45,-.17,-50,.18,.23,6,'#725c43');}
  const rail=(x1,z1,x2,z2)=>{const length=Math.hypot(x2-x1,z2-z1),steps=Math.ceil(length/2.8);for(let i=0;i<=steps;i++){const u=i/steps,x=x1+(x2-x1)*u,z=z1+(z2-z1)*u;m.link([x,-1.1,z],[x,1.16,z],.115,'#826849',.095);m.ellipsoid(x,1.17,z,.12,.05,.12,'#b39a73',false,10,5);if(i<steps){const v=(i+1)/steps,nx=x1+(x2-x1)*v,nz=z1+(z2-z1)*v;for(const y of [.65,1.0]){let prev=[x,y,z];for(let j=1;j<=6;j++){const a=j/6,p=[x+(nx-x)*a,y-Math.sin(a*Math.PI)*.10,z+(nz-z)*a];m.link(prev,p,.022,'#c6b58d',.022);prev=p;}}}}
   this.colliders.push({shape:'box',kind:'dock rail',x:(x1+x2)/2,z:(z1+z2)/2,halfWidth:Math.abs(x2-x1)/2+.1,halfDepth:Math.abs(z2-z1)/2+.1,minY:.18,maxY:1.2});
  };
  for(const side of [-1,1]){rail(side*1.77,-30,side*1.77,-47);rail(side*1.77,-47,side*3.02,-47);rail(side*3.02,-47,side*3.02,-52.9);}rail(-3.02,-52.9,3.02,-52.9);
  this.mesh=new Float32Array(m.data);
 }
 diagnostics(){return {pathEnd:[0,-29],tip:[0,-53],deckHeight:WildwoodModel.dock.height,railColliders:this.colliders.length,vertices:this.mesh.length/9};}
}
window.DockPier=DockPier;
})();
