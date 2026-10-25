/* FootSal: a turn-based, secret-planning football game in a live three.js stadium.
   Ported from the standalone prototype (see reference/footsal-page.md). Rules are unchanged; this
   version swaps the procedural stand-ins for real assets: Poly Haven HDRI + PBR textures, Kenney
   animated players, recorded crowd, music and impact sounds. Everything falls back to the procedural
   version if an asset fails to load. */
(()=>{
const $=s=>document.querySelector(s);
if(!window.THREE){$('#fail').hidden=false;return;}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), rnd=(a,b)=>a+Math.random()*(b-a);
const mid=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
const P=a=>a.map(([x,y])=>({x,y})), clone=a=>a.map(p=>({x:p.x,y:p.y}));
const C={red:'#d9493c',chalk:'#eef3ea','chalk-dim':'rgba(238,243,234,.55)',marker:'#f2c641',ink:'#151a1b'};
// Team identity, the one source for every team cue. Never hue alone: team 0 wears a LIGHT kit and is
// drawn with circles, team 1 a DARK kit drawn with rounded squares, so greyscale and colour-blind players
// can still tell them apart. accent: caps, spots, circles, ground marks, boards; text: the accent made
// readable as text on the dark UI (>=4.5:1 on #0f1517); on: text placed on an accent fill (>=4.5:1);
// shirt/shorts: the kit; chipText: numbers on the shirt-coloured number chip.
const TEAMS=[
  {accent:'#f08a24',text:'#f08a24',on:'#151a1b',shirt:'#f1ece0',shorts:'#262b33',chipText:'#151a1b',shape:'circle'},
  {accent:'#2f7de1',text:'#5b9bf0',on:'#050608',shirt:'#1f2f5c',shorts:'#e6e2d6',chipText:'#ffffff',shape:'square'}];
const TEAMC=TEAMS.map(t=>t.accent);
TEAMS.forEach((t,i)=>{const s=document.documentElement.style;s.setProperty(`--t${i}`,t.accent);s.setProperty(`--t${i}-text`,t.text);s.setProperty(`--t${i}-kit`,t.shirt);});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ASSET={
  hdr:'images/footsal/blouberg_sunrise_2_1k.hdr',
  tex:'images/footsal/',
  models:['models/footsal/character-male-a.glb','models/footsal/character-female-b.glb'],
  audio:'audio/footsal/'
};

/* ---------- settings & names ---------- */
const SET={sfx:80,crowd:70,music:45,haptics:true,cam:'top',isoZoom:1,players:5,t1:20,t2:20,clock:true,diff:'med',quality:'standard'};
// CPU level (single player). Medium is the original CPU; Easy and Hard only change how well it chooses.
const DIFF_NAME={easy:'Easy',med:'Medium',hard:'Hard'};
// graphics presets. Standard ships with the page (1k Poly Haven maps in images/footsal/); High and
// Ultra-high stream sharper maps and a 2k sky straight from Poly Haven's CDN (CC0, CORS-enabled) and
// render at higher resolution. pr: canvas pixel-ratio cap; ss: [min,max] supersampling of the composite
// pass; shadow: sun shadow map; tex/nor: diffuse/normal map size; turf: turf canvas scale; ov: overlay
// canvas resolution.
const QUALITY={
  standard:{pr:2,ss:[1.5,2],shadow:2048,tex:'1k',nor:'1k',sky:'1k',turf:1,ov:560},
  high:{pr:2.5,ss:[2,2.5],shadow:4096,tex:'2k',nor:'2k',sky:'2k',turf:1.5,ov:700},
  ultra:{pr:3,ss:[2.5,3],shadow:8192,tex:'4k',nor:'2k',sky:'2k',turf:2,ov:840}};
const Q=()=>QUALITY[SET.quality]||QUALITY.standard;
try{Object.assign(SET,JSON.parse(localStorage.getItem('gpfc.settings.v1')||'{}'));}catch(e){}
const saveSet=()=>{try{localStorage.setItem('gpfc.settings.v1',JSON.stringify(SET));}catch(e){}};
const PRE=['Riverside','Monsoon','Copper Street','Lantern','Harbour','Saffron','Old Mill','Peacock','Northern','Kite Hill','Banyan','Sunset','Granite','Ironbridge','Juniper','Coral Bay','Marigold','Thunder Road'];
const SUF=['Rovers','United','Athletic','Wanderers','FC','Comets','Rangers','City','Albion','Strikers','Tigers','Town'];
function randName(avoid){let n;do{n=PRE[Math.floor(Math.random()*PRE.length)]+' '+SUF[Math.floor(Math.random()*SUF.length)];}while(n===avoid);return n;}
// browsers refuse (and log) vibration before the first real tap, so wait for one
function buzz(p){if(!SET.haptics)return;const ua=navigator.userActivation;if(ua&&!ua.hasBeenActive)return;try{if(navigator.vibrate)navigator.vibrate(p);}catch(e){}}
/* ---------- audio: recorded samples with synthesised fallbacks ---------- */
// Samples: crowd (Gregor Quendel, CC BY 4.0), impacts (Kenney, CC0), music "Diamond Race" (iamoneabe, CC0).
// Whistle, horn, net, tick and tap stay synthesised. Until a sample decodes, its synth stand-in plays.
const AU={ctx:null,next:0,buf:{},loops:{}};
const SAMPLES=['kick-1','kick-2','kick-3','trap-1','trap-2','post','step-1','step-2','shing','clang','glass','crowd-bed','crowd-chant','crowd-goal','crowd-cheer','crowd-soft','music'];
function audioInit(){
  if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return;}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  try{
    const c=new AC();AU.ctx=c;
    AU.master=c.createGain();AU.master.connect(c.destination);
    AU.sfx=c.createGain();AU.sfx.connect(AU.master);
    AU.crowd=c.createGain();AU.crowd.connect(AU.master);
    AU.music=c.createGain();AU.music.gain.value=0;AU.music.connect(AU.master);
    const len=c.sampleRate*3,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);
    let b0=0,b1=0,b2=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;b0=.99765*b0+w*.099;b1=.963*b1+w*.2965;b2=.57*b2+w*1.0527;d[i]=(b0+b1+b2+w*.1848)*.17;}
    AU.noise=buf;
    // four synthetic crowd beds, one per stand; they fill in under (or instead of) the recorded crowd
    AU.beds=[-1,-.35,.35,1].map((pan,i)=>{
      const s=c.createBufferSource();s.buffer=buf;s.loop=true;s.playbackRate.value=.85+i*.08;
      const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=600+i*150;bp.Q.value=.6;
      const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;
      const g=c.createGain();g.gain.value=0;
      s.connect(bp);bp.connect(lp);lp.connect(g);
      let out=g;if(c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=pan;g.connect(p);out=p;}
      out.connect(AU.crowd);s.start(0,Math.random()*2);return {g,bp};
    });
    applyVolumes();
    SAMPLES.forEach(loadSample);
  }catch(e){AU.ctx=null;}
}
function loadSample(name){
  fetch(ASSET.audio+name+'.mp3').then(r=>{if(!r.ok)throw 0;return r.arrayBuffer();})
    .then(ab=>new Promise((ok,no)=>AU.ctx.decodeAudioData(ab,ok,no)))
    .then(b=>{AU.buf[name]=b;onSample(name);}).catch(()=>{});
}
function onSample(name){
  // the two crowd loops start as soon as they arrive; the music too
  if(name==='crowd-bed'||name==='crowd-chant'){const l=loopBuf(name,AU.crowd);if(l)AU.loops[name]=l;}
  if(name==='music'){const l=loopBuf('music',AU.music,1);if(l)AU.loops.music=l;musicTick(true);}
}
function loopBuf(name,dest,vol=0){
  const c=AU.ctx,b=AU.buf[name];if(!c||!b)return null;
  const s=c.createBufferSource();s.buffer=b;s.loop=true;const g=c.createGain();g.gain.value=vol;s.connect(g);g.connect(dest);
  s.start(0,Math.random()*b.duration*.8);return{s,g};
}
function playBuf(name,{vol=1,rate=1,pan=0,dest,delay=0}={}){
  const c=AU.ctx,b=AU.buf[name];if(!c||!b)return false;const t=c.currentTime+delay;
  const s=c.createBufferSource();s.buffer=b;s.playbackRate.value=rate;const g=c.createGain();g.gain.value=vol;s.connect(g);
  let out=g;if(pan&&c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=pan;g.connect(p);out=p;}
  out.connect(dest||AU.sfx);s.start(t);return true;
}
const pick=(...n)=>n[Math.floor(Math.random()*n.length)];
function applyVolumes(){if(!AU.ctx)return;const t=AU.ctx.currentTime;AU.sfx.gain.setTargetAtTime(SET.sfx/100,t,.05);AU.crowd.gain.setTargetAtTime(SET.crowd/100*.9,t,.1);musicTick(true);}
// music sits forward in the menus and ducks under the match
function musicTick(force){if(!AU.ctx||!AU.loops.music)return;const want=SET.music/100*(SCREEN==='game'?.16:.55);
  if(force||Math.abs(want-(AU.musicV||0))>.001){AU.musicV=want;AU.music.gain.setTargetAtTime(want,AU.ctx.currentTime,.8);}}
function env(g,t,a,peak,dec){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dec);}
function tone(type,f0,f1,dur,peak,dest,delay=0,pan=0){
  const c=AU.ctx;if(!c)return null;const t=c.currentTime+delay;
  const o=c.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);
  const g=c.createGain();env(g,t,.006,peak,dur);o.connect(g);
  let out=g;if(pan&&c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=pan;g.connect(p);out=p;}
  out.connect(dest||AU.sfx);o.start(t);o.stop(t+dur+.1);return o;
}
function noise(dur,peak,type,freq,q,dest,delay=0,pan=0,f1){
  const c=AU.ctx;if(!c)return;const t=c.currentTime+delay;
  const s=c.createBufferSource();s.buffer=AU.noise;
  const f=c.createBiquadFilter();f.type=type;f.frequency.setValueAtTime(freq,t);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t+dur);f.Q.value=q||1;
  const g=c.createGain();env(g,t,Math.min(.08,dur*.2),peak,dur);s.connect(f);f.connect(g);
  let out=g;if(pan&&c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=pan;g.connect(p);out=p;}
  out.connect(dest||AU.sfx);s.start(t,Math.random()*2);s.stop(t+dur+.2);
}
const SFX={
  kick(p=.6){if(!playBuf(pick('kick-1','kick-2','kick-3'),{vol:.55+p*.6,rate:.92+p*.22}))noise(.05,.35,'highpass',1800,.7);tone('sine',170,46,.17,.25+p*.35);},
  trap(){if(!playBuf(pick('trap-1','trap-2'),{vol:.9,rate:rnd(.9,1.1)})){tone('sine',140,70,.12,.35);noise(.06,.12,'lowpass',500,.7);}},
  step(){playBuf(pick('step-1','step-2'),{vol:.35,rate:rnd(.85,1.15),pan:rnd(-.5,.5)});},
  tap(){tone('triangle',900,700,.05,.16);},
  tick(){tone('square',1700,null,.03,.07);},
  whistle(n=1,long=false){const c=AU.ctx;if(!c)return;for(let k=0;k<n;k++){const t=c.currentTime+k*.42,d=long&&k===n-1?.8:.28;
    const o=c.createOscillator();o.frequency.value=3050;const l=c.createOscillator();l.frequency.value=27;const lg=c.createGain();lg.gain.value=170;l.connect(lg);lg.connect(o.frequency);
    const g=c.createGain();env(g,t,.01,.14,d);o.connect(g);g.connect(AU.sfx);o.start(t);l.start(t);o.stop(t+d+.1);l.stop(t+d+.1);}},
  net(){noise(.5,.5,'bandpass',3600,.9);},
  horn(){[220,277,330].forEach(f=>{const c=AU.ctx;if(!c)return;const t=c.currentTime+.05;const o=c.createOscillator();o.type='sawtooth';o.frequency.value=f;
    const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1300;const g=c.createGain();env(g,t,.04,.07,1.4);o.connect(lp);lp.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+1.6);});},
  thud(){if(!playBuf('kick-2',{vol:1,rate:.7}))tone('sine',120,55,.2,.7);noise(.1,.25,'lowpass',600,.7);},
  ooh(){noise(1.3,.55,'bandpass',950,1.4,AU.crowd,0,0,430);playBuf('crowd-soft',{vol:.5,dest:AU.crowd,rate:.9});},
  cheer(n=6){
    if(n>=10&&playBuf('crowd-goal',{vol:1.1,dest:AU.crowd}))return;
    if(n>=4&&playBuf('crowd-cheer',{vol:.75,dest:AU.crowd,rate:rnd(.95,1.05)}))return;
    for(let i=0;i<n;i++)noise(rnd(.18,.45),rnd(.15,.35),'bandpass',rnd(800,1500),2.2,AU.crowd,rnd(0,1.6),rnd(-1,1));
    for(let i=0;i<Math.ceil(n/3);i++)tone('sine',rnd(1500,2000),rnd(2300,3000),rnd(.2,.4),.05,AU.crowd,rnd(0,1.6),rnd(-1,1));},
  // anime stingers for the cut-ins: whooshes, a "dodon" double hit, a rising charge, bell shing, chime
  // sparkle and a sad descending horn. Bells and glass are Kenney samples; the rest is synthesised.
  anime:{
    swish(){noise(.22,.32,'bandpass',700,1.6,AU.sfx,0,rnd(-.6,.6),5200);},
    whoosh(){noise(.42,.45,'bandpass',300,1.2,AU.sfx,0,0,3800);noise(.3,.2,'highpass',2500,.7,AU.sfx,.08);},
    dodon(){[0,.15].forEach((t,i)=>{tone('sine',i?62:80,30,.55,.85,AU.sfx,t);tone('triangle',160,50,.18,.3,AU.sfx,t);noise(.18,.35,'lowpass',380,.8,AU.sfx,t);});},
    rise(){tone('sawtooth',220,1400,.32,.07);noise(.32,.18,'bandpass',600,2,AU.sfx,0,0,6000);},
    shing(rate=1.5){if(!playBuf('shing',{vol:.7,rate}))tone('sine',2600,3200,.6,.12);tone('sine',3136,null,.8,.05,AU.sfx,.02);},
    sparkle(){[1568,1976,2349,3136,3951].forEach((f,i)=>tone('sine',f,null,.35,.09,AU.sfx,i*.055,(i-2)*.25));playBuf('glass',{vol:.5,rate:1.3});},
    sad(){[[392,370],[370,349],[349,330],[330,262]].forEach(([a,b],i)=>tone('triangle',a,b,i===3?.9:.26,.16,AU.sfx,i*.3));},
    lock(){SFX.anime.whoosh();SFX.anime.shing(1.1);},
    kickoff(){SFX.anime.whoosh();SFX.anime.dodon();},
    shot(){SFX.anime.rise();SFX.anime.dodon();SFX.anime.whoosh();},
    perfect(){SFX.anime.shot();SFX.anime.shing(1.8);SFX.anime.sparkle();},
    goal(){SFX.anime.dodon();SFX.anime.whoosh();setTimeout(()=>{SFX.anime.shing(1.3);SFX.anime.sparkle();},180);},
    blocked(){if(!playBuf('clang',{vol:.8,rate:.85}))tone('square',300,120,.2,.2);SFX.anime.dodon();SFX.anime.swish();}
  }
};
let excite=.12,exciteT=.12;
function crowdTick(now){
  if(!AU.ctx||now<AU.next)return;AU.next=now+380;
  const t=AU.ctx.currentTime,rec=!!AU.loops['crowd-bed'],base=(.18+excite*.95)*(rec?.35:1);
  AU.beds.forEach(b=>{b.g.gain.setTargetAtTime(base*(.65+Math.random()*.7),t,.25);b.bp.frequency.setTargetAtTime(600+excite*500+Math.random()*250,t,.4);});
  if(rec)AU.loops['crowd-bed'].g.gain.setTargetAtTime(.55+excite*.5,t,.5);
  if(AU.loops['crowd-chant'])AU.loops['crowd-chant'].g.gain.setTargetAtTime(clamp((excite-.3)*1.4,0,.8),t,.6);
  if(Math.random()<.06+excite*.35)SFX.cheer(1+Math.floor(excite*4));
  musicTick();
}

/* ---------- three.js stadium ---------- */
const V3=THREE.Vector3;
const cv=$('#gl');
let R3;
try{R3=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});}catch(e){$('#fail').hidden=false;return;}
R3.setPixelRatio(Math.min(window.devicePixelRatio||1,Q().pr));
const MAXTEX=R3.capabilities.maxTextureSize||4096;
R3.outputEncoding=THREE.sRGBEncoding;R3.toneMapping=THREE.ACESFilmicToneMapping;R3.toneMappingExposure=1.05;
R3.shadowMap.enabled=true;R3.shadowMap.type=THREE.PCFSoftShadowMap;
const ANI=R3.capabilities.getMaxAnisotropy();
const scene=new THREE.Scene();scene.background=new THREE.Color('#7fc4f0');scene.fog=new THREE.Fog('#bfe3f7',160,360);
const cam=new THREE.PerspectiveCamera(34,1,.5,700);
const hemi=new THREE.HemisphereLight('#cfe6ff','#3d5a3a',.3);scene.add(hemi);
const sun=new THREE.DirectionalLight('#fff4e0',1.05);sun.position.set(-26,42,20);sun.castShadow=true;
Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:5,far:120});sun.shadow.bias=-.0005;
function setShadow(){const s=Math.min(Q().shadow,MAXTEX);if(sun.shadow.mapSize.x===s)return;sun.shadow.mapSize.set(s,s);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}}
setShadow();
scene.add(sun);scene.add(sun.target);

// loading: every file goes through one manager so the splash can show progress
let status='Building the stadium…',loadPct=0,loadDone=false;
const setStatus=s=>{status=s;const el=$('#status');if(el)el.textContent=s;};
const setLoad=()=>{const b=$('#loadbar');if(!b)return;b.firstElementChild.style.width=(loadPct*100).toFixed(0)+'%';b.classList.toggle('done',loadDone);};
const LM=new THREE.LoadingManager();
LM.onProgress=(u,n,total)=>{loadPct=n/total;setStatus(`Loading the stadium ${Math.round(loadPct*100)}%`);setLoad();};
LM.onLoad=()=>{loadDone=true;setStatus('');setLoad();};
LM.onError=()=>{};

// Sky: the Poly Haven HDRI (Blouberg Sunrise 2, CC0) repainted anime-style on a dome. The shader decodes
// RGBE, pushes it toward a clean cel-anime blue, posterises it into flat bands and keeps the clouds white.
// Until the HDRI arrives the dome shows a plain gradient. Output is linear (the composite pass encodes).
const SKY={tSky:{value:null},uHas:{value:0},uTime:{value:0}};
const skyDome=new THREE.Mesh(new THREE.SphereGeometry(380,48,24),new THREE.ShaderMaterial({uniforms:SKY,side:THREE.BackSide,depthWrite:true,fog:false,
  vertexShader:`varying vec3 vDir;void main(){vDir=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform sampler2D tSky;uniform float uHas,uTime;varying vec3 vDir;
  vec3 rgbe(vec4 c){return c.rgb*exp2(c.a*255.-128.);}
  void main(){vec3 d=normalize(vDir);float h=clamp(d.y,-.2,1.);
    vec3 top=vec3(.16,.48,.92),hor=vec3(.62,.86,1.),col=mix(hor,top,pow(max(h,0.),.6));
    if(uHas>.5){vec2 uv=vec2(atan(d.z,d.x)/6.28318+.5,asin(clamp(d.y,-1.,1.))/3.14159+.5);
      vec3 c=rgbe(texture2D(tSky,uv));c=c/(1.+c);float l=dot(c,vec3(.3,.59,.11));
      float mx=max(c.r,max(c.g,c.b)),sat=(mx-min(c.r,min(c.g,c.b)))/max(mx,1e-4);
      // clouds = the greyish parts of the HDRI, drawn as flat two-tone cel shapes over a clean gradient
      float cloud=(1.-smoothstep(.16,.24,sat))*smoothstep(.02,.1,h)*step(.18,l);
      vec3 cl=mix(vec3(.74,.8,.95),vec3(1.,.99,.96),step(.5,l));
      col=mix(col,cl,cloud);
      col=mix(col,vec3(1.,.9,.74),smoothstep(.9,.97,l)*.7);}
    col=mix(col,vec3(.55,.68,.6),smoothstep(.02,-.15,d.y));
    gl_FragColor=vec4(pow(col,vec3(2.2)),1.);}`}));
skyDome.renderOrder=-1;scene.add(skyDome);
// ?debug&cdn=<base> points the High/Ultra-high downloads at a local mirror (for testing offline)
const PH_CDN=(/[?&]debug/.test(location.search)&&new URLSearchParams(location.search).get('cdn'))||'https://dl.polyhaven.org/file/ph-assets/';
let skyRes=null,hiLoads=0;
// the shipped 1k HDRI loads first (through LM, so it counts toward the splash bar); a 2k one replaces it
// for High and Ultra-high, and a failed download just leaves the 1k sky in place
function loadSky(res,mgr){if(skyRes===res)return;skyRes=res;
  const url=res==='1k'?ASSET.hdr:`${PH_CDN}HDRIs/hdr/${res}/blouberg_sunrise_2_${res}.hdr`;if(!mgr){hiLoads++;qualStatus();}
  try{new THREE.RGBELoader(mgr).setDataType(THREE.UnsignedByteType).load(url,tex=>{if(!mgr){hiLoads--;qualStatus();}if(skyRes!==res){tex.dispose();return;}
    tex.minFilter=tex.magFilter=THREE.NearestFilter;tex.generateMipmaps=false;tex.needsUpdate=true;const old=SKY.tSky.value;SKY.tSky.value=tex;SKY.uHas.value=1;if(old)old.dispose();},
    undefined,()=>{if(!mgr){hiLoads--;qualStatus();skyRes=null;}});}catch(e){}}
loadSky('1k',LM);
function qualStatus(){const el=$('#qstat');if(el)el.textContent=hiLoads>0?'Loading sharper graphics…':'';}

function canvasTex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=ANI;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}return t;}
function grain(g,w,h,n,a){for(let i=0;i<n;i++){g.fillStyle=Math.random()<.5?`rgba(255,255,255,${a})`:`rgba(0,0,0,${a})`;g.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*3);}}
// Anime look: every surface is cel-shaded with a three-step ramp (shadow, mid, lit). std() keeps the old
// call sites; options a toon material doesn't have (roughness, metalness...) are dropped.
const GRAD=(()=>{const d=new Uint8Array([46,46,46,150,150,150,255,255,255]),t=new THREE.DataTexture(d,3,1,THREE.RGBFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;return t;})();
function std(o){const m=new THREE.MeshToonMaterial({gradientMap:GRAD}),v={};for(const k in o)if(k in m)v[k]=o[k];m.setValues(v);return m;}
// Poly Haven PBR set (CC0): diffuse in sRGB and normal (GL); roughness is meaningless under cel shading.
// The material keeps its flat colour until the maps arrive.
// Every material starts on the shipped 1k maps; loadPBR() then swaps in the preset's size once it has
// downloaded (a failed download keeps what's there). PBRS remembers each set so a quality change can redo it.
const TL=new THREE.TextureLoader(LM),PBRS=[];
const texURL=(id,suffix,res)=>res==='1k'?`${ASSET.tex}${id}_${suffix}_1k.jpg`:`${PH_CDN}Textures/jpg/${res}/${id}/${id}_${suffix}_${res}.jpg`;
function prepTex(t,e,srgb){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(e.rep[0],e.rep[1]);t.anisotropy=ANI;if(srgb)t.encoding=THREE.sRGBEncoding;return t;}
function loadPBR(e,q,initial){
  [['map','diff',q.tex,true],['normalMap','nor_gl',q.nor,false]].forEach(([slot,suffix,res,srgb])=>{
    if(slot==='map'&&!e.color)return;if(e.res[slot]===res)return;e.res[slot]=res;
    if(initial){e.mat[slot]=prepTex(TL.load(texURL(e.id,suffix,res)),e,srgb);return;}
    hiLoads++;qualStatus();
    fetchImg(texURL(e.id,suffix,res)).then(img=>{hiLoads--;qualStatus();if(e.res[slot]!==res)return;
      const t=new THREE.Texture(img);t.needsUpdate=true;const old=e.mat[slot];e.mat[slot]=prepTex(t,e,srgb);e.mat.needsUpdate=true;if(old)old.dispose();},
      ()=>{hiLoads--;qualStatus();e.res[slot]=null;});});
  e.mat.needsUpdate=true;}
// one download per file even when two materials share it (the stands use concrete twice)
const imgCache=new Map();
function fetchImg(url){if(!imgCache.has(url))imgCache.set(url,new Promise((ok,no)=>new THREE.ImageLoader().setCrossOrigin('anonymous').load(url,ok,undefined,e=>{imgCache.delete(url);no(e);})));return imgCache.get(url);}
function pbr(mat,id,rep,{color=true,normal=.8}={}){
  const e={mat,id,rep,color,res:{}};PBRS.push(e);
  if(color)mat.color.set('#ffffff');
  loadPBR(e,QUALITY.standard,true);mat.normalScale.set(normal,normal);return mat;
}

// turf: mowing stripes along the pitch, with Poly Haven "Leafy Grass" baked in as luminance detail
const TURF_W=1024,TURF_H=1536;
function paintTurf(g,w,h,detail){
  for(let i=0;i<12;i++){g.fillStyle=i%2?'#26773a':'#2f8a44';g.fillRect(0,i*h/12,w,h/12);}
  // tiles keep the same size on the pitch at every quality; a bigger canvas just gives them more pixels
  if(detail){g.save();g.globalCompositeOperation='overlay';g.globalAlpha=.55;const s=128*w/TURF_W;
    for(let y=0;y<h;y+=s)for(let x=0;x<w;x+=s)g.drawImage(detail,x,y,s,s);g.restore();
    g.save();g.globalCompositeOperation='soft-light';g.globalAlpha=.25;
    for(let y=0;y<h;y+=s*3)for(let x=0;x<w;x+=s*3)g.drawImage(detail,x+s,y+s/2,s*3,s*3);g.restore();}
  else grain(g,w,h,20000*w/TURF_W,.035);
}
let turf=null,turfDetail=null,turfM=null;
function buildTurf(){const w=Math.round(TURF_W*Q().turf),h=Math.round(TURF_H*Q().turf);
  if(turf&&turf.image.width===w&&turf.fsDetail===!!turfDetail)return;
  const old=turf;turf=canvasTex(w,h,(g)=>paintTurf(g,w,h,turfDetail));turf.fsDetail=!!turfDetail;
  if(turfM){turfM.material.map=turf;turfM.material.needsUpdate=true;}if(old)old.dispose();}
buildTurf();
turfM=new THREE.Mesh(new THREE.PlaneGeometry(24,36),std({map:turf,envMapIntensity:.3,roughness:.95}));turfM.rotation.x=-Math.PI/2;turfM.receiveShadow=true;scene.add(turfM);
new THREE.ImageLoader(LM).load(ASSET.tex+'leafy_grass_detail_512.jpg',img=>{turfDetail=img;buildTurf();});
// apron: Poly Haven "Rubberized Track"
const apronMat=pbr(std({color:'#7a3a2c',envMapIntensity:.4}),'rubberized_track',[7,10],{normal:.6});
apronMat.color.set('#c9a69c');
const apron=new THREE.Mesh(new THREE.PlaneGeometry(29,40),apronMat);
apron.rotation.x=-Math.PI/2;apron.position.y=-.02;apron.receiveShadow=true;scene.add(apron);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(400,400),std({color:'#4b4f4c'}));ground.rotation.x=-Math.PI/2;ground.position.y=-.06;scene.add(ground);

