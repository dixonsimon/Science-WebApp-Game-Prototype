// --- Inline Perlin Noise Function (no external lib needed) ---
function PerlinNoise(seed = 0) {
  const p = new Uint8Array(512);
  const permutation = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  for (let i=0; i < 256 ; i++) p[256+i] = p[i] = permutation[i];
  this.noise2D = function(x, y) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const a = p[X] + Y, b = p[X + 1] + Y;
    return lerp(v, lerp(u, grad(p[a], x, y), grad(p[b], x-1, y)), lerp(u, grad(p[a + 1], x, y-1), grad(p[b + 1], x - 1, y-1)));
  };
  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(t, a, b) { return a + t * (b - a); }
  function grad(hash, x, y) {
    const h = hash & 3;
    return (h === 0 ? x + y : (h === 1 ? -x + y : (h === 2 ? x - y : -x - y)));
  }
}

// --- Game Code ---
const facts={"Wildflower":["Wildflowers help pollinators survive!"],"Quartz Rock":["Quartz is a very common mineral."],"Water Sample":["Water is vital for all living things."],"Shell":["Shells protect animal bodies."]};
const sampleTypes=["Wildflower","Quartz Rock","Water Sample","Shell"];
const samples = [];
const researchLog=[];
const scene=new THREE.Scene();scene.background=new THREE.Color(0x66c6ff);
const camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,1000);
const renderer=new THREE.WebGLRenderer();renderer.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(renderer.domElement);

// ---- Smoother Perlin Terrain ----
const LAND_SIZE = 100, DETAIL = 48, simplex = new PerlinNoise(), groundVerts=[];
const geom = new THREE.PlaneGeometry(LAND_SIZE, LAND_SIZE, DETAIL, DETAIL); geom.rotateX(-Math.PI/2);
for(let i=0;i<geom.attributes.position.count;i++){
  const v=geom.attributes.position, x=v.getX(i),z=v.getZ(i),y=simplex.noise2D(x*0.04,z*0.04)*1.5 + simplex.noise2D(x*0.12,z*0.12)*0.5;
  v.setY(i,y); groundVerts.push(y);
}
const ground = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({color:0x32d97d,flatShading:true}));
ground.position.y=0;scene.add(ground);

// Helper: get Y for any (x,z)
function getTerrainHeight(x, z){
  let fx = Math.max(-LAND_SIZE/2, Math.min(LAND_SIZE/2-1, x)),
      fz = Math.max(-LAND_SIZE/2, Math.min(LAND_SIZE/2-1, z));
  let rx = (fx+LAND_SIZE/2)/(LAND_SIZE), rz = (fz+LAND_SIZE/2)/(LAND_SIZE);
  let pi = Math.floor(rx*DETAIL), pj = Math.floor(rz*DETAIL);
  let idx = pi + pj*(DETAIL+1);
  return groundVerts[idx];
}
// --- scientist/player (better model)
const scientist = new THREE.Group();
const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1, 8), new THREE.MeshPhongMaterial({color:0xffbc72}));
body.position.y = 0.5; scientist.add(body);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhongMaterial({color:0xffedd3}));
head.position.y = 1.2; scientist.add(head);
const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8), new THREE.MeshPhongMaterial({color:0xffe167}));
armL.position.set(-0.35, 0.8, 0); armL.rotation.z = Math.PI/6; scientist.add(armL);
const armR = armL.clone(); armR.position.x = 0.35; armR.rotation.z = -Math.PI/6; scientist.add(armR);
const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 8), new THREE.MeshPhongMaterial({color:0xDCD9DF}));
legL.position.set(-0.2, -0.3, 0); scientist.add(legL);
const legR = legL.clone(); legR.position.x = 0.2; scientist.add(legR);
let sx=0,sz=0; // scientist's world coordinates
let sy=getTerrainHeight(sx,sz)+1;
scientist.position.set(sx,sy,sz);scene.add(scientist);
scene.add(new THREE.HemisphereLight(0xffffff,0x449933,1));
const sun=new THREE.DirectionalLight(0xffffcc,.85);sun.position.set(6,10,8);scene.add(sun);
// --- Collectibles on terrain
function randomPos(){let r=24+Math.random()*30,a=Math.random()*Math.PI*2;return[Math.cos(a)*r,Math.sin(a)*r];}
for(let i=0;i<10;i++){
  let t=sampleTypes[i%sampleTypes.length],[x,z]=randomPos();
  let y=getTerrainHeight(x,z)+1,mesh;
  if(t=="Wildflower") mesh=new THREE.Mesh(new THREE.ConeGeometry(0.5,1.2,7),new THREE.MeshPhongMaterial({color:0xe2ff8c}));
  else if(t=="Quartz Rock") mesh=new THREE.Mesh(new THREE.DodecahedronGeometry(0.7),new THREE.MeshPhongMaterial({color:0xbbbaf2}));
  else if(t=="Water Sample") mesh=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.4,0.7,18),new THREE.MeshPhongMaterial({color:0x6dcfff}));
  else mesh=new THREE.Mesh(new THREE.TorusGeometry(0.45,0.16,12,22,Math.PI),new THREE.MeshPhongMaterial({color:0xf7fad0}));
  mesh.position.set(x,y,z);
  mesh.userData={type:t,collected:false,baseY:mesh.position.y};
  scene.add(mesh); samples.push(mesh);
}

