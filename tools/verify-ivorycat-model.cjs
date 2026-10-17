const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('../game/model.js');
const context={window:{},WildwoodModel:M,WildwoodPerformance:{mobile:true,meshSegments:18,meshRings:10},Float32Array};
vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../game/creatures.js'),'utf8'),context);
const {creature}=context.window.MythicMesh,look=M.preset('ivorycat');
assert(M.species.some(s=>s.id==='cat')&&M.species.some(s=>s.id==='ivorycat'),'Both cat characters must remain selectable');
function mesh(config,blend=0,phase=0){const data=creature(config,{motion:{blend,run:blend,phase}});assert(data.length>0&&data.length%9===0&&data.every(Number.isFinite));return data;}
for(const blend of [0,.25,.5,.75,1])for(let i=0;i<12;i++)mesh(look,blend,i*Math.PI/6);
for(const [key,values] of Object.entries(M.choices))for(const value of values)for(const blend of [0,1])mesh({...look,[key]:value},blend,.7);
for(const size of [.65,1.7])mesh({...look,size,wingSize:size,tailSize:size,earSize:size},.5,2);
assert.equal(look.bodyColor,'#eee7d2');
const saved=M.validate({...M.fresh(),...look,bodyColor:'#8899aa',eyeColor:'#456789',wings:'bat',tail:'nine',soul:'frost'});
assert.equal(saved.animal,'ivorycat');assert.equal(saved.bodyColor,'#8899aa');assert.equal(saved.eyeColor,'#456789');assert.equal(saved.wings,'bat');assert.equal(saved.tail,'nine');assert.equal(saved.soul,'frost');
const idle=mesh(look),transition=mesh(look,.001),standing=mesh(look,1,Math.PI/2);assert.equal(idle.length,standing.length);let delta=0;for(let i=0;i<idle.length;i+=9)for(let j=0;j<3;j++)delta=Math.max(delta,Math.abs(idle[i+j]-transition[i+j]));assert(delta<.005,'Loaf-to-standing transition must not snap');
const headHeight=data=>{let max=0;for(let i=0;i<data.length;i+=9)if(data[i+2]>.5)max=Math.max(max,data[i+1]);return max;};assert(headHeight(standing)>headHeight(idle)+.4,'Standing cat should rise naturally from its tucked resting pose');
console.log('PASS: separate Ivory Cat selection, loaf/standing/gait transitions, all appearance options and saved customization');