// goals
const white=std({color:'#ffffff',roughness:.35,metalness:.1}),nets=[];
const netTex=canvasTex(64,64,(g)=>{g.clearRect(0,0,64,64);g.strokeStyle='rgba(255,255,255,.95)';g.lineWidth=3;for(let i=0;i<=64;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i,64);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(64,i);g.stroke();}},[12,5]);
[[-15,-1],[15,1]].forEach(([z0,d])=>{
  [-2.4,2.4].forEach(x=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,2.05,12),white);p.position.set(x,1.02,z0);p.castShadow=true;scene.add(p);});
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,4.9,12),white);bar.rotation.z=Math.PI/2;bar.position.set(0,2.05,z0);bar.castShadow=true;scene.add(bar);
  const net=new THREE.Mesh(new THREE.BoxGeometry(4.8,2,1.4,14,6,4),new THREE.MeshBasicMaterial({map:netTex,alphaMap:netTex,transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false}));
  net.position.set(0,1,z0+d*.7);net.userData={z0,d,kick:0};scene.add(net);nets.push(net);
});

// advertising boards that carry the team names
const boardClones=[];
const boardCv=document.createElement('canvas');boardCv.width=1024;boardCv.height=64;
const boardTex=new THREE.CanvasTexture(boardCv);boardTex.encoding=THREE.sRGBEncoding;boardTex.wrapS=THREE.RepeatWrapping;boardTex.anisotropy=ANI;
function paintBoards(a,b){const g=boardCv.getContext('2d');g.fillStyle='#0a0e12';g.fillRect(0,0,1024,64);g.font='700 40px "Barlow Condensed","Arial Narrow",sans-serif';g.textBaseline='middle';
  let x=18;const seg=[[`FOOTSAL`,C.marker],[`  ·  `,'#5d6a70'],[a.toUpperCase(),TEAMS[0].text],[`  v  `,'#cfd6d2'],[b.toUpperCase(),TEAMS[1].text],[`  ·  `,'#5d6a70']];
  while(x<1024){for(const [t,c] of seg){g.fillStyle=c;g.fillText(t,x,34);x+=g.measureText(t).width;}}
  boardTex.needsUpdate=true;boardClones.forEach(t=>t.needsUpdate=true);}
paintBoards('Home','Away');
const boardBack=pbr(std({color:'#151b20'}),'corrugated_iron_02',[6,1],{color:false,normal:.5});
function board(len,x,z,ry){const t=boardTex.clone();t.needsUpdate=true;t.repeat.set(len/14,1);boardClones.push(t);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(len,.9),new THREE.MeshBasicMaterial({map:t,toneMapped:false}));m.position.set(x,.45,z);m.rotation.y=ry;scene.add(m);
  const back=new THREE.Mesh(new THREE.BoxGeometry(len,.9,.12),boardBack);back.position.set(x,.45,z);back.rotation.y=ry;back.translateZ(-.07);scene.add(back);}
board(33,-11.8,0,Math.PI/2);board(33,11.8,0,-Math.PI/2);board(23.6,0,-17.4,0);board(23.6,0,17.4,Math.PI);

// stands on all four sides, stepped, in Poly Haven "Concrete Floor 02"
const DX=13.6,DZ=19.4,ROWS=10;
const standM=pbr(std({color:'#8b9098',roughness:.95}),'concrete_floor_02',[12,1]),standEnd=pbr(std({color:'#7d828a',roughness:.95}),'concrete_floor_02',[8,1]);
standM.color.set('#b9bcc2');standEnd.color.set('#a4a8ae');
for(let i=0;i<ROWS;i++){const top=.6+i*.55;
  [-1,1].forEach(s=>{const m=new THREE.Mesh(new THREE.BoxGeometry(1,top,2*(DZ+i+1)),standM);m.position.set(s*(DX+i+.5),top/2,0);m.receiveShadow=true;scene.add(m);
    const e=new THREE.Mesh(new THREE.BoxGeometry(2*(DX+i+1),top,1),standEnd);e.position.set(0,top/2,s*(DZ+i+.5));e.receiveShadow=true;scene.add(e);});}
// cantilever roofs on the long sides, Poly Haven "Corrugated Iron 02"
const roofM=pbr(std({color:'#2b3238',roughness:.6,metalness:.4}),'corrugated_iron_02',[2,14]);
roofM.color.set('#8a949c');
const poleM=std({color:'#2b3238',roughness:.5,metalness:.5});
[-1,1].forEach(s=>{const r=new THREE.Mesh(new THREE.BoxGeometry(7,.35,62),roofM);r.position.set(s*(DX+ROWS+.5),9.6,0);r.castShadow=true;scene.add(r);
  for(let z=-28;z<=28;z+=8){const p=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,9.6,6),poleM);p.position.set(s*(DX+ROWS+3.6),4.8,z);scene.add(p);}});
// floodlight towers, each with a glow sprite, a real (shadowless) spotlight and a light cone shown in the menus
const glowTex=canvasTex(64,64,(g)=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,248,225,1)');gr.addColorStop(.35,'rgba(255,236,190,.5)');gr.addColorStop(1,'rgba(255,230,180,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);});
const coneTex=canvasTex(8,128,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(255,240,200,.0)');gr.addColorStop(.08,'rgba(255,240,200,.55)');gr.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);});
const cones=[];
[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz],k)=>{const x=sx*27,z=sz*33;
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.35,.55,26,8),poleM);pole.position.set(x,13,z);scene.add(pole);
  const head=new THREE.Mesh(new THREE.BoxGeometry(5,2.6,.6),new THREE.MeshStandardMaterial({color:'#222',emissive:'#fff3d0',emissiveIntensity:1.6}));
  head.position.set(x,26.5,z);head.lookAt(0,0,0);scene.add(head);
  const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:'#fff4dc',blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));gl.scale.set(16,16,1);gl.position.copy(head.position);scene.add(gl);
  if(k<2){const sl=new THREE.SpotLight('#fff1d6',.3,120,.5,.6,1);sl.position.copy(head.position);sl.target.position.set(-sx*4,0,-sz*6);scene.add(sl);scene.add(sl.target);}
  const len=Math.hypot(x,26.5,z)*.95,cg=new THREE.CylinderGeometry(.6,9,len,24,1,true).translate(0,-len/2,0).rotateX(-Math.PI/2);
  const cone=new THREE.Mesh(cg,new THREE.MeshBasicMaterial({map:coneTex,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false,fog:false}));
  cone.position.copy(head.position);cone.lookAt(-sx*3,0,-sz*4);cone.renderOrder=3;scene.add(cone);cones.push(cone);});

// crowd: instanced bodies and heads that bounce in a vertex shader
const CU={uTime:{value:0},uExcite:{value:0}};
function crowdMat(){const m=new THREE.MeshToonMaterial({color:'#9a9a9a',gradientMap:GRAD});m.onBeforeCompile=sh=>{sh.uniforms.uTime=CU.uTime;sh.uniforms.uExcite=CU.uExcite;
  sh.vertexShader='attribute float aSeed;\nuniform float uTime;\nuniform float uExcite;\n'+sh.vertexShader.replace('#include <begin_vertex>',
  `#include <begin_vertex>
  float cs=fract(aSeed*7.31);
  float jump=uExcite*step(.25,cs)*(.3+.45*cs);
  transformed.y+=abs(sin(uTime*(3.0+aSeed*3.0)+aSeed*40.0))*(0.03+jump);`);};return m;}
const seats=[];
for(let i=0;i<ROWS;i++){const top=.6+i*.55;
  [-1,1].forEach(s=>{const x=s*(DX+i+.5),half=DZ+i;for(let z=-half+.35;z<=half-.35;z+=.62)if(Math.random()>.07)seats.push([x+rnd(-.1,.1),top,z+rnd(-.12,.12)]);
    const z=s*(DZ+i+.5),hx=DX+i;for(let x2=-hx+.35;x2<=hx-.35;x2+=.62)if(Math.random()>.07)seats.push([x2+rnd(-.12,.12),top,z+rnd(-.1,.1)]);});}
const NC=seats.length;
const bodyG=new THREE.CylinderGeometry(.19,.24,.82,5).translate(0,.41,0),headG=new THREE.IcosahedronGeometry(.16,0).translate(0,.96,0);
const seedA=new Float32Array(NC).map(()=>Math.random());
bodyG.setAttribute('aSeed',new THREE.InstancedBufferAttribute(seedA,1));headG.setAttribute('aSeed',new THREE.InstancedBufferAttribute(seedA.slice(),1));
const bodies=new THREE.InstancedMesh(bodyG,crowdMat(),NC),heads=new THREE.InstancedMesh(headG,crowdMat(),NC);
const kit=['#f08a24','#d9761a','#2f7de1','#2563b8','#f2f2ee','#f2c641','#22272b','#8a9198','#e0703a','#3b9a63'],skins=['#e6b996','#c99068','#a8704a','#7d5236','#f0cfb2'];
const mtx=new THREE.Matrix4(),col=new THREE.Color();
seats.forEach(([x,y,z],i)=>{const sc=rnd(.88,1.1);mtx.makeScale(sc,sc,sc);mtx.setPosition(x,y,z);bodies.setMatrixAt(i,mtx);heads.setMatrixAt(i,mtx);
  bodies.setColorAt(i,col.set(kit[Math.floor(Math.random()*kit.length)]));heads.setColorAt(i,col.set(skins[Math.floor(Math.random()*skins.length)]));});
bodies.frustumCulled=heads.frustumCulled=false;scene.add(bodies);scene.add(heads);

/* ---------- VFX: particles, fireworks, goal shockwave ---------- */
const dotTex=canvasTex(32,32,g=>{const gr=g.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,32,32);});
const sqTex=canvasTex(16,16,g=>{g.fillStyle='#fff';g.fillRect(2,4,12,8);});
class Particles{
  constructor(max,size,map,additive,floor=true){this.max=max;this.n=0;this.pos=new Float32Array(max*3).fill(-999);this.col=new Float32Array(max*3);this.vel=new Float32Array(max*3);this.life=new Float32Array(max);this.ml=new Float32Array(max);this.base=new Float32Array(max*3);this.grav=new Float32Array(max);this.fade=additive;this.floor=floor;
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(this.pos,3));g.setAttribute('color',new THREE.BufferAttribute(this.col,3));
    this.pts=new THREE.Points(g,new THREE.PointsMaterial({size,map,vertexColors:true,transparent:true,depthWrite:false,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending,sizeAttenuation:true,toneMapped:false,alphaTest:additive?0:.4}));
    this.pts.frustumCulled=false;scene.add(this.pts);this.i=0;this.live=0;}
  emit(x,y,z,count,o){for(let k=0;k<count;k++){const i=this.i;this.i=(this.i+1)%this.max;const a=Math.random()*Math.PI*2,sp=rnd(o.speed*.4,o.speed);
    if(o.sphere){const u=rnd(-1,1),r=Math.sqrt(1-u*u);this.vel.set([Math.cos(a)*r*sp,u*sp,Math.sin(a)*r*sp],i*3);}
    else this.vel.set([Math.cos(a)*sp*(o.flat?1:.6)+(o.dx||0),rnd(o.up*.5,o.up),Math.sin(a)*sp*(o.flat?1:.6)+(o.dz||0)],i*3);
    this.pos.set([x+rnd(-o.spread,o.spread),y,z+rnd(-o.spread,o.spread)],i*3);
    const c=new THREE.Color(o.colors[Math.floor(Math.random()*o.colors.length)]);this.base.set([c.r,c.g,c.b],i*3);this.col.set([c.r,c.g,c.b],i*3);
    this.life[i]=this.ml[i]=rnd(o.life*.6,o.life);this.grav[i]=o.grav;}this.live=1;}
  update(dt){if(!this.live)return;let any=0;for(let i=0;i<this.max;i++){if(this.life[i]<=0)continue;this.life[i]-=dt;const j=i*3;
    if(this.life[i]<=0){this.pos[j+1]=-999;continue;}any=1;
    this.vel[j+1]-=this.grav[i]*dt;this.pos[j]+=this.vel[j]*dt;this.pos[j+1]+=this.vel[j+1]*dt;this.pos[j+2]+=this.vel[j+2]*dt;
    if(this.floor&&this.pos[j+1]<.02){this.pos[j+1]=.02;this.vel[j]*=.6;this.vel[j+1]*=-.2;this.vel[j+2]*=.6;}
    if(this.fade){const f=this.life[i]/this.ml[i];this.col[j]=this.base[j]*f;this.col[j+1]=this.base[j+1]*f;this.col[j+2]=this.base[j+2]*f;}}
    this.live=any;this.pts.geometry.attributes.position.needsUpdate=true;this.pts.geometry.attributes.color.needsUpdate=true;}
}
const dust=new Particles(500,.28,dotTex,true),confetti=new Particles(400,.34,sqTex,false),sparks=new Particles(700,.42,dotTex,true,false);
const NF=360,flashPos=new Float32Array(NF*3),flashCol=new Float32Array(NF*3),flashV=new Float32Array(NF);
for(let i=0;i<NF;i++){const s=seats[Math.floor(Math.random()*NC)];flashPos.set([s[0],s[1]+1.2,s[2]],i*3);}
const flashG=new THREE.BufferGeometry();flashG.setAttribute('position',new THREE.BufferAttribute(flashPos,3));flashG.setAttribute('color',new THREE.BufferAttribute(flashCol,3));
const flashes=new THREE.Points(flashG,new THREE.PointsMaterial({size:1.1,map:dotTex,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));scene.add(flashes);
function updateFlashes(dt){const p=.0015+excite*.03;for(let i=0;i<NF;i++){flashV[i]=Math.max(0,flashV[i]-dt*7);if(Math.random()<p)flashV[i]=1;const v=flashV[i];flashCol[i*3]=v;flashCol[i*3+1]=v;flashCol[i*3+2]=v*.95;}flashG.attributes.color.needsUpdate=true;}
// fireworks after a goal: queued bursts high over the pitch (so the top-down camera sees them), each a
// sphere of sparks plus a pop panned to its side
const fwQ=[];
function fireworks(team){const t0=performance.now();for(let k=0;k<7;k++)fwQ.push({t:t0+300+k*rnd(260,420),x:rnd(-9,9),z:rnd(-13,13),c:[TEAMC[team],C.marker,'#ffffff']});}
function updateFireworks(now){while(fwQ.length&&fwQ[0].t<=now){const f=fwQ.shift();
  sparks.emit(f.x,rnd(9,13),f.z,90,{sphere:true,speed:5,spread:.1,colors:f.c,life:1.5,grav:2.5});
  noise(.35,.25,'lowpass',900,.8,AU.sfx,0,clamp(f.x/10,-1,1));tone('sine',90,40,.3,.25,AU.sfx,0,clamp(f.x/10,-1,1));}}
// goal shockwave: an additive ring that races out across the turf from the goal mouth
const ringTex=canvasTex(128,128,g=>{const gr=g.createRadialGradient(64,64,40,64,64,64);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.7,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);});
const ring=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:ringTex,color:C.marker,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));
ring.rotation.x=-Math.PI/2;ring.position.set(0,.06,-15);ring.renderOrder=4;scene.add(ring);let ringT=-1;
function updateRing(now){if(ringT<0)return;const k=(now-ringT)/1100;if(k>=1){ring.material.opacity=0;ringT=-1;return;}const s=2+k*34;ring.scale.set(s,s,1);ring.material.opacity=(1-k)*.9;}

/* ---------- anime VFX: starbursts, ball trail, shot aura, goal light pillar ---------- */
// impact starburst: a spiky white star with an ink rim that pops and spins at every touch
const starTex=canvasTex(256,256,g=>{g.translate(128,128);const pts=[],n=16;for(let i=0;i<n*2;i++){const a=i/(n*2)*Math.PI*2,r=i%2?40+Math.random()*16:104+Math.random()*20;pts.push([Math.cos(a)*r,Math.sin(a)*r]);}
  const path=()=>{g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();};
  path();g.lineWidth=14;g.lineJoin='round';g.strokeStyle='#151a1b';g.stroke();path();g.fillStyle='#ffffff';g.fill();
  g.scale(.55,.55);path();g.fillStyle='#fff3b0';g.fill();});
const bursts=Array.from({length:8},()=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:starTex,transparent:true,depthTest:false,depthWrite:false,toneMapped:false}));s.visible=false;s.renderOrder=6;scene.add(s);return{s,t0:0,life:1,max:1};});
let burstI=0;
function burst(x,y,z,size,color,life=320){const b=bursts[burstI++%bursts.length];b.s.position.set(x,y,z);b.s.material.color.set(color||'#ffffff');b.s.material.rotation=Math.random()*6.28;b.t0=performance.now();b.life=life;b.max=size;b.s.visible=true;}
function updateBursts(now){bursts.forEach(b=>{if(!b.s.visible)return;const k=(now-b.t0)/b.life;if(k>=1){b.s.visible=false;return;}
  const e=1+2.7*Math.pow(k-1,3)+1.7*Math.pow(k-1,2);const s=b.max*Math.min(1.15,e);b.s.scale.set(s,s,1);b.s.material.opacity=1-k*k;b.s.material.rotation+=.02;});}
