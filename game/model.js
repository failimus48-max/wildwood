'use strict';
(function(root){
const landmarkPoints=[[-6,5],[5,9],[10,-3],[-12,-7],[3,-12],[-22,8],[-25,-6],[20,14],[26,4],[18,-14],[-15,23],[4,28],[15,25],[-9,-26],[-25,-20]];
const palette=['#d88845','#b1a1ce','#779eaf','#d1ac64','#92ab7c'];
const species=[
 ['bunny','Moon Bunny','🐇','Long ears, soft paws, boundless curiosity.','#c4b4e6'],['fox','Forest Fox','🦊','A bright-eyed wanderer with a plush tail.','#d88845'],
 ['wolf','Dire Wolf','🐺','A noble guardian of the hidden trails.','#8198b5'],['cat','Star Cat','🐈','A tiny dreamer with a feline silhouette.','#ba92c9'],
 ['deer','Celestial Deer','🦌','Graceful legs and branching antlers.','#b7a082'],['dragon','Dream Dragon','🐉','Scales, a long tail, and sweeping wings.','#78ae9b'],
 ['unicorn','Cloud Unicorn','🦄','A little pony with a spiral horn.','#e0c7e3'],['gryphon','Gryphon Cub','🦅','A feathered guardian with a golden beak.','#d8ad68'],
 ['kirin','Kirin','✧','A gentle dragon-deer with a crystal horn.','#9cc4aa'],['jackalope','Jackalope','🐇','A woodland bunny crowned with antlers.','#c8b194'],
 ['kitsune','Kitsune','🦊','A mystical fox with nine swaying tails.','#efe3c6'],['phoenix','Little Phoenix','🔥','A bright feathered spirit with a fan tail.','#df8766'],
 ['owl','Moon Owl','🦉','Round feathers, wide eyes, and silent wings.','#b6a1c7'],['axolotl','Star Axolotl','✺','A smiling water spirit with feathery gills.','#e6a3b9'],
 ['bat','Dusk Bat','🦇','Huge ears and a pair of night wings.','#a48bbd'],['bear','Spirit Bear','🐻','A cuddly, round-eared guardian.','#b99175'],
 ['tiger','Moon Tiger','🐯','A feline explorer with striped fur.','#d9aa67'],['otter','River Otter','🦦','A playful swimmer with a smooth long tail.','#a68d78'],
 ['ferret','Starlight Ferret','✦','A slender little adventurer.','#d0b798'],['spiritbunny','Blue Spirit Bunny','💠','A plush blue spirit bunny inspired by Blub.','#6bcce8'],
 ['pegasus','Pegasus','🪽','A little winged pony born to dream.','#e2dacc'],['chimerabunny','Chimera Bunny','✧','Rabbit ears, twin horns, and a dragon tail.','#a795ce'],
 ['fennec','Fennec Spirit','🦊','A desert fox with magnificent big ears.','#dfc28a'],['snowleopard','Snow Leopard','🐾','A spotted cat with an extra-fluffy tail.','#b9c6d0']
].map(([id,name,icon,description,color])=>({id,name,icon,description,color}));
const souls=[
 ['ember','Ember','#ff984e','A warm spark of courage.'],['frost','Frost','#79efff','Quiet resolve, bright as ice.'],
 ['verdant','Verdant','#9bf177','A little flame of growth.'],['astral','Astral','#c7a0ff','A curious spark of starlight.'],
 ['solar','Solar','#ffe36f','A golden flame of joy.'],['lunar','Lunar','#eef5ff','A soft light for gentle hearts.'],
 ['tide','Tide','#689fff','A restless spirit of discovery.'],['rose','Rose','#ff8ac7','A bright flame of kindness.'],
 ['void','Void','#8853dc','A mysterious violet whisper.'],['ruby','Ruby','#ff646e','A fierce little spark of will.']
].map(([id,name,color,description])=>({id,name,color,description}));
const choices={wings:['none','angel','bat','fairy','butterfly','dragon','phoenix'],horns:['none','unicorn','twin','antlers','curled','crystal'],tail:['natural','fluffy','long','dragon','nine','pom'],pattern:['none','spots','stripes','stars','runes'],accessory:['none','halo','crown','crystals','flowers','scarf']};
const lookKeys=['animal','bodyColor','accentColor','eyeColor','wingColor','size','earSize','wingSize','tailSize','wings','horns','tail','pattern','accessory','glowEyes','soul'];
function fresh(){return {version:3,name:'Little Fox',animal:'fox',color:0,bodyColor:palette[0],accentColor:'#f4e5cd',eyeColor:'#243d43',wingColor:'#eee5ff',size:1,earSize:1,wingSize:1,tailSize:1,wings:'none',horns:'none',tail:'natural',pattern:'none',accessory:'none',glowEyes:false,soul:null,x:0,z:6,yaw:0,world:{hour:9,cycle:true,speed:1,weather:"auto",autoWeather:"clear",weatherAge:0},visited:[],started:false};}
const hex=(v,f)=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v)?v.toLowerCase():f;
function appearance(input){const base=fresh(),s={};for(const k of lookKeys)s[k]=base[k];if(!input)return s;s.animal=species.some(a=>a.id===input.animal)?input.animal:'fox';const oldColor=Number.isInteger(input.color)&&palette[input.color]?palette[input.color]:palette[0];s.bodyColor=hex(input.bodyColor,oldColor);for(const k of ['accentColor','eyeColor','wingColor'])s[k]=hex(input[k],base[k]);for(const k of ['size','earSize','wingSize','tailSize'])s[k]=Number.isFinite(input[k])?Math.max(.65,Math.min(1.7,input[k])):1;for(const [k,values] of Object.entries(choices))s[k]=values.includes(input[k])?input[k]:base[k];s.glowEyes=!!input.glowEyes;s.soul=souls.some(a=>a.id===input.soul)?input.soul:null;return s;}
function worldSettings(input){const v=input||{};return {hour:Number.isFinite(v.hour)?((v.hour%24)+24)%24:9,cycle:v.cycle!==false,speed:Number.isFinite(v.speed)?Math.max(.25,Math.min(4,v.speed)):1,weather:['auto','clear','cloudy','rain','snow','mist'].includes(v.weather)?v.weather:'auto',autoWeather:['clear','cloudy','rain','snow','mist'].includes(v.autoWeather)?v.autoWeather:'clear',weatherAge:Number.isFinite(v.weatherAge)?Math.max(0,Math.min(150,v.weatherAge)):0};}
function validate(input){const s=fresh();if(!input||![1,2,3].includes(input.version))return s;Object.assign(s,appearance(input));for(const k of ['x','z','yaw'])if(Number.isFinite(input[k]))s[k]=input[k];if(Math.hypot(s.x,s.z)>39){s.x=0;s.z=6;}s.name=typeof input.name==='string'?input.name.slice(0,24):s.name;s.color=Number.isInteger(input.color)&&palette[input.color]?input.color:0;s.visited=Array.isArray(input.visited)?[...new Set(input.visited.filter(i=>['commons','grove','meadow','den'].includes(i)))]:[];s.world=worldSettings(input.world);s.started=!!input.started;return s;}

function preset(id){const a=species.find(s=>s.id===id)||species[1],s=appearance({animal:a.id,bodyColor:a.color});if(['dragon','bat'].includes(id))s.wings='bat';if(['unicorn','kirin'].includes(id))s.horns=id==='kirin'?'crystal':'unicorn';if(['deer','jackalope'].includes(id))s.horns='antlers';if(['gryphon','owl','pegasus'].includes(id))s.wings='angel';if(id==='kitsune')s.tail='nine';if(id==='phoenix'){s.wings='phoenix';s.tail='long';}if(id==='tiger')s.pattern='stripes';if(id==='snowleopard'){s.pattern='spots';s.tail='fluffy';}if(id==='chimerabunny'){s.horns='twin';s.tail='dragon';}if(id==='fennec')s.earSize=1.6;if(id==='spiritbunny'){s.accentColor='#bcefff';s.eyeColor='#16366a';s.wingColor='#b8eaff';s.glowEyes=true;}return s;}
function randomLook(){const s=preset(species[Math.floor(Math.random()*species.length)].id),color=()=> '#'+Math.floor(Math.random()*0x1000000).toString(16).padStart(6,'0');for(const k of ['bodyColor','accentColor','eyeColor','wingColor'])s[k]=color();for(const [k,v] of Object.entries(choices))s[k]=v[Math.floor(Math.random()*v.length)];for(const k of ['size','earSize','wingSize','tailSize'])s[k]=Math.round((.75+Math.random()*.8)*100)/100;s.glowEyes=Math.random()>.5;s.soul=souls[Math.floor(Math.random()*souls.length)].id;return s;}
function move(s,dx,dz,obstacles){let x=s.x+dx,z=s.z+dz;if(Math.hypot(x,z)>39)return false;for(const o of obstacles)if(Math.hypot(x-o.x,z-o.z)<o.r+.55)return false;s.x=x;s.z=z;return true;}

const api={landmarkPoints,palette,species,souls,choices,lookKeys,fresh,appearance,validate,worldSettings,preset,randomLook,move};root.WildwoodModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
