const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('../game/model.js');
const context={window:{},WildwoodModel:M,WildwoodPerformance:{mobile:true,meshSegments:18,meshRings:10},Float32Array};
vm.createContext(context);
// Expose the internal wing builder only inside this test sandbox, isolating wings from the moving legs.
vm.runInContext(fs.readFileSync(require.resolve('../game/creatures.js'),'utf8').replace('window.MythicMesh={','window.MythicMesh={deerFeatherWings,'),context);
const {Mesh,deerFeatherWings}=context.window.MythicMesh,config=M.preset('deer');
function pose(blend,run,phase){const m=new Mesh();deerFeatherWings(m,config,0,blend>0,{blend,run,phase});return m.data;}
const delta=(a,b)=>Math.max(...a.map((v,i)=>Math.abs(v-b[i])));
assert.equal(delta(pose(0,0,0),pose(0,0,1)),0,'Stopped wings must not follow a stale stride phase');
assert(delta(pose(1,0,0),pose(1,0,Math.PI/4))>.05,'Walking must visibly move the wings even at a fixed clock time');
assert(delta(pose(1,0,.7),pose(1,1,.7))>.02,'Running must strengthen wing motion');
assert(delta(pose(0,0,.7),pose(.001,0,.7))<.005,'Starting and stopping must blend without a snap');
for(const blend of [0,.5,1])for(const run of [0,1])for(let i=0;i<24;i++){
 const a=pose(blend,run,i*Math.PI/12),b=pose(blend,run,i*Math.PI/12+Math.PI*2);
 assert(a.length&&a.every(Number.isFinite));assert(delta(a,b)<.00001,'Wing loop must close without a jump');
}
console.log('PASS: stride-driven wings, stronger run motion, smooth blend and finite seamless loops');