// ball trail: a camera-agnostic ribbon in the ground plane that tapers behind the ball, team colour to white
const TRN=26,trPos=new Float32Array(TRN*6),trCol=new Float32Array(TRN*6),trHist=[];
const trG=new THREE.BufferGeometry();trG.setAttribute('position',new THREE.BufferAttribute(trPos,3));trG.setAttribute('color',new THREE.BufferAttribute(trCol,3));
{const idx=[];for(let i=0;i<TRN-1;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}trG.setIndex(idx);}
const trail=new THREE.Mesh(trG,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
trail.frustumCulled=false;trail.renderOrder=5;scene.add(trail);const trC=new THREE.Color(),trW=new THREE.Color('#ffffff');
function updateTrail(on,color,width){
  if(on)trHist.push(ball.position.clone());else if(trHist.length)trHist.shift();
  while(trHist.length>TRN)trHist.shift();
  const n=trHist.length;trail.visible=n>2;if(!trail.visible)return;
  for(let i=0;i<TRN;i++){const p=trHist[Math.min(i,n-1)],q=trHist[Math.max(0,Math.min(i,n-1)-1)],dx=p.x-q.x,dz=p.z-q.z,l=Math.hypot(dx,dz)||1,f=Math.min(i,n-1)/(n-1),w=width*f;
    trPos.set([p.x-dz/l*w,p.y,p.z+dx/l*w,p.x+dz/l*w,p.y,p.z-dx/l*w],i*6);
    trC.set(color).lerp(trW,f*f).multiplyScalar(f*.95);trCol.set([trC.r,trC.g,trC.b,trC.r,trC.g,trC.b],i*6);}
  trG.attributes.position.needsUpdate=true;trG.attributes.color.needsUpdate=true;
}
// shot aura: cel flames licking up a cylinder around the striker
const AU_U={uTime:{value:0},uA:{value:0},uC:{value:new THREE.Color(C.marker)}};
const aura=new THREE.Mesh(new THREE.CylinderGeometry(.75,1.05,3,32,1,true).translate(0,1.5,0),new THREE.ShaderMaterial({uniforms:AU_U,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform float uTime,uA;uniform vec3 uC;varying vec2 vUv;
  void main(){float x=vUv.x*6.2832,y=vUv.y;
    float f=sin(x*7.+sin(y*5.-uTime*11.)*1.6)*.5+.5;f+=sin(x*13.-uTime*7.+y*9.)*.25;
    float h=f*(1.-y)*1.7-y*.4;float a=step(.55,h);float core=step(1.05,h);
    vec3 c=mix(uC,vec3(1.),core);gl_FragColor=vec4(c*a*uA,1.);}`}));
aura.visible=false;aura.renderOrder=5;scene.add(aura);let auraT=-1;
function auraOn(x,z,color){aura.position.set(x,0,z);AU_U.uC.value.set(color);auraT=performance.now();aura.visible=true;}
// goal light pillar: a tall beam out of the goal mouth
const pillar=new THREE.Mesh(new THREE.CylinderGeometry(2.6,3.4,40,32,1,true).translate(0,20,0),new THREE.MeshBasicMaterial({map:coneTex,color:C.marker,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
pillar.rotation.x=Math.PI;pillar.position.set(0,40,-15.6);pillar.visible=false;scene.add(pillar);let pillarT=-1;
function updateAnimeFx(now,dt){
  updateBursts(now);
  AU_U.uTime.value=now/1000;
  if(auraT>=0){const k=(now-auraT)/1300;if(k>=1){aura.visible=false;auraT=-1;}else{AU_U.uA.value=Math.min(1,k*6)*(1-k*k);aura.scale.set(1+k*.3,1+k*.5,1+k*.3);}}
  if(pillarT>=0){const k=(now-pillarT)/1600;if(k>=1){pillar.visible=false;pillarT=-1;}else{pillar.visible=true;pillar.material.opacity=Math.min(1,k*8)*(1-k)*.9;pillar.scale.set(1+k*.6,1,1+k*.6);}}
}

/* ---------- players: Kenney "Mini Characters" (CC0), recoloured per team, with procedural fallback ---------- */
// Kits: team 0 cream shirt / dark shorts, team 1 navy shirt / light shorts, both with accent trim and
// sleeves, plus a flat accent cap on the head (foosball style) that is round for team 0 and squared for
// team 1, so the top-down camera reads the team from the cap shape, the cap colour and the shirt tone.
const skinM=std({color:'#d6a47c',roughness:.7,flatShading:true}),hairM=std({color:'#2a1d16',roughness:.8,flatShading:true});
function makeCap(team,r,h){const T=TEAMS[team];let geo;
  if(T.shape==='circle')geo=new THREE.CylinderGeometry(r,r,h,40);
  else{const q=r*.95,c=q*.38,s=new THREE.Shape();s.moveTo(-q+c,-q);s.lineTo(q-c,-q);s.quadraticCurveTo(q,-q,q,-q+c);s.lineTo(q,q-c);s.quadraticCurveTo(q,q,q-c,q);s.lineTo(-q+c,q);s.quadraticCurveTo(-q,q,-q,q-c);s.lineTo(-q,-q+c);s.quadraticCurveTo(-q,-q,-q+c,-q);
    geo=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,curveSegments:6}).translate(0,0,-h/2).rotateX(-Math.PI/2);}
  // unlit, and converted to linear so the composite's tone curve hands back the exact accent: a lit cap
  // facing the sun washes out to near-white and loses the team colour
  const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:new THREE.Color(T.accent).convertSRGBToLinear()}));m.castShadow=true;m.name='team-cap';return m;}
function fallbackBody(g,team){const T=TEAMS[team],shirt=std({color:T.shirt,flatShading:true}),trimM=std({color:T.accent,flatShading:true}),shortsM=std({color:T.shorts});
  const legs=new THREE.Mesh(new THREE.CylinderGeometry(.3,.24,.8,6),shortsM);legs.position.y=.4;
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.56,.34,.9,6),shirt);body.position.y=1.24;
  const collar=new THREE.Mesh(new THREE.CylinderGeometry(.58,.58,.1,6),trimM);collar.position.y=1.66;
  const head=new THREE.Mesh(new THREE.IcosahedronGeometry(.25,0),skinM);head.position.y=1.92;
  const hair=new THREE.Mesh(new THREE.IcosahedronGeometry(.26,0),hairM);hair.position.y=2.02;hair.scale.y=.5;
  const cap=makeCap(team,.27,.08);cap.position.y=2.17;
  [legs,body,collar,head,hair,cap].forEach(m=>{m.castShadow=true;g.add(m);});}
function mkPlayer(team){const g=new THREE.Group();fallbackBody(g,team);g.visible=false;scene.add(g);return g;}
const T3=[0,1].map(t=>Array.from({length:7},()=>mkPlayer(t)));
const ANIM={idle:'idle',run:'sprint',kick:'attack-kick-right',jump:'jump',lift:'fall',yes:'emote-yes',no:'emote-no'};
// Builds one team's kit from Kenney's shared 512x512 colour atlas (32x128 px swatch cells) and a copy of
// the body mesh. Cells are classified from the mesh itself: torso+arm cells = shirt, torso-only cells =
// trim, the highest leg-only cell = shorts; cells the head mesh uses are never touched. Arm vertices on the
// shirt are moved to a spare cell painted in the accent (sleeves). Torso and arm vertices are pushed
// outward so the shoulders show around the head from above (the animations key bone scale, so this has
// to happen in the geometry, not on the bones).
function kitBody(src,body,head,team){
  const T=TEAMS[team],img=src.image,W=img.width,H=img.height,cvs=document.createElement('canvas');cvs.width=W;cvs.height=H;
  const g=cvs.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);
  const geo=body.geometry.clone(),uv=geo.attributes.uv,pos=geo.attributes.position,si=geo.attributes.skinIndex,sw=geo.attributes.skinWeight,bones=body.skeleton?body.skeleton.bones:[];
  const torso=bones.findIndex(b=>/torso/i.test(b.name)),isArm=bones.map(b=>/arm/i.test(b.name)),isLeg=bones.map(b=>/leg/i.test(b.name)),isHead=bones.map(b=>/head/i.test(b.name));
  if(!uv||!si||torso<0)return null;
  const CW=32,CH=128,NX=W/CW,NY=H/CH,comp=(a,i,k)=>k===0?a.getX(i):k===1?a.getY(i):k===2?a.getZ(i):a.getW(i);
  const cellKey=(u,v)=>Math.floor(clamp(u,0,.9999)*NX)+','+Math.floor(clamp(v,0,.9999)*NY);
  const dom=new Int16Array(uv.count),cells={};
  for(let i=0;i<uv.count;i++){let best=0,bi=-1;for(let k=0;k<4;k++){const w=comp(sw,i,k);if(w>best){best=w;bi=comp(si,i,k);}}dom[i]=bi;
    const c=cells[cellKey(uv.getX(i),uv.getY(i))]||(cells[cellKey(uv.getX(i),uv.getY(i))]={t:0,a:0,l:0,h:0,y:0,n:0});
    if(bi===torso)c.t++;else if(isArm[bi])c.a++;else if(isLeg[bi])c.l++;else if(isHead[bi])c.h++;c.y+=pos.getY(i);c.n++;}
  const headCells=new Set();const hu=head&&head.geometry.attributes.uv;if(hu)for(let i=0;i<hu.count;i++)headCells.add(cellKey(hu.getX(i),hu.getY(i)));
  const shirt=[],trim=[];let shorts=null,top=-Infinity;
  Object.entries(cells).forEach(([k,c])=>{if(headCells.has(k)||c.h)return;
    if(c.t>=5&&!c.l)(c.a?shirt:trim).push(k);
    else if(c.l>=5&&!c.t&&!c.a&&c.y/c.n>top){top=c.y/c.n;shorts=k;}});
  if(!shirt.length&&!trim.length)return null;
  const used=new Set([...Object.keys(cells),...headCells]);let spare=null;
  for(let y=0;y<NY&&!spare;y++)for(let x=0;x<NX;x++)if(!used.has(x+','+y)){spare=[x,y];break;}
  const xy=k=>k.split(',').map(Number);
  const paint=(k,hex)=>{const [cx,cy]=xy(k),d=g.getImageData(cx*CW,cy*CH,CW,CH),a=d.data,col=new THREE.Color(hex);
    for(let p=0;p<a.length;p+=4){const l=(a[p]*.3+a[p+1]*.59+a[p+2]*.11)/255,s=.72+l*.45;a[p]=clamp(col.r*255*s,0,255);a[p+1]=clamp(col.g*255*s,0,255);a[p+2]=clamp(col.b*255*s,0,255);}
    g.putImageData(d,cx*CW,cy*CH);};
  // sleeves: copy the shirt swatch into the spare cell (keeps its shading), then remap arm vertices onto it
  if(spare&&shirt.length){const [sx,sy]=xy(shirt[0]),src0=new Set(shirt);g.putImageData(g.getImageData(sx*CW,sy*CH,CW,CH),spare[0]*CW,spare[1]*CH);
    for(let i=0;i<uv.count;i++){if(!isArm[dom[i]])continue;const u=uv.getX(i),v=uv.getY(i),k=cellKey(u,v);if(!src0.has(k))continue;const [cx,cy]=xy(k);
      uv.setXY(i,(spare[0]*CW+(u*W-cx*CW))/W,(spare[1]*CH+(v*H-cy*CH))/H);}
    uv.needsUpdate=true;paint(spare[0]+','+spare[1],T.accent);}
  shirt.forEach(k=>paint(k,T.shirt));trim.forEach(k=>paint(k,T.accent));if(shorts)paint(shorts,T.shorts);
  for(let i=0;i<pos.count;i++){const b=dom[i];if(b===torso){pos.setX(i,pos.getX(i)*1.22);pos.setZ(i,pos.getZ(i)*1.08);}else if(isArm[b])pos.setX(i,pos.getX(i)*1.22);}
  pos.needsUpdate=true;geo.computeBoundingBox();geo.computeBoundingSphere();
  const t=new THREE.CanvasTexture(cvs);t.flipY=src.flipY;t.encoding=THREE.sRGBEncoding;t.magFilter=src.magFilter;t.minFilter=src.minFilter;t.wrapS=src.wrapS;t.wrapT=src.wrapT;
  return{tex:t,geo};
}
function loadPlayers(){
  if(!THREE.GLTFLoader||!THREE.SkeletonUtils)return;
  const gl=new THREE.GLTFLoader(LM),got=[];let left=ASSET.models.length;
  ASSET.models.forEach((url,mi)=>gl.load(url,g=>{got[mi]=g;if(--left===0)buildPlayers(got.filter(Boolean));},undefined,()=>{if(--left===0)buildPlayers(got.filter(Boolean));}));
}
function buildPlayers(list){
  if(!list.length)return;
  try{
    // one template per model per team, so clones share the team material
    const tpl=[0,1].map(team=>list.map(gltf=>{
      const root=THREE.SkeletonUtils.clone(gltf.scene);let skinned=null,headMesh=null,headBone=null;
      root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.frustumCulled=false;if(o.isSkinnedMesh&&/body/i.test(o.name))skinned=o;if(/head/i.test(o.name))headMesh=o;}if(o.isBone&&/^head$/i.test(o.name))headBone=o;});
      const anyMesh=skinned||(()=>{let m=null;root.traverse(o=>{if(!m&&o.isSkinnedMesh)m=o;});return m;})();
      const srcMap=anyMesh&&anyMesh.material&&anyMesh.material.map;
      const kit=srcMap&&srcMap.image?kitBody(srcMap,anyMesh,headMesh,team):null;
      if(kit)anyMesh.geometry=kit.geo;
      const mat=new THREE.MeshToonMaterial({map:kit?kit.tex:srcMap,gradientMap:GRAD,skinning:true});
      root.traverse(o=>{if(o.isMesh)o.material=mat;});
      const box=new THREE.Box3().setFromObject(root),h=box.max.y-box.min.y||1;root.scale.setScalar(2.05/h);
      // the team cap sits flat on top of the head and rides the head bone, so it follows every animation
      if(headMesh&&headBone){root.updateMatrixWorld(true);const hb=new THREE.Box3().setFromObject(headMesh),sz=hb.getSize(new V3()),ct=hb.getCenter(new V3());
        const cap=makeCap(team,Math.min(sz.x,sz.z)*.5,.1);cap.position.set(ct.x,hb.max.y+.04,ct.z);cap.updateMatrix();headBone.attach(cap);}
      return{root,clips:gltf.animations};}));
    [0,1].forEach(team=>T3[team].forEach((g,i)=>{
      const t=tpl[team][i%tpl[team].length],m=THREE.SkeletonUtils.clone(t.root);
      while(g.children.length)g.remove(g.children[0]);g.add(m);
      const mixer=new THREE.AnimationMixer(m),acts={};
      Object.entries(ANIM).forEach(([k,name])=>{const clip=THREE.AnimationClip.findByName(t.clips,name);if(clip)acts[k]=mixer.clipAction(clip);});
      ['kick','jump'].forEach(k=>{if(acts[k]){acts[k].setLoop(THREE.LoopOnce,1);acts[k].clampWhenFinished=true;}});
      g.userData={mixer,acts,cur:null,off:rnd(0,2)};
      if(acts.idle){acts.idle.play();acts.idle.time=g.userData.off;g.userData.cur='idle';}
    }));
  }catch(e){console.warn('FootSal: keeping the procedural players',e);}
}
function setAnim(g,k,restart){const u=g.userData;if(!u.acts||!u.acts[k])return;if(u.cur===k&&!restart)return;
  const next=u.acts[k],prev=u.cur&&u.acts[u.cur];next.reset();next.setEffectiveWeight(1);next.play();if(prev&&prev!==next)next.crossFadeFrom(prev,.18,false);u.cur=k;}
loadPlayers();

// ball: a real truncated-icosahedron pattern (12 black pentagons, 20 white hexagons with seams) painted on
// an equirect canvas from the Voronoi cells of the icosahedron's vertices and face centres
const BR=.22;
const ballTex=canvasTex(512,256,(g,w,h)=>{
  const t=(1+Math.sqrt(5))/2,V=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(v=>new V3(...v).normalize());
  const F=[];for(let a=0;a<12;a++)for(let b=a+1;b<12;b++)for(let c=b+1;c<12;c++)if(V[a].dot(V[b])>.4&&V[a].dot(V[c])>.4&&V[b].dot(V[c])>.4)F.push(V[a].clone().add(V[b]).add(V[c]).normalize());
  const cells=V.map(v=>({v,pent:1,w:1.012})).concat(F.map(v=>({v,pent:0,w:1})));
  const img=g.createImageData(w,h),d=img.data,p=new V3();
  for(let j=0;j<h;j++){const th=(j+.5)/h*Math.PI;for(let i=0;i<w;i++){const ph=(i+.5)/w*Math.PI*2;p.set(-Math.cos(ph)*Math.sin(th),Math.cos(th),Math.sin(ph)*Math.sin(th));
    let b1=-9,b2=-9,bc=null;for(const c of cells){const s=p.dot(c.v)*c.w;if(s>b1){b2=b1;b1=s;bc=c;}else if(s>b2)b2=s;}
    let v=bc.pent?28:244;if(b1-b2<.006)v=bc.pent?28:120;const k=(j*w+i)*4;d[k]=v;d[k+1]=v;d[k+2]=bc.pent?v+4:v-6;d[k+3]=255;}}
  g.putImageData(img,0,0);});
const ball=new THREE.Mesh(new THREE.SphereGeometry(BR,32,20),std({map:ballTex,roughness:.38,envMapIntensity:.8}));ball.castShadow=true;ball.position.set(0,BR,0);scene.add(ball);
const lastBall=new V3();

// painted overlay: pitch lines, plans, circles and ground signifiers, drawn in 2D and laid on the turf
let OVS=Q().ov;const ovc=document.createElement('canvas');ovc.width=Math.round(1.1*OVS);ovc.height=Math.round(1.66*OVS);
// ctx/OVS/OX/OY are the current drawing target: the turf overlay normally, a tutorial card's mini pitch
// while drawInto() runs (pitch units * OVS = pixels, (OX, OY) = where pitch (0, 0) sits, in pitch units)
let ctx=ovc.getContext('2d'),OX=.05,OY=.08;const ovTex=new THREE.CanvasTexture(ovc);ovTex.encoding=THREE.sRGBEncoding;ovTex.anisotropy=ANI;
const ovMesh=new THREE.Mesh(new THREE.PlaneGeometry(22,33.2),new THREE.MeshBasicMaterial({map:ovTex,transparent:true,depthWrite:false,toneMapped:false}));
ovMesh.rotation.x=-Math.PI/2;ovMesh.position.y=.03;ovMesh.renderOrder=2;scene.add(ovMesh);
const X3=x=>(x-.5)*20,Z3=y=>(y-.75)*20;

/* ---------- game rules ---------- */
const R=0.06,PR=0.045,M_PER_UNIT=20,WIN=3;
const SHAPES={5:{A:[[.5,1.33],[.22,1.02],[.78,1.02],[.5,.82],[.5,.5]],D:[[.5,.07],[.3,.3],[.7,.3],[.5,.48],[.5,.8]]},
              7:{A:[[.5,1.34],[.2,1.12],[.8,1.12],[.36,.86],[.64,.86],[.24,.56],[.76,.56]],D:[[.5,.07],[.28,.32],[.72,.32],[.5,.42],[.18,.62],[.82,.62],[.5,.82]]}};
const NEXT={setupA:'setupD',setupD:'planA',planA:'planD',planD:'ready'};
let S={phase:'menu',mode:null,n:5,score:[0,0],attacker:0,att:P(SHAPES[5].A),def:P(SHAPES[5].D),seq:[],shifts:[],names:['Home','Away']};

function distSeg(a,b,c){const dx=b.x-a.x,dy=b.y-a.y,L2=dx*dx+dy*dy||1e-9;const t=clamp(((c.x-a.x)*dx+(c.y-a.y)*dy)/L2,0,1);return Math.hypot(a.x+t*dx-c.x,a.y+t*dy-c.y);}
function segHit(a,b,c,r){const dx=b.x-a.x,dy=b.y-a.y,L2=dx*dx+dy*dy||1e-9,L=Math.sqrt(L2);if(distSeg(a,b,c)>=r)return null;
  const tc=((c.x-a.x)*dx+(c.y-a.y)*dy)/L2,perp=Math.abs((c.x-a.x)*dy-(c.y-a.y)*dx)/L;return clamp(tc-Math.sqrt(Math.max(0,r*r-perp*perp))/L,0,1);}
function pGoal(p){const d=Math.hypot(p.x-.5,p.y);return clamp(1.15-1.05*d,.05,.95);}
const metres=p=>Math.round(Math.hypot(p.x-.5,p.y)*M_PER_UNIT);
function shotTarget(sh,defs){let best=.5,bd=-1;for(let x=.4;x<=.6001;x+=.02){const t={x,y:0};let m=Infinity;defs.forEach(d=>m=Math.min(m,distSeg(sh,t,d)));if(m>bd){bd=m;best=x;}}return{x:best,y:0};}
function legsFor(att,defs,seq){const pts=seq.map(i=>att[i]),legs=[];for(let k=1;k<pts.length;k++)legs.push({a:pts[k-1],b:pts[k],shot:false,from:seq[k-1]});const sh=pts[pts.length-1];legs.push({a:sh,b:shotTarget(sh,defs),shot:true,from:seq[seq.length-1]});return legs;}
const inBox=p=>p.x>.2&&p.x<.8&&p.y<.26;
function keepOneInBox(arr,i){const p=arr[i];if(!inBox(p)||!arr.some((q,j)=>j!==i&&inBox(q)))return false;
  const dl=p.x-.2,dr=.8-p.x,dt=.26-p.y,m=Math.min(dl,dr,dt);arr[i]=m===dt?{x:p.x,y:.285}:(m===dl?{x:.175,y:p.y}:{x:.825,y:p.y});return true;}
function enforceBox(arr){let kept=false;arr.forEach((p,i)=>{if(inBox(p)){if(kept)keepOneInBox(arr,i);kept=true;}});return arr;}
function sweetFor(p){const d=Math.hypot(p.x-.5,p.y);return{c:.62,w:clamp(.32-d*.12,.16,.28)};}
function needle(now,t0){const f=((now-t0)/1900)%1;return f<.5?f*2:2-f*2;}
function powerQ(v,sw){const off=Math.abs(v-sw.c);if(off<=sw.w/2)return{q:1,kind:'sweet'};return{q:clamp(1-(off-sw.w/2)/.3,0,1),kind:v>sw.c?'over':'soft'};}
/* defender orders and the live simulation. Defenders take an order in their plan (hold zone, press the
   ball, mark an attacker; the keeper always keeps) and move during play. The whole play is simulated at
   60 steps a second before it is shown; o.track records defender (and running attacker) positions about
   30 times a second for the replay. A long chain can pull defenders out of shape, but it also gives them
   time to close in: keep that trade-off when tuning. Levers, biggest first: SPEED.press, REACT,
   PASS_R/TACKLE_R, ZONE_R (raise REACT before lowering speeds if pressing feels too strong). */
const SPEED={press:.14,mark:.13,zone:.10,keep:.12},REACT=.28,ZONE_R=.10,PASS_R=.036,TACKLE_R=.034,MARK_GAP=.055;
// built but off until the owner approves: attackers running on after passing, and long passes going astray
const RUN_V=0,RUN_D=.15,MISPLACE_ON=false,MIS_SAFE=.3,MIS_SLOPE=1.6;
const ORDER_NAME={keep:'GK',zone:'HOLD',press:'PRESS',mark:'MARK'};
const defaultOrders=n=>Array.from({length:n},(_,i)=>i?{t:'zone'}:{t:'keep'});
const keeperX=x=>clamp(.5+(x-.5)*.35,.4,.6);
function nearOnSeg(a,b,c){const dx=b.x-a.x,dy=b.y-a.y,L2=dx*dx+dy*dy||1e-9,t=clamp(((c.x-a.x)*dx+(c.y-a.y)*dy)/L2,0,1);return{x:a.x+dx*t,y:a.y+dy*t};}
// the ball on one leg at time t (seconds after kickoff): passes ease into the receiver, who traps it and
// nudges it toward the next ball during the hold; shots slow over the last 30% of their path
function legPos(L,t){const u=clamp((t-L.t0)/L.dur,0,1),f=L.shot?(u<.7?u/.7*.85:.85+.15*(u-.7)/.3):1-(1-u)*(1-u);
  let x=L.a.x+(L.b.x-L.a.x)*f,y=L.a.y+(L.b.y-L.a.y)*f;
  if(u>=1&&L.hold&&L.nb){const q=clamp((t-L.t0-L.dur)/L.hold,0,1),e=q*q*(3-2*q);x=L.b.x+(L.nb.x-L.b.x)*e;y=L.b.y+(L.nb.y-L.b.y)*e;}
  return{x,y,u,f};}
// the shot is judged the moment it is struck, from where everyone is then. Never show the percentage.
function settleShot(sh,defs,meter){
  const base=pGoal(sh),pw=meter&&meter.v!=null?powerQ(meter.v,meter.sw):{q:.4,kind:'rushed'};
  const strikeF=pw.kind==='sweet'?1.08:.25+.6*pw.q;
  const keeperF=1+clamp((Math.abs(defs[0].x-keeperX(sh.x))-.01)*7,0,.7);
  let near=Infinity;for(let i=1;i<defs.length;i++)near=Math.min(near,Math.hypot(defs[i].x-sh.x,defs[i].y-sh.y));
  const pressureF=near<.07?.7:(near>=.14?1.15:1);
  const p=clamp(base*strikeF*keeperF*pressureF,.03,.95),goal=Math.random()<p;
  const reason=keeperF>1.05?'The keeper was out of position.':(pressureF<1?'Shot under pressure.':(pressureF>1?'Plenty of space to shoot.':''));
  return{goal,pw,reason,missKind:goal?null:(pw.kind==='soft'?'soft':(pw.kind==='over'?'hard':'wide'))};
}
function orderTarget(o,i,D,home,A,ball,known){
  if(o.t==='keep')return{x:keeperX(ball.x),y:.05};
  if(o.t==='press')return{x:ball.x,y:ball.y};
  if(o.t==='mark'){const a=A[o.k]||A[0],gx=.5-a.x,gy=-a.y,l=Math.hypot(gx,gy)||1;return{x:a.x+gx/l*MARK_GAP,y:a.y+gy/l*MARK_GAP};}
  const h=home[i];let t=known?nearOnSeg(known.a,known.b,h):{x:h.x+(ball.x-h.x)*.15,y:h.y+(ball.y-h.y)*.15};
  const dx=t.x-h.x,dy=t.y-h.y,d=Math.hypot(dx,dy);if(d>ZONE_R)t={x:h.x+dx/d*ZONE_R,y:h.y+dy/d*ZONE_R};return t;
}
function simulate(att0,def0,seq,meter,orders){
  if(!seq.length)return{type:'noplan',anim:[],track:[],total:0};
  const n=def0.length,ord=orders||defaultOrders(n),D=clone(def0),home=clone(def0),A=clone(att0),home0=clone(att0);
  const step=1/60,anim=[],track=[],last=seq.length-1,running={};
  let t=0,frame=0,res=null,shot=null;
  const rec=()=>track.push(RUN_V>0?{t,d:clone(D),a:clone(A)}:{t,d:clone(D)});
  // legs are created when they are kicked, from the state at that moment
  const kick=(k,t0)=>{
    const from=seq[k],a=k===0?{...A[from]}:anim[k-1].nb||anim[k-1].b;
    if(k<last){const to=seq[k+1];delete running[to];if(RUN_V>0)running[from]=true;
      let b={...A[to]};const len=Math.hypot(b.x-a.x,b.y-a.y);let astray=false;
      if(MISPLACE_ON&&Math.random()<clamp((len-MIS_SAFE)*MIS_SLOPE,0,.6)){const s=Math.random()<.5?-1:1,ux=(b.x-a.x)/len,uy=(b.y-a.y)/len,off=rnd(.06,.12);
        b={x:clamp(b.x-uy*off*s+ux*.05,.02,.98),y:clamp(b.y+ux*off*s+uy*.05,.02,1.48)};astray=true;}
      const L={a,b,shot:false,from,to,t0,dur:Math.hypot(b.x-a.x,b.y-a.y)/.95+.25,hold:astray?0:.9,astray};
      const nt=k+1<last?A[seq[k+2]]:shotTarget(b,D),dx=nt.x-b.x,dy=nt.y-b.y,l=Math.hypot(dx,dy)||1;
      if(!astray)L.nb={x:b.x+dx/l*.016,y:b.y+dy/l*.016};
      anim.push(L);return L;}
    const sh={...A[from]};shot=settleShot(sh,D,meter);const tg=shotTarget(sh,D);let b;
    if(shot.goal)b={x:tg.x,y:-.035};else if(shot.missKind==='soft')b={x:tg.x,y:.035};else b={x:Math.random()<.5?.3:.7,y:-.035};
    const power=meter&&meter.v!=null?meter.v:.5,L={a,b,shot:true,from,t0,dur:Math.hypot(b.x-a.x,b.y-a.y)/(1.15+1.4*power)+.2,hold:0,sh,power};
    anim.push(L);return L;};
  let L=kick(0,0);rec();
  for(;;){
    t+=step;frame++;
    const end=L.t0+L.dur+L.hold;
    if(t>=end){
      if(L.shot){L.endT=L.t0+L.dur;L.end=L.b;break;}
      if(L.astray){L.endT=L.t0+L.dur;L.end=L.b;res={type:'astray'};break;}
      L.endT=end;L.end=L.nb||L.b;L=kick(anim.length,end);}
    const ball=legPos(L,t),holding=ball.u>=1&&!L.shot;
    // the last pass the defenders have read (they react REACT seconds after a kick, never to the plan)
    let known=null;for(let k=anim.length-1;k>=0;k--)if(!anim[k].shot&&t>=anim[k].t0+REACT){known=anim[k];break;}
    if(t>=REACT){const f=holding?.25:1;
      for(let i=0;i<n;i++){const o=ord[i]||{t:i?'zone':'keep'},tg=orderTarget(o,i,D,home,A,ball,known),dx=tg.x-D[i].x,dy=tg.y-D[i].y,d=Math.hypot(dx,dy),s=Math.min(d,(SPEED[o.t]||.1)*f*step);
        if(d>1e-6){D[i].x+=dx/d*s;D[i].y+=dy/d*s;}}}
    if(RUN_V>0)Object.keys(running).forEach(j=>{const h=home0[j];if(h.y-A[j].y<RUN_D)A[j].y=Math.max(.03,A[j].y-RUN_V*step);});
    // winning the ball: first defender to reach it, except just off the boot, as a pass arrives, or a shot in the air
    const moving=ball.u<1,safe=moving&&(ball.u<.06||(!L.shot&&ball.u>.85)||(L.shot&&ball.u>.45));
    if(!safe){const r=moving?PASS_R:TACKLE_R;let bi=-1,bd=r;
      for(let i=0;i<n;i++){if(i===0&&L.shot)continue;const d=Math.hypot(D[i].x-ball.x,D[i].y-ball.y);if(d<bd){bd=d;bi=i;}}
      if(bi>=0){L.endT=t;L.end={x:ball.x,y:ball.y};L.cut=true;res={type:'intercept',by:bi,kind:moving?'intercept':'tackle',onShot:L.shot,order:ord[bi]};break;}}
    if(frame%2===0)rec();
    if(t>40)break;
  }
  rec();
  const total=anim[anim.length-1].endT,base={anim,track,total,orders:ord};
  if(res)return Object.assign(base,res,{power:.5,shooter:shot&&L.shot?L.sh:null});
  const sh=anim[anim.length-1];
  return Object.assign(base,{type:shot.goal?'goal':'miss',pw:shot.pw,missKind:shot.missKind,shotKind:shot.goal?'sweet':shot.missKind,power:sh.power,shooter:sh.sh,reason:shot.reason});
}
function trackAt(tr,t,key){if(!tr.length)return null;if(t<=tr[0].t)return tr[0][key];const z=tr[tr.length-1];if(t>=z.t)return z[key];
  let lo=0,hi=tr.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(tr[m].t<=t)lo=m;else hi=m;}
  const a=tr[lo],b=tr[hi],k=(t-a.t)/(b.t-a.t||1);return a[key].map((p,i)=>({x:p.x+(b[key][i].x-p.x)*k,y:p.y+(b[key][i].y-p.y)*k}));}
// CPU defence orders, from the fuzzy attacker circles only: mark the circle(s) nearest goal, maybe press
// the deepest circle (likely the first ball carrier), everyone else holds
// (a mark is only given when that defender can reach the circle's mark point in time: FootSalRadial.markReach,
// which also only sees the fuzzy circles; otherwise the defender stays free for the press or holds)
function botOrders(fz,defs){const n=defs.length,ord=defaultOrders(n),free=new Set();for(let i=1;i<n;i++)free.add(i);
  const nearestFree=p=>{let bi=-1,bd=Infinity;free.forEach(i=>{const d=Math.hypot(defs[i].x-p.x,defs[i].y-p.y);if(d<bd){bd=d;bi=i;}});return bi;};
  const byGoal=fz.map((p,k)=>({k,d:Math.hypot(p.x-.5,p.y)})).sort((a,b)=>a.d-b.d);
  for(let j=0;j<(n>=7?2:1)*cpu().marks&&j<byGoal.length;j++){const c=fz[byGoal[j].k],i=nearestFree(c);if(i<0)break;
    if(window.FootSalRadial&&FootSalRadial.markReach(defs[i],[c],SPEED.mark,REACT)[0]!=='reach')continue;
    ord[i]={t:'mark',k:byGoal[j].k};free.delete(i);}
  if(Math.random()<cpu().press&&fz.length){const deep=fz.reduce((a,p)=>p.y>a.y?p:a,fz[0]),i=nearestFree(deep);if(i>0){ord[i]={t:'press'};free.delete(i);}}
  return ord;}
// CPU level tuning. med reproduces the original CPU exactly. top: how many of the best-scored pass chains
// it picks from at random; aim: strike-meter error in sweet-zone widths; marks/press: defensive orders.
const DIFF={easy:{top:8,aim:1.9,marks:0,press:.35},med:{top:3,aim:1.15,marks:1,press:.75},hard:{top:1,aim:.6,marks:1,press:.9}};
const cpu=()=>DIFF[SET.diff]||DIFF.med;
// bot: it only ever sees the fuzzy positions
function botSetupA(n){return P(SHAPES[n].A).map(p=>({x:clamp(p.x+rnd(-.07,.07),.06,.94),y:clamp(p.y+rnd(-.07,.07),.2,1.44)}));}
function botSetupD(n){const k=rnd(.85,1.25),sx=rnd(.85,1.1);return enforceBox(P(SHAPES[n].D).map((p,i)=>i?{x:clamp(.5+(p.x-.5)*sx+rnd(-.05,.05),.05,.95),y:clamp(p.y*k+rnd(-.05,.05),.05,1.45)}:p));}
const ZR=.18;
function fuzz(arr){return arr.map(p=>{const a=rnd(0,Math.PI*2),r=Math.sqrt(Math.random())*.13;return{x:clamp(p.x+Math.cos(a)*r,.03,.97),y:clamp(p.y+Math.sin(a)*r,.03,1.47)};});}
function botPlanD(att,def){const n=def.length,byY=att.slice().sort((a,b)=>a.y-b.y),along=(p,f)=>({x:p.x+(.5-p.x)*f,y:p.y*(1-f)}),tg=[];
  for(let i=0;i<n-1;i++){const a=byY[i%byY.length],b=byY[(i+1)%byY.length];tg.push(i%2?mid(a,b):along(a,.35));}
  tg.sort(()=>Math.random()-.5);const fin=clone(def),stay=1+Math.floor(Math.random()*(n-1));
  for(let i=1;i<n;i++){if(i===stay)continue;const t=tg[i-1];fin[i]={x:clamp(t.x+rnd(-.05,.05),.04,.96),y:clamp(t.y+rnd(-.05,.05),.04,1.46)};}
  enforceBox(fin);const out=[];for(let i=1;i<n;i++)if(fin[i].x!==def[i].x||fin[i].y!==def[i].y)out.push({i,...fin[i]});return out;}
function botPlanA(att,defs){const n=att.length,seqs=[];
  (function rec(s){if(s.length)seqs.push(s.slice());if(s.length===4)return;for(let i=0;i<n;i++){if(s.includes(i)||(!s.length&&inBox(att[i])))continue;s.push(i);rec(s);s.pop();}})([]);
  if(!seqs.length)return[];
  const sc=seqs.map(s=>{let safe=1;legsFor(att,defs,s).forEach(L=>{let m=Infinity;defs.forEach(d=>m=Math.min(m,distSeg(L.a,L.b,d)));safe*=clamp((m-R)/.12,0,1);});return{s,v:safe*pGoal(att[s[s.length-1]])+Math.random()*.03};});
  sc.sort((a,b)=>b.v-a.v);return sc[Math.floor(Math.random()*Math.min(cpu().top,sc.length))].s;}

/* ---------- flow ---------- */
const A=()=>S.attacker,D=()=>1-S.attacker;
const ctrl=ph=>({setupA:A(),planA:A(),setupD:D(),planD:D()})[ph];
const human=t=>S.mode==='2p'||t===0;
const who=t=>S.mode==='bot'?(t===0?'You':'CPU'):S.names[t];
let SCREEN='splash';
function setScreen(s){SCREEN=s;document.body.classList.toggle('ingame',s==='game');musicTick();camUI();}

// who controls a team, the mode line in the scoreboard, and every place the score is shown
const whoTag=t=>S.mode==='bot'?(t===0?'You':'CPU'):`Player ${t+1}`;
const modeText=()=>S.mode==='bot'?'VS CPU':'TWO PLAYER';
// the broadcast scoreboard as markup (the Kickoff page and the tutorial; the HUD has its own copy in the page)
const sbHTML=(s0,s1,mode,cls)=>`<div class="sb ${cls||''}" aria-label="Score"><div class="sb-team t0"><b class="sb-score">${s0}</b></div>
  <div class="sb-mid"><span>${esc(mode)}</span><small>FIRST TO 3</small></div><div class="sb-team t1"><b class="sb-score">${s1}</b></div></div>`;
function showScore(){[0,1].forEach(t=>{$('#s'+t).textContent=S.score[t];
    $('#n'+t).innerHTML=`<b>${esc(S.names[t])}</b><small><i class="chip t${t}"></i>${esc(whoTag(t))}</small>`;});
  $('#sbMode').textContent=modeText();}
function newGame(mode,names,n){
  const sh=SHAPES[n];
  S={mode,n,names,score:[0,0],attacker:0,lastHuman:null,note:'',teams:[{a:P(sh.A),d:P(sh.D)},{a:P(sh.A),d:P(sh.D)}]};
  showScore();paintBoards(names[0],names[1]);
  setScreen('game');$('#hud').hidden=false;startAttack();
}
function startAttack(){
  S.attackNo=(S.attackNo||0)+1;setTimeout(showScore,0);$('#replay').hidden=true;
  Object.assign(S,{att:clone(S.teams[A()].a),def:clone(S.teams[D()].d),seq:[],goalTapped:false,shotNag:false,shifts:[],orders:defaultOrders(S.n),acts:[],out:null,defPlay:null,note:'',fuzzA:null,fuzzD:null,meter:null,offside:null,flashA:'',flash:'',hLeg:-1,fx:false,paused:false,lesson:null});
  exciteT=.15;setCam(viewFor('setupA'));go('setupA');
}
function go(ph){
  S.phase=ph;uiReset();S.drag=null;S.deadline=null;S.flash='';S.flashA='';
  if(ph==='play'){startPlay();return;}
  if(ph==='planA'&&!S.fuzzD){S.fuzzD=fuzz(S.def);S.fuzzA=fuzz(S.att);}
  if(ph==='ready'){S.waiting=false;$('#hud').hidden=true;tipsFor('ready',kickoffPage);return;}
  const c=ctrl(ph);
  if(!human(c)){
    if(ph==='setupA')S.att=botSetupA(S.n);
    if(ph==='setupD')S.def=botSetupD(S.n);
    if(ph==='planA'){S.seq=botPlanA(S.att,S.fuzzD);if(S.seq.length){const sw=sweetFor(S.att[S.seq[S.seq.length-1]]);S.goalTapped=true;S.meter={t0:0,sw,v:clamp(sw.c+rnd(-cpu().aim,cpu().aim)*sw.w,0,1)};}}
    if(ph==='planD'){S.shifts=botPlanD(S.fuzzA,S.def);S.orders=botOrders(S.fuzzA,planPos());}
    finishPhase(true);return;
  }
  if(S.mode==='2p'&&S.lastHuman!==null&&S.lastHuman!==c){showHandoff(c);return;}
  begin();
}
function begin(){hideOv();S.waiting=false;S.lastHuman=ctrl(S.phase);S.dur=(S.phase.startsWith('plan')?SET.t2:SET.t1)*1000;S.deadline=S.mode==='2p'||!SET.clock?null:performance.now()+S.dur;S.lastSec=99;hud();
  // first time in this phase on this device: its card first (after the hand-off in two player, so each
  // player sees the cards for their own role), with the clock held
  const ph=S.phase,c=ctrl(ph);tipsFor(ph,()=>cutIn(c===A()?'attack':'defend',{c:TEAMC[c],sub:who(c)}));}
function finishPhase(fromBot){
  if(!NEXT[S.phase])return;
  if(S.phase==='setupA')S.teams[A()].a=clone(S.att);
  if(S.phase==='setupD')S.teams[D()].d=clone(S.def);
  if(S.phase==='planA'&&S.meter&&S.meter.v==null)S.meter.v=needle(performance.now(),S.meter.t0);
  go(NEXT[S.phase]);
}
function startPlay(){
  const dp=clone(S.def);S.shifts.forEach(s=>dp[s.i]={x:s.x,y:s.y});
  // the whole play (ball timeline, defender runs, who wins it, the shot) is simulated up front
  S.defPlay=dp;S.out=simulate(S.att,dp,S.seq,S.meter,S.orders);S.prevD=null;
  S.playStart=performance.now();S.resolved=false;S.hLeg=-1;S.rLeg=-1;S.fx=false;S.kickT={};S.stepT=0;
  hideOv();$('#hud').hidden=false;exciteT=.35;setCam(viewFor('play'));hud();
  cutIn('kickoff',{c:TEAMC[A()],sub:`${S.names[A()]} attack`});FX.speed=.6;
}
// Kickoff page, after the last side locks in (or the CPU finishes). It covers the pitch and shows only who
// attacks whom, the attack number and the score: nothing about either plan (in 'ready' the players, ball
// and pitch overlay are hidden as well). Behind it the camera sweeps low over the empty pitch and the
// crowd swells. Two player gets a 3-2-1 countdown after the tap; single player kicks off at once.
const WHISTLE='<svg viewBox="0 0 32 24" aria-hidden="true"><path d="M3 9.5a7.5 7.5 0 1 0 13.6 4.3l12.4-1.3V7.2L12 7.5A7.5 7.5 0 0 0 3 9.5z" fill="currentColor"/><circle cx="10.5" cy="12" r="2.6" fill="var(--ink)"/><path d="M14 3.5l1.6 2.4M19 2.5l.4 2.8M23.5 3.5l-1 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function kickoffPage(){const a=A(),d=D(),TA=TEAMS[a],TD=TEAMS[d];
  $('#hud').hidden=true;setCam('sweep');camUI();exciteT=.7;SFX.cheer(6);
  // two halftone team bands slide in from opposite sides around a VS burst (the cut-in look), then the
  // broadcast scoreboard; each band says who controls the team (You / CPU, or Player 1 / 2) and its role
  const band=(t,cls,role)=>{const T=TEAMS[t];return `<div class="kick-band ${cls}" style="--c:${T.accent};--on:${T.on}"><div class="kb-row"><i class="chip t${t}"></i>
      <b class="kb-name">${esc(S.names[t])}</b></div><span class="kb-tag">${esc(whoTag(t))} · ${role}</span></div>`;};
  const burstPts=Array.from({length:32},(_,i)=>{const r=i%2?30:50,an=i/32*Math.PI*2;return `${(60+Math.cos(an)*r).toFixed(1)},${(60+Math.sin(an)*r).toFixed(1)}`;}).join(' ');
  showOv(`<div class="kick" style="--ta:${TA.accent};--td:${TD.accent}"><div class="kick-lines"></div>
    <p class="kick-tag"><span lang="ja">キックオフ</span>Attack ${S.attackNo} · ${esc(S.names[a])} attack</p>
    ${band(a,'kb-a','Attacking')}
    <div class="kick-vs"><svg viewBox="0 0 120 120" aria-hidden="true"><polygon points="${burstPts}"/></svg><b>VS</b></div>
    ${band(d,'kb-d','Defending')}
    ${sbHTML(S.score[0],S.score[1],modeText(),'kick-sb')}
    <div class="kick-count" id="kcount" aria-live="assertive"></div>
    <button class="kick-btn" id="ko" type="button">${WHISTLE}<span>Kick off</span></button></div>`,'kickoff');
  $('#ko').onclick=()=>{const b=$('#ko');if(b.disabled)return;b.disabled=true;SFX.whistle(1);buzz(25);
    if(S.mode!=='2p'){go('play');return;}
    b.classList.add('gone');$('.kick').classList.add('counting');let n=3;const el=$('#kcount');
    const step=()=>{if(S.phase!=='ready')return;if(n===0){go('play');return;}
      el.textContent=n;el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');
      SFX.thud();SFX.cheer(3);exciteT=Math.min(1,exciteT+.1);buzz(15);n--;setTimeout(step,700);};
    step();};}
function resolve(){
  S.resolved=true;S.phase='result';
  const o=S.out,att=S.names[A()],def=S.names[D()],m=o.shooter?metres(o.shooter):0;
  const rushed=o.pw&&o.pw.kind==='rushed'?' The strike was rushed.':'',why=o.reason?' '+o.reason:'';
  let h,p,lesson='';
  if(o.type==='goal'){S.score[A()]++;h='Goal!';p=`${esc(att)} score from ${m} m. ${o.pw.kind==='sweet'?'Perfect strike.':'Scrappy, but it went in.'}${why}${rushed}`;
    const el=$('#s'+A());el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');}
  else if(o.type==='miss'){h={hard:'Too hard',soft:'Too soft',wide:'Wide'}[o.missKind];
    p={hard:`Struck too hard from ${m} m. It flew wide.`,soft:`Too soft from ${m} m. The keeper saved it.`,wide:`It drifted wide from ${m} m.`}[o.missKind]+why+rushed;}
  else if(o.type==='intercept'){const od=o.order||{t:'zone'},ev=o.onShot?'shot':o.kind;
    h={shot:'Blocked',tackle:'Tackled',intercept:'Intercepted'}[ev];
    const how={press:'pressed and',mark:`marked #${(od.k||0)+1} and`,zone:'held and',keep:'rushed out and'}[od.t]||'';
    const what={shot:'blocked the shot',tackle:'won the ball',intercept:'cut out the pass'}[ev];
    p=`${esc(def)} #${o.by+1} ${how} ${what}.`;
    // the player's first lost ball ever: one line on why, and a pulsing ring on that defender in the replay
    if(human(A())&&!TIP.seen.lostBall){markSeen(['lostBall']);S.lesson=o.by;
      const verb={press:'was pressing',mark:`was marking #${(od.k||0)+1}`,zone:'was holding its zone',keep:'came off the line'}[od.t]||'was there';
      lesson=`#${o.by+1} ${verb} and ${{shot:'got in front of the shot',tackle:'reached the ball',intercept:'reached the pass'}[ev]}.`;}}
  else if(o.type==='astray'){h='Misplaced';p='The pass went astray.';}
  else{h='No plan';p=`${esc(att)} had no pass chain set.`;cutIn('noplan');}
  showScore();
  const over=S.score[A()]>=WIN;
  const card=()=>{S.phase='result';
    showOv(`<div class="card"><h2 class="hl" style="color:${o.type==='goal'?C.marker:C.chalk}">${h}</h2><p>${p}</p>${lesson?`<p class="why">${lesson}</p>`:''}<button class="prime" id="nx" type="button">${over?'See the result':'Next attack'}</button></div>`,'low');
    $('#nx').onclick=()=>{SFX.tap();if(over)return gameOver();S.attacker=D();startAttack();};
    hud();};
  // a goal is replayed first (skippable); everything else goes straight to the result card
  if(o.type==='goal')startReplay(card);else card();
}
// Goal replay: the same simulated play again at REPLAY_RATE, from a low broadcast camera, with a REPLAY
// badge and a Skip button. When it ends (or is skipped) the result card appears.
function startReplay(then){Object.assign(S,{phase:'replay',rpStart:performance.now(),afterReplay:then,hLeg:-1,rLeg:-1,fx:false,kickT:{},prevD:null});
  setCam('replay');$('#replay').hidden=false;$('#controls').classList.add('off');hud();}
function endReplay(){if(S.phase!=='replay')return;$('#replay').hidden=true;setCam(viewFor('result'));
  const f=S.afterReplay;S.afterReplay=null;S.phase='result';if(f)f();}
$('#rpSkip').onclick=()=>{SFX.tap();endReplay();};
function gameOver(){
  const w=S.score[0]>S.score[1]?0:1;S.phase='over';hud();SFX.whistle(3,true);SFX.cheer(14);exciteT=.9;fireworks(w);
  if(S.mode==='bot'&&w===1)cutIn('lose',{sub:`${S.names[1]} take it`});else cutIn('win',{c:TEAMC[w],t:S.mode==='bot'?'VICTORY!!':'WINNER!!',sub:S.names[w]});
  const head=S.mode==='bot'?(w===0?'You win':'The CPU wins'):`${esc(S.names[w])} win`;
  showOv(`<div class="card"><h2 class="hl" style="color:${TEAMS[w].text}">${head}</h2><p>${esc(S.names[0])} ${S.score[0]} – ${S.score[1]} ${esc(S.names[1])}</p><button class="prime" id="again" type="button">Rematch</button><button class="ghost" id="tomenu" type="button">Main menu</button></div>`,'dim');
  $('#again').onclick=()=>{SFX.tap();newGame(S.mode,S.names,S.n);};$('#tomenu').onclick=()=>{SFX.tap();mainMenu();};
}

/* ---------- overlays & screens ---------- */
const ov=$('#ov');ov.hidden=true;
function showOv(html,mode){ov.innerHTML=html;ov.className=mode||'';ov.hidden=false;}
function hideOv(){ov.hidden=true;ov.innerHTML='';}
function showHandoff(c){S.waiting=true;hud();
  showOv(`<div class="card"><h2 style="color:${TEAMS[c].text}">Pass to ${esc(S.names[c])}</h2><p>${esc(S.names[1-c])}, look away. Your plan stays secret.</p><button class="prime" id="ready" type="button">I'm ready</button></div>`,'solid');
  $('#ready').onclick=()=>{SFX.tap();begin();};}
const DIE='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.6" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.6" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.6" fill="currentColor"/></svg>';

function splash(){setScreen('splash');$('#hud').hidden=true;setCam('orbit');lineupMenu();
  showOv(`<div class="splash"><h1 class="logo">Foot<span>Sal</span><small lang="ja">フットサル</small></h1><p class="tag">Plan in secret. Pass in the open.</p><div class="load${loadDone?' done':''}" id="loadbar"><i style="width:${(loadPct*100).toFixed(0)}%"></i></div><p class="status" id="status">${esc(status)}</p><button class="prime big pulse" id="enter" type="button">Tap to enter</button></div>`,'dim');
  $('#enter').onclick=()=>{audioInit();SFX.whistle(1);SFX.anime.kickoff();exciteT=.3;
    if(TIP.intro){mainMenu();return;}
    // first launch: three intro cards, then straight into a single player match (Skip tutorial: the menu)
    TIP.intro=true;saveTips();
    openTips(INTRO,'intro',why=>{if(why==='skip'){mainMenu();return;}const a=randName(),b=randName(a);SFX.whistle(1);newGame('bot',[a,b],SET.players);});};}
function mainMenu(){setScreen('menu');$('#hud').hidden=true;setCam('orbit');lineupMenu();exciteT=.15;S.phase='menu';
  showOv(`<div class="card menu"><h1 class="logo">Foot<span>Sal</span></h1><nav>
    <button class="prime" id="m1" type="button">Play single player</button>
    <button class="ghost" id="m2" type="button">Play two player</button>
    <button class="ghost" id="m6" type="button">How to play</button>
    <button class="ghost" id="m3" type="button">Settings</button>
    <button class="ghost" id="m5" type="button">Credits</button>
    <button class="ghost" id="m4" type="button">Quit</button></nav><p class="foot">Made by <a class="credit" href="https://www.ankitpassi.in" target="_blank" rel="noopener">Ankit Passi</a></p></div>`,'dim');
  $('#m1').onclick=()=>{SFX.tap();setup('bot');};$('#m2').onclick=()=>{SFX.tap();setup('2p');};$('#m3').onclick=()=>{SFX.tap();settings();};$('#m4').onclick=()=>{SFX.tap();quit();};$('#m5').onclick=()=>{SFX.tap();credits();};
  $('#m6').onclick=()=>{SFX.tap();setScreen('howto');openTips(DECK,'deck',()=>mainMenu());};}
// segmented choices shared by the setup and settings cards
const seg=(id,opts,val)=>`<div class="seg" id="${id}">${opts.map(([v,l])=>`<button type="button" data-v="${v}" aria-pressed="${String(val)===String(v)}">${l}</button>`).join('')}</div>`;
const bindSeg=(id,f)=>{$('#'+id).onclick=e=>{const b=e.target.closest('button');if(!b)return;SFX.tap();$('#'+id).querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));f(b.dataset.v);saveSet();};};
const CLOCKS=[[5,'5 s'],[10,'10 s'],[15,'15 s'],[20,'20 s'],[30,'30 s']];
// single player clock: on with a time for Set up and Plan, or off (each turn waits for Done / Lock in)
const clockSummary=()=>SET.clock?`Clock: ${SET.t1} s / ${SET.t2} s`:'Clock: off';
const clockNote=()=>SET.clock?`${SET.t1} s to set up, ${SET.t2} s to plan. Change the times in Settings.`:'Each turn waits for Done or Lock in.';
function setup(mode){setScreen('setup');
  const n0=randName(),n1=randName(n0);
  showOv(`<div class="card"><h2>${mode==='bot'?'Single player':'Two player'}</h2>
    <div class="field"><label class="lab" for="tn0"><span class="chip t0"></span>${mode==='bot'?'Your team':'Player 1 team'}</label>
      <div class="row"><input type="text" id="tn0" maxlength="18" value="${esc(n0)}" autocomplete="off"><button class="dice" id="r0" type="button" aria-label="Random name">${DIE}</button></div></div>
    <div class="field"><label class="lab" for="tn1"><span class="chip t1"></span>${mode==='bot'?'CPU team':'Player 2 team'}</label>
      <div class="row"><input type="text" id="tn1" maxlength="18" value="${esc(n1)}" autocomplete="off" ${mode==='bot'?'readonly':''}><button class="dice" id="r1" type="button" aria-label="Random name">${DIE}</button></div></div>
    <div class="field"><span class="lab">Players per side</span><div class="seg" id="pc"><button type="button" data-n="5" aria-pressed="${SET.players===5}">5 a side</button><button type="button" data-n="7" aria-pressed="${SET.players===7}">7 a side</button></div></div>
    ${mode==='bot'?`<div class="field"><span class="lab">CPU level</span>${seg('df',[['easy','Easy'],['med','Medium'],['hard','Hard']],SET.diff)}</div>`:''}
    ${mode==='bot'?`<div class="field"><span class="lab">Clock</span>${seg('sck',[['1','On'],['0','Off']],SET.clock?1:0)}<p class="setup-sum" id="ckSum">${clockNote()}</p></div>`:'<p class="setup-sum">No clock. Pass the phone between turns.</p>'}
    <p class="foot">First to 3 goals.</p>
    <button class="prime" id="start" type="button">Kick off match</button><button class="ghost" id="back" type="button">Back</button></div>`,'dim');
  if(mode==='bot'){bindSeg('df',v=>SET.diff=v);
    bindSeg('sck',v=>{SET.clock=v==='1';$('#ckSum').textContent=clockNote();});}
  $('#r0').onclick=()=>{SFX.tap();$('#tn0').value=randName($('#tn1').value);};
  $('#r1').onclick=()=>{SFX.tap();$('#tn1').value=randName($('#tn0').value);};
  $('#pc').onclick=e=>{const b=e.target.closest('button');if(!b)return;SFX.tap();SET.players=+b.dataset.n;saveSet();$('#pc').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));lineupMenu();};
  $('#back').onclick=()=>{SFX.tap();mainMenu();};
  $('#start').onclick=()=>{const a=$('#tn0').value.trim()||randName(),b=$('#tn1').value.trim()||randName(a);SFX.whistle(1);newGame(mode,[a,b],SET.players);};
}
function settings(){setScreen('settings');
  showOv(`<div class="card"><h2>Settings</h2>
    <div class="field"><span class="lab">Camera</span>${seg('cm',[['top','Top-down'],['iso','Isometric'],['chase','Behind the play']],SET.cam)}</div>
    <div class="field"><span class="lab">Quality</span>${seg('gq',[['standard','Standard'],['high','High'],['ultra','Ultra-high']],SET.quality)}
      <p class="foot">Higher looks sharper but needs a stronger device.</p><p class="foot" id="qstat" aria-live="polite"></p></div>
    <h3 class="sec">Audio</h3>
    <div class="field"><label class="lab" for="vs">Sound effects<span class="val" id="vsv">${SET.sfx}</span></label><input type="range" id="vs" min="0" max="100" value="${SET.sfx}"></div>
    <div class="field"><label class="lab" for="vc">Crowd<span class="val" id="vcv">${SET.crowd}</span></label><input type="range" id="vc" min="0" max="100" value="${SET.crowd}"></div>
    <div class="field"><label class="lab" for="vm">Music<span class="val" id="vmv">${SET.music}</span></label><input type="range" id="vm" min="0" max="100" value="${SET.music}"></div>
    <div class="field"><span class="lab">Haptics</span>${seg('hp',[['1','On'],['0','Off']],SET.haptics?1:0)}</div>
    <h3 class="sec">Clock</h3>
    <div class="field"><span class="lab">Clock in single player</span>${seg('ck',[['1','On'],['0','Off']],SET.clock?1:0)}</div>
    <div class="field clk${SET.clock?'':' off'}"><span class="lab">Set up</span>${seg('t1',CLOCKS,SET.t1)}</div>
    <div class="field clk${SET.clock?'':' off'}"><span class="lab">Plan</span>${seg('t2',CLOCKS,SET.t2)}</div>
    <p class="foot">Off: each turn waits until you tap Done or Lock in.</p>
    <h3 class="sec">Tips</h3>
    <button class="ghost" id="tipsAgain" type="button">Show tips again</button><p class="foot" id="tipsMsg" aria-live="polite"></p>
    <button class="prime" id="back" type="button">Back</button></div>`,'dim');
  $('#tipsAgain').onclick=()=>{SFX.tap();TIP.seen={};saveTips();$('#tipsMsg').textContent='Done. Each tip shows again the next time you reach it.';};
  // with the clock off the time choices stay visible but greyed out and can't be changed
  const clockUI=()=>document.querySelectorAll('.clk').forEach(f=>{f.classList.toggle('off',!SET.clock);f.querySelectorAll('button').forEach(b=>{b.disabled=!SET.clock;});});
  clockUI();bindSeg('ck',v=>{SET.clock=v==='1';clockUI();});bindSeg('t1',v=>SET.t1=+v);bindSeg('t2',v=>SET.t2=+v);
  $('#vs').oninput=e=>{SET.sfx=+e.target.value;$('#vsv').textContent=SET.sfx;applyVolumes();saveSet();};
  $('#vs').onchange=()=>SFX.kick(.6);
  $('#vc').oninput=e=>{SET.crowd=+e.target.value;$('#vcv').textContent=SET.crowd;applyVolumes();saveSet();};
  $('#vc').onchange=()=>{audioInit();SFX.cheer(4);};
  $('#vm').oninput=e=>{SET.music=+e.target.value;$('#vmv').textContent=SET.music;applyVolumes();saveSet();};
  bindSeg('hp',v=>{SET.haptics=v==='1';buzz(30);});bindSeg('cm',v=>SET.cam=v);bindSeg('gq',v=>{SET.quality=v;applyQuality();});qualStatus();
  $('#back').onclick=()=>{SFX.tap();mainMenu();};}
