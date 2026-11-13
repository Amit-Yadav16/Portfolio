import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Pause, Play, RotateCcw } from 'lucide-react';
import './avatar.css';

// A procedural, articulated character: all geometry moves in real 3D space.
export default function Avatar3D({ reduced, onReveal }) {
  const host = useRef(null);
  const controls = useRef(null);
  const reveal = useRef(onReveal);
  reveal.current = onReveal;
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const container = host.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { setFailed(true); reveal.current(); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 50);
    camera.position.set(0, 2.35, 7.8);
    camera.lookAt(0, 2.1, 0);
    scene.add(new THREE.HemisphereLight(0xd9f4ff, 0x18202e, 2.3));
    function light(color, intensity, x, y, z) {
      const l = new THREE.DirectionalLight(color, intensity); l.position.set(x,y,z); scene.add(l);
    }
    light(0xffdfbf, 3.6, -3, 5, 5);
    light(0x5ce9ff, 4.5, 3, 3, -2);
    light(0xa8ffdc, 1.2, -3, 2, -2);
    const character = new THREE.Group(); scene.add(character);
    const skin = new THREE.MeshStandardMaterial({color:0xb77b54, roughness:.65});
    const lip = new THREE.MeshStandardMaterial({color:0x825044, roughness:.7});
    const hair = new THREE.MeshStandardMaterial({color:0x171514, roughness:.75});
    const jacket = new THREE.MeshStandardMaterial({color:0x101820, roughness:.43, metalness:.22});
    const shirt = new THREE.MeshStandardMaterial({color:0x070b10, roughness:.9});
    const trim = new THREE.MeshStandardMaterial({color:0x67f6ff, emissive:0x1cc7ee, emissiveIntensity:2, roughness:.3});
    const metal = new THREE.MeshStandardMaterial({color:0x262f38, metalness:.85, roughness:.25});
    const lens = new THREE.MeshPhysicalMaterial({color:0x07121e, metalness:.45, roughness:.13, clearcoat:1});
    const white = new THREE.MeshStandardMaterial({color:0xe2dcd2, roughness:.4});
    const iris = new THREE.MeshStandardMaterial({color:0x30231b, roughness:.3});
    const pupil = new THREE.MeshStandardMaterial({color:0x020303, roughness:.15});
    function ellipsoid(parent, mat, pos, scale) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1,32,24),mat);
      m.position.set(...pos); m.scale.set(...scale); parent.add(m); return m;
    }
    function bar(parent, mat, a, b, radius) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,1,12),mat);
      parent.add(m); connect(m,a,b); return m;
    }
    function connect(mesh, a, b) {
      const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
      mesh.position.copy(start).add(end).multiplyScalar(.5);
      mesh.scale.y = start.distanceTo(end);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());
    }
    // Tapered leather jacket, collar, zipper, and luminous shoulder seams.
    ellipsoid(character,jacket,[0,1.35,0],[.77,.94,.36]);
    ellipsoid(character,shirt,[0,1.65,.29],[.28,.69,.13]);
    ellipsoid(character,skin,[0,2.3,0],[.24,.35,.23]);
    for(const s of [-1,1]) {
      const collar=ellipsoid(character,jacket,[s*.23,2.12,.21],[.15,.31,.12]); collar.rotation.z=s*-.3;
      bar(character,trim,[s*.35,2.05,.28],[s*.67,1.94,.25],.014);
      bar(character,metal,[s*.13,.65,.36],[s*.13,1.97,.4],.014);
      bar(character,trim,[s*.15,.8,.37],[s*.15,1.28,.42],.009);
    }
    const head = new THREE.Group(); head.position.y=2.9; character.add(head);
    ellipsoid(head,skin,[0,0,0],[.46,.62,.39]);
    ellipsoid(head,skin,[0,-.31,.045],[.35,.29,.32]);
    for(const s of [-1,1]) {
      ellipsoid(head,skin,[s*.455,-.05,0],[.09,.16,.08]);
      ellipsoid(head,lip,[s*.478,-.05,.055],[.03,.085,.015]);
      ellipsoid(head,skin,[s*.24,-.12,.3],[.18,.14,.11]);
      ellipsoid(head,white,[s*.18,.035,.355],[.114,.058,.036]);
      ellipsoid(head,iris,[s*.18,.035,.389],[.044,.046,.014]);
      ellipsoid(head,pupil,[s*.18,.035,.403],[.021,.027,.009]);
      ellipsoid(head,white,[s*.166,.052,.412],[.009,.012,.005]);
      const brow=ellipsoid(head,hair,[s*.18,.145,.36],[.135,.029,.027]); brow.rotation.z=s*-.12;
    }
    ellipsoid(head,skin,[0,-.07,.39],[.07,.17,.085]);
    ellipsoid(head,skin,[0,-.17,.445],[.095,.063,.07]);
    ellipsoid(head,lip,[0,-.3,.34],[.135,.025,.027]);
    ellipsoid(head,skin,[0,-.325,.34],[.125,.025,.03]);
    // Small moustache and a swept, layered hairstyle.
    for(const s of [-1,1]) ellipsoid(head,hair,[s*.055,-.257,.36],[.064,.014,.018]);
    ellipsoid(head,hair,[0,.39,-.055],[.47,.29,.37]);
    for(let i=0;i<11;i++) {
      const t=i/10;
      const strand=ellipsoid(head,hair,[-.39+t*.76,.43+Math.sin(t*Math.PI)*.12,.08],[.14,.18,.31]);
      strand.rotation.z=-.55; strand.rotation.x=-.15+t*.3;
    }
    for(const s of [-1,1]) ellipsoid(head,hair,[s*.415,.19,-.015],[.052,.23,.24]);

    const glasses=new THREE.Group();character.add(glasses);
    for(const s of [-1,1]) {
      ellipsoid(glasses,metal,[s*.205,0,0],[.207,.139,.044]);
      ellipsoid(glasses,lens,[s*.205,0,.033],[.178,.109,.027]);
      bar(glasses,metal,[s*.4,.035,0],[s*.445,.035,-.32],.023);
      bar(glasses,trim,[s*.29,.071,.058],[s*.34,.071,.056],.006);
    }
    bar(glasses,metal,[-.06,.035,0],[.06,.035,0],.026);
    const arms=[-1,1].map(s=>{
      const upper=bar(character,jacket,[s*.67,1.92,0],[s*.85,1.3,.12],.205);
      const lower=bar(character,jacket,[s*.85,1.3,.12],[s*.63,.94,.34],.16);
      ellipsoid(character,jacket,[s*.66,1.9,0],[.25,.28,.29]);
      const hand=new THREE.Group(); character.add(hand);
      ellipsoid(hand,skin,[0,0,0],[.105,.13,.065]);
      // Curved fingers and opposed thumb meet the goggles' outer temples.
      for(let f=0;f<4;f++) {
        const x=(f-1.5)*.044;
        bar(hand,skin,[x,.065,0],[x,.17,.02],.024);
        bar(hand,skin,[x,.17,.02],[x,.18,.075],.022);
      }
      bar(hand,skin,[-s*.08,-.02,.01],[-s*.13,.055,.09],.035);
      ellipsoid(hand,skin,[-s*.115,.07,.1],[.035,.04,.035]);
      return {s,upper,lower,hand};
    });
    const state={reach:0,pull:0};
    const start={x:.64,y:1.02,z:.42};
    const lerp=THREE.MathUtils.lerp;
    function pose(time=0) {
      const gY=lerp(2.94,1.82,state.pull), gZ=.47+Math.sin(state.pull*Math.PI/2)*.58;
      glasses.position.set(0,gY,gZ); glasses.rotation.x=-state.pull*.3;
      for(const a of arms) {
        const s=a.s;
        const wrist=[s*lerp(start.x,.47,state.reach),lerp(start.y,gY-.14,state.reach),lerp(start.z,gZ-.035,state.reach)];
        const elbow=[s*lerp(.88,1.02,state.reach),lerp(1.28,1.94-state.pull*.5,state.reach),lerp(.08,.46,state.reach)];
        connect(a.upper,[s*.66,1.94,0],elbow);connect(a.lower,elbow,wrist);
        a.hand.position.set(...wrist);a.hand.rotation.set(-state.pull*.3,0,s*lerp(-.12,-.1,state.reach));
      }
      if(!reduced){character.position.y=Math.sin(time*.0016)*.012;character.rotation.y=Math.sin(time*.0006)*.035;}
    }
    const timeline=gsap.timeline({paused:true});
    timeline.to(state,{reach:1,duration:1.25,ease:'power2.inOut'},3)
      .to(state,{pull:1,duration:1.65,ease:'power2.inOut'},4.45)
      .call(()=>reveal.current(),[],5.15)
      .to({}, {duration:3})
      .to(state,{pull:0,duration:1.5,ease:'power2.inOut'})
      .to(state,{reach:0,duration:1.15,ease:'power2.inOut'},'>.2');
    timeline.repeat(-1).repeatDelay(2);
    if(reduced){state.reach=1;state.pull=1;pose();reveal.current();}
    else timeline.play();
    let visible=true, frame=0, manualPause=false;
    function resize(){const {width,height}=container.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);resize();
    function tick(t){frame=requestAnimationFrame(tick);if(visible){if(!manualPause)pose(t);renderer.render(scene,camera);}}
    frame=requestAnimationFrame(tick);
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!reduced)timeline.paused(!visible||manualPause);},{threshold:.05});observer.observe(container);
    const contextLost=e=>{e.preventDefault();setFailed(true);timeline.pause();reveal.current();};
    renderer.domElement.addEventListener('webglcontextlost',contextLost);
    controls.current={pause(value){manualPause=value;timeline.paused(value||!visible);},replay(){manualPause=false;timeline.restart();}};
    return()=>{cancelAnimationFrame(frame);timeline.kill();observer.disconnect();resizeObserver.disconnect();controls.current=null;renderer.domElement.removeEventListener('webglcontextlost',contextLost);scene.traverse(o=>o.geometry?.dispose());[skin,lip,hair,jacket,shirt,trim,metal,lens,white,iris,pupil].forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
  },[reduced]);
  return <div className="avatar-3d-shell"><div ref={host} className="avatar-3d" role="img" aria-label="Animated 3D avatar of Amit, using both hands to pull off his goggles"/>{failed&&<div className="avatar-fallback" role="img" aria-label="Amit Yadav avatar"/>}{!reduced&&!failed&&<div className="avatar-controls"><button onClick={()=>{controls.current?.pause(!paused);setPaused(!paused);}} aria-label={paused?'Play avatar animation':'Pause avatar animation'}>{paused?<Play size={13}/>:<Pause size={13}/>}</button><button onClick={()=>{controls.current?.replay();setPaused(false);}} aria-label="Replay goggles removal"><RotateCcw size={13}/></button><span>LIVE 3D</span></div>}</div>;
}
