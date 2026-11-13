import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './avatar-intro.css';

// Original photographic character, with matching image-based action poses.
export default function AvatarIntro({ reduced, onReveal, onStart }) {
  const root = useRef(null);
  const timeline = useRef(null);
  const callbacks = useRef({ onReveal, onStart });
  callbacks.current = { onReveal, onStart };
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all(['/assets/avatar-sequence.png', '/assets/avatar-sideways.png'].map(src => new Promise((resolve,reject) => {
      const image = new Image(); image.onload = resolve; image.onerror = reject; image.src = src;
    }))).then(() => { if(!cancelled) setReady(true); }).catch(() => {
      if(!cancelled) { setFailed(true); callbacks.current.onReveal(); }
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if(!ready) return;
    const frames = root.current.querySelectorAll('.photo-frame');
    const context = gsap.context(() => {
      gsap.set(frames, { opacity:0 });
      gsap.set(frames[0], { opacity:1 });
      if(reduced) {
        gsap.set(frames[0], {opacity:0}); gsap.set(frames[3], {opacity:1});
        callbacks.current.onReveal(); return;
      }
      const tl = gsap.timeline({repeat:-1});
      timeline.current = tl;
      tl.call(()=>{callbacks.current.onStart();})
        // Preserve the original three-second introduction before the hands rise.
        .to(frames[1], {opacity:1,duration:.45,ease:'power1.inOut'},3)
        .set(frames[0], {opacity:0},3.45)
        // Both lens halves and hands move outwards in the matching poses.
        .to(frames[2], {opacity:1,duration:.48,ease:'power1.inOut'},3.8)
        .set(frames[1], {opacity:0},4.28)
        .to(frames[3], {opacity:1,duration:.55,ease:'power1.inOut'},4.55)
        .set(frames[2], {opacity:0},5.1)
        .to({}, {duration:.35})
        .call(()=>callbacks.current.onReveal())
        .to({}, {duration:4.5})
        .call(()=>callbacks.current.onStart())
        .to(frames[3], {opacity:0,duration:.45})
        .to(frames[0], {opacity:1,duration:.45},'<');
    },root);
    return()=>{timeline.current=null;context.revert();};
  },[ready,reduced]);

  return <div className="photo-avatar-wrap" ref={root}>
    <div className="photo-avatar" role="img" aria-label="Amit's original avatar pulls the two goggle lenses sideways apart with both hands">
      <div className="photo-frame original-pose"/>
      {!failed&&[0,1,2].map(i=><div key={i} className={`photo-frame sideways-pose side-${i}`}/>)}
    </div>
  </div>;
}