function credits(){setScreen('credits');
  const a=(href,t)=>`<a href="${href}" target="_blank" rel="noopener">${t}</a>`;
  showOv(`<div class="card"><h2>Credits</h2><ul class="credits">
    <li><b>Game</b>${a('https://www.ankitpassi.in','Ankit Passi')}</li>
    <li><b>Sky and light</b>${a('https://polyhaven.com/a/blouberg_sunrise_2','Blouberg Sunrise 2')} by Greg Zaal, Poly Haven, CC0</li>
    <li><b>Textures</b>Leafy Grass, Concrete Floor 02, Rubberized Track and Corrugated Iron 02 from ${a('https://polyhaven.com/textures','Poly Haven')}, CC0</li>
    <li><b>Players</b>${a('https://kenney.nl/assets/mini-characters','Mini Characters')} by Kenney, CC0</li>
    <li><b>Kicks and touches</b>${a('https://kenney.nl/assets/impact-sounds','Impact Sounds')} by Kenney, CC0</li>
    <li><b>Crowd</b>${a('https://opengameart.org/content/free-crowd-cheering-sounds','Free Crowd Cheering Sounds')} by Gregor Quendel, ${a('https://creativecommons.org/licenses/by/4.0/','CC BY 4.0')}, trimmed and re-encoded</li>
    <li><b>Music</b>${a('https://opengameart.org/content/diamond-race','Diamond Race')} by iamoneabe, CC0, trimmed</li>
    <li><b>Engine and type</b>three.js (MIT). Bangers, Dela Gothic One, Barlow Condensed and Permanent Marker (OFL).</li>
  </ul><button class="prime" id="back" type="button">Back</button></div>`,'dim');
  $('#back').onclick=()=>{SFX.tap();mainMenu();};}
