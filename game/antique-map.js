'use strict';
(() => {
class AntiqueIslandMap {
 constructor(canvas,{trees=[],hills=[],stones=[]}={}){this.canvas=canvas;canvas.width=canvas.height=480;this.ctx=canvas.getContext('2d');this.base=document.createElement('canvas');this.base.width=this.base.height=480;this.features={trees,hills,stones};this.build();document.fonts?.ready.then(()=>this.build());}
 point(x,z){return [120+x*1.75,137+z*1.75];}
 build(){const c=this.base.getContext('2d');c.setTransform(2,0,0,2,0,0);const ink='#6b5134',paper=c.createRadialGradient(116,108,22,120,120,160);paper.addColorStop(0,'#f1dfb4');paper.addColorStop(.7,'#e0c797');paper.addColorStop(1,'#ad8355');c.fillStyle=paper;c.fillRect(0,0,240,240);let seed=8211;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<2500;i++){const x=rand()*240,y=rand()*240;c.fillStyle=i%2?'#6043220b':'#fff6d31c';c.fillRect(x,y,.3+rand()*1.1,.3+rand()*.6);}
  c.strokeStyle='#78573588';c.lineWidth=.7;c.strokeRect(7,7,226,226);c.strokeStyle='#78573555';c.strokeRect(10,10,220,220);
  const line=(points,color=ink,width=.65)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke();};
  for(const x of [17,223])for(const y of [17,223]){c.save();c.translate(x,y);c.rotate((x>120?Math.PI:0)+(y>120?Math.PI/2:0));c.strokeStyle=ink;c.lineWidth=.6;c.beginPath();c.moveTo(0,14);c.bezierCurveTo(9,8,11,-4,2,0);c.bezierCurveTo(-4,4,7,8,14,0);c.stroke();c.restore();}
  c.textAlign='center';c.fillStyle=ink;c.font='15px "Berkshire Swash", Georgia, serif';c.fillText('Wildwood',120,29);line([[89,34],[151,34]],'#94734c',.5);
  const coast=extra=>{c.beginPath();for(let i=0;i<=180;i++){const a=i/180*Math.PI*2,r=42+extra+Math.sin(a*17)*.17+Math.sin(a*31)*.10,p=this.point(Math.cos(a)*r,Math.sin(a)*r);i?c.lineTo(...p):c.moveTo(...p);}c.closePath();};
  // Quiet engraved sea strokes stay outside the accurately positioned island.
  c.strokeStyle='#847b6159';c.lineWidth=.45;for(let row=0;row<22;row++)for(let j=0;j<12;j++){const x=18+j*18+(row%2)*7,y=43+row*8;if(Math.hypot(x-120,y-137)<79||x>192&&y<85)continue;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+3,y-1.3,x+6,y);c.quadraticCurveTo(x+8,y+1,x+10,y);c.stroke();}
  coast(2.1);c.strokeStyle='#8c775c65';c.lineWidth=.5;c.stroke();coast(.85);c.strokeStyle='#826547aa';c.stroke();coast(0);c.fillStyle='#e7d5a7';c.fill();c.strokeStyle=ink;c.lineWidth=1;c.stroke();
  coast(-1.1);c.strokeStyle='#9b7c5280';c.lineWidth=.4;c.stroke();
  // Winding cross-island roads follow their in-world routes.
  c.setLineDash([1.3,1.7]);const road=[];for(let x=-30;x<=30;x++)road.push(this.point(x,Math.sin(x*.08)*2));line(road,'#8b6845',1);line([this.point(0,-29),this.point(0,29)],'#8b6845',1);c.setLineDash([]);
  const pine=(x,y,k=1)=>{line([[x,y],[x,y-6*k]],'#6b6948',.5);for(let j=0;j<3;j++){const yy=y-5*k+j*1.8*k,w=(1.8+j*.65)*k;line([[x-w,yy+2*k],[x,yy-.8*k],[x+w,yy+2*k]],'#6b6948',.5);}};
  for(const t of this.features.trees){const [x,y]=this.point(t.x,t.z);pine(x,y,.55+(t.size||1)*.18);}
  for(const [x,z,h] of this.features.hills){const [px,py]=this.point(x,z);line([[px-5,py+3],[px,py-5],[px+5,py+3]],ink,.6);for(let i=0;i<3;i++)line([[px+i*.8,py-3+i*1.6],[px+1+i*.9,py+1+i*.8]],'#8c7655',.4);}
  const pond=this.point(WildwoodPond.x,WildwoodPond.z);c.beginPath();c.ellipse(pond[0],pond[1],WildwoodPond.radius*1.75,WildwoodPond.radius*1.55,-.2,0,Math.PI*2);c.fillStyle='#b9bb9b';c.fill();c.strokeStyle='#797959';c.lineWidth=.7;c.stroke();for(let i=0;i<3;i++)line([[pond[0]-3,pond[1]-2+i*2],[pond[0]+3,pond[1]-2+i*2]],'#6f826d',.35);
  // Dock, cottage, shrine and rune markers use small pen-and-ink symbols.
  for(const r of WildwoodModel.dock.regions){const p=this.point(-r.halfWidth,r.minZ),q=this.point(r.halfWidth,r.maxZ);c.fillStyle='#c6a776';c.fillRect(p[0],p[1],q[0]-p[0],q[1]-p[1]);c.strokeStyle=ink;c.lineWidth=.55;c.strokeRect(p[0],p[1],q[0]-p[0],q[1]-p[1]);for(let yy=p[1]+2;yy<q[1];yy+=2.4)line([[p[0],yy],[q[0],yy]],'#896b45',.4);}
  const home=this.point(-8,17);line([[home[0]-4,home[1]],[home[0]-4,home[1]-5],[home[0],home[1]-8],[home[0]+4,home[1]-5],[home[0]+4,home[1]],[home[0]-4,home[1]]],ink,.8);line([[home[0]-5,home[1]-4],[home[0],home[1]-8],[home[0]+5,home[1]-4]],ink,.8);line([[home[0]-1,home[1]],[home[0]-1,home[1]-3],[home[0]+1,home[1]-3],[home[0]+1,home[1]]],ink,.5);
  for(const stone of this.features.stones){const [x,y]=this.point(stone.x,stone.z);line([[x-1.4,y+2],[x-1.2,y-2],[x+.5,y-3],[x+1.4,y+2],[x-1.4,y+2]],'#79634b',.6);}
  const shrine=this.point(20,-17);line([[shrine[0],shrine[1]-3],[shrine[0]+2,shrine[1]],[shrine[0],shrine[1]+3],[shrine[0]-2,shrine[1]],[shrine[0],shrine[1]-3]],ink,.7);
  c.font='italic 7px Georgia, serif';c.fillStyle=ink;c.fillText('Fernwood',77,105);c.fillText('Sunpetal',157,119);c.fillText('The Den',103,181);c.font='italic 7.5px Georgia, serif';c.save();c.translate(29,146);c.rotate(-Math.PI/2);c.fillText('The Whispering Sea',0,0);c.restore();
  // Eight-point compass rose; north remains the same as the game world's negative Z.
  c.save();c.translate(205,54);c.strokeStyle=ink;c.lineWidth=.5;c.beginPath();c.arc(0,0,12,0,Math.PI*2);c.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4,len=i%2?7:15;c.beginPath();c.moveTo(Math.cos(a-.24)*3,Math.sin(a-.24)*3);c.lineTo(Math.cos(a)*len,Math.sin(a)*len);c.lineTo(Math.cos(a+.24)*3,Math.sin(a+.24)*3);c.closePath();c.fillStyle=i%2?'#e9d5a4':ink;c.fill();c.stroke();}c.font='9px Georgia,serif';c.fillStyle=ink;c.fillText('N',0,-19);c.font='6px Georgia,serif';c.fillText('E',20,2);c.fillText('W',-20,2);c.restore();
  c.font='italic 6.5px Georgia,serif';c.fillStyle='#7a5c3b';c.fillText('Trails, hearth & hidden wonders',120,223);this.builds=(this.builds||0)+1;
 }
 draw(state){const c=this.ctx;c.setTransform(1,0,0,1,0,0);c.drawImage(this.base,0,0);c.setTransform(2,0,0,2,0,0);const [x,y]=this.point(state.x,state.z);c.save();c.translate(x,y);c.rotate(-state.yaw);c.fillStyle='#923e31';c.strokeStyle='#fff0c9';c.lineWidth=1;c.beginPath();c.moveTo(0,5);c.lineTo(-3.4,-3.5);c.lineTo(0,-1.7);c.lineTo(3.4,-3.5);c.closePath();c.fill();c.stroke();c.restore();}
}
window.AntiqueIslandMap=AntiqueIslandMap;
})();
