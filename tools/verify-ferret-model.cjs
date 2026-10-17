const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('../game/model.js');
const context={window:{},WildwoodModel:M,WildwoodPerformance:{mobile:true,meshSegments:18,meshRings:10},Float32Array};
vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../game/creatures.js'),'utf8'),context);
const {creature}=context.window.MythicMesh,look=M.preset('ferret');
function mesh(config,blend=0,phase=0){const data=creature(config,{motion:{blend,run:blend,phase}});assert(data.length>0&&data.length%9===0&&data.every(Number.isFinite));return data;}
for(const blend of [0,.5,1])for(let i=0;i<12;i++)mesh(look,blend,i*Math.PI/6);
for(const [key,values] of Object.entries(M.choices))for(const value of values)mesh({...look,[key]:value},1,.7);
for(const size of [.65,1.7])mesh({...look,size,wingSize:size,tailSize:size,earSize:size},.5,2);
assert.equal(look.bodyColor,'#eee9e5');assert.equal(look.wings,'none');
const saved=M.validate({...M.fresh(),...look,bodyColor:'#8899aa',eyeColor:'#456789',wings:'bat',tail:'nine',soul:'frost'});
for(const k of ['bodyColor','eyeColor','wings','tail','soul'])assert.equal(saved[k],{bodyColor:'#8899aa',eyeColor:'#456789',wings:'bat',tail:'nine',soul:'frost'}[k]);
assert.equal(M.validate({...M.fresh(),animal:'ferret',bodyColor:'#d0b798'}).bodyColor,'#eee9e5');
const idle=mesh(look),transition=mesh(look,.001);assert.equal(idle.length,transition.length);let delta=0;for(let i=0;i<idle.length;i+=9)for(let j=0;j<3;j++)delta=Math.max(delta,Math.abs(idle[i+j]-transition[i+j]));assert(delta<.005,'Ferret movement transition must be smooth');
const xs=[],ys=[],zs=[];for(let i=0;i<idle.length;i+=9){xs.push(idle[i]);ys.push(idle[i+1]);zs.push(idle[i+2]);}assert(Math.max(...zs)-Math.min(...zs)>3.5,'Ferret must retain its long body and tail');assert(Math.max(...ys)<2,'Ferret must retain its short-legged proportions');
console.log('PASS: reference ferret proportions, gait transitions, appearance options, palette migration and custom save persistence');