function quit(){setScreen('quit');exciteT=.05;
  showOv(`<div class="card"><h2>Thanks for playing</h2><p>Close this tab whenever you're done.</p><button class="prime" id="back" type="button">Back to menu</button></div>`,'dim');
  $('#back').onclick=()=>{SFX.tap();mainMenu();};}
function pauseGame(){
  if(SCREEN!=='game'||!ov.hidden||S.phase==='replay')return;
  const now=performance.now();S.paused=true;S.pauseLeft=S.deadline?S.deadline-now:null;S.deadline=null;
  // team 1 on a band at the top, team 2 at the bottom, each with name, score, who controls it and its
  // role this attack; the card between says what you're doing (single player)
  const band=t=>`<div class="pz-band pz-t${t}" style="--c:${TEAMS[t].accent};--on:${TEAMS[t].on}"><i class="chip t${t}"></i>
      <span class="pz-name"><b>${esc(S.names[t])}</b><small>${esc(whoTag(t))} · ${t===A()?'Attacking':'Defending'}</small></span><span class="pz-score">${S.score[t]}</span></div>`;
  const role=S.mode==='bot'?`<p class="pz-role">You: <b>${A()===0?'Attack':'Defend'}</b></p>`:`<p class="pz-role">${esc(S.names[A()])} attack</p>`;
  showOv(`<div class="pz">${band(0)}<div class="card pz-card"><span class="pz-jp" lang="ja">一時停止</span><h2 class="hl">Paused</h2>${role}
    <button class="prime" id="res" type="button">Resume</button><button class="ghost" id="rst" type="button">Restart match</button><button class="ghost" id="mm" type="button">Main menu</button></div>${band(1)}</div>`,'pause');
  $('#res').onclick=()=>{SFX.tap();hideOv();S.paused=false;if(S.pauseLeft!=null)S.deadline=performance.now()+S.pauseLeft;};
  $('#rst').onclick=()=>{SFX.tap();newGame(S.mode,S.names,S.n);};
  $('#mm').onclick=()=>{SFX.tap();mainMenu();};
}
$('#pause').onclick=pauseGame;
function lineupMenu(){$('#replay').hidden=true;const n=SET.players;S.phase='menu';S.deadline=null;S.waiting=false;S.paused=false;S.drag=null;S.meter=null;S.defPlay=null;S.fx=false;S.kickT=null;S.n=n;S.att=P(SHAPES[n].A);S.def=P(SHAPES[n].D);S.attacker=0;S.seq=[];S.shifts=[];S.out=null;}

/* ---------- HUD text ---------- */
function hud(){
  const ph=S.phase,ttl=$('#title'),hint=$('#hint'),c=ctrl(ph),col=c===undefined?C.chalk:TEAMS[c].text;
  ttl.style.setProperty('--tc',col);
  const showCtl=['setupA','setupD','planA','planD'].includes(ph)&&!S.waiting;
  $('#controls').classList.toggle('off',!showCtl);
  $('#timer').classList.toggle('off',!showCtl||S.mode==='2p'||!SET.clock);
  $('#timer').style.setProperty('--wc',col);
  $('#phl').textContent=c===A()?'ATTACK':'DEFENCE';
  $('#undo').hidden=!ph.startsWith('plan'); // no Undo while setting positions, so Done takes the full row
  $('#go').textContent=ph.startsWith('plan')?'Lock in':'Done';
  // titles name what the player does; hints are one short line saying what to do next (the tutorial
  // explains the rest). In two player the title carries the team, since the phone changes hands.
  const two=S.mode==='2p'&&c!==undefined,tt=s=>two?`${S.names[c]}: ${s}`:s;
  if(S.waiting){ttl.textContent=`Over to ${S.names[c]}`;hint.textContent=`Pass the phone to ${S.names[c]}.`;}
  else if(ph==='setupA'){ttl.textContent=tt('Set up your attack');hint.textContent='Drag your players into place, then tap Done.';}
  else if(ph==='setupD'){ttl.textContent=tt('Set up your defence');hint.textContent=S.flash||'Drag your defenders into place, then tap Done.';}
  else if(ph==='planA'){ttl.textContent=tt('Plan your attack');
    if(S.flashA)hint.textContent=S.flashA;
    else if(!S.seq.length)hint.textContent='Tap who starts, then who they pass to.';
    else if(S.goalTapped&&S.meter&&S.meter.v==null)hint.textContent='Tap when the needle is in the yellow for a perfect shot, or tap Lock in to shoot now.';
    else if(S.goalTapped)hint.textContent='Tap Lock in, or Undo to strike again.';
    else hint.textContent='Tap a teammate to pass, or the goal to shoot.';}
  else if(ph==='planD'){ttl.textContent=tt('Plan your defence');hint.textContent=S.flash||'Tap a defender for orders, or drag to move them.';}
  else if(ph==='play'){ttl.textContent='Kick off';hint.textContent='Watch both plans play out.';}
  else if(ph==='replay'){ttl.textContent='Goal replay';hint.textContent='Tap Skip replay to see the result.';}
  else if(ph==='result'){ttl.textContent='Replay';hint.textContent='Check the replay, then tap Next attack.';}
  else if(ph==='over'){ttl.textContent='Full time';hint.textContent='Tap Rematch to play again.';}
  camUI();requestAnimationFrame(measure);
}

/* ---------- input ---------- */
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),gplane=new THREE.Plane(new V3(0,1,0),0),hitP=new V3();
function world(e){const r=cv.getBoundingClientRect();ndc.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(ndc,cam);
  if(!ray.ray.intersectPlane(gplane,hitP))return{x:-9,y:-9};return{x:hitP.x/20+.5,y:hitP.z/20+.75};}
function hit(arr,p,rad=.08){let best=-1,bd=rad;arr.forEach((q,i)=>{const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;best=i;}});return best;}
function planPos(){const fin=clone(S.def);S.shifts.forEach(x=>fin[x.i]={x:x.x,y:x.y});return fin;}
function strike(){const now=performance.now();if(S.phase==='planA'&&S.meter&&S.meter.v==null){S.meter.v=needle(now,S.meter.t0);SFX.kick(.4);buzz(25);hud();
  if(powerQ(S.meter.v,S.meter.sw).kind==='sweet')cutIn('sweet',{c:C.marker});}}
$('#meter').addEventListener('pointerdown',e=>{e.preventDefault();strike();});
cv.addEventListener('pointerdown',e=>{
  if(SCREEN!=='game'||S.waiting||!ov.hidden)return;
  const p=world(e),ph=S.phase;
  if(ph==='setupA'||ph==='setupD'){const arr=ph==='setupA'?S.att:S.def,i=hit(arr,p);if(i>=0){S.drag={arr,i};cv.setPointerCapture(e.pointerId);SFX.tap();buzz(8);}}
  else if(ph==='planA'){
    const now=performance.now();
    if(S.goalTapped){strike();return;}
    const i=hit(S.att,p,.075);
    if(i>=0){
      if(!S.seq.length&&inBox(S.att[i])){S.offside={i,t:now};S.flashA='Offside. Pick someone outside the box to start.';SFX.whistle(1);cutIn('offside',{c:C.red,sub:`#${i+1} can't start in the box`});buzz([20,30,20]);hud();return;}
      S.flashA='';if(S.seq[S.seq.length-1]!==i&&S.seq.length<7){S.seq.push(i);SFX.tap();buzz(12);}
    } else if(S.seq.length&&p.y<.16&&p.x>.2&&p.x<.8){S.goalTapped=true;S.flashA='';S.meter={t0:now,sw:sweetFor(S.att[S.seq[S.seq.length-1]]),v:null};SFX.tap();buzz(18);}
    hud();
  }
  else if(ph==='planD')radialDown(e);
});
function setOrder(i,o){S.acts.push({k:'order',i,prev:S.orders[i]});S.orders[i]=o;SFX.tap();buzz(12);}
// defender kickoff move (Phase 2 drag): unchanged rules, one defender in the D, shifts against the shape
function dragDefender(i,p){const fin=planPos();fin[i]={x:clamp(p.x,.04,.96),y:clamp(p.y,.04,1.46)};
  if(keepOneInBox(fin,i)&&!S.gaWarned){S.gaWarned=true;S.flash='Only one defender is allowed in the box.';buzz(20);hud();}
  S.shifts=S.shifts.filter(x=>x.i!==i);if(Math.hypot(fin[i].x-S.def[i].x,fin[i].y-S.def[i].y)>.01)S.shifts.push({i,...fin[i]});}
cv.addEventListener('pointermove',e=>{
  if(ui.state!=='idle'){radialMove(e);return;}
  if(!S.drag)return;const p=world(e);
  const isA=S.drag.arr===S.att;S.drag.arr[S.drag.i]={x:clamp(p.x,.04,.96),y:clamp(p.y,isA?.2:.04,1.46)};
  if(!isA&&keepOneInBox(S.drag.arr,S.drag.i)&&!S.gaWarned){S.gaWarned=true;S.flash='Only one defender is allowed in the box.';buzz(20);hud();}
});
const endDrag=e=>{if(ui.state!=='idle'){radialUp(e);return;}const was=S.drag;S.drag=null;S.gaWarned=false;if(!was)return;SFX.step();hud();};
cv.addEventListener('pointerup',endDrag);
cv.addEventListener('pointercancel',e=>{if(ui.state!=='idle'){radialCancel(e);return;}endDrag(e);});
$('#go').onclick=()=>{SFX.tap();if(S.phase==='planD'){uiReset();S.flash='';}
  // an attack has to end in a shot: Lock in walks the player through it rather than firing a rushed one
  // (the clock running out still locks whatever is set, as before)
  if(S.phase==='planA'&&S.goalTapped&&S.meter&&S.meter.v==null){shootAndLock();return;}
  if(S.phase==='planA'&&!shotReady()){shotPrompt();return;}
  finishPhase();};
const shotReady=()=>S.seq.length&&S.goalTapped&&S.meter&&S.meter.v!=null;
// Lock in while the needle is still running takes the strike where the needle is, shows it, then locks in
function shootAndLock(){strike();$('#go').disabled=true;
  setTimeout(()=>{$('#go').disabled=false;if(S.phase==='planA'&&shotReady())finishPhase();},650);}
function shotPrompt(){buzz([20,40,20]);
  if(!S.seq.length)S.flashA='Tap who starts with the ball first.';
  else if(!S.goalTapped){S.shotNag=true;S.flashA='Take your shot: tap the goal.';cutIn('takeshot',{c:C.marker});}
  else S.flashA='Tap when the needle is in the yellow for a perfect shot.';
  hud();}
$('#undo').onclick=()=>{SFX.tap();
  if(S.phase==='planA'){S.flashA='';if(S.goalTapped&&S.meter&&S.meter.v!=null){S.meter.v=null;S.meter.t0=performance.now();}else if(S.goalTapped){S.goalTapped=false;S.meter=null;}else S.seq.pop();}
  // planD undo walks back the last order or the last move, whichever came last
  if(S.phase==='planD'){S.flash='';uiReset();const a=S.acts.pop();if(a&&a.k==='order')S.orders[a.i]=a.prev;else S.shifts.pop();}hud();};

/* ---------- defender orders: radial menu + Mark mode ----------
   One input state machine for the defender's Phase 2, kept in `ui` and never mixed with game state:
     idle -(down on a defender)-> pressing
     pressing -(moves > 8 px)-> dragging (the existing kickoff move)
              -(up without moving)-> menuOpen          (tap)
              -(held still HOLD_MS)-> menuOpen, finger still down (start of the slide gesture)
     menuOpen -(over a wedge)-> preview; -(release/tap Hold or Press)-> commit -> idle
              -(release/tap Mark, or slide onto Mark)-> markPick; -(centre / outside / Esc)-> idle
     markPick -(over a marker)-> line snaps to it; -(release/tap a marker)-> commit mark -> idle
              -(elsewhere / on the defender / Esc)-> idle
   Orders are written only on commit (setOrder, which also records the undo step and ticks haptics); a
   cancel never touches them. The pointer is captured from the first pointerdown, so a press -> slide onto
   Mark -> slide onto a marker -> release runs through the same states. All hit tests are geometry
   (FootSalRadial.wedgeAt, distances on the pitch), never elementFromPoint. The clock keeps running. */
const RAD=window.FootSalRadial,DRAG_PX=8,HOLD_MS=450,MARK_DWELL=150;
const ORDER_WORD={zone:'Hold',press:'Press',mark:'Mark'};
const ORDER_CAPTION={zone:'Guards nearby passing lanes.',press:'Chases whoever has the ball.',mark:'Sticks to one attacker you pick.'};
const ui={state:'idle',i:-1,pid:null,x0:0,y0:0,down:false,slide:false,wedge:null,circle:-1,ptr:null,scr:null,fan:null,fanC:null,timer:0};
const radialEl=$('#radial'),rdFan=$('#radial .rd-fan'),rdCap=$('#radial .rd-cap');
let swallowClick=false;
function uiReset(){clearTimeout(ui.timer);clearTimeout(ui.markTimer);ui.markTimer=0;Object.assign(ui,{state:'idle',i:-1,pid:null,down:false,slide:false,wedge:null,circle:-1,ptr:null,scr:null,fan:null,fanC:null});
  radialEl.classList.remove('open','marking');radialEl.hidden=true;}
function screenOf(p){cam.updateMatrixWorld();const v=new V3(X3(p.x),0,Z3(p.y)).project(cam);return{x:(v.x*.5+.5)*innerWidth,y:(-v.y*.5+.5)*innerHeight};}
// the area the fan may use: between the HUD bands, with the 8 px side gutters
function safeRect(){const t=$('.band.top').getBoundingClientRect(),b=$('.band.bot').getBoundingClientRect();
  return{left:8,right:innerWidth-8,top:Math.max(8,t.bottom),bottom:Math.min(innerHeight-8,b.top+16)};}
const ptOf=e=>({x:e.clientX,y:e.clientY});
function circleAt(g){let j=-1,bd=ZR*1.1;(S.fuzzA||[]).forEach((c,k)=>{const d=Math.hypot(c.x-g.x,c.y-g.y);if(d<bd){bd=d;j=k;}});return j;}
function capture(e){try{e.target.setPointerCapture(e.pointerId);}catch(_){}}
function radialDown(e){S.flash='';const pt=ptOf(e),g=world(e);ui.scr=pt;ui.ptr=g;
  if(ui.state==='idle'){const i=hit(planPos(),g,.08);if(i<0){hud();return;}
    capture(e);Object.assign(ui,{state:'pressing',i,pid:e.pointerId,x0:pt.x,y0:pt.y,down:true});SFX.tap();buzz(10);
    if(i>0)ui.timer=setTimeout(()=>{if(ui.state==='pressing')openMenu(true);},HOLD_MS);hud();return;}
  if(ui.state==='pressing'||ui.state==='dragging')return;  // a second finger mid-gesture is ignored
  // menu or Mark mode already open: this press is a tap (or the start of a slide) on it
  capture(e);ui.pid=e.pointerId;ui.down=true;uiHover();}
function radialMove(e){if(ui.pid!=null&&e.pointerId!==ui.pid)return;const pt=ptOf(e),g=world(e);ui.scr=pt;ui.ptr=g;
  if(ui.state==='pressing'){if(Math.hypot(pt.x-ui.x0,pt.y-ui.y0)<=DRAG_PX)return;clearTimeout(ui.timer);ui.state='dragging';S.acts.push({k:'move'});}
  if(ui.state==='dragging'){dragDefender(ui.i,g);return;}
  uiHover();
  // slide gesture: with the finger still down, resting on the Mark wedge (MARK_DWELL) starts picking a
  // marker; a drag that only sweeps across it on the way out is still a drag (below)
  if(ui.state==='menuOpen'&&ui.down){
    if(ui.wedge==='mark'){if(!ui.markTimer)ui.markTimer=setTimeout(()=>{ui.markTimer=0;if(ui.state==='menuOpen'&&ui.down&&ui.wedge==='mark')enterMark();},MARK_DWELL);}
    else if(ui.markTimer){clearTimeout(ui.markTimer);ui.markTimer=0;}}
  // a hold that opened the fan but then carries the finger right past it was a slow drag, not a choice
  if(ui.state==='menuOpen'&&ui.down&&ui.slide&&ui.fanC&&Math.hypot(pt.x-ui.fanC.x,pt.y-ui.fanC.y)>RAD.OUTER+12){
    const i=ui.i,pid=ui.pid;uiReset();Object.assign(ui,{state:'dragging',i,pid,down:true});S.acts.push({k:'move'});dragDefender(i,g);hud();}}
function radialUp(e){if(ui.pid!=null&&e.pointerId!==ui.pid)return;const pt=ptOf(e),g=world(e);ui.scr=pt;ui.ptr=g;ui.down=false;
  if(ui.state==='pressing'){clearTimeout(ui.timer);
    if(ui.i===0){uiReset();S.flash='The keeper always guards the goal.';hud();return;}
    openMenu(false);return;}
  if(ui.state==='dragging'){SFX.step();uiReset();hud();return;}
  if(ui.state==='menuOpen'){const w=RAD.wedgeAt(pt,ui.fanC,ui.fan);
    if(w==='mark'){enterMark();return;}
    if(w){commit(w);return;}
    // a hold-to-open lifted on the defender leaves the menu open for a tap; anything else cancels
    if(ui.slide&&Math.hypot(pt.x-ui.fanC.x,pt.y-ui.fanC.y)<RAD.DEAD){ui.slide=false;return;}
    cancelMenu();return;}
  if(ui.state==='markPick'){const k=circleAt(g),d=planPos()[ui.i],onDef=Math.hypot(g.x-d.x,g.y-d.y)<.06;
    if(k>=0&&!onDef)commit('mark',k);else cancelMenu(true);}}
function radialCancel(){if(ui.state==='dragging'){uiReset();hud();return;}cancelMenu();}
function uiHover(){if(ui.state==='menuOpen'&&ui.fanC)ui.wedge=RAD.wedgeAt(ui.scr,ui.fanC,ui.fan);else if(ui.state==='markPick')ui.circle=circleAt(ui.ptr);}
function openMenu(slide){const s=safeRect(),p=screenOf(planPos()[ui.i]);
  Object.assign(ui,{state:'menuOpen',slide,wedge:null,circle:-1,fan:RAD.fanAngle(p,s)});ui.fanC=RAD.fanCentre(p,ui.fan,s);
  buildFan(rdFan,ui.fan,(S.orders[ui.i]||{t:'zone'}).t,ui.i+1);radialEl.classList.remove('marking');radialEl.hidden=false;void radialEl.offsetWidth;radialEl.classList.add('open');placeRadial();hud();}
function enterMark(){clearTimeout(ui.markTimer);ui.markTimer=0;Object.assign(ui,{state:'markPick',circle:circleAt(ui.ptr||{x:-9,y:-9})});
  if(ui.down)ui.slide=true;radialEl.classList.add('marking');SFX.tap();placeRadial();hud();}
function commit(t,k){const i=ui.i;setOrder(i,t==='mark'?{t:'mark',k}:{t});
  S.flash=`#${i+1} set to ${ORDER_WORD[t]}. Tap Lock in when ready.`;uiReset();hud();}
function cancelMenu(markMiss){const was=ui.state;uiReset();
  if(was==='markPick'&&markMiss)S.flash='Tap inside a circle to mark an attacker.';hud();}
// the fan's SVG wedges and the three icon+word buttons, built once per opening for its direction
const ICON={
  zone:'<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="3"/>',
  press:'<path d="M3 12h14M12 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
  mark:'<circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>'};
// el: the .rd-fan to fill, a0: the fan's direction, cur: the defender's current order, num: shirt number
function buildFan(el,a0,cur,num){const O=RAD.OUTER,In=RAD.DEAD+4,gap=.04,pt=(r,a)=>`${(O+Math.cos(a)*r).toFixed(1)} ${(O+Math.sin(a)*r).toFixed(1)}`;
  let svg='',btn='';
  RAD.WEDGES.forEach((w,j)=>{const s=a0+(j-1.5)*RAD.SPAN+gap,e=a0+(j-.5)*RAD.SPAN-gap;
    svg+=`<path data-w="${w}" class="rd-wedge${w===cur?' cur':''}" d="M${pt(In,s)} L${pt(O,s)} A${O} ${O} 0 0 1 ${pt(O,e)} L${pt(In,e)} A${In} ${In} 0 0 0 ${pt(In,s)} Z"/>`;
    const c=RAD.wedgeCentre({x:O,y:O},a0,w);
    btn+=`<div class="rd-btn${w===cur?' cur':''}" data-w="${w}" style="left:${c.x.toFixed(1)}px;top:${c.y.toFixed(1)}px"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[w]}</svg><span>${ORDER_WORD[w]}</span></div>`;});
  el.innerHTML=`<svg class="rd-svg" width="${2*O}" height="${2*O}" viewBox="0 0 ${2*O} ${2*O}" aria-hidden="true">${svg}</svg>${btn}<div class="rd-hub">#${num}</div>`;}
const fanHot=(el,w)=>el.querySelectorAll('[data-w]').forEach(x=>x.classList.toggle('hot',x.dataset.w===w));
// each frame: keep the fan on its defender (projected through the camera), mark the hovered wedge, and
// write the caption strip; close if the turn moved on underneath (clock ran out, pause, hand-off)
function radialFrame(){if(ui.state==='idle')return;
  if(SCREEN!=='game'||S.phase!=='planD'||!ov.hidden||S.waiting){uiReset();return;}
  if(ui.state==='menuOpen'||ui.state==='markPick')placeRadial();}
function placeRadial(){const s=safeRect(),p=screenOf(planPos()[ui.i]);ui.fanC=RAD.fanCentre(p,ui.fan,s);const O=RAD.OUTER;
  rdFan.style.transform=`translate(${(ui.fanC.x-O).toFixed(1)}px,${(ui.fanC.y-O).toFixed(1)}px)`;
  fanHot(rdFan,ui.wedge);
  const marking=ui.state==='markPick';
  rdCap.textContent=marking?'Tap a circle to mark. Tap elsewhere to cancel.':(ui.wedge?ORDER_CAPTION[ui.wedge]:`Pick an order for #${ui.i+1}.`);
  // caption strip above the fan if there is room, otherwise below; in Mark mode, at the top of the pitch
  const b=RAD.fanBox(ui.fanC,ui.fan),w=Math.min(innerWidth-24,320),h=34;
  let y=marking?s.top+6:(b.top-h-8>=s.top?b.top-h-8:b.bottom+8),x=clamp((marking?innerWidth/2:ui.fanC.x)-w/2,12,innerWidth-12-w);
  rdCap.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;rdCap.style.width=w+'px';}
// a tap anywhere outside the pitch (HUD buttons included) while the menu is open only closes it
window.addEventListener('pointerdown',e=>{if((ui.state==='menuOpen'||ui.state==='markPick')&&e.target!==cv){e.preventDefault();e.stopPropagation();swallowClick=true;cancelMenu();}},true);
window.addEventListener('click',e=>{if(swallowClick){swallowClick=false;e.preventDefault();e.stopPropagation();}},true);
window.addEventListener('keydown',e=>{
  if(ui.state==='menuOpen'||ui.state==='markPick'){
    if(e.key==='Escape'){e.preventDefault();cancelMenu();return;}
    if(ui.state==='menuOpen'&&/^[123]$/.test(e.key)){e.preventDefault();const w=RAD.WEDGES[+e.key-1];if(w==='mark')enterMark();else commit(w);return;}}
  if(e.key==='Escape')pauseGame();else if((e.key===' '||e.key==='Enter')&&SCREEN==='game'&&S.phase==='planA'&&S.meter&&S.meter.v==null&&ov.hidden){e.preventDefault();strike();}});

/* ---------- painted overlay ---------- */
const rgba=(h,a)=>`rgba(${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)},${a})`;
const Wt=()=>ctx.setTransform(OVS,0,0,OVS,OX*OVS,OY*OVS);
// draw with every overlay function onto another canvas (a tutorial card): scale s px per pitch unit,
// pitch point (x0, y0) at the canvas's top-left corner
function drawInto(g,s,x0,y0,fn){const keep=[ctx,OVS,OX,OY];ctx=g;OVS=s;OX=-x0;OY=-y0;
  try{ctx.setTransform(1,0,0,1,0,0);Wt();fn();}finally{[ctx,OVS,OX,OY]=keep;}}
