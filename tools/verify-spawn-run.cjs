const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),M=require('../game/model.js');
const old={...M.fresh(),name:'Fern',animal:'fox',soul:'rose',bodyColor:'#b77d61',x:12,z:7,started:true,visited:['den'],world:{hour:22,weather:'rain',cycle:false}};
delete old.spawnVersion;
const migrated=M.validate(old);
assert.equal(migrated.x,-8);assert.equal(migrated.z,23);assert.equal(migrated.yaw,Math.PI);
for(const key of ['name','animal','soul','bodyColor','visited'])assert.deepEqual(migrated[key],old[key]);
assert.equal(migrated.world.hour,22);assert.equal(migrated.world.weather,'rain');
assert.equal(M.validate({...migrated,x:12,z:7}).x,12,'Later sessions must retain their saved position');
assert.equal(M.validate({...migrated,x:100}).x,-8,'Invalid positions return to the den');
for(const mobile of [false,true]){
 const context={window:{},WildwoodModel:M,WildwoodPerformance:{mobile,meshSegments:mobile?18:32,meshRings:mobile?10:24},Float32Array};vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../game/creatures.js'),'utf8'),context);
 const {creature,advanceFoxMotion}=context.window.MythicMesh;let motion={blend:0,run:0,phase:0},previous=null,maxStep=0;
 for(let frame=0;frame<330;frame++){
  const moving=frame<150,running=frame>=50&&frame<150;motion=advanceFoxMotion(motion,1/60,moving,running);
  const mesh=creature(M.fresh(),{t:frame/60,moving,motion});assert(mesh.every(Number.isFinite));
  const bounds=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(let j=0;j<mesh.length;j+=9)for(let k=0;k<3;k++){bounds[k]=Math.min(bounds[k],mesh[j+k]);bounds[k+3]=Math.max(bounds[k+3],mesh[j+k]);}if(previous){assert.equal(mesh.length,previous.length,'Pose transitions must preserve topology');for(let k=0;k<6;k++)maxStep=Math.max(maxStep,Math.abs(bounds[k]-previous.bounds[k]));}previous=mesh;previous.bounds=bounds;
  if(frame===49)assert(motion.blend>.99&&motion.run===0,'Walk settles without a run');
  if(frame===149)assert(motion.run>.99,'Running pose settles');
 }
 assert(motion.blend<.001&&motion.run<.001,'Stopping settles back into the seated pose');assert(maxStep<.16,'Pose snapped between frames: '+maxStep);
 for(const wings of M.choices.wings)for(const tail of M.choices.tail)assert(creature({...M.fresh(),wings,tail},{moving:true,motion:{blend:1,run:1,phase:2}}).every(Number.isFinite));
 console.log('PASS: '+(mobile?'mobile':'desktop')+' fox walk/run/stop continuity and custom tails/wings; max silhouette step '+maxStep.toFixed(3));
}
console.log('PASS: den spawn, one-time old-save migration, appearance/sky preservation and later position saves');
