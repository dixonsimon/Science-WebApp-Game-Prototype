// --- THREE.js SETUP ---
    const scene = new THREE.Scene();
    // Bright, clear blue sky
    scene.background = new THREE.Color(0x66c6ff);

    const camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 2000);
    camera.position.set(0, 2.2, 10);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Sunlight and ambient
    scene.add(new THREE.HemisphereLight(0xe6faff, 0xcfecff, 0.55));
    var dirLight = new THREE.DirectionalLight(0xfffaf3, 1.1);
    dirLight.position.set(40,100,42);
    scene.add(dirLight);

    // LAND
    const LAND_SIZE = 200;
    const groundGeo = new THREE.BoxGeometry(LAND_SIZE, 1, LAND_SIZE);
    const groundMat = new THREE.MeshPhongMaterial({color: 0x7bd672});
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1.5;
    scene.add(ground);

    // SCIENTIST PLAYER: geometric, colorful
    const scientist = new THREE.Group();
    function buildScientist() {
      const shoeL = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.09, 14, 18, Math.PI), new THREE.MeshPhongMaterial({color:"#71789C"}));
      shoeL.position.set(-0.22, 0.11,-0.06); shoeL.rotation.x=Math.PI/2;
      const shoeR = shoeL.clone(); shoeR.position.x=0.22; scientist.add(shoeL,shoeR);

      const legMat = new THREE.MeshPhongMaterial({color: "#DCD9DF"});
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,0.42,8), legMat); legL.position.set(-0.22,0.37,0);
      const legR = legL.clone(); legR.position.x=0.22; scientist.add(legL, legR);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.64, 1.0, 0.42), new THREE.MeshPhongMaterial({color: "#ffbc72"})); body.position.y = 0.97; scientist.add(body);
      const tie = new THREE.Mesh(new THREE.ConeGeometry(0.09,0.22,7), new THREE.MeshPhongMaterial({color: "#3fa7f5"})); tie.position.set(0,1.35,0.21); scientist.add(tie);

      const should = new THREE.Mesh(new THREE.SphereGeometry(0.36,12,8), new THREE.MeshPhongMaterial({color:"#ffc6b9"}));
      should.scale.set(1.13,0.51,0.67); should.position.set(0,1.5,0); scientist.add(should);

      const armMat = new THREE.MeshPhongMaterial({color: "#ffe167"});
      const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.52, 8, 14), armMat);
      armL.position.set(-0.46,1.26,0); armL.rotation.z = Math.PI/10;
      const armR = armL.clone(); armR.position.x = 0.46; armR.rotation.z=-Math.PI/10; scientist.add(armL, armR);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.36,18,16), new THREE.MeshPhongMaterial({color: "#ffedd3"})); head.position.y = 1.98; scientist.add(head);

      const hatB = new THREE.Mesh(new THREE.CylinderGeometry(0.37,0.37,0.08,18), new THREE.MeshPhongMaterial({color:'#35477d'})); hatB.position.set(0,2.22,0);
      const hatT = new THREE.Mesh(new THREE.CylinderGeometry(0.24,0.24,0.25,15), new THREE.MeshPhongMaterial({color:'#1a2238'})); hatT.position.set(0,2.36,0);
      scientist.add(hatB, hatT);
    }
    buildScientist();
    scientist.position.set(0,0,0);
    scene.add(scientist);

    // --- WHITE OPAQUE CLOUDS ---
    function addCloud(x, z, y=31, n=5) {
      const cloud = new THREE.Group();
      for(let i=0;i<n;++i){
        const sph = new THREE.Mesh(
          new THREE.SphereGeometry(2.1 + Math.random()*1.7, 20,16),
          new THREE.MeshPhongMaterial({
            color:0xffffff,
            transparent: false,
            opacity: 1,
            shininess: 20
          })
        );
        sph.position.x = (Math.random()-0.5)*3.8;
        sph.position.z = (Math.random()-0.5)*2.9;
        sph.position.y = (Math.random()-0.6)*2.7;
        cloud.add(sph);
      }
      cloud.position.set(x,y,z);
      scene.add(cloud);
    }
    [
      [10, 23], [-20, 40], [-60, -15], [70, -70],
      [-40, 100], [60, 100], [-100, -100]
    ].forEach(([x,z])=>addCloud(x,z,31 + Math.random()*8, 4 + Math.floor(Math.random()*3)));

    // --- SAMPLES (unchanged, still fun and randomized) ---
    function makeFlower(x,z) {
      const group = new THREE.Group();
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.82, 8),
        new THREE.MeshPhongMaterial({color: 0x22991e}));
      stem.position.y = 0.41; group.add(stem);
      const blossom = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 12, 10),
        new THREE.MeshPhongMaterial({color: 0xffbae8}));
      blossom.position.set(0,0.87,0); group.add(blossom);
      const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 12, 10),
        new THREE.MeshPhongMaterial({ color: 0xffd000}));
      center.position.set(0,1,0); group.add(center);
      group.userData = {label: "Wildflower", collected: false};
      group.position.set(x, 0.05, z);
      return group;
    }
    function makeRock(x,z) {
      const mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.78,0),
        new THREE.MeshPhongMaterial({ color: 0xaea7cc, flatShading:true}));
      mesh.rotation.set(0.2,1,0);
      mesh.userData = {label: "Quartz Rock", collected:false};
      mesh.position.set(x,0.46,z);
      return mesh;
    }
    function makeMoss(x,z) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.66, 14, 8),
        new THREE.MeshPhongMaterial({color: 0x77edd4}));
      mesh.scale.y = 0.28;
      mesh.userData = {label: "Moss Patch", collected:false};
      mesh.position.set(x,0.18,z);
      return mesh;
    }
    function makeWaterSample(x,z) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22,0.23,0.55,14),
        new THREE.MeshPhongMaterial({color: 0x6dcfff, transparent:true, opacity: 0.66}));
      mesh.userData = {label:"Water Sample",collected:false};
      mesh.position.set(x,0.36,z);
      return mesh;
    }
    function makeSoilCore(x,z) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34,0.36,0.9,10),
        new THREE.MeshPhongMaterial({color: 0xc99e6a}));
      mesh.userData = {label:"Soil Core",collected:false};
      mesh.position.set(x,0.45,z);
      return mesh;
    }
    function makeTreeCone(x, z) {
      const group = new THREE.Group();
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.32, 0.8, 12),
        new THREE.MeshPhongMaterial({ color: 0xbd6856 }));
      cone.position.y = 0.4; group.add(cone);
      group.userData = {label: "Tree Cone", collected: false};
      group.position.set(x, 0.05, z);
      return group;
    }
    function makeShell(x, z) {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.36, 0.14, 12, 28, Math.PI),
        new THREE.MeshPhongMaterial({ color: 0xf7fad0 }));
      mesh.rotation.x = Math.PI/2;
      mesh.userData = {label: "Shell", collected: false};
      mesh.position.set(x,0.32,z);
      return mesh;
    }
    function makeFern(x, z) {
      const mesh = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.16, 0.69, 4, 8),
        new THREE.MeshPhongMaterial({ color: 0x70e360 }));
      mesh.rotation.x = Math.PI/5;
      mesh.userData = {label: "Fern", collected: false};
      mesh.position.set(x,0.55,z);
      return mesh;
    }
    function makeLeafFossil(x, z) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.74, 0.08, 0.5),
        new THREE.MeshPhongMaterial({ color: 0xd4cbaa }));
      mesh.userData = {label: "Leaf Fossil", collected: false};
      mesh.position.set(x,0.08,z);
      return mesh;
    }
    // Types and randomization
    const collectibleTypes = [
      {count: 2, maker: makeRock},
      {count: 2, maker: makeFlower},
      {count: 2, maker: makeWaterSample},
      {count: 2, maker: makeMoss},
      {count: 2, maker: makeSoilCore},
      {count: 2, maker: makeTreeCone},
      {count: 2, maker: makeShell},
      {count: 2, maker: makeFern},
      {count: 2, maker: makeLeafFossil}
    ];
    // Helper: random position within a ring (minRadius,maxRadius) from (0,0)
    function randomPosition(minR, maxR) {
      const rad = minR + Math.random() * (maxR - minR);
      const angle = Math.random() * Math.PI * 2;
      return [
        Math.round(Math.cos(angle) * rad),
        Math.round(Math.sin(angle) * rad)
      ];
    }

    const samples = [];
    // 1st half: close (20-50 units), 2nd half: farther (60-120 units)
    collectibleTypes.forEach(t=>{
      for(let i=0;i<t.count;i++){
        const isClose = (i % 2 == 0);
        const [x,z] = isClose ? randomPosition(20,48) : randomPosition(60,120);
        samples.push(t.maker(x,z));
      }
    });
    for (const s of samples) scene.add(s);

    // --- CAMERA + POINTER LOCK ---
    let pitchObject = new THREE.Object3D();
    pitchObject.add(camera);
    let yawObject = new THREE.Object3D();
    yawObject.position.y = 1.57;
    yawObject.add(pitchObject);
    scene.add(yawObject);

    function resetCameraToPlayer() {
      yawObject.position.set(scientist.position.x, 1.57, scientist.position.z);
    }
    resetCameraToPlayer();

    let isLocked=false;
    let rotationSpeed = 0.0022;

    function onMouseMove( event ) {
      if (!isLocked) return;
      yawObject.rotation.y -= event.movementX * rotationSpeed;
      pitchObject.rotation.x -= event.movementY * rotationSpeed;
      pitchObject.rotation.x = Math.max( -Math.PI/2, Math.min(Math.PI/2, pitchObject.rotation.x));
    }
    document.body.addEventListener('click', function(){
      if(!isLocked) renderer.domElement.requestPointerLock();
    });
    document.addEventListener('pointerlockchange', ()=>{
      isLocked = document.pointerLockElement === renderer.domElement;
      document.getElementById('lock-instruct').style.display = isLocked?"none":"block";
    });
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    if (!isLocked) document.getElementById('lock-instruct').style.display = 'block';

    let keys = {}, jumpKeyDown = false;
    document.addEventListener("keydown", e => { keys[e.code]=true; if(e.code==="Space") jumpKeyDown=true; });
    document.addEventListener("keyup",   e => { keys[e.code]=false; if(e.code==="Space") jumpKeyDown=false; });

    window.addEventListener('resize', ()=>{
      camera.aspect=window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const sampleListElem = document.getElementById("samples");
    let researchLog = [];
    function updateLog(){
      sampleListElem.innerHTML = "";
      for(const n of researchLog)
        sampleListElem.innerHTML += "<li>"+n+"</li>";
      if(researchLog.length === 0) sampleListElem.innerHTML = "<i>No samples yet</i>";
    }
    updateLog();

    // --- PHYSICS ---
    let vy = 0, inAir = false, GRAVITY = 0.016;

    function animate() {
      requestAnimationFrame(animate);

      // --- PLAYER MOVEMENT (WASD, relative to camera yaw) ---
      let speed = 0.15, jumpHeight = 0.31;
      let move = new THREE.Vector3();
      if(keys["KeyW"]) move.z -= 1;
      if(keys["KeyS"]) move.z += 1;
      if(keys["KeyA"]) move.x -= 1;
      if(keys["KeyD"]) move.x += 1;
      if(move.length()>0){
        move.normalize();
        const yaw = yawObject.rotation.y;
        let forward = new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw));
        let right = new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
        let moveDir = new THREE.Vector3();
        moveDir.addScaledVector(forward, move.z);
        moveDir.addScaledVector(right, move.x);
        moveDir.normalize();
        moveDir.multiplyScalar(speed);
        let next = scientist.position.clone().add(moveDir);
        const limit = LAND_SIZE/2-1.5;
        if(Math.abs(next.x) < limit && Math.abs(next.z) < limit) {
          scientist.position.x = next.x;
          scientist.position.z = next.z;
          yawObject.position.x = next.x;
          yawObject.position.z = next.z;
        }
      }

      scientist.rotation.y = yawObject.rotation.y;

      // --- JUMPING + GRAVITY ---
      if(!inAir && jumpKeyDown) {
        vy = 0.20;
        inAir = true;
      }
      if(inAir) {
        vy -= GRAVITY;
        scientist.position.y += vy;
        yawObject.position.y = scientist.position.y + 1.57;
        // Land on ground
        if(scientist.position.y <= 0){
          scientist.position.y = 0;
          yawObject.position.y = 1.57;
          inAir = false;
          vy = 0;
        }
      }

      // --- SAMPLE INTERACTION ---
      for(let m of samples){
        const sY = (m.position ? m.position.y : 0) + 0.14;
        const distance = scientist.position.clone().setY(0).distanceTo(m.position ? m.position.clone().setY(0) : new THREE.Vector3());
        if(!m.userData.collected && 
          (distance < 1.8) && Math.abs((scientist.position.y||0) - (sY)) < 1.1 ) {
          m.children?.forEach(p=>p.material.emissive?.setHex(0xffea8a));
          m.material?.emissive?.setHex(0xffea8a);
          if(keys["KeyE"]){
            m.userData.collected=true;
            researchLog.push(m.userData.label);
            m.visible = false;
            updateLog();
          }
        } else {
          m.children?.forEach(p=>p.material.emissive?.setHex(0x0));
          m.material?.emissive?.setHex(0x0);
        }
      }

      camera.position.set(0, 2.2, 10);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }
    animate();