function text(x,y,str,size,color,font){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=color;ctx.font=`${font||'700'} ${size*OVS}px "Barlow Condensed","Arial Narrow",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(str,(x+OX)*OVS,(y+OY)*OVS+size*OVS*.05);ctx.restore();}
function line(a,b){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
function rrect(x,y,w,h,r){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);}
function arrow(a,b,col,dash,trimA=PR+.01,trimB=PR+.012){
  const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(L<trimA+trimB+.01)return;
  const ux=dx/L,uy=dy/L,s0={x:a.x+ux*trimA,y:a.y+uy*trimA},e0={x:b.x-ux*trimB,y:b.y-uy*trimB};
  ctx.strokeStyle=col;ctx.lineWidth=.011;ctx.lineCap='round';ctx.setLineDash(dash?[.025,.022]:[]);line(s0,e0);ctx.setLineDash([]);
  const h=.032;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(e0.x+ux*.008,e0.y+uy*.008);ctx.lineTo(e0.x-ux*h-uy*h*.6,e0.y-uy*h+ux*h*.6);ctx.lineTo(e0.x-ux*h+uy*h*.6,e0.y-uy*h-ux*h*.6);ctx.closePath();ctx.fill();}
// goal: the shoot prompt {nag, last} while an attack has passes but no shot yet, else null
function lines(now,goal){
  ctx.strokeStyle='rgba(245,248,240,.92)';ctx.lineWidth=.0065;ctx.setLineDash([]);
  ctx.strokeRect(0,0,1,1.5);line({x:0,y:.75},{x:1,y:.75});ctx.beginPath();ctx.arc(.5,.75,.13,0,Math.PI*2);ctx.stroke();
  [[0,1],[1.5,-1]].forEach(([y0,dir])=>{ctx.strokeRect(.2,Math.min(y0,y0+dir*.26),.6,.26);ctx.strokeRect(.36,Math.min(y0,y0+dir*.09),.28,.09);
    ctx.fillStyle='rgba(245,248,240,.92)';ctx.beginPath();ctx.arc(.5,y0+dir*.18,.008,0,7);ctx.fill();
    ctx.beginPath();ctx.arc(.5,y0+dir*.18,.1,dir>0?.2*Math.PI:1.2*Math.PI,dir>0?.8*Math.PI:1.8*Math.PI);ctx.stroke();});
  ctx.beginPath();ctx.arc(.5,.75,.008,0,7);ctx.fill();
  [[0,0],[1,0],[0,1.5],[1,1.5]].forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,.025,y?Math.PI*(x?1:1.5):Math.PI*(x?.5:0),y?Math.PI*(x?1.5:2):Math.PI*(x?1:.5));ctx.stroke();});
  if(goal){const nag=goal.nag;ctx.fillStyle=C.marker;ctx.globalAlpha=(nag?.34:.2)+(nag?.22:.14)*Math.sin(now/(nag?110:180));ctx.fillRect(.2,-.05,.6,.21);ctx.globalAlpha=1;
    // after Lock in without a shot: a marching arrow from the last receiver into the goal as well
    if(nag){const last=goal.last;ctx.save();ctx.lineDashOffset=-now/400;arrow(last,{x:.5,y:.1},C.marker,true,PR+.012,.01);ctx.restore();}
    text(.5,.12,'TAP THE GOAL TO SHOOT',nag?.04:.034,C.marker);}
}
function chevron(cx,cy,w,h){ctx.beginPath();ctx.moveTo(cx-w/2,cy+h/2);ctx.lineTo(cx,cy-h/2);ctx.lineTo(cx+w/2,cy+h/2);ctx.lineTo(cx+w/2,cy+h/2+.035);ctx.lineTo(cx,cy-h/2+.035);ctx.lineTo(cx-w/2,cy+h/2+.035);ctx.closePath();ctx.fill();}
// m: {ph, A, D} (the phase and which team attacks / defends)
function groundMarks(now,m){
  const ph=m.ph;if(ph==='menu'||ph==='ready')return;
  const reveal=ph==='play'||ph==='replay'||ph==='result'||ph==='over',ac=TEAMC[m.A],dc=TEAMC[m.D];
  const att=ph==='setupA'||ph==='planA'||reveal,def=ph==='setupD'||ph==='planD'||reveal,k=reveal?.4:1;
  if(att){ctx.fillStyle=ac;
    for(let i=0;i<5;i++){ctx.globalAlpha=k*(.25+.4*Math.max(0,Math.sin(now/260-i*.9)));chevron(.5,1.3-i*.19,.26,.07);}
    for(let i=0;i<7;i++){ctx.globalAlpha=k*.35;chevron(.06,1.38-i*.2,.06,.03);chevron(.94,1.38-i*.2,.06,.03);}
    ctx.globalAlpha=k*.55;ctx.strokeStyle=ac;ctx.lineWidth=.008;ctx.beginPath();ctx.arc(.5,0,.3,.15*Math.PI,.85*Math.PI);ctx.stroke();ctx.globalAlpha=1;
    if(!reveal)label(.5,1.44,'YOUR ATTACK',.03,TEAMS[m.A].text);}
  if(def){ctx.save();ctx.beginPath();ctx.rect(.2,0,.6,.26);ctx.clip();ctx.strokeStyle=dc;ctx.lineWidth=.012;ctx.globalAlpha=k*.45;
    for(let x=-.3;x<1;x+=.045){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+.26,.26);ctx.stroke();}ctx.restore();
    ctx.globalAlpha=k*.8;ctx.strokeStyle=dc;ctx.lineWidth=.014;ctx.strokeRect(.2,0,.6,.26);
    ctx.fillStyle=dc;ctx.globalAlpha=k*.4;for(let x=.08;x<.95;x+=.084){teamShape(m.D,x,.5,.011);ctx.fill();}ctx.globalAlpha=1;
    if(!reveal){label(.5,.33,'YOUR GOAL',.03,TEAMS[m.D].text);text(.5,.215,'ONE DEFENDER IN THE BOX',.024,C.chalk,'600');}}
}
// the team's shape, used everywhere a team is marked: circle for team 0, rounded square for team 1
function teamShape(team,x,y,r){if(TEAMS[team].shape==='circle'){ctx.beginPath();ctx.arc(x,y,r,0,7);}else{const q=r*.9;rrect(x-q,y-q,2*q,2*q,q*.36);}}
// player spot: solid accent fill (reads on the darker turf), a kit-coloured rim (light vs dark) and an
// ink keyline; the number chip uses the same shape in the shirt colour
function spot(p,team,num,ring){const T=TEAMS[team];
  teamShape(team,p.x,p.y,PR);ctx.fillStyle=T.accent;ctx.fill();ctx.strokeStyle=T.shirt;ctx.lineWidth=.01;ctx.stroke();
  teamShape(team,p.x,p.y,PR+.006);ctx.strokeStyle=C.ink;ctx.lineWidth=.003;ctx.stroke();
  if(ring){teamShape(team,p.x,p.y,PR+.019);ctx.strokeStyle=ring;ctx.lineWidth=.01;ctx.stroke();}
  const cx=p.x-.046,cy=p.y+.04;teamShape(team,cx,cy,.021);ctx.fillStyle=T.shirt;ctx.fill();ctx.strokeStyle=T.accent;ctx.lineWidth=.005;ctx.stroke();text(cx,cy-.002,String(num),.03,T.chipText);
}
// ground labels sit on turf, so they get an ink outline under the team text colour
function label(x,y,str,size,color,font){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.font=`${font||'700'} ${size*OVS}px "Barlow Condensed","Arial Narrow",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  const px=(x+OX)*OVS,py=(y+OY)*OVS+size*OVS*.05;ctx.lineJoin='round';ctx.lineWidth=size*OVS*.22;ctx.strokeStyle=C.ink;ctx.strokeText(str,px,py);ctx.fillStyle=color;ctx.fillText(str,px,py);ctx.restore();}
function vis(){const ph=S.phase,reveal=ph==='play'||ph==='replay'||ph==='result'||ph==='over';
  return{reveal,att:ph==='menu'||ph==='setupA'||ph==='planA'||reveal,def:ph==='menu'||ph==='setupD'||ph==='planD'||reveal};}
// the play clock in ms since the play began. A goal replay runs the same clock again at REPLAY_RATE,
// starting just before the first kick
const REPLAY_RATE=.7;
const playMs=now=>S.phase==='replay'?KO-250+(now-S.rpStart)*REPLAY_RATE:now-S.playStart;
const playT=now=>(playMs(now)-KO)/1000;
// defenders: walk from their shape to the kickoff spots during the kickoff delay, then play back the
// simulated runs (o.track); after play they stay where the play ended
function defNow(now){const v=vis();if(S.phase==='planD')return planPos();
  if(v.reveal&&S.defPlay){const ms=playMs(now),tr=S.out&&S.out.track;
    if(ms>=KO&&tr&&tr.length)return trackAt(tr,playT(now),'d');
    const e=clamp(ms/1000,0,1),k=e*e*(3-2*e);return S.def.map((p,i)=>({x:p.x+(S.defPlay[i].x-p.x)*k,y:p.y+(S.defPlay[i].y-p.y)*k}));}
  return S.def;}
// attackers only move in play when attacker runs (RUN_V) are switched on
function attNow(now){const tr=S.out&&S.out.track;if(vis().reveal&&tr&&tr.length&&tr[0].a)return trackAt(tr,Math.max(0,playT(now)),'a');return S.att;}
// order icons, the same shapes as the radial menu's SVG (24-unit box): ring = Hold, arrow = Press,
// crosshair = Mark
function orderIcon(t,x,y,s,col){const f=s/24;ctx.save();ctx.translate(x-s/2,y-s/2);ctx.scale(f,f);ctx.strokeStyle=col;ctx.lineCap='round';ctx.lineJoin='round';
  if(t==='zone'){ctx.lineWidth=3;ctx.beginPath();ctx.arc(12,12,8,0,7);ctx.stroke();}
  else if(t==='press'){ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(3,12);ctx.lineTo(17,12);ctx.moveTo(12,6);ctx.lineTo(18,12);ctx.lineTo(12,18);ctx.stroke();}
  else if(t==='mark'){ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(12,12,6,0,7);ctx.moveTo(12,2);ctx.lineTo(12,7);ctx.moveTo(12,17);ctx.lineTo(12,22);ctx.moveTo(2,12);ctx.lineTo(7,12);ctx.moveTo(17,12);ctx.lineTo(22,12);ctx.stroke();}
  ctx.restore();}
function chip(p,o,sel){const lbl=o.t==='mark'?`MARK ${o.k+1}`:ORDER_NAME[o.t],ic=o.t==='keep'?0:.026,w=.022+.0128*lbl.length+ic,h=.034,x=p.x-w/2,y=p.y-PR-.046;
  const bg=o.t==='press'?C.marker:(o.t==='mark'?C.chalk:'#151a1b'),fg=o.t==='press'||o.t==='mark'?C.ink:C.chalk;
  ctx.fillStyle=bg;rrect(x,y,w,h,.008);ctx.fill();ctx.strokeStyle=sel?C.marker:C.ink;ctx.lineWidth=sel?.006:.004;ctx.stroke();
  if(ic)orderIcon(o.t,x+.006+ic/2,y+h/2,.022,fg);text(p.x+ic/2,y+h/2,lbl,.026,fg);}
// Order previews for the radial menu. Pure drawing from the state handed in (nothing read from S or ui),
// so the tutorial can call them with its own setups.
function previewHold(home,col){ctx.save();ctx.fillStyle=rgba(col,.16);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=.008;ctx.setLineDash([.02,.012]);
  ctx.beginPath();ctx.arc(home.x,home.y,ZONE_R,0,7);ctx.fill();ctx.stroke();ctx.restore();}
function previewPress(from,circles,col){if(!circles||!circles.length)return;
  const c={x:circles.reduce((s,q)=>s+q.x,0)/circles.length,y:circles.reduce((s,q)=>s+q.y,0)/circles.length};
  arrow(from,c,col,false,PR+.012,.02);label((from.x+c.x)/2,(from.y+c.y)/2-.035,'chases the ball',.028,C.chalk);}
// Mark mode: markers pulse, solid outline = 'reach', dashed = 'late'; numbers of defenders already marking
// each one; the defender's reach range faintly; a dashed line from the defender to the pointer that snaps
// to the hovered marker. opt: {from, circles, reach, marked, hover, pointer, col, team, reachR, now}
function previewMark(o){const t=o.now||0,attCol=TEAMC[o.team];ctx.save();
  if(o.reachR>0){ctx.fillStyle=rgba(o.col,.1);ctx.strokeStyle='rgba(238,243,234,.4)';ctx.lineWidth=.005;ctx.setLineDash([.012,.012]);ctx.beginPath();ctx.arc(o.from.x,o.from.y,o.reachR,0,7);ctx.fill();ctx.stroke();ctx.setLineDash([]);}
  o.circles.forEach((c,k)=>{const hot=k===o.hover,r=ZR*(1+.045*Math.sin(t/260+k*1.3)),g=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,r);
    g.addColorStop(0,rgba(attCol,hot?.95:.8));g.addColorStop(.65,rgba(attCol,.5));g.addColorStop(1,rgba(attCol,.12));
    ctx.fillStyle=g;teamShape(o.team,c.x,c.y,r);ctx.fill();
    ctx.strokeStyle=hot?C.marker:C.chalk;ctx.lineWidth=hot?.014:.009;ctx.setLineDash(o.reach&&o.reach[k]==='late'?[.024,.018]:[]);teamShape(o.team,c.x,c.y,r);ctx.stroke();ctx.setLineDash([]);
    const m=o.marked&&o.marked[k];if(m&&m.length){const s=m.map(n=>'#'+n).join(' '),w=.03+.017*s.length,y=c.y-r-.012;
      ctx.fillStyle=C.ink;rrect(c.x-w/2,y-.02,w,.04,.01);ctx.fill();ctx.strokeStyle=o.col;ctx.lineWidth=.004;ctx.stroke();text(c.x,y,s,.028,C.chalk);}});
  const to=o.hover>=0?o.circles[o.hover]:o.pointer;
  if(to){ctx.strokeStyle=o.hover>=0?C.marker:o.col;ctx.lineWidth=.009;ctx.setLineDash([.022,.014]);line(o.from,to);ctx.setLineDash([]);}
  ctx.restore();}
// while the menu or Mark mode is open: dim the pitch, then draw the preview and the chosen defender on top
function radialOverlay(now){if(S.phase!=='planD'||(ui.state!=='menuOpen'&&ui.state!=='markPick'))return;
  radialPaint({me:planPos()[ui.i],num:ui.i+1,dTeam:D(),aTeam:A(),circles:S.fuzzA||[],orders:S.orders,marking:ui.state==='markPick',
    wedge:ui.wedge,cur:(S.orders[ui.i]||{t:'zone'}).t,hover:ui.circle,pointer:ui.ptr,now});}
// the pitch under an open order menu, from the values handed in: {me, num, dTeam, aTeam, circles, orders,
// marking, wedge (hovered), cur (current order), hover (circle in Mark mode), pointer, now}
function radialPaint(o){
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='rgba(4,8,10,.55)';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();
  const me=o.me,col=TEAMC[o.dTeam],circles=o.circles;
  const markOpts=()=>({from:me,circles,reach:RAD.markReach(me,circles,SPEED.mark,REACT),marked:RAD.markedBy(o.orders),hover:o.marking?o.hover:-1,
    pointer:o.marking?o.pointer:null,col,team:o.aTeam,reachR:RAD.reachRadius(SPEED.mark,REACT),now:o.now});
  if(o.marking)previewMark(markOpts());
  else{const w=o.wedge||o.cur;if(w==='zone')previewHold(me,col);else if(w==='press')previewPress(me,circles,col);else if(w==='mark')previewMark(markOpts());}
  spot(me,o.dTeam,o.num,C.marker);}
// What the overlay shows, worked out from the game state. paintOverlay() only draws what it is handed, so
// the tutorial cards feed it their own scripted states and look exactly like the game.
function overlayState(now){
  const ph=S.phase,game=SCREEN==='game',v=vis(),st={game,ph,A:A(),D:D()};
  const zt=ph==='planA'?D():A(),zp=game?(ph==='planA'?S.fuzzD:(ph==='planD'?S.fuzzA:null)):null;
  st.zones=zp?{pts:zp,team:zt}:null;
  st.goal=ph==='planA'&&S.seq.length&&!S.goalTapped?{nag:S.shotNag,last:S.att[S.seq[S.seq.length-1]]}:null;
  if(!game)return st;
  const showSeq=(ph==='planA'||v.reveal)&&S.seq.length,defs=defNow(now),atts=attNow(now),ords=(S.out&&v.reveal?S.out.orders:S.orders)||[];
  const live=ph==='play'||ph==='replay';
  if(v.reveal&&S.out&&S.out.track&&S.out.track.length>1)st.trails={track:S.out.track,tn:live?playT(now):1e9,defs};
  st.links=[];
  if(ph==='planD'||v.reveal)ords.forEach((o,i)=>{if(o.t!=='mark'||!defs[i])return;const to=ph==='planD'?(S.fuzzA||[])[o.k]:atts[o.k];if(to)st.links.push([defs[i],to]);});
  st.arrows=[];const ar=(a,b,dash,tA,tB)=>st.arrows.push({a,b,dash,tA,tB});
  if(showSeq&&v.reveal&&S.out&&S.out.anim.length)st.arrows=playArrows(S.out,live?ballState(now):null);
  else if(showSeq&&!v.reveal){for(let k=1;k<S.seq.length;k++)ar(S.att[S.seq[k-1]],S.att[S.seq[k]],false);
    const last=S.att[S.seq[S.seq.length-1]];if(S.goalTapped)ar(last,shotTarget(last,S.fuzzD||S.def),true,PR+.01,.005);}
  st.shifts=ph==='planD'||v.reveal?S.shifts.map(sh=>({from:S.def[sh.i],to:v.reveal?null:sh})):[];
  const by=S.out&&S.out.type==='intercept'&&S.fx?S.out.by:-1;
  const picked=i=>ph==='planD'&&ui.i===i&&(ui.state==='menuOpen'||ui.state==='markPick');
  const held=i=>(ph==='planD'&&ui.i===i&&(ui.state==='pressing'||ui.state==='dragging'))||(S.drag&&S.drag.arr===S.def&&S.drag.i===i);
  st.atts=v.att?atts.map((p,i)=>({p,ring:ph==='planA'&&S.seq[S.seq.length-1]===i?C.marker:(S.drag&&S.drag.arr===S.att&&S.drag.i===i?C.chalk:null)})):null;
  st.defs=v.def?defs.map((p,i)=>({p,ring:i===by||picked(i)?C.marker:(held(i)?C.chalk:null)})):null;
  // order chips above each defender (their plan and the replay only; the attacker never sees them early)
  st.chips=v.def&&(ph==='planD'||v.reveal)?defs.map((p,i)=>({p,o:ords[i]||{t:i?'zone':'keep'},sel:picked(i)})):null;
  st.badges=[];if(showSeq&&!live){const m={};S.seq.forEach((idx,k)=>(m[idx]=m[idx]||[]).push(k+1));Object.entries(m).forEach(([idx,ks])=>st.badges.push({p:S.att[idx],lbl:ks.join('·')}));}
  st.offside=ph==='planA'&&S.offside&&now-S.offside.t<1600?{p:S.att[S.offside.i]}:null;
  st.lesson=S.lesson!=null&&S.fx&&v.reveal&&defs[S.lesson]?{p:defs[S.lesson]}:null;
  return st;}
// a play's pass and shot arrows: all of them once it is over (b = null), else up to the ball
function playArrows(o,b){const out=[];
  o.anim.forEach((L,k)=>{const end=L.cut?L.end:L.b,trimB=L.cut?.03:(L.shot?.005:PR+.012);
    if(!b){out.push({a:L.a,b:end,dash:L.shot,tA:PR+.01,tB:trimB});return;}
    if(b.leg<0||k>b.leg)return;
    if(k<b.leg)out.push({a:L.a,b:end,dash:L.shot,tA:PR+.01,tB:trimB});
    else out.push({a:L.a,b:b.arrived?end:{x:b.x,y:b.y},dash:L.shot,tA:PR+.01,tB:b.arrived&&!L.shot&&!L.cut?PR+.012:.03});});
  return out;}
function paintOverlay(st,now){
  // possible-location circles: one radial gradient per hidden player, centre shifted off the real spot
  // (team 1's markers are rounded squares, so shape alone says whose players they hide)
  const z=st.zones;
  if(z){const zt=z.team,zc=TEAMC[zt];ctx.save();ctx.globalAlpha=z.alpha==null?1:z.alpha;ctx.fillStyle='rgba(6,14,9,.18)';ctx.fillRect(0,0,1,1.5);
    z.pts.forEach((p,i)=>{const r=ZR*(1+.035*Math.sin(now/650+i*1.7)),g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
      g.addColorStop(0,rgba(zc,.85));g.addColorStop(.6,rgba(zc,.5));g.addColorStop(1,rgba(zc,.08));
      ctx.fillStyle=g;teamShape(zt,p.x,p.y,r);ctx.fill();
      ctx.strokeStyle=rgba(zc,1);ctx.lineWidth=.007;ctx.setLineDash([.02,.016]);teamShape(zt,p.x,p.y,r);ctx.stroke();ctx.setLineDash([]);});ctx.restore();}
  lines(now,st.goal);if(!st.game)return;groundMarks(now,st);
  const dc=TEAMC[st.D];
  // defenders' runs as dashed chalk trails, growing during play and complete in the replay
  if(st.trails){const{track:tr,tn,defs}=st.trails;
    ctx.strokeStyle='rgba(238,243,234,.75)';ctx.lineWidth=.006;ctx.setLineDash([.012,.012]);
    for(let i=0;i<tr[0].d.length;i++){ctx.beginPath();ctx.moveTo(tr[0].d[i].x,tr[0].d[i].y);for(const f of tr){if(f.t>tn)break;ctx.lineTo(f.d[i].x,f.d[i].y);}if(tn>0&&tn<1e9)ctx.lineTo(defs[i].x,defs[i].y);ctx.stroke();}
    ctx.setLineDash([]);}
  // markers joined to their targets: the circle while planning, the real attacker once revealed
  (st.links||[]).forEach(([a,b])=>{ctx.strokeStyle=dc;ctx.lineWidth=.007;ctx.setLineDash([.018,.014]);line(a,b);ctx.setLineDash([]);});
  (st.arrows||[]).forEach(r=>arrow(r.a,r.b,C.marker,r.dash,r.tA,r.tB));
  (st.shifts||[]).forEach(sh=>{const o=sh.from;ctx.strokeStyle=C.chalk;ctx.lineWidth=.005;ctx.setLineDash([.015,.012]);teamShape(st.D,o.x,o.y,PR);ctx.stroke();ctx.setLineDash([]);if(sh.to)arrow(o,sh.to,C.chalk,true,PR,PR+.012);});
  if(st.atts)st.atts.forEach((s,i)=>spot(s.p,st.A,i+1,s.ring));
  if(st.defs)st.defs.forEach((s,i)=>spot(s.p,st.D,i+1,s.ring));
  // the defender who first won the ball off the player: a pulsing ring, once
  if(st.lesson){const p=st.lesson.p,k=(now%900)/900;ctx.save();ctx.strokeStyle=C.marker;ctx.lineWidth=.01;
    ctx.globalAlpha=1-k;teamShape(st.D,p.x,p.y,PR+.02+k*.07);ctx.stroke();ctx.restore();}
  if(st.chips)st.chips.forEach(c=>chip(c.p,c.o,c.sel));
  (st.badges||[]).forEach(({p,lbl})=>{const w=.024+.012*(lbl.length-1);ctx.fillStyle=C.marker;rrect(p.x+.03-w/2+.012,p.y-.075,w+.012,.04,.02);ctx.fill();text(p.x+.048,p.y-.055,lbl,.03,C.ink);});
  if(st.offside){const p=st.offside.p,wave=Math.sin(now/70)*.012;
    ctx.strokeStyle=C.chalk;ctx.lineWidth=.008;line({x:p.x+.055,y:p.y+.02},{x:p.x+.055,y:p.y-.13});
    ctx.fillStyle=C.marker;ctx.beginPath();ctx.moveTo(p.x+.055,p.y-.13);ctx.lineTo(p.x+.13,p.y-.115+wave);ctx.lineTo(p.x+.055,p.y-.08);ctx.closePath();ctx.fill();
    ctx.fillStyle=C.red;ctx.beginPath();ctx.moveTo(p.x+.055,p.y-.13);ctx.lineTo(p.x+.09,p.y-.122+wave/2);ctx.lineTo(p.x+.055,p.y-.105);ctx.closePath();ctx.fill();
    text(p.x,p.y+.09,'OFFSIDE',.032,C.marker);}
}
function drawOverlay(now){
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,ovc.width,ovc.height);Wt();
  paintOverlay(overlayState(now),now);
  if(SCREEN==='game')radialOverlay(now);
}

/* ---------- ball path ---------- */
const KO=1300;
function ballState(now){return ballAt(S.out,Math.max(0,playT(now)));}
// the ball of a simulated play o at t seconds after the first kick (the tutorial replays its own plays)
function ballAt(o,t){
  if(!o||!o.anim.length)return null;
  const last=o.anim.length-1;
  let st={x:o.anim[0].a.x,y:o.anim[0].a.y,h:BR,leg:-1,done:false,arrived:false};
  // same kinematics as the simulation (legPos); a leg that was won stops where the defender met it
  o.anim.forEach((L,k)=>{if(t<L.t0)return;const tt=Math.min(t,L.endT),p=legPos(L,tt);let h=BR;
    if(L.shot&&o.type!=='intercept')h=BR+({sweet:.9,hard:.55,wide:.4,soft:0}[o.shotKind]??.3)*Math.sin(Math.PI*Math.min(1,p.f*1.05)*.55);
    st={x:p.x,y:p.y,h,leg:k,arrived:p.u>=1,done:k===last&&t>=L.endT};});
  return st;
}

