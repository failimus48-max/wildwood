'use strict';
(() => {
class MeadowGroundcover{
 constructor(terrain,stones=[]){this.blades=0;this.plants=0;this.mushrooms=0;this.weeds=0;this.bluebells=0;this.chunks=[];let seed=524891;const r=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;},blocked=(x,z)=>Math.hypot(x,z)>38||Math.hypot(x,z)<5.9||Math.abs(x)<2.1||Math.abs(z-Math.sin(x*.08)*2)<2.6||Math.hypot(x-21,z-12)<4.9||Math.hypot(x+8,z-18)<8||Math.hypot(x-8,z+8)<3.4||Math.hypot(x-20,z+17)<2||stones.some(s=>Math.hypot(x-s.x,z-s.z)<1.2)||(Math.abs(x+27)<1.2&&z>14&&z<21);
  for(let cx=-40;cx<40;cx+=8)for(let cz=-40;cz<40;cz+=8){const data=[],lod=[],plants=new MythicMesh.Mesh();const vertex=(out,p,col)=>out.push(p[0],p[1],p[2],0,p[3],.5,...col);
   for(let x=cx;x<cx+8;x+=.8)for(let z=cz;z<cz+8;z+=.8){if(blocked(x,z))continue;const count=WildwoodPerformance.mobile?28:44;for(let i=0;i<count;i++){const xx=x+(r()-.5)*.8,zz=z+(r()-.5)*.8;if(blocked(xx,zz))continue;const base=terrain.sample(xx,zz)+.016,h=.24+r()*.27,w=.045+r()*.045,a=r()*6.283,dx=Math.cos(a)*w,dz=Math.sin(a)*w,bx=Math.cos(a+.5)*h*(.25+r()*.3),bz=Math.sin(a+.5)*h*.4,col=[.23+r()*.12,.43+r()*.16,.16+r()*.1],points=[[xx-dx,base,zz-dz,0],[xx+dx,base,zz+dz,0],[xx+bx+dx*.5,base+h*.58,zz+bz+dz*.5,h*.58],[xx+bx-dx*.5,base+h*.58,zz+bz-dz*.5,h*.58],[xx+bx*1.8,base+h,zz+bz*1.8,h]];for(const k of [0,1,2,0,2,3,3,2,4]){vertex(data,points[k],col);if(i%4===0){const p=points[k];vertex(lod,[xx+(p[0]-xx)*1.7,base+(p[1]-base)*.85,zz+(p[2]-zz)*1.7,p[3]*.85],col);}}this.blades++;}
    if(r()<.14){this.plants++;this.weeds++;for(let j=0;j<7;j++){const a=j*.898,xx=x+.2,zz=z+.2,y=terrain.sample(xx,zz)+.03,dx=Math.cos(a)*.29,dz=Math.sin(a)*.29,co=[.26+r()*.1,.43+r()*.1,.2];for(const k of [0,1,2,0,2,3]){const p=[[xx,y,zz,.03],[xx+dx-dz*.55,y+.14,zz+dz+dx*.55,.17],[xx+dx*1.9,y+.19,zz+dz*1.9,.22],[xx+dx+dz*.55,y+.14,zz+dz-dx*.55,.17]][k];vertex(data,p,co);vertex(lod,p,co);}}
    }
    if(r()<.035){this.mushrooms++;const xx=x+.3,zz=z+.3,y=terrain.sample(xx,zz),h=.27+r()*.24,cap=['#a76544','#c27358','#b99162'][Math.floor(r()*3)];plants.softLink([xx,y+.02,zz],[xx,y+h,zz],.045,'#eee2bc');plants.ellipsoid(xx,y+h,zz,.19,.105,.19,cap,false,8,5);plants.ellipsoid(xx,y+h-.04,zz,.17,.025,.17,'#d8c9a7',false,8,3);for(let j=0;j<5;j++){const a=j*2.399;plants.ellipsoid(xx+Math.cos(a)*.11,y+h+.082,zz+Math.sin(a)*.11,.025,.012,.025,'#f4e5c6',false,5,3);}}
    if(r()<.05){this.bluebells++;const xx=x+.4,zz=z+.1,y=terrain.sample(xx,zz),h=.47+r()*.15;plants.link([xx,y,zz],[xx+.045,y+h,zz],.012,'#557f49',.008);for(let j=0;j<3;j++){const bx=xx+.11+j*.025,by=y+h-j*.12,bz=zz+j*.03;plants.link([xx+.04,by+.06,zz],[bx,by+.025,bz],.009,'#557f49',.005);for(let k=0;k<8;k++){const a=k*6.283/8,b=(k+1)*6.283/8,top=[bx,by+.04,bz],p=[bx+Math.cos(a)*.064,by-.065,bz+Math.sin(a)*.064],q=[bx+Math.cos(b)*.064,by-.065,bz+Math.sin(b)*.064];plants.triangle(top,p,q,k%2?'#697ed2':'#465eb5');plants.triangle([bx,by-.055,bz],q,p,'#34478c');}}}
   }
   // Keep solid plants in both detail levels; only distant grass is simplified.
   for(let i=0;i<plants.data.length;i+=9){const p=plants.data.slice(i,i+9);p[3]=0;p[4]=.18;p[5]=.5;data.push(...p);lod.push(...p);}if(data.length)this.chunks.push({x:cx+4,z:cz+4,mesh:new Float32Array(data),lod:new Float32Array(lod)});
  }
 }
 diagnostics(){return {blades:this.blades,lowPlants:this.plants,mushrooms:this.mushrooms,weeds:this.weeds,bluebells:this.bluebells,height:[.24,.51],chunks:this.chunks.length,vertices:this.chunks.reduce((n,c)=>n+(c.meshCount||c.mesh.length/9),0)};}
}
window.MeadowGroundcover=MeadowGroundcover;
})();
