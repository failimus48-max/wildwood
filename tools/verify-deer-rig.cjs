const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('../game/model.js');
const context={window:{},WildwoodModel:M,WildwoodPerformance:{mobile:true,meshSegments:18,meshRings:10},Float32Array};
vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../game/creatures.js'),'utf8'),context);
const {deerRig,creature}=context.window.MythicMesh,distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
for(const blend of [0,.5,1])for(const run of [0,1])for(let frame=0;frame<90;frame++){
 const pose={blend,run,phase:frame/90*Math.PI*2},rig=deerRig(pose);
 assert.equal(rig.legs.length,4);
 const back=rig.torso.slice(1,-1).map(q=>q[1]+q[3]);assert(Math.max(...back)-Math.min(...back)<.1,'Back/croup must remain balanced');
 for(const leg of rig.legs){
  assert(Math.abs(distance(leg.root,leg.middle)-leg.upper)<.0001,'Upper limb stretches');
  assert(Math.abs(distance(leg.middle,leg.distal)-leg.lower)<.0001,'Lower limb stretches');
  assert(leg.root[1]>leg.middle[1]&&leg.middle[1]>leg.distal[1]&&leg.distal[1]>leg.ankle[1],'Limb joints must descend toward the hoof');
  assert(Math.abs(leg.distal[2]-leg.ankle[2])<.08,'Cannon should be close to vertical');
  if(leg.front<0)assert(leg.middle[2]>leg.root[2]&&leg.middle[2]>leg.distal[2],'Stifle must face forward, above the rear hock');
 }
 if(frame%30===0){const mesh=creature(M.preset('deer'),{motion:pose});assert(mesh.length&&mesh.length%9===0&&mesh.every(Number.isFinite));}
}
for(const tail of M.choices.tail)for(const wings of M.choices.wings)assert(creature({...M.preset('deer'),tail,wings},{motion:{blend:1,run:1,phase:1}}).every(Number.isFinite));
console.log('PASS: balanced deer torso, four connected limbs, fixed bone lengths, joint ordering, near-vertical cannons and custom tails/wings');