/* ---------- world sync & effects ---------- */
function syncWorld(now,dt){
  const v=vis(),ph=S.phase,n=S.n,menu=SCREEN!=='game';
  const at=T3[A()],df=T3[D()],defs=defNow(now);
  const b=v.reveal?ballState(now):null;
  // ball
  let bp;
  if(b)bp={x:X3(b.x),y:b.h,z:Z3(b.y)};
  else{const st=S.seq.length&&ph==='planA'?S.att[S.seq[0]]:S.att[menu?n-1:0];bp={x:X3(st.x)+.5,y:BR,z:Z3(st.y)-.5};}
  ball.visible=menu||ph==='setupA'||ph==='planA'||v.reveal;
  ball.position.set(bp.x,bp.y,bp.z);
  const dx=ball.position.x-lastBall.x,dz=ball.position.z-lastBall.z,dd=Math.hypot(dx,dz);
  if(dd>1e-4&&dd<3){const ax=new V3(dz,0,-dx).normalize();ball.rotateOnWorldAxis(ax,dd/BR);if(v.reveal&&dd>.02)dust.emit(ball.position.x,.05,ball.position.z,1,{speed:.2,up:.3,spread:.05,colors:['#ffffff'],life:.35,grav:0});}
  lastBall.copy(ball.position);
  // players: position, facing and which animation each should be playing
  const o=S.out,res=(ph==='result'||ph==='over')&&o;
  // defenders run whenever their position is changing (kickoff walk-out and the simulated runs)
  const vel=defs.map((p,i)=>S.prevD&&S.prevD[i]&&dt>0?Math.hypot(p.x-S.prevD[i].x,p.y-S.prevD[i].y)/dt:0);
  // live = the play itself or its goal replay (the replay re-runs the same timeline, slower, without the
  // splash screens, score change or fireworks)
  const live=ph==='play'||ph==='replay',rp=ph==='replay';
  S.prevD=live?defs.map(p=>({x:p.x,y:p.y})):null;const moving=live&&vel.some(s=>s>.02);
  const place=(g,p,i,team)=>{g.visible=true;let y=0,anim='idle';
    const kt=S.kickT&&team==='a'?S.kickT[i]:null;
    if(kt&&now-kt<260&&!g.userData.acts)y=Math.sin((now-kt)/260*Math.PI)*.35;
    const dragged=(S.drag&&((team==='a'&&S.drag.arr===S.att)||(team==='d'&&S.drag.arr===S.def))&&S.drag.i===i)||(team==='d'&&ph==='planD'&&ui.state==='dragging'&&ui.i===i);
    if(dragged){y=.35;anim='lift';}
    if(team==='d'&&live&&vel[i]>.02)anim='run';
    if(kt&&now-kt<650)anim='kick';
    if(team==='d'&&S.fx&&o&&o.type==='intercept'&&o.by===i){anim='jump';if(!g.userData.acts)y=Math.abs(Math.sin(now/130))*.6;}
    if(res){if(o.type==='goal')anim=team==='a'?'yes':'no';else if(o.type==='intercept')anim=team==='d'&&o.by===i?'yes':(team==='a'?'no':'idle');else anim=team==='a'?'no':'yes';}
    if(menu&&!g.userData.acts)y=Math.abs(Math.sin(now/400+i))*.06;
    setAnim(g,anim,anim==='kick'&&kt&&now-kt<dt*1000+20);
    if(g.userData.mixer)g.userData.mixer.update(dt);
    g.position.set(X3(p.x),y,Z3(p.y));
    const face=res&&(anim==='yes'||anim==='no')?Math.atan2(cam.position.x-g.position.x,cam.position.z-g.position.z):Math.atan2(ball.position.x-g.position.x,ball.position.z-g.position.z);
    g.rotation.y=face;};
  [0,1].forEach(t=>T3[t].forEach(g=>g.visible=false));
  if(v.att)attNow(now).slice(0,n).forEach((p,i)=>place(at[i],p,i,'a'));
  if(v.def)defs.slice(0,n).forEach((p,i)=>place(df[i],p,i,'d'));
  if(moving&&now-S.stepT>170){S.stepT=now;SFX.step();}
  // kicks, haptics and particles per leg
  if(live&&b&&b.leg>S.hLeg){S.hLeg=b.leg;const L=S.out.anim[b.leg];S.kickT[L.from]=now;
    SFX.kick(L.shot?S.out.power:.45);if(!rp)buzz(L.shot?40:15);exciteT=L.shot?.6:.4;
    const np=Math.max(0,S.seq.length-1);if(!rp)$('#hint').textContent=L.shot?`Shot from ${metres(L.a)} m…`:`Pass ${b.leg+1} of ${np}`;
    dust.emit(X3(L.a.x),.1,Z3(L.a.y),L.shot?26:14,{speed:2.2,up:2.4,spread:.2,colors:['#7ccf6a','#b6e39a','#ffffff'],life:.7,grav:7});
    // anime beat for the touch: starburst always; a pass gets a quick banner and a gust of speed lines,
    // a shot gets the full cut-in, an impact frame, a camera punch and a flame aura on the striker
    const ac=TEAMC[A()],sweet=S.out.pw&&S.out.pw.kind==='sweet';
    burst(X3(L.a.x),.6,Z3(L.a.y),L.shot?3.4:2,L.shot?(sweet?C.marker:'#ffffff'):'#ffffff');
    if(L.shot){dust.emit(X3(L.a.x),.3,Z3(L.a.y),12,{speed:3.5,up:1.2,spread:.1,colors:[C.marker,'#ffffff'],life:.45,grav:2});
      FX.speed=1.2;auraOn(X3(L.a.x),Z3(L.a.y),sweet?C.marker:ac);if(!rp){impactFrame(110);FX.punch=1;cutIn(sweet?'perfect':'shot',{c:sweet?C.marker:ac});}}
    else{FX.speed=Math.max(FX.speed,.55);if(!rp)cutIn('pass',{c:ac,sub:np?`${b.leg+1} of ${np}`:''});}}
  if(live&&b&&b.arrived&&!b.done&&b.leg>S.rLeg){S.rLeg=b.leg;SFX.trap();if(!rp)buzz(8);
    const L=S.out.anim[b.leg];dust.emit(X3(L.b.x),.05,Z3(L.b.y),8,{speed:1,up:1,spread:.1,colors:['#7ccf6a','#ffffff'],life:.5,grav:6});
    burst(X3(L.b.x),.5,Z3(L.b.y),1.2,'#ffffff',240);}
  // trail ribbon (and a few comet sparks on a shot) while the ball travels
  const flying=live&&b&&b.leg>=0&&!b.arrived;
  updateTrail(flying,TEAMC[A()],flying&&S.out.anim[b.leg].shot?.42:.24);
  if(flying&&S.out.anim[b.leg].shot)dust.emit(ball.position.x,ball.position.y,ball.position.z,2,{speed:.15,up:.1,spread:.04,colors:[C.marker,'#ffffff'],life:.4,grav:0});
  if(live&&b&&b.done&&!S.fx){S.fx=true;effectsFor(S.out,ball.position,rp);}
  if(ph==='play'&&!S.resolved&&S.out&&now-S.playStart>KO+S.out.total*1000+(S.out.type==='goal'?1200:600))resolve();
  // the replay loops until the player taps Skip replay
  if(rp&&S.out&&playMs(now)>KO+S.out.total*1000+1400)Object.assign(S,{rpStart:now,hLeg:-1,rLeg:-1,fx:false,kickT:{},prevD:null});
  // nets
  nets.forEach(nm=>{const k=nm.userData.kick;nm.userData.kick=Math.max(0,k-dt*2.5);nm.scale.z=1+Math.sin(k*12)*k*.35;nm.position.z=nm.userData.z0+nm.userData.d*.7*nm.scale.z;});
}
function effectsFor(o,p,replay){
  // the replay gets the net, the crowd and the ring again, but not the splash, fireworks or haptics
  if(o.type==='goal'&&replay){nets[0].userData.kick=1;SFX.net();SFX.cheer(10);exciteT=.9;ringT=performance.now();ring.material.color.set(TEAMC[A()]);
    burst(p.x,1.2,p.z,5,C.marker,480);confetti.emit(0,2.2,-15,90,{speed:4,up:7,spread:1.4,colors:[TEAMC[A()],C.marker,'#ffffff'],life:2.6,grav:6,dz:3});return;}
  if(o.type==='goal'){nets[0].userData.kick=1;SFX.net();SFX.horn();SFX.cheer(14);exciteT=1;shake=1;buzz([40,50,90,50,120]);ringT=performance.now();ring.material.color.set(TEAMC[A()]);fireworks(A());
    confetti.emit(0,2.2,-15,220,{speed:5,up:9,spread:1.6,colors:[TEAMC[A()],C.marker,'#ffffff',TEAMC[A()]],life:3.2,grav:6,dz:3});
    dust.emit(p.x,1,p.z,40,{speed:3,up:3,spread:.4,colors:[C.marker,'#ffffff'],life:1,grav:4});
    pillarT=performance.now();pillar.material.color.set(TEAMC[A()]);burst(p.x,1.2,p.z,6,C.marker,520);impactFrame(150);FX.flash=.8;FX.speed=1.4;FX.punch=1.2;
    cutIn('goal',{c:TEAMC[A()],sub:`${S.names[A()]} score`});}
  else if(o.type==='intercept'){SFX.thud();SFX.ooh();exciteT=.5;buzz([30,40,30]);shake=.35;dust.emit(p.x,.3,p.z,30,{speed:2.6,up:2.6,spread:.15,colors:[C.chalk,TEAMC[D()]],life:.8,grav:6});
    burst(p.x,.8,p.z,4,TEAMC[D()],420);impactFrame(90);FX.punch=.7;
    cutIn(o.onShot?'blocked':(o.kind==='tackle'?'tackle':'intercept'),{c:TEAMC[D()],sub:`${S.names[D()]} #${o.by+1} · ${ORDER_NAME[(o.order||{t:'zone'}).t]}`});}
  else{SFX.ooh();exciteT=.55;buzz([30,40,30]);if(o.missKind==='soft'){SFX.thud();SFX.trap();}
    cutIn(o.type==='astray'?'astray':(o.missKind||'wide'));}
}

/* ---------- camera ---------- */
const HUDM={top:0,bot:0};
function measure(){if(SCREEN!=='game'){HUDM.top=0;HUDM.bot=0;return;}HUDM.top=$('.band.top').getBoundingClientRect().bottom-14;HUDM.bot=innerHeight-$('.band.bot').getBoundingClientRect().top-14;}
const camS={mode:'orbit',from:null,t0:0,dur:1400,tgt:new V3(),off:0};
// the player's camera (SET.cam): Top-down or Isometric for setting up and planning, and Top-down,
// Isometric or Behind the play once the ball moves. The HUD camera button cycles them at any time.
const ISO_ZOOM=[1,2.6],PLAN_PH=['setupA','setupD','planA','planD'];
const viewFor=ph=>PLAN_PH.includes(ph)?(SET.cam==='iso'?'iso':'top'):(SET.cam||'top');
const CAM_NAME={top:'Top-down',iso:'Isometric',chase:'Behind the play'};
function camUI(){const ph=S.phase,shown=SCREEN==='game'&&!['ready','replay'].includes(ph),v=viewFor(ph);
  const b=$('#camBtn');b.hidden=!shown;b.dataset.v=v;b.setAttribute('aria-label',`Camera: ${CAM_NAME[v]}. Tap to switch.`);$('#camLbl').textContent={top:'TOP',iso:'ISO',chase:'CHASE'}[v];
  $('#zoom').hidden=!shown||v!=='iso';const z=SET.isoZoom||1;$('#zIn').disabled=z>=ISO_ZOOM[1]-.01;$('#zOut').disabled=z<=ISO_ZOOM[0]+.01;}
function cycleCam(){const opts=PLAN_PH.includes(S.phase)?['top','iso']:['top','iso','chase'],cur=viewFor(S.phase);
  SET.cam=opts[(opts.indexOf(cur)+1)%opts.length];saveSet();setCam(viewFor(S.phase),700);camUI();}
function zoomIso(f){SET.isoZoom=clamp((SET.isoZoom||1)*f,ISO_ZOOM[0],ISO_ZOOM[1]);saveSet();camUI();}
$('#camBtn').onclick=()=>{SFX.tap();cycleCam();};
$('#zIn').onclick=()=>{SFX.tap();zoomIso(1.25);};$('#zOut').onclick=()=>{SFX.tap();zoomIso(1/1.25);};
// mouse wheel / trackpad zoom over the pitch, isometric only
cv.addEventListener('wheel',e=>{if(SCREEN!=='game'||camS.mode!=='iso')return;e.preventDefault();zoomIso(e.deltaY<0?1.1:1/1.1);},{passive:false});
function setCam(m,dur=1400){if(camS.mode===m)return;camS.dur=dur;camS.from={pos:cam.position.clone(),tgt:camS.tgt.clone(),up:cam.up.clone(),off:camS.off};camS.mode=m;camS.t0=performance.now();}
function topH(){const H=innerHeight,Wd=innerWidth,tn=Math.tan(cam.fov*Math.PI/360),free=Math.max(160,H-HUDM.top-HUDM.bot);
  return Math.max(34*H/(2*tn*free),23*H/(2*tn*Wd));}
let shake=0;
function pose(m,now){
  if(m==='orbit'){const a=now/1000*.05;return{pos:new V3(Math.sin(a)*46,21,Math.cos(a)*46),tgt:new V3(0,1,0),up:new V3(0,1,0),off:0};}
  // kickoff page: a slow, low sweep around the empty pitch (held still for reduced motion)
  if(m==='sweep'){const a=reducedMotion()?.7:now/1000*.11;return{pos:new V3(Math.sin(a)*15,3.4+Math.sin(a*.8)*.6,Math.cos(a)*19),tgt:new V3(Math.sin(a+1)*2,1,0),up:new V3(0,1,0),off:0};}
  // goal replay: low, from behind and to the side of the ball, like a broadcast replay
  if(m==='replay'){const bp=ball.position;return{pos:new V3(bp.x*.4+7,6.5,clamp(bp.z+13,-4,30)),tgt:new V3(bp.x*.7,.6,bp.z-4),up:new V3(0,1,0),off:0};}
  // isometric: 45° round the pitch from the attacking corner, 35° down, framing the whole pitch between
  // the HUD bands; zoom moves in, and in play the view drifts toward the ball as it does
  if(m==='iso'){const H=innerHeight,Wd=innerWidth,tn=Math.tan(cam.fov*Math.PI/360),free=Math.max(160,H-HUDM.top-HUDM.bot);
    const fit=Math.max(11.5*H/(tn*free),20.5*H/(tn*Wd)),z=clamp(SET.isoZoom||1,ISO_ZOOM[0],ISO_ZOOM[1]),d=fit/z;
    const bp=ball.position,live=['play','replay','result','over'].includes(S.phase),k=live?1-1/z:0;
    const tgt=new V3(bp.x*k,0,bp.z*k),el=.615,yaw=Math.PI/4;
    return{pos:new V3(tgt.x+d*Math.cos(el)*Math.sin(yaw),d*Math.sin(el),tgt.z+d*Math.cos(el)*Math.cos(yaw)),tgt,up:new V3(0,1,0),off:.8};}
  if(m==='chase'){const bp=ball.position;return{pos:new V3(bp.x*.35,14,clamp(bp.z+19,6,32)),tgt:new V3(bp.x*.5,0,bp.z-6),up:new V3(0,1,0),off:.5};}
  return{pos:new V3(0,topH(),0),tgt:new V3(0,0,0),up:new V3(0,0,-1),off:1};
}
let coneA=0;
function updateCam(now,dt){
  let p=pose(camS.mode,now);
  if(camS.from){const k=clamp((now-camS.t0)/camS.dur,0,1),e=k*k*(3-2*k),f=camS.from;
    p={pos:f.pos.clone().lerp(p.pos,e),tgt:f.tgt.clone().lerp(p.tgt,e),up:f.up.clone().lerp(p.up,e).normalize(),off:f.off+(p.off-f.off)*e};if(k>=1)camS.from=null;}
  cam.position.copy(p.pos);if(shake>0){cam.position.x+=rnd(-1,1)*shake*.5;cam.position.z+=rnd(-1,1)*shake*.5;}
  // anime punch-in: dolly toward the ball and tilt the frame a touch, then ease back
  if(FX.punch>0){const k=Math.sin(Math.min(1,FX.punch)*Math.PI/2);cam.position.lerp(ball.position,.2*k);}
  cam.up.copy(p.up);cam.lookAt(p.tgt);camS.tgt.copy(p.tgt);camS.off=p.off;
  // isometric sits outside the stadium: the near plane cuts away the stands and the floodlight mast
  // between the camera and the pitch, so the view reads as a cutaway
  const near=camS.mode==='iso'?Math.max(.5,cam.position.distanceTo(p.tgt)-19):.5;
  if(Math.abs(cam.near-near)>.05){cam.near=near;cam.updateProjectionMatrix();}
  if(FX.punch>0)cam.rotateZ(Math.sin(Math.min(1,FX.punch)*Math.PI/2)*.07);
  const shift=(HUDM.top-HUDM.bot)/2*p.off;
  if(Math.abs(shift)>.5)cam.setViewOffset(innerWidth,innerHeight,0,-shift,innerWidth,innerHeight);else cam.clearViewOffset();
  // floodlight beams only read from the side; fade them out as the camera tips over the pitch
  coneA+=((1-p.off)*.06-coneA)*Math.min(1,dt*4);cones.forEach(c=>{c.material.opacity=coneA;c.visible=coneA>.005;});
}

/* ---------- stopwatch & meter ---------- */
(function(){const g=$('#swTicks');let h='';for(let i=0;i<10;i++){const a=i/10*Math.PI*2,c=Math.sin(a),s2=-Math.cos(a);h+=`<line x1="${32+c*22}" y1="${42+s2*22}" x2="${32+c*25}" y2="${42+s2*25}"/>`;}g.innerHTML=h;})();
function watch(f,left){const r=24,cx=32,cy=42,w=$('#swW'),el=$('#timer');
  if(f>=.999)w.setAttribute('d',`M${cx},${cy-r}A${r},${r} 0 1 1 ${cx-.01},${cy-r}Z`);else if(f<=0)w.setAttribute('d','');
  else{const a=(1-f)*Math.PI*2,x=cx+Math.sin(a)*r,y=cy-Math.cos(a)*r;w.setAttribute('d',`M${cx},${cy}L${x},${y}A${r},${r} 0 ${f>.5?1:0} 1 ${cx},${cy-r}Z`);}
  $('#swH').setAttribute('transform',`rotate(${(1-f)*360} 32 42)`);const sec=Math.max(0,Math.ceil(left/1000));$('#secs').textContent=sec;
  const low=left<3000;el.classList.toggle('low',low);el.classList.toggle('ticking',low);
  if(low&&sec<S.lastSec&&sec>0)SFX.tick();S.lastSec=sec;}
function meterUI(now){const m=S.meter,show=SCREEN==='game'&&S.phase==='planA'&&!!m&&ov.hidden;const el=$('#meter');if(el.hidden===show)el.hidden=!show;if(!show)return;
  paintMeter(el,m,now);}
// one strike meter (the HUD's, or a tutorial card's copy of it): m = {sw: sweet spot, t0, v (null = running)}
function paintMeter(el,m,now){const v=m.v==null?needle(now,m.t0):m.v,z=el.querySelector('.mzone'),lab=el.querySelector('.mlab');
  z.style.left=((m.sw.c-m.sw.w/2)*100)+'%';z.style.width=(m.sw.w*100)+'%';el.querySelector('.mneedle').style.left=(v*100)+'%';
  lab.textContent=m.v==null?'TAP IN THE YELLOW FOR A PERFECT SHOT':'STRIKE SET';lab.style.color=m.v==null?C.marker:C.chalk;}

/* ---------- anime composite: ink outlines, grade, impact frame, speed lines, flash ---------- */
// The scene renders into a linear target; one full-screen pass then draws ink lines where the depth
// buffer folds (Laplacian of 1/z, so flat ground never lines itself), boosts colour like a cel anime,
// and layers the anime beats: a black-and-white impact frame, radial speed lines around the ball and a
// white flash.
const FX={impactUntil:0,speed:0,flash:0,punch:0,focus:new THREE.Vector2(.5,.5)};
function impactFrame(ms){FX.impactUntil=performance.now()+ms;document.body.classList.add('impact');setTimeout(()=>document.body.classList.remove('impact'),ms);}
const POST=(()=>{try{
  const caps=R3.capabilities,hasDepth=caps.isWebGL2||!!R3.extensions.get('WEBGL_depth_texture');
  const half=caps.isWebGL2&&!!R3.extensions.get('EXT_color_buffer_float');
  const rt=new THREE.WebGLRenderTarget(2,2,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat,type:half?THREE.HalfFloatType:THREE.UnsignedByteType,depthBuffer:true});
  if(hasDepth){rt.depthTexture=new THREE.DepthTexture(2,2);rt.depthTexture.type=THREE.UnsignedIntType;}
  const U={tColor:{value:rt.texture},tDepth:{value:rt.depthTexture},uTexel:{value:new THREE.Vector2()},uNear:{value:cam.near},uFar:{value:cam.far},
    uEdge:{value:.012},uInk:{value:hasDepth?1:0},uImpact:{value:0},uSpeed:{value:0},uFlash:{value:0},uTime:{value:0},uAspect:{value:1},uFocus:{value:FX.focus}};
  const mat=new THREE.ShaderMaterial({uniforms:U,depthTest:false,depthWrite:false,
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader:`uniform sampler2D tColor,tDepth;uniform vec2 uTexel,uFocus;uniform float uNear,uFar,uEdge,uInk,uImpact,uSpeed,uFlash,uTime,uAspect;varying vec2 vUv;
    float iz(vec2 uv){float d=texture2D(tDepth,uv).x;return (uFar-d*(uFar-uNear))/(uNear*uFar);}
    float hash(float n){return fract(sin(n)*43758.5453);}
    vec3 srgb(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(.0031308,c));}
    vec3 rrt(vec3 v){vec3 a=v*(v+.0245786)-.000090537;vec3 b=v*(.983729*v+.432951)+.238081;return a/b;}
    vec3 aces(vec3 c){const mat3 I=mat3(vec3(.59719,.076,.0284),vec3(.35458,.90834,.13383),vec3(.04823,.01566,.83777));
      const mat3 O=mat3(vec3(1.60475,-.10208,-.00327),vec3(-.53108,1.10813,-.07276),vec3(-.07367,-.00605,1.07602));
      return clamp(O*rrt(I*(c*1.05/.6)),0.,1.);}
    void main(){
      vec3 c=texture2D(tColor,vUv).rgb;
      // the filmic curve the scene was lit for, rescaled so pure white (chalk lines, overlay) stays white
      c=clamp(aces(c)/aces(vec3(1.)),0.,1.);
      c=srgb(c);
      float l=dot(c,vec3(.299,.587,.114));c=clamp(mix(vec3(l),c,1.25),0.,1.);c=clamp((c-.5)*1.12+.5,0.,1.);
      float ink=0.;
      if(uInk>.5){float w=iz(vUv),wl=iz(vUv-vec2(uTexel.x,0.)),wr=iz(vUv+vec2(uTexel.x,0.)),wd=iz(vUv-vec2(0.,uTexel.y)),wu=iz(vUv+vec2(0.,uTexel.y));
        float e=(abs(wl+wr-2.*w)+abs(wu+wd-2.*w))/max(w,1e-6);ink=smoothstep(uEdge,uEdge*2.5,e);}
      c=mix(c,vec3(.06,.07,.11),ink*.88);
      vec2 p=(vUv-uFocus)*vec2(uAspect,1.);float r=length(p),a=atan(p.y,p.x);
      float id=floor((a+3.14159)/6.28318*150.),h=hash(id+floor(uTime*20.)*7.13);
      float sl=step(.74,h)*smoothstep(.16+h*.22,.62,r);
      c=mix(c,vec3(1.),sl*clamp(uSpeed,0.,1.)*.8);
      vec3 imp=vec3(1.-step(.5,l));imp=mix(imp,vec3(1.),ink);imp*=vec3(1.,.93,.9);
      c=mix(c,imp,uImpact);
      c=mix(c,vec3(1.),uFlash);
      c*=1.-.22*smoothstep(.6,1.25,length((vUv-.5)*vec2(uAspect,1.))*1.25);
      gl_FragColor=vec4(c,1.);}`});
  const quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),mat);quad.frustumCulled=false;
  const ps=new THREE.Scene();ps.add(quad);const pc=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  return{rt,U,render(){R3.setRenderTarget(rt);R3.render(scene,cam);R3.setRenderTarget(null);R3.render(ps,pc);},
    size(w,h){const ss=Q().ss;let pr=clamp(window.devicePixelRatio||1,ss[0],ss[1]);pr=Math.min(pr,MAXTEX/w,MAXTEX/h);rt.setSize(Math.round(w*pr),Math.round(h*pr));
      U.uTexel.value.set(pr/(w*pr)*1.25,pr/(h*pr)*1.25);U.uAspect.value=w/h;U.uInk.value=hasDepth?1:0;}};
}catch(e){console.warn('FootSal: no composite pass',e);return null;}})();
const projV=new V3();
function updatePost(now,dt){
  FX.speed=Math.max(0,FX.speed-dt*1.4);FX.flash=Math.max(0,FX.flash-dt*3);FX.punch=Math.max(0,FX.punch-dt*1.3);
  if(!POST)return;const U=POST.U;
  projV.copy(ball.position).project(cam);FX.focus.lerp(new THREE.Vector2(projV.x*.5+.5,projV.y*.5+.5),Math.min(1,dt*12));
  U.uImpact.value=now<FX.impactUntil?1:0;U.uSpeed.value=FX.speed;U.uFlash.value=FX.flash;U.uTime.value=now/1000;
}

/* ---------- cut-ins: an anime splash for every game state ---------- */
// size: small (top banner, no flash), big, huge (goal and match end); sad = gloom lines and drooping text.
const CUTS={
  attack:{t:'ATTACK!',jp:'攻撃開始',size:'small',sfx:'swish'},
  defend:{t:'DEFENCE!',jp:'守備につけ',size:'small',sfx:'swish'},
  kickoff:{t:'KICK OFF!',jp:'キックオフ',size:'big',sfx:'kickoff',d:1150},
  pass:{t:'PASS!',jp:'パス',size:'small',sfx:'swish',d:750},
  shot:{t:'SHOOT!!',jp:'シュート',size:'big',sfx:'shot',d:1000},
  perfect:{t:'PERFECT!!',jp:'会心のシュート',size:'big',sfx:'perfect',d:1100},
  sweet:{t:'SWEET SPOT!',jp:'ナイス!',size:'small',sfx:'sparkle',d:800},
  takeshot:{t:'TAKE YOUR SHOT!',jp:'シュートを打て!',size:'small',sfx:'swish',d:1200},
  goal:{t:'GOAL!!',jp:'ゴール!!',size:'huge',sfx:'goal',d:2000},
  blocked:{t:'BLOCKED!',jp:'ブロック!!',size:'big',sfx:'blocked',d:1500},
  intercept:{t:'INTERCEPTED!',jp:'パスカット!!',size:'big',sfx:'blocked',d:1500},
  tackle:{t:'TACKLED!',jp:'タックル!!',size:'big',sfx:'blocked',d:1500},
  astray:{t:'MISPLACED…',jp:'パスミス…',size:'big sad',sfx:'sad',d:1500,sub:'The pass ran astray'},
  wide:{t:'WIDE…',jp:'はずれ…',size:'big sad',sfx:'sad',d:1500,sub:'Drifted past the post'},
  hard:{t:'TOO HARD…',jp:'ふかした…',size:'big sad',sfx:'sad',d:1500,sub:'Dragged wide'},
  soft:{t:'TOO SOFT…',jp:'よわい…',size:'big sad',sfx:'sad',d:1500,sub:'The keeper gathers it'},
  noplan:{t:'NO PLAN…',jp:'ノープラン…',size:'big sad',sfx:'sad',d:1500,sub:'Attack wasted'},
  offside:{t:'OFFSIDE!',jp:'オフサイド',size:'small',sfx:'swish',d:900},
  win:{t:'VICTORY!!',jp:'勝利',size:'huge',sfx:'goal',d:2200},
  lose:{t:'DEFEAT…',jp:'敗北',size:'huge sad',sfx:'sad',d:2200}
};
const cutEl=$('#cut');
function cutIn(key,o={}){
  const d=CUTS[key];if(!d)return;
  const dur=(d.d||1000)*(matchMedia('(prefers-reduced-motion: reduce)').matches?.7:1),small=d.size.includes('small');
  // a bigger beat clears whatever is on screen; small banners only replace other small banners
  [...cutEl.children].forEach(c=>{if(!small||c.classList.contains('small'))c.remove();});
  const el=document.createElement('div');el.className='ci '+d.size;
  el.style.setProperty('--d',dur/1000+'s');el.style.setProperty('--c',o.c||(d.size.includes('sad')?'#8c97a6':C.marker));
  // on a team band, the katakana, subline and letter outlines use that team's contrast-safe ink
  const tm=TEAMS.find(t=>t.accent===o.c);if(tm)el.style.setProperty('--c2',tm.on);
  const letters=[...(o.t||d.t)].map((ch,i)=>`<i style="--i:${i}">${ch===' '?'&nbsp;':esc(ch)}</i>`).join('');
  const sub=o.sub!=null?o.sub:(d.sub||'');
  el.innerHTML=`<div class="ci-flash"></div><div class="ci-lines"></div><div class="ci-band"><span class="ci-jp" lang="ja">${esc(d.jp)}</span><b class="ci-t" aria-label="${esc(o.t||d.t)}">${letters}</b>${sub?`<span class="ci-sub">${esc(sub)}</span>`:''}</div>`;
  cutEl.appendChild(el);setTimeout(()=>el.remove(),dur+40);
  if(!small&&!d.size.includes('sad'))FX.flash=Math.max(FX.flash,.35);
  const s=SFX.anime[d.sfx];if(s)s();
}