// --- Clouds ---
const clouds=[];function addCloud(x,z,y=18,n=5){const cloud=new THREE.Group();for(let i=0;i<n;++i){let sph=new THREE.Mesh(new THREE.SphereGeometry(2.1+Math.random()*1.4,12,10),new THREE.MeshPhongMaterial({color:0xffffff}));sph.position.set((Math.random()-.5)*4.5,(Math.random()-.5)*2.7,(Math.random()-.5)*2.5);cloud.add(sph);}cloud.position.set(x,y,z);scene.add(cloud);clouds.push(cloud);}
for(let i=0;i<7;i++){let angle=Math.PI*2*(i/7),rad=32+Math.random()*24;addCloud(Math.cos(angle)*rad,Math.sin(angle)*rad,19+Math.random()*7,3+Math.floor(Math.random()*3));}

// --- Input, Camera, UI ---
let vy=0,inAir=false,keyState={}, az = 0, el = 0.18;
let stamina = 100, staminaBar = document.querySelector('#stamina .bar');
const logElem=document.getElementById('samples'),scoreElem=document.getElementById('score'),factDiv=document.getElementById('fact');
const compassArrow = document.getElementById('compass-arrow');
function updateLog(){logElem.innerHTML=researchLog.map(x=>'<li>'+x+'</li>').join('');}
function showFact(txt){factDiv.textContent=txt;factDiv.style.display='block';setTimeout(()=>factDiv.style.display='none',2400);}
let lockInstruct=document.getElementById('lock-instruct'),locked=false;
function lockEvent(){locked=document.pointerLockElement===renderer.domElement;lockInstruct.style.display=locked?'none':'block';}
document.body.addEventListener('click',()=>{renderer.domElement.requestPointerLock();});
document.addEventListener('pointerlockchange',lockEvent);lockEvent();
document.addEventListener('mousemove',function(e){
  if(!locked)return;
  az-=e.movementX*0.0022;
  el-=e.movementY*0.0022;
  el=Math.max(-Math.PI/4,Math.min(Math.PI/4,el));
});
document.addEventListener('keydown',function(e){
  if(e.code === 'ShiftLeft' || e.code === 'ShiftRight') keyState['Shift'] = true;
  else keyState[e.code] = true;
});
document.addEventListener('keyup',function(e){
  if(e.code === 'ShiftLeft' || e.code === 'ShiftRight') keyState['Shift'] = false;
  else keyState[e.code] = false;
});
let skyTime=0;
function animate(){
  skyTime += 0.008;
  let dayCol = new THREE.Color(0x66c6ff), eveCol = new THREE.Color(0xfadc8f);
  let t = Math.max(0,Math.min(1,0.5 + 0.5*Math.sin(skyTime/15)));
  scene.background = dayCol.clone().lerp(eveCol, t);
  for(let j=0;j<clouds.length;j++){
    let cloud=clouds[j];
    cloud.position.x += Math.sin(0.25*skyTime+j)*0.008;
    cloud.position.z += Math.cos(0.18*skyTime-j)*0.012;
    cloud.position.x = Math.max(-200,Math.min(200,cloud.position.x));
    cloud.position.z = Math.max(-200,Math.min(200,cloud.position.z));
  }
  // Controls relative to view (fixed direction)
  let baseSpeed = 0.16;
  let speed = (keyState['Shift'] && stamina > 0) ? baseSpeed * 1.8 : baseSpeed;
  let fw = new THREE.Vector3(Math.sin(az),0,Math.cos(az)).negate(); // Negate for correct forward
  let rt = new THREE.Vector3(Math.cos(az),0,-Math.sin(az));
  let dir = new THREE.Vector3();
  if(keyState["KeyW"])dir.add(fw);
  if(keyState["KeyS"])dir.sub(fw);
  if(keyState["KeyA"])dir.sub(rt);
  if(keyState["KeyD"])dir.add(rt);
  if(dir.length()>0){
    dir.normalize().multiplyScalar(speed);
    sx+=dir.x;sz+=dir.z;
    if(keyState['Shift'] && stamina > 0) stamina = Math.max(0, stamina - 0.5);
  } else if(stamina < 100) stamina = Math.min(100, stamina + 0.2);
  staminaBar.style.width = stamina + '%';
  staminaBar.classList.toggle('low', stamina < 30);
  // Invisible walls: clamp to land boundaries
  sx = Math.max(-LAND_SIZE/2, Math.min(LAND_SIZE/2, sx));
  sz = Math.max(-LAND_SIZE/2, Math.min(LAND_SIZE/2, sz));
  // Maintain on terrain
  sy = getTerrainHeight(sx, sz)+1;
  // Jump! (higher and faster fall)
  if(!inAir&&keyState['Space']){vy=1.0;inAir=true;}
  if(inAir){vy-=0.035;sy+=vy;if(sy<=getTerrainHeight(sx,sz)+1){sy=getTerrainHeight(sx,sz)+1;vy=0;inAir=false;}}
  scientist.position.set(sx,sy,sz);
  // Camera
  let r = 15, y = sy + 5 + 5*Math.sin(el), x = sx + r*Math.sin(az), z = sz + r*Math.cos(az);
  camera.position.set(x, y, z);camera.lookAt(sx, sy+1, sz);
  // Samples = animate, stick to terrain, collect
  samples.forEach((m,i)=>{
    m.position.y=getTerrainHeight(m.position.x,m.position.z)+1+Math.sin(Date.now()/450+i)*.21;
    m.rotation.y+=.016;
    if(!m.userData.collected&&scientist.position.distanceTo(m.position)<2){
      m.material.emissive=new THREE.Color(0x33ff99);
      if(keyState["KeyE"]){m.userData.collected=true;researchLog.push(m.userData.type);updateLog();scoreElem.textContent='Samples: '+researchLog.length;showFact(facts[m.userData.type][0]);}
    }else{m.material.emissive?.setRGB(0,0,0);}
    m.visible=!m.userData.collected;
  });
  // Compass rotation
  compassArrow.style.transform = `rotate(${ -az }rad)`;
  renderer.render(scene,camera);requestAnimationFrame(animate);
}
updateLog();animate();

