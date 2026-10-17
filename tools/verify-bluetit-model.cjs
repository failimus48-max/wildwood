const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('../game/model.js');
const context={window:{},WildwoodModel:M,WildwoodPerformance:{mobile:true,meshSegments:18,meshRings:10},Float32Array};
vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../game/creatures.js'),'utf8'),context);
const {creature}=context.window.MythicMesh,look=M.preset('bluetit');
assert(M.species.some(s=>s.id==='bluetit'));assert.equal(M.bodyScale(look),.62);
function mesh(config,blend=0,phase=0){const data=creature(config,{motion:{blend,run:blend,phase}});assert(data.length>0&&data.length%9===0&&data.every(Number.isFinite));return data;}
for(const blend of [0,.5,1])for(let i=0;i<12;i++)mesh(look,blend,i*Math.PI/6);
for(const [key,values] of Object.entries(M.choices))for(const value of values)mesh({...look,[key]:value},1,.7);
for(const size of [.65,1.7])mesh({...look,size,wingSize:size,tailSize:size},.5,2);
assert.equal(look.bodyColor,'#e4d276');assert.equal(look.wings,'angel');
assert(mesh(look).length>mesh({...look,wings:'none'}).length,'Folded wings must be removable');
const saved=M.validate({...M.fresh(),...look,bodyColor:'#8899aa',eyeColor:'#456789',wings:'bat',tail:'pom',soul:'frost'});
assert.equal(saved.animal,'bluetit');assert.equal(saved.bodyColor,'#8899aa');assert.equal(saved.eyeColor,'#456789');assert.equal(saved.wings,'bat');assert.equal(saved.tail,'pom');assert.equal(saved.soul,'frost');
const idle=mesh(look),transition=mesh(look,.001);assert.equal(idle.length,transition.length);let delta=0,maxY=0;for(let i=0;i<idle.length;i+=9){maxY=Math.max(maxY,idle[i+1]);for(let j=0;j<3;j++)delta=Math.max(delta,Math.abs(idle[i+j]-transition[i+j]));}assert(delta<.005);assert(maxY<.9,'Blue tit should stay small beside other animals');
console.log('PASS: small blue tit proportions, gait, appearance choices, removable folded wings and saved customization');
