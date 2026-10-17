const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('../game/model.js');
const context={window:{},WildwoodModel:M,WildwoodPerformance:{mobile:true,meshSegments:18,meshRings:10},Float32Array};
vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../game/creatures.js'),'utf8'),context);
const {creature}=context.window.MythicMesh,look=M.preset('pony');
assert(M.species.some(s=>s.id==='pony')&&M.species.some(s=>s.id==='unicorn'));
function mesh(config,blend=0,phase=0){const data=creature(config,{motion:{blend,run:blend,phase}});assert(data.length>0&&data.length%9===0&&data.every(Number.isFinite));return data;}
for(const blend of [0,.5,1])for(let i=0;i<24;i++)mesh(look,blend,i*Math.PI/12);
for(const [key,values] of Object.entries(M.choices))for(const value of values)mesh({...look,[key]:value},1,.7);
for(const size of [.65,1.7])mesh({...look,size,wingSize:size,tailSize:size,earSize:size},.5,2);
assert.equal(look.horns,'none');assert.equal(look.wings,'none');assert.equal(look.bodyColor,'#e4d8bd');
const saved=M.validate({...M.fresh(),...look,bodyColor:'#8899aa',wings:'angel',horns:'crystal',tail:'nine',soul:'frost'});for(const [k,v] of Object.entries({animal:'pony',bodyColor:'#8899aa',wings:'angel',horns:'crystal',tail:'nine',soul:'frost'}))assert.equal(saved[k],v);
const idle=mesh(look),transition=mesh(look,.001);assert.equal(idle.length,transition.length);let delta=0,maxY=0;for(let i=0;i<idle.length;i+=9){maxY=Math.max(maxY,idle[i+1]);for(let j=0;j<3;j++)delta=Math.max(delta,Math.abs(idle[i+j]-transition[i+j]));}assert(delta<.005,'Pony gait should blend smoothly');assert(maxY>2.7&&maxY<3,'Pony must retain long-legged reference proportions and short equine ears');
const moved=creature(look,{position:[7,2,-9],yaw:1.2,motion:{blend:0,run:0,phase:0}});assert.equal(moved.length,idle.length);for(let i=0;i<idle.length;i+=9)for(let k=6;k<9;k++)assert(Math.abs(moved[i+k]-idle[i+k])<.00001,'Stocking colours must stay attached while moving');
const rig=context.window.MythicMesh.ponyRig;
for(const leg of rig({blend:0,run:0,phase:0}).legs){const u=(leg.root[1]-leg.middle[1])/(leg.root[1]-leg.distal[1]),line=leg.root[2]+(leg.distal[2]-leg.root[2])*u;assert(Math.abs(leg.middle[2]-line)<.06,'Standing pony knees should have a restrained bend');assert(Math.abs(leg.distal[2]-leg.ankle[2])<.05,'Standing lower legs should align near vertically');}
for(const blend of [0,.5,1])for(let i=0;i<24;i++)for(const leg of rig({blend,run:blend,phase:i*Math.PI/12}).legs){assert([...leg.root,...leg.middle,...leg.distal,...leg.ankle].every(Number.isFinite));assert(leg.root[1]>leg.middle[1]&&leg.middle[1]>leg.distal[1]&&leg.distal[1]>leg.ankle[1],'Pony joints should descend naturally');}
console.log('PASS: straighter pony stance, articulated gait, long-legged meshes, attached stockings, appearance options and saved customization');
