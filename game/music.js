'use strict';
// Fernlight: an original, locally synthesized woodland score.
// The composition contains no samples or melodies from the reference soundtrack.
(() => {
const chords=[
 [50,57,60,64,69], [46,53,57,60,65], [53,60,64,67,72], [48,55,62,64,69],
 [55,62,65,69,74], [46,53,60,62,65], [50,57,60,64,67], [48,55,59,62,67]
];
const phrases=[
 [[.5,76],[2,72],[3.5,69],[5.5,74],[7,72]],
 [[1,69],[2.5,65],[4.5,72],[6,69]],
 [[.5,72],[2.5,76],[4,79],[6.5,76]],
 [[1,74],[3,72],[4.5,67],[6.5,69]],
 [[.5,77],[2,74],[4.5,69],[6,72]],
 [[1.5,74],[3.5,72],[5,69],[7,65]],
 [[.5,69],[2.5,72],[4,76],[6.5,74]],
 [[1,71],[3,67],[5,74],[7,69]]
];
const frequency=midi=>440*Math.pow(2,(midi-69)/12);
class WoodlandScore {
 constructor(context){
  this.context=context;this.started=false;this.timer=null;this.bar=0;this.next=0;
  this.master=context.createGain();this.master.gain.value=0;
  this.compressor=context.createDynamicsCompressor();this.compressor.threshold.value=-17;this.compressor.knee.value=20;this.compressor.ratio.value=3;
  this.master.connect(this.compressor);this.compressor.connect(context.destination);
  this.dry=context.createGain();this.dry.gain.value=.8;this.dry.connect(this.master);
  this.reverb=context.createConvolver();this.wet=context.createGain();this.wet.gain.value=.32;this.reverb.connect(this.wet);this.wet.connect(this.master);
  const impulse=context.createBuffer(2,Math.floor(context.sampleRate*3.8),context.sampleRate);let seed=43927;
  for(let channel=0;channel<2;channel++){const data=impulse.getChannelData(channel);let smooth=0;for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;smooth=.5*smooth+.5*(seed/4294967296*2-1);data[i]=smooth*Math.pow(1-i/data.length,3)*.55;}}
  this.reverb.buffer=impulse;
  this.padWave=context.createPeriodicWave(new Float32Array(6),new Float32Array([0,1,.18,.075,.025,.012]));
 }
 route(node,pan){const p=this.context.createStereoPanner();p.pan.value=pan;node.connect(p);p.connect(this.dry);p.connect(this.reverb);return p;}
 pad(notes,time){const ctx=this.context,gain=ctx.createGain(),filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1050;filter.Q.value=.25;gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(.085,time+2.5);gain.gain.setValueAtTime(.085,time+6);gain.gain.linearRampToValueAtTime(0,time+11);filter.connect(gain);const pan=this.route(gain,Math.sin(this.bar*.8)*.18);let remaining=notes.length*2;
  for(const midi of notes)for(const detune of [-4,4]){const o=ctx.createOscillator();o.setPeriodicWave(this.padWave);o.frequency.value=frequency(midi);o.detune.value=detune;o.connect(filter);o.start(time);o.stop(time+11.1);o.onended=()=>{o.disconnect();if(--remaining===0){filter.disconnect();gain.disconnect();pan.disconnect();}};}
 }
 pluck(midi,time,pan=0,volume=.12){const ctx=this.context,g=ctx.createGain(),filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.setValueAtTime(2300,time);filter.frequency.exponentialRampToValueAtTime(700,time+2.8);filter.Q.value=.5;g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(volume,time+.018);g.gain.exponentialRampToValueAtTime(.0001,time+4);filter.connect(g);const p=this.route(g,pan);let remaining=3;for(const [ratio,level] of [[1,1],[2,.2],[3,.055]]){const o=ctx.createOscillator(),harmonic=ctx.createGain();o.type='sine';o.frequency.value=frequency(midi)*ratio;harmonic.gain.value=level;o.connect(harmonic);harmonic.connect(filter);o.start(time);o.stop(time+4.1);o.onended=()=>{o.disconnect();harmonic.disconnect();if(--remaining===0){filter.disconnect();g.disconnect();p.disconnect();}};}}
 scheduleBar(index,time){const i=index%8,cycle=Math.floor(index/8)%2;this.pad(chords[i],time);for(let n=0;n<4;n++)this.pluck(chords[i][n+1]+12,time+n*2+.2,Math.sin(index+n)*.42,.068);for(const [offset,note] of phrases[i])this.pluck(note+(cycle&&i%3===0?12:0),time+offset,Math.sin(offset+i)*.3,cycle?.10:.12);}
 schedule(){const ctx=this.context;while(this.next<ctx.currentTime+8){this.scheduleBar(this.bar++,this.next);this.next+=8;}}
 async start(){clearTimeout(this.pauseTimer);if(this.active&&this.started&&this.context.state==='running')return;await this.context.resume();this.active=true;if(!this.started){this.started=true;this.next=this.context.currentTime+.12;this.schedule();this.timer=setInterval(()=>{if(this.context.state==='running')this.schedule();},500);}this.volume(.28,1.4);}
 volume(value,fade=.3){const a=this.master.gain,t=this.context.currentTime;if(a.cancelAndHoldAtTime)a.cancelAndHoldAtTime(t);else{a.cancelScheduledValues(t);a.setValueAtTime(a.value,t);}a.linearRampToValueAtTime(value,t+fade);}
 async pause(){this.active=false;clearTimeout(this.pauseTimer);this.volume(0,.2);this.pauseTimer=setTimeout(()=>this.context.suspend().catch(()=>{}),250);}
 async resume(){clearTimeout(this.pauseTimer);if(this.started){await this.context.resume();this.active=true;this.volume(.28,.8);}}
 chime(){if(this.context.state!=='running')return;for(let i=0;i<3;i++)this.pluck([72,76,79][i],this.context.currentTime+i*.08,0,.16);}
 dispose(){clearInterval(this.timer);clearTimeout(this.pauseTimer);this.timer=null;this.context.close();}
 diagnostics(){return {title:'Fernlight',state:this.context.state,started:this.started,scheduledBars:this.bar,loopSeconds:128,volume:this.master.gain.value};}
}
window.WoodlandScore=WoodlandScore;
})();
