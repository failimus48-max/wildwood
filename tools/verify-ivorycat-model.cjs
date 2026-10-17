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
const gait=context.window.MythicMesh.ivoryCatGait;
for(let i=0;i<120;i++){const g=gait({blend:1,run:0,phase:i*Math.PI/60});assert(g.legs.filter(l=>l.planted).length>=2,'Walking cat must keep support on the ground');for(const leg of g.legs){assert(leg.lift>=0);if(leg.planted)assert.equal(leg.lift,0,'Planted paw should not bounce');}}
for(const [fraction,side,front] of [[0,-1,-1],[.25,-1,1],[.5,1,-1],[.75,1,1]]){const leg=gait({blend:1,run:0,phase:fraction*Math.PI*2}).legs.find(l=>l.side===side&&l.front===front);assert(leg.planted&&Math.abs(leg.stride-.18)<.00001,'Feline footfalls must follow hind then fore on each side');}
for(const phase of [0,1,3,6])for(const leg of gait({blend:0,run:0,phase}).legs)assert(leg.lift===0&&leg.stride===0,'Resting cat should stay still');
console.log('PASS: feline footfall order and paw contacts, resting/standing transitions, separate cat selection and saved customization');
