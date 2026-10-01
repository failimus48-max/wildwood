const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'game');
const files=fs.readdirSync(dir).filter(p=>/\.(html|css|js|woff2?|png|jpg|ogg|mp3|wav|json)$/.test(p)&&p!=='manifest.json').sort().map(p=>{const b=fs.readFileSync(path.join(dir,p));return {path:p,bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')};});
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify({schema:1,entry:'index.html',files},null,2)+'\n');
console.log('Manifest generated for '+files.length+' game files.');
