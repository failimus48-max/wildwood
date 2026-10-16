const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('../game/model.js');
const ctx={window:{},WildwoodModel:M,WildwoodPerformance:{mobile:true,meshSegments:18,meshRings:10},Float32Array};ctx.window=ctx;vm.createContext(ctx);for(const file of ['creatures.js','dock.js','terrain.js'])vm.runInContext(fs.readFileSync(require.resolve('../game/'+file),'utf8'),ctx);const dock=new ctx.window.DockPier(),terrain=new ctx.window.WoodlandTerrain();
assert(dock.mesh.length&&dock.mesh.every(Number.isFinite));assert.equal(dock.colliders.length,7);
for(const size of [.65,1,1.7])for(const animal of ['cat','wolf','deer']){
 const s={...M.fresh(),animal,size,x:0,z:-28,soul:'frost'};
 for(let i=0;i<250;i++)M.move(s,0,-.1,dock.colliders,{footY:M.dock.height});
 assert(s.z<-51&&s.z>-53,'Cannot reach platform or escaped the end');assert.equal(terrain.walkHeight(s.x,s.z),M.dock.height);const saved=M.validate(s);assert.equal(saved.z,s.z,'Dock position lost on reload');assert.equal(saved.soul,'frost');
 const end=s.z;M.move(s,0,-5,dock.colliders,{footY:M.dock.height});assert.equal(s.z,end,'End rail permits passage');
 for(let i=0;i<100;i++)M.move(s,.1,0,dock.colliders,{footY:M.dock.height});assert(s.x<3.1-.55*M.bodyScale(s),'Escaped side rail');
 s.x=0;for(let i=0;i<250;i++)M.move(s,0,.1,dock.colliders,{footY:M.dock.height});assert(s.z>-29,'Cannot return to path');
}
assert.equal(M.move({...M.fresh(),x:38.9,z:0},2,0,[]),false,'Ordinary island boundary expanded');
assert.equal(M.validate({...M.fresh(),x:10,z:-49}).z,M.spawn.z,'Ocean save position incorrectly accepted');
assert(!M.dock.contains(0,-54)&&!M.dock.contains(4,-50));
console.log('PASS: dock geometry, path-to-platform traversal, rails, return, deck support and saved position across character sizes');
