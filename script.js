// --- THREE.js SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc7e9ff);
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 2000);
    camera.position.set(0, 2.2, 10);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // LIGHTS
    scene.add(new THREE.HemisphereLight(0xf9f9ff, 0x25872d, 0.54));
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(15,34,12); scene.add(dirLight);

    // BIGGER GROUND
    const LAND_SIZE = 200;
    const groundGeo = new THREE.BoxGeometry(LAND_SIZE, 1, LAND_SIZE);
    const groundMat = new THREE.MeshPhongMaterial({color: 0x429749});
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1.5;
    scene.add(ground);

    // --- SCIENTIST CHARACTER (capsule, football-head, little "armless" limbs) ---
    const scientist = new THREE.Group();
    scene.add(scientist);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.6,1.5,14), 
                               new THREE.MeshPhongMaterial({color: 0xf8e16c}));
    body.position.y = 1.05;
    scientist.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.6,18,14), 
                               new THREE.MeshPhongMaterial({color: 0xf9ede4}));
    head.scale.set(1, 1.25, 1);
    head.position.y = 2.13;
    scientist.add(head);
    const armMat = new THREE.MeshPhongMaterial({color: 0xe0d067});
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.18,0.9,8), armMat);
    const armR = armL.clone();
    armL.position.set(-0.65,1.1,0); armL.rotation.z = Math.PI/4;
    armR.position.set( 0.65,1.1,0); armR.rotation.z = -Math.PI/4;
    scientist.add(armL,armR);
    const legMat = new THREE.MeshPhongMaterial({color: 0xaf952a});
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.20,0.20,0.49,8), legMat);
    const legR = legL.clone();
    legL.position.set(-0.25,0.25,0);
    legR.position.set(0.25,0.25,0);
    scientist.add(legL, legR);
    scientist.position.set(0,0,0);

    // --- SAMPLE DEFINITIONS ---
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
        new THREE.MeshPhongMaterial({ color: 0xcfcfcf, flatShading:true}));
      mesh.rotation.set(0.2,1,0);
      mesh.userData = {label: "Quartz Rock", collected:false};
      mesh.position.set(x,0.46,z);
      return mesh;
    }
    function makeMoss(x,z) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.66, 14, 8),
        new THREE.MeshPhongMaterial({color: 0x4cc386}));
      mesh.scale.y = 0.28;
      mesh.userData = {label: "Moss Patch", collected:false};
      mesh.position.set(x,0.18,z);
      return mesh;
    }
    function makeWaterSample(x,z) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22,0.23,0.55,14),
        new THREE.MeshPhongMaterial({color: 0x77aeff, transparent:true, opacity: 0.56}));
      mesh.userData = {label:"Water Sample",collected:false};
      mesh.position.set(x,0.36,z);
      return mesh;
    }
    function makeSoilCore(x,z) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34,0.36,0.9,10),
        new THREE.MeshPhongMaterial({color: 0x8f6e45}));
      mesh.userData = {label:"Soil Core",collected:false};
      mesh.position.set(x,0.45,z);
      return mesh;
    }
    function makeTreeCone(x, z) {
      const group = new THREE.Group();
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.32, 0.8, 12),
        new THREE.MeshPhongMaterial({ color: 0x91672c }));
      cone.position.y = 0.4; group.add(cone);
      group.userData = {label: "Tree Cone", collected: false};
      group.position.set(x, 0.05, z);
      return group;
    }
    function makeShell(x, z) {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.36, 0.14, 12, 28, Math.PI),
        new THREE.MeshPhongMaterial({ color: 0xe9e6b0 }));
      mesh.rotation.x = Math.PI/2;
      mesh.userData = {label: "Shell", collected: false};
      mesh.position.set(x,0.32,z);
      return mesh;
    }
    function makeFern(x, z) {
      const mesh = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.16, 0.69, 4, 8),
        new THREE.MeshPhongMaterial({ color: 0x3c9f5b }));
      mesh.rotation.x = Math.PI/5;
      mesh.userData = {label: "Fern", collected: false};
      mesh.position.set(x,0.55,z);
      return mesh;
    }
    function makeLeafFossil(x, z) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.74, 0.08, 0.5),
        new THREE.MeshPhongMaterial({ color: 0xccc59a }));
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
    let pitchObject = new THREE.Object3D(); // up/down
    pitchObject.add(camera);
    let yawObject = new THREE.Object3D(); // left/right
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

    let keys = {};
    document.addEventListener("keydown", e => keys[e.code]=true);
    document.addEventListener("keyup",   e => keys[e.code]=false);

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

    function animate() {
      requestAnimationFrame(animate);

      // --- PLAYER MOVEMENT (WASD, relative to camera yaw) ---
      let speed = 0.15;
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
          scientist.position.copy(next);
          yawObject.position.set(scientist.position.x, 1.57, scientist.position.z);
        }
      }
      scientist.rotation.y = yawObject.rotation.y;

      // --- SAMPLE INTERACTION ---
      for(let m of samples){
        if(!m.userData.collected && 
          scientist.position.distanceTo(m.position) < 1.65) {
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