/* ---------- tutorial: first-time cards and How to play ---------- */
// Every card's loop is drawn live by the overlay's own painter (paintOverlay and everything it calls) on a
// mini pitch over the turf texture, with the real strike meter, scoreboard and order fan, all driven by a
// scripted state on a timeline (the plays are real simulate() runs, replayed like the game replays them).
// Change a drawing function and the cards change with it.
const TIP_KEY='footsal.tips.v1';
// {intro, seen: {cardId: 1}}. If storage can't be read the intro counts as seen, so nobody gets stuck on
// it, and the phase cards still show once per visit.
const TIP=(()=>{try{const d=JSON.parse(localStorage.getItem(TIP_KEY)||'{}')||{};return{intro:!!d.intro,seen:d.seen&&typeof d.seen==='object'?d.seen:{}};}
  catch(e){return{intro:true,seen:{}};}})();
const saveTips=()=>{try{localStorage.setItem(TIP_KEY,JSON.stringify(TIP));}catch(e){}};
const markSeen=ids=>{ids.forEach(id=>{TIP.seen[id]=1;});saveTips();};
const CARD={
  win:{t:'How you win',b:'Score more goals than the other team. First to 3 goals wins.'},
  turns:{t:'Taking turns',b:'You attack, then defend, then swap.'},
  phases:{t:'The two phases',b:'Each turn is Set up, where you place your players, then Plan, where you choose your moves.'},
  setup:{t:'Phase 1 · Set up',b:"Drag your players into place. The other side can't see them."},
  circles:{t:'Phase 2 · Reading the circles',b:'Each circle hides one opponent somewhere inside, not always at the centre.'},
  attack:{t:'Attacking',b:'Tap who starts, then each pass, then the goal, and stop the needle in the yellow.'},
  orders:{t:'Defending · Orders',b:'Give each defender an order: Hold guards nearby passing lanes, Press chases the ball, Mark sticks to one attacker.'},
  kickoff:{t:'Kickoff',b:'Defenders run once the ball moves, so a longer pass chain pulls them out of place but gives them time to close in.'}};
const INTRO=['win','turns','phases'],DECK=['win','turns','setup','circles','attack','orders','kickoff'];
// the cards each phase shows the first time a player reaches it ('circles' only once overall)
const PHASE_TIPS={setupA:['setup'],setupD:['setup'],planA:['circles','attack'],planD:['circles','orders'],ready:['kickoff']};

const ease=k=>k*k*(3-2*k),span=(t,a,b)=>clamp((t-a)/(b-a),0,1),lerpP=(a,b,k)=>({x:a.x+(b.x-a.x)*k,y:a.y+(b.y-a.y)*k});
const tipSt=(ph,A,D,o)=>Object.assign({game:true,ph,A,D,zones:null,goal:null,arrows:[],links:[],shifts:[],atts:null,defs:null,chips:null,badges:[],offside:null,lesson:null},o);
const spots=(pts,ring)=>pts.map((p,i)=>({p,ring:ring?ring(i):null}));
const badgesOf=(att,seq)=>{const m={},out=[];seq.forEach((idx,k)=>(m[idx]=m[idx]||[]).push(k+1));Object.entries(m).forEach(([idx,ks])=>out.push({p:att[idx],lbl:ks.join('·')}));return out;};
// simulate() with a fixed random draw, so a card's play comes out the same every time
function fixedPlay(att,def,seq,orders){const r=Math.random;Math.random=()=>.001;
  try{return simulate(att,def,seq,{t0:0,sw:{c:.62,w:.24},v:.62},orders);}finally{Math.random=r;}}
// the play at t seconds after the first kick, as the overlay shows it in play
function playSt(o,att,t,A,D){const b=ballAt(o,Math.max(0,t)),defs=trackAt(o.track,Math.max(0,t),'d');
  return{b,defs,st:tipSt('play',A,D,{trails:{track:o.track,tn:Math.max(0,t),defs},arrows:t>0?playArrows(o,b):[],atts:spots(att),defs:spots(defs),
    chips:defs.map((p,i)=>({p,o:o.orders[i]||{t:i?'zone':'keep'},sel:false})),links:o.orders.map((x,i)=>x.t==='mark'?[defs[i],att[x.k]]:null).filter(Boolean)})};}
// tutorial-only cues on top of the real overlay: the ball (a 3D model in the game), a finger and a tap
function tipBall(b){if(!b)return;ctx.beginPath();ctx.arc(b.x,b.y,.017,0,7);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=.005;ctx.stroke();}
function tipFinger(p){ctx.save();ctx.globalAlpha=.6;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.x+.012,p.y+.018,.03,0,7);ctx.fill();ctx.restore();}
function tipTap(p,k){if(k<=0||k>=1)return;ctx.save();ctx.globalAlpha=1-k;ctx.strokeStyle='#fff';ctx.lineWidth=.008;ctx.beginPath();ctx.arc(p.x,p.y,.03+k*.06,0,7);ctx.stroke();ctx.restore();}

// scenes: view = [x0, y0, w, h] of the pitch shown; frame(t, run) returns the layers to paint and a dom()
// step for the HTML parts (scoreboard, meter, fan)
const SCENES={
  win(){const att=[{x:.28,y:.74},{x:.72,y:.48},{x:.46,y:.24}],def=[{x:.5,y:.05},{x:.2,y:.3},{x:.86,y:.62}];
    const o=fixedPlay(att,def,[0,1,2],[{t:'keep'},{t:'zone'},{t:'zone'}]),lead=.4,dur=Math.min(5,Math.max(3.4,lead+o.total+1.3));
    return{view:[0,-.2,1,1],dur,ui:`${sbHTML(0,0,'VS CPU','tip-sb')}`,
      frame(t){const p=playSt(o,att,t-lead,0,1),scored=o.type==='goal'&&t-lead>=o.total;
        return{layers:[{st:p.st,extra:()=>tipBall(p.b)}],
          dom:run=>{const el=run.el.querySelector('.tip-sb .t0 .sb-score'),v=scored?'1':'0';if(el.textContent!==v){el.textContent=v;el.classList.remove('bump');if(scored){void el.offsetWidth;el.classList.add('bump');}}}};}};},
  turns(){const a=P(SHAPES[5].A),d=P(SHAPES[5].D),dur=4.4;
    const atk=tipSt('setupA',0,1,{atts:spots(a)}),dfn=tipSt('setupD',1,0,{defs:spots(d)});
    // the camera sits on the attacking half, then glides to the defending half as the markings switch
    return{view:[-.05,.55,1.1,.95],dur,ui:'<span class="tip-chip"></span>',
      frame(t){const k=ease(span(t,2,2.35)),y0=.55-.6*ease(span(t,1.9,2.5));
        return{view:[-.05,y0,1.1,.95],layers:[{st:atk,alpha:1-k},{st:dfn,alpha:k}],dom:run=>{const c=run.el.querySelector('.tip-chip'),s=k<.5?'You attack':'You defend';if(c.textContent!==s)c.textContent=s;}};}};},
  phases(){const home=P(SHAPES[5].A),start=home.map((_,i)=>({x:.3+i*.1,y:1.42})),def=[{x:.5,y:.06},{x:.3,y:.32},{x:.7,y:.3},{x:.5,y:.5},{x:.5,y:.8}];
    const fz=def.map((p,i)=>({x:clamp(p.x+[.04,-.06,.06,-.05,.05][i],.05,.95),y:p.y+[.03,.05,-.04,-.06,.05][i]})),seq=[1,3,4],dur=4.8;
    return{view:[0,0,1,1.5],dur,ui:'<span class="tip-chip"></span>',
      frame(t){const plan=t>=2.4,pos=home.map((h,i)=>lerpP(start[i],h,ease(span(t,.2+i*.36,.5+i*.36))));
        const st=plan?tipSt('planA',0,1,{zones:{pts:fz,team:1,alpha:ease(span(t,2.4,2.9))},atts:spots(home),badges:badgesOf(home,seq.slice(0,t<3.3?1:t<3.8?2:3)),
            arrows:[[1,3,3.3],[3,4,3.8]].filter(x=>t>x[2]).map(([i,j,t0])=>({a:home[i],b:lerpP(home[i],home[j],ease(span(t,t0,t0+.3)))}))})
          :tipSt('setupA',0,1,{atts:spots(pos)});
        return{layers:[{st}],dom:run=>{const c=run.el.querySelector('.tip-chip'),s=plan?'2 · Plan':'1 · Set up';if(c.textContent!==s)c.textContent=s;}};}};},
  setup(){const home=P(SHAPES[5].A),start=home.map((_,i)=>({x:.26+i*.12,y:1.4})),dur=4.4;
    return{view:[0,.45,1,1.05],dur,
      frame(t){let drag=-1,fp=null;const pos=home.map((h,i)=>{const t0=.3+i*.62,k=span(t,t0,t0+.5);if(k>0&&k<1){drag=i;}return lerpP(start[i],h,ease(k));});
        if(drag>=0)fp=pos[drag];
        return{layers:[{st:tipSt('setupA',0,1,{atts:spots(pos,i=>i===drag?C.chalk:null)}),extra:()=>{if(fp)tipFinger(fp);}}]};}};},
  circles(){const def=[{x:.5,y:.06},{x:.28,y:.3},{x:.72,y:.27},{x:.5,y:.5}],off=[[.03,.05],[-.07,.05],[.06,-.06],[-.05,-.07]];
    const fz=def.map((p,i)=>({x:p.x+off[i][0],y:p.y+off[i][1]})),dur=4.6;
    return{view:[0,-.06,1,.78],dur,
      frame(t){const z=ease(span(t,.2,1)),r=ease(span(t,1.9,2.6));
        return{layers:[{st:tipSt('planA',0,1,{zones:{pts:fz,team:1,alpha:z}})},
          {alpha:r,extra:()=>{def.forEach((p,i)=>{ctx.strokeStyle=C.chalk;ctx.lineWidth=.005;ctx.setLineDash([.012,.01]);line(fz[i],p);ctx.setLineDash([]);spot(p,1,i+1);});}}]};}};},
  attack(){const att=[{x:.5,y:1.02},{x:.22,y:.8},{x:.78,y:.64},{x:.42,y:.46},{x:.62,y:.3}],seq=[1,3,4],tap=[.25,.8,1.35],goalT=1.9,dur=4.8;
    const fz=[{x:.53,y:.09},{x:.3,y:.33},{x:.7,y:.36}],last=att[4],sw=sweetFor(last),stopT=goalT+(1-sw.c/2)*1.9,tg=shotTarget(last,fz),gp={x:.5,y:.1};
    return{view:[0,-.04,1,1.12],dur,ui:`<div class="meter tip-meter" hidden><div class="mlab"></div><div class="mbar"><i class="mzone"></i><b class="mneedle"></b></div></div>`,
      frame(t){const n=tap.filter(x=>t>=x).length,s=seq.slice(0,n),shot=t>=goalT;
        const arrows=[];for(let k=1;k<n;k++)arrows.push({a:att[s[k-1]],b:lerpP(att[s[k-1]],att[s[k]],ease(span(t,tap[k],tap[k]+.3)))});
        if(shot)arrows.push({a:last,b:lerpP(last,tg,ease(span(t,goalT,goalT+.3))),dash:true,tA:PR+.01,tB:.005});
        const st=tipSt('planA',0,1,{zones:{pts:fz,team:1},atts:spots(att,i=>n&&s[n-1]===i?C.marker:null),badges:badgesOf(att,s),arrows,
          goal:n===seq.length&&!shot?{nag:false,last}:null});
        const taps=()=>{tap.forEach((x,k)=>tipTap(att[seq[k]],span(t,x,x+.45)));tipTap(gp,span(t,goalT,goalT+.45));};
        return{layers:[{st,extra:taps}],dom:run=>{const m=run.el.querySelector('.tip-meter');if(m.hidden===shot)m.hidden=!shot;
          if(shot)paintMeter(m,{sw,t0:goalT*1000,v:t>=stopT?sw.c:null},t*1000);}};}};},
  orders(){const def=[{x:.5,y:.06},{x:.27,y:.3},{x:.7,y:.28},{x:.52,y:.52}],att=[{x:.3,y:.82},{x:.72,y:.6},{x:.42,y:.36}];
    const fz=att.map((p,i)=>({x:p.x+[.04,-.05,.05][i],y:p.y+[-.04,.05,.04][i]})),ords=[{t:'keep'},{t:'zone'},{t:'press'},{t:'mark',k:1}];
    const o=fixedPlay(att,def,[0,1,2],ords),steps=[[1,'zone',.15,.75],[2,'press',.75,1.35],[3,'mark',1.35,2.1]],playT0=2.2,dur=Math.min(5,playT0+o.total+.4);
    return{view:[0,-.04,1,.98],dur,ui:'<div class="radial tip-fan"><div class="rd-fan"></div></div>',
      frame(t,run){
        if(t>=playT0){const p=playSt(o,att,t-playT0,1,0);return{layers:[{st:p.st,extra:()=>tipBall(p.b)}],dom:r=>tipFan(r,null)};}
        const set=ords.map((x,i)=>i===0?x:{t:'zone'});steps.forEach(([i,w,,t1])=>{if(t>=t1)set[i]=ords[i];});
        const cur=steps.find(([,,t0,t1])=>t>=t0&&t<t1);
        const st=tipSt('planD',1,0,{zones:{pts:fz,team:1},defs:spots(def),chips:def.map((p,i)=>({p,o:set[i],sel:cur&&cur[0]===i})),
          links:set.map((x,i)=>x.t==='mark'?[def[i],fz[x.k]]:null).filter(Boolean)});
        let fan=null,extra=null;
        if(cur){const[i,w,t0]=cur,hot=t>=t0+.3?w:null,marking=w==='mark'&&t>=t0+.55;fan={i,p:def[i],w:hot,cur:set[i].t,marking};
          extra=()=>radialPaint({me:def[i],num:i+1,dTeam:0,aTeam:1,circles:fz,orders:set,marking,wedge:hot,cur:set[i].t,hover:marking&&t>=t0+.7?1:-1,pointer:marking?lerpP(def[i],fz[1],span(t,t0+.55,t0+.7)):null,now:run.now});}
        return{layers:[{st,extra}],dom:r=>tipFan(r,fan)};}};},
  kickoff(){const att=[{x:.3,y:.84},{x:.76,y:.6},{x:.4,y:.32}],def=[{x:.5,y:.05},{x:.52,y:.62},{x:.24,y:.4}];
    const o=fixedPlay(att,def,[0,1,2],[{t:'keep'},{t:'press'},{t:'zone'}]),lead=.4,dur=Math.min(5,Math.max(3.4,lead+o.total+.9));
    return{view:[0,-.04,1,.98],dur,frame(t){const p=playSt(o,att,t-lead,0,1);return{layers:[{st:p.st,extra:()=>tipBall(p.b)}]};}};}
};
// the card's copy of the order fan, on its defender, scaled to the mini pitch
function tipFan(run,f){const wrap=run.el.querySelector('.tip-fan'),el=wrap.querySelector('.rd-fan');wrap.classList.toggle('open',!!f&&!f.marking);
  if(!f)return;const key=f.i+f.cur;if(run.fanKey!==key){run.fanKey=key;buildFan(el,-Math.PI/2,f.cur,f.i+1);}
  const[x0,y0,w]=run.view,k=run.el.clientWidth/w,sc=.6,O=RAD.OUTER;
  el.style.transform=`translate(${((f.p.x-x0)*k-O*sc).toFixed(1)}px,${((f.p.y-y0)*k-O*sc).toFixed(1)}px) scale(${sc})`;fanHot(el,f.w);}

let tip=null;
function tipPaint(run,layers){const{g,cv}=run,[x0,y0,w]=run.view,s=cv.width/w;
  g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);
  drawInto(g,s,x0,y0,()=>{if(turf)ctx.drawImage(turf.image,-.1,-.15,1.2,1.8);});
  layers.forEach(L=>{const a=L.alpha==null?1:L.alpha;if(a<=.002)return;const tg=a<.998?run.bg:g;
    if(tg!==g){tg.setTransform(1,0,0,1,0,0);tg.clearRect(0,0,cv.width,cv.height);}
    drawInto(tg,s,x0,y0,()=>{if(L.st)paintOverlay(L.st,run.now);if(L.extra)L.extra();});
    if(tg!==g){g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=a;g.drawImage(run.buf,0,0);g.restore();}});}
// one frame at t: the last 0.35 s crossfade into the first frame, so every loop is seamless
function tipDraw(run,t,now){run.now=now;const sc=run.sc,f=sc.frame(t,run);let layers=f.layers;run.view=f.view||sc.view;
  if(!run.once&&t>sc.dur-.35){const k=ease(span(t,sc.dur-.35,sc.dur)),f0=sc.frame(0,run),fade=(ls,m)=>ls.map(L=>Object.assign({},L,{alpha:(L.alpha==null?1:L.alpha)*m}));
    const v0=f0.view||sc.view;run.view=run.view.map((x,i)=>x+(v0[i]-x)*k);
    layers=fade(layers,1-k).concat(fade(f0.layers,k));if(k>.5&&f0.dom){f0.dom(run);tipPaint(run,layers);return;}}
  tipPaint(run,layers);if(f.dom)f.dom(run);}
function tipTick(now){const run=tip&&tip.run;if(!run||!run.cv.isConnected)return;
  if(run.vis&&!document.hidden){let t=(now-run.t0)/1000;
    if(run.once&&t>=run.sc.dur){tipDraw(run,run.sc.dur-.001,now);run.raf=0;const b=$('#tpRe');if(b)b.hidden=false;return;}
    tipDraw(run,run.once?t:t%run.sc.dur,now);}
  run.raf=requestAnimationFrame(tipTick);}
function tipStart(){const id=tip.list[tip.i],sc=SCENES[id](),st=$('.tip-stage'),cv=st.querySelector('canvas'),dpr=Math.min(2,window.devicePixelRatio||1);
  cv.width=Math.round(st.clientWidth*dpr);cv.height=Math.round(st.clientHeight*dpr);
  const buf=document.createElement('canvas');buf.width=cv.width;buf.height=cv.height;
  const run={sc,cv,g:cv.getContext('2d'),buf,bg:buf.getContext('2d'),el:st,t0:performance.now(),vis:true,once:reducedMotion(),now:performance.now()};
  // the loop only runs while its card is on screen
  if('IntersectionObserver' in window){run.io=new IntersectionObserver(e=>{run.vis=e[e.length-1].isIntersecting;});run.io.observe(st);}
  tip.run=run;
  // reduced motion: the last frame, with Replay to play it through once
  if(run.once){tipDraw(run,sc.dur-.001,run.now);$('#tpRe').hidden=false;}else run.raf=requestAnimationFrame(tipTick);
  $('#tpRe').onclick=()=>{SFX.tap();$('#tpRe').hidden=true;run.t0=performance.now();if(!run.raf)run.raf=requestAnimationFrame(tipTick);};}
function tipStop(){const run=tip&&tip.run;if(!run)return;if(run.raf)cancelAnimationFrame(run.raf);run.raf=0;if(run.io)run.io.disconnect();tip.run=null;}
// kind: 'intro' (first launch: Got it + Skip tutorial), 'phase' (first time in a phase: Got it), 'deck'
// (How to play: Back / Next / Done, swipe, close; never changes what has been seen)
function openTips(list,kind,done){tipStop();tip={list,i:0,kind,done};showTip();}
function showTip(){const id=tip.list[tip.i],c=CARD[id],n=tip.list.length,last=tip.i===n-1,deck=tip.kind==='deck',sc=SCENES[id]();
  const ar=`${sc.view[2]}/${sc.view[3]}`;
  const nav=deck?`<button class="ghost" id="tpBack" type="button"${tip.i?'':' disabled'}>Back</button><button class="prime" id="tpNext" type="button">${last?'Done':'Next'}</button>`
    :`<button class="prime" id="tpNext" type="button">Got it</button>`;
  showOv(`<div class="card tip" role="dialog" aria-modal="true" aria-labelledby="tpT" data-card="${id}">
    ${n>1?`<div class="tip-dots" aria-label="Card ${tip.i+1} of ${n}">${tip.list.map((_,k)=>`<i${k===tip.i?' class="on"':''}></i>`).join('')}</div>`:''}
    ${deck?'<button class="tip-x" id="tpX" type="button" aria-label="Close">×</button>':''}
    <h2 class="hl" id="tpT">${esc(c.t)}</h2>
    <div class="tip-stage" style="--ar:${ar}"><canvas aria-hidden="true"></canvas>${sc.ui||''}<button class="ghost tip-replay" id="tpRe" type="button" hidden>Replay</button></div>
    <p class="tip-body">${esc(c.b)}</p>
    <div class="tip-nav">${nav}</div>
    ${tip.kind==='intro'?'<button class="ghost tip-skip" id="tpSkip" type="button">Skip tutorial</button>':''}</div>`,'tip');
  const next=()=>{SFX.tap();if(tip.kind!=='deck')markSeen([id]);if(last)closeTips('done');else{tipStop();tip.i++;showTip();}};
  const back=()=>{if(!deck||!tip.i)return;SFX.tap();tipStop();tip.i--;showTip();};
  $('#tpNext').onclick=next;if(deck){$('#tpBack').onclick=back;$('#tpX').onclick=()=>{SFX.tap();closeTips('close');};}
  if(tip.kind==='intro')$('#tpSkip').onclick=()=>{SFX.tap();markSeen(Object.keys(CARD).concat('lostBall'));closeTips('skip');};
  // swipe left for the next card, right for the previous one (How to play)
  const card=$('.card.tip');let sx=null;
  card.onpointerdown=e=>{sx=e.clientX;};card.onpointerup=e=>{if(sx==null)return;const dx=e.clientX-sx;sx=null;if(e.target.closest('button'))return;
    if(dx<-50&&(deck||tip.kind==='intro'))next();else if(dx>50)back();};
  tipStart();$('#tpNext').focus({preventScroll:true});}
function closeTips(why){tipStop();const d=tip&&tip.done;tip=null;hideOv();if(d)d(why);}
window.addEventListener('keydown',e=>{if(!tip)return;
  if(e.key==='ArrowRight'){e.preventDefault();$('#tpNext').click();}
  else if(e.key==='ArrowLeft'&&tip.kind==='deck'){e.preventDefault();const b=$('#tpBack');if(b&&!b.disabled)b.click();}
  else if(e.key==='Escape'&&tip.kind==='deck'){e.preventDefault();closeTips('close');}});
// before a human turn in phase ph: any cards not seen yet, with the clock stopped while they are up and
// restarted with exactly the time that was left
function tipsFor(ph,then){const due=(PHASE_TIPS[ph]||[]).filter(id=>!TIP.seen[id]);if(!due.length){then();return;}
  const left=S.deadline?S.deadline-performance.now():null;S.deadline=null;S.tipHold=true;if(left!=null)watch(clamp(left/(S.dur||10000),0,1),left);
  openTips(due,'phase',()=>{S.tipHold=false;if(left!=null&&S.phase===ph)S.deadline=performance.now()+left;then();});}

/* ---------- loop ---------- */
function resize(){R3.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();if(POST)POST.size(innerWidth,innerHeight);measure();}
window.addEventListener('resize',resize);
// switch presets live: resolution, shadows, turf and overlay canvases now; sharper maps and sky as they
// download (going back to Standard swaps the shipped 1k files back in)
function applyQuality(){const q=Q();
  R3.setPixelRatio(Math.min(window.devicePixelRatio||1,q.pr));setShadow();buildTurf();
  if(OVS!==q.ov){OVS=q.ov;ovc.width=Math.round(1.1*OVS);ovc.height=Math.round(1.66*OVS);ovTex.dispose();ovTex.needsUpdate=true;}
  PBRS.forEach(e=>loadPBR(e,q));loadSky(q.sky);resize();}
document.addEventListener('visibilitychange',()=>{if(!AU.ctx)return;if(document.hidden)AU.ctx.suspend();else AU.ctx.resume();});
let lastT=performance.now(),lastOv=0;
function loop(now){
  const dt=Math.min(.05,(now-lastT)/1000);lastT=now;
  if(S.deadline&&!S.waiting&&!S.paused){const left=S.deadline-now;watch(clamp(left/(S.dur||10000),0,1),left);if(left<=0){S.deadline=null;finishPhase();}}
  exciteT=Math.max(S.phase==='ready'?.62:.12,exciteT-dt*.12);excite+=(exciteT-excite)*Math.min(1,dt*3);CU.uExcite.value=excite;CU.uTime.value=now/1000;
  shake=Math.max(0,shake-dt*2);
  crowdTick(now);syncWorld(now,dt);dust.update(dt);confetti.update(dt);sparks.update(dt);updateFireworks(now);updateRing(now);updateAnimeFx(now,dt);updateFlashes(dt);meterUI(now);radialFrame();

  if(now-lastOv>33){drawOverlay(now);ovTex.needsUpdate=true;lastOv=now;}
  updateCam(now,dt);updatePost(now,dt);
  if(POST)POST.render();else R3.render(scene,cam);
  requestAnimationFrame(loop);
}
lineupMenu();resize();splash();requestAnimationFrame(loop);
if(SET.quality!=='standard')applyQuality();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{paintBoards(S.names?S.names[0]:'Home',S.names?S.names[1]:'Away');boardClones.forEach(t=>t.needsUpdate=true);});
if(/[?&]debug/.test(location.search))window.__fs={get S(){return S;},SET,AU,T3,scene,cam,go,newGame,startAttack,simulate,settleShot,botOrders,defaultOrders,segHit,enforceBox,botPlanA,botPlanD,effectsFor,fireworks,cutIn,FX,POST,applyQuality,ui,screenOf,planPos,TIP,openTips,SCENES,hud,get tip(){return tip;},tipAt:t=>{const r=tip&&tip.run;if(r){r.vis=false;tipDraw(r,t,performance.now());}},
  wedgeScreen:w=>ui.fanC?RAD.wedgeCentre(ui.fanC,ui.fan,w):null,PBRS,SKY,R3,sun,get turf(){return turf;}};
})();