// Compass labels
const compass = document.getElementById('compass');
['N', 'E', 'S', 'W'].forEach((dir, i) => {
  const el = document.createElement('div');
  el.className = 'dir';
  el.textContent = dir;
  const angle = i * 90 * (Math.PI / 180);
  const dist = 34;
  el.style.left = (40 + dist * Math.sin(angle)) + 'px';
  el.style.top = (40 - dist * Math.cos(angle)) + 'px';
  compass.appendChild(el);
});

// How to Play fade out
const instructions = document.getElementById('instructions');
setTimeout(() => instructions.style.opacity = '0', 10000);

// Audio setup
let audioContext, ambientSoundBuffer, footstepSoundBuffer, ambientSource;
document.body.addEventListener('click', async () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    await loadSounds();
    playAmbient();
  }
}, {once: true});

async function loadSounds() {
  const ambientResponse = await fetch('https://cdn.pixabay.com/download/audio/2021/08/04/audio_ace08d4649.mp3?filename=ambient-nature-10331.mp3');
  const ambientData = await ambientResponse.arrayBuffer();
  ambientSoundBuffer = await audioContext.decodeAudioData(ambientData);

  const footstepResponse = await fetch('https://cdn.pixabay.com/download/audio/2021/08/04/audio_7fc2e0359b.mp3?filename=footstep-on-grass-15820.mp3');
  const footstepData = await footstepResponse.arrayBuffer();
  footstepSoundBuffer = await audioContext.decodeAudioData(footstepData);
}

function playAmbient() {
  ambientSource = audioContext.createBufferSource();
  ambientSource.buffer = ambientSoundBuffer;
  ambientSource.loop = true;
  ambientSource.connect(audioContext.destination);
  ambientSource.start();
}

let lastStepTime = 0;
function tryPlayFootstep(time) {
  if (audioContext && time - lastStepTime > 400 && (keyState['KeyW'] || keyState['KeyA'] || keyState['KeyS'] || keyState['KeyD'])) {
    lastStepTime = time;
    const source = audioContext.createBufferSource();
    source.buffer = footstepSoundBuffer;
    source.connect(audioContext.destination);
    source.start();
  }
}

// Integrate into animate loop
const originalAnimate = animate;
animate = function() {
  tryPlayFootstep(performance.now());
  originalAnimate();
};