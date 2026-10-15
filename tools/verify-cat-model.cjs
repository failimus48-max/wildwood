const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('../game/model.js');
const context={window:{},WildwoodModel:M,WildwoodPerformance:{mobile:true,meshSegments:18,meshRings:10},Float32Array};
vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../game/creatures.js'),'utf8'),context);
const {creature}=context.window.MythicMesh,look=M.preset('cat');
function check(config,pose){const mesh=creature(config,{motion:pose,t:.4});assert(mesh.length&&mesh.length%9===0&&mesh.every(Number.isFinite),'Invalid cat mesh');return mesh;}
for(const blend of [0,.5,1])for(const run of [0,1])for(let i=0;i<24;i++)check(look,{blend,run,phase:i*Math.PI/12});
for(const [key,values] of Object.entries(M.choices))for(const value of values)for(const blend of [0,1])check({...look,[key]:value},{blend,run:0,phase:.7});
for(const size of [.65,1.7])check({...look,size,earSize:size,tailSize:size,wingSize:size,wings:'angel'},{blend:.5,run:1,phase:2});
const a=check(look,{blend:0,run:0,phase:0}),b=check(look,{blend:.001,run:0,phase:0});assert.equal(a.length,b.length);let max=0;for(let i=0;i<a.length;i+=9)for(let j=0;j<3;j++)max=Math.max(max,Math.abs(a[i+j]-b[i+j]));assert(max<.005,'Sit-to-walk transition snaps');
const saved=M.validate({...M.fresh(),...look,soul:'frost',bodyColor:'#526a89',tail:'nine',wings:'bat'});assert.equal(saved.animal,'cat');assert.equal(saved.bodyColor,'#526a89');assert.equal(saved.tail,'nine');assert.equal(saved.wings,'bat');assert.equal(saved.soul,'frost');
console.log('PASS: cat idle/walk/run meshes, smooth stance transition, every appearance option and saved customization');
