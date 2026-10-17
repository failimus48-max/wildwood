const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('../game/model.js');
const context={window:{},WildwoodModel:M,WildwoodPerformance:{mobile:true,meshSegments:18,meshRings:10},Float32Array};
vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../game/creatures.js'),'utf8'),context);
const {creature}=context.window.MythicMesh,look=M.preset('owl');
function mesh(config,blend=0,phase=0){const data=creature(config,{motion:{blend,run:blend,phase}});assert(data.length>0&&data.length%9===0&&data.every(Number.isFinite));return data;}
for(const blend of [0,.5,1])for(let i=0;i<12;i++)mesh(look,blend,i*Math.PI/6);
for(const [key,values] of Object.entries(M.choices))for(const value of values)mesh({...look,[key]:value},1,.7);
for(const size of [.65,1.7])mesh({...look,size,wingSize:size,tailSize:size},.5,2);
assert.equal(look.bodyColor,'#eeeada');assert.equal(look.wings,'angel');assert.equal(look.eyeColor,'#777db0');
assert(mesh(look).length>mesh({...look,wings:'none'}).length,'Folded wings must be removable');
const saved=M.validate({...M.fresh(),...look,bodyColor:'#8899aa',eyeColor:'#456789',wings:'bat',soul:'frost'});
assert.equal(saved.bodyColor,'#8899aa');assert.equal(saved.eyeColor,'#456789');assert.equal(saved.wings,'bat');assert.equal(saved.soul,'frost');
const migrated=M.validate({...M.fresh(),animal:'owl',bodyColor:'#b6a1c7'});assert.equal(migrated.bodyColor,'#eeeada');assert.equal(migrated.eyeColor,'#777db0');
const idle=mesh(look),transition=mesh(look,.001);assert.equal(idle.length,transition.length);let delta=0;for(let i=0;i<idle.length;i+=9)for(let j=0;j<3;j++)delta=Math.max(delta,Math.abs(idle[i+j]-transition[i+j]));assert(delta<.005,'Owl movement transition must be smooth');
console.log('PASS: snowy owl gait, removable folded wings, all appearance choices, palette migration and custom save persistence');
