'use strict';
(() => {
// A bespoke plush axolotl based on the user's Bobo photographs.
function bobo({position=[0,0,0],yaw=0,t=0}={}) {
 const m=new MythicMesh.Mesh(position,yaw,1.05),pink='#eed4df',gill='#ce79b0',blue='#b4dce1',cream='#f4eddf';
 const breathe=Math.sin(t*1.6)*.014;
 m.ellipsoid(0,.67,-.38,.72,.56,1.1,blue,false,20,12);
 m.ellipsoid(0,1.14+breathe,.8,.95,.84,.8,pink,false,24,14);
 for(const side of [-1,1]) {
  for(const z of [-.93,.64]) {
   m.ellipsoid(side*.56,.21,z,.32,.25,.36,pink,false,14,8);
   m.ellipsoid(side*.56,.14,z+.13,.325,.17,.31,cream,false,14,8);
   m.ellipsoid(side*.48,.23,z+.397,.038,.04,.012,'#b0d3d8',false,8,4);
   m.ellipsoid(side*.62,.22,z+.397,.038,.04,.012,'#e6a2ba',false,8,4);
  }
  m.ellipsoid(side*.43,1.34+breathe,1.506,.128,.147,.085,'#161a23',false,18,10);
  m.ellipsoid(side*.43-.034,1.393+breathe,1.584,.034,.043,.013,'#fffff4',true,10,6);
  m.ellipsoid(side*.43+.028,1.294+breathe,1.584,.015,.019,.009,'#9ac3cc',false,8,4);
  m.ellipsoid(side*.64,.99+breathe,1.353,.105,.044,.016,'#e8a9c2',false,12,6);
  for(let i=0;i<3;i++) {
   const root=[side*.74,.8+i*.31+breathe,.76],end=[side*(1.36-i*.025),.58+i*.6+breathe+Math.sin(t*1.8+i)*.035,.72];
   m.softLink(root,end,.12,gill);
   for(let j=0;j<5;j++) {
    const u=.27+j*.145,p=root.map((v,k)=>v+(end[k]-v)*u);
    for(const edge of [-1,1])m.softLink(p,[p[0]+side*.09,p[1]+edge*(.13+j*.015),p[2]+.045],.05,j%2?'#dfa0c5':'#d589b9');
   }
   m.ellipsoid(end[0],end[1],end[2],.1,.12,.1,'#dfa0c5',false,10,6);
  }
  // Small pastel animal/flower motifs sewn onto the blue fabric body.
  for(let i=0;i<4;i++) {
   const z=-1.04+i*.36,y=.68+(i%2)*.16,x=side*(.72*Math.sqrt(Math.max(.05,1-((y-.67)/.56)**2-((z+.38)/1.1)**2))+.011),c=['#e7a6bf','#a7be76','#b2a4d0','#d4bd84'][i];
   m.ellipsoid(x,y,z,.022,.085,.09,c,false,10,6);
   m.ellipsoid(x+side*.016,y+.09,z+.015,.018,.052,.058,c,false,8,5);
   for(const a of [-1,1])m.ellipsoid(x+side*.02,y-.04,z+a*.09,.014,.027,.034,c,false,8,4);
   m.ellipsoid(x+side*.036,y+.102,z+.039,.008,.011,.012,'#617784',false,6,4);
  }
  let previous=[side*.61,.37,-1.16];for(let i=1;i<=8;i++){const p=[side*(.61+.045*Math.sin(i/8*Math.PI)),.37,-1.16+i*.22];m.link(previous,p,.008,'#83b6c0');previous=p;}
 }
 // Curved, rose-colored embroidered smile, following the surface of the head.
 let previous=null;for(let i=0;i<=16;i++){const x=-.4+i*.05,y=.86+.7*x*x+breathe,z=.8+.8*Math.sqrt(1-(x/.95)**2-((y-1.14-breathe)/.84)**2)+.014,p=[x,y,z];if(previous)m.link(previous,p,.019,'#ba7898');previous=p;}
 m.ellipsoid(0,.61,1.4,.43,.2,.06,cream,false,16,8);
 m.ellipsoid(-.13,.47,1.45,.16,.09,.055,cream,false,12,6);m.ellipsoid(.13,.47,1.45,.16,.09,.055,cream,false,12,6);m.ellipsoid(0,.47,1.49,.055,.06,.035,'#d993b3',false,10,6);
 m.softLink([0,.55,-1.2],[Math.sin(t*.8)*.09,.38,-1.9],.22,blue);
 m.ellipsoid(Math.sin(t*.8)*.09,.4,-1.9,.32,.12,.52,'#dea3c5',false,16,8);
 return new Float32Array(m.data);
}
window.BoboPlush={mesh:bobo,name:'Bobo'};
})();
