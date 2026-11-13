import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crosshair, Check } from 'lucide-react';
import gsap from 'gsap';
import './auto-skills.css';

const skills = ['ML','DL','FastAPI','LLMs','Agentic AI','MySQL','NLP'];
const locations = [[29,29],[70,51],[43,65],[72,25],[36,43],[67,68],[49,27]];

export default function AutoSkills({reduced}) {
  const section = useRef(null);
  const [shot,setShot] = useState({index:0,phase:'enter',done:0});
  const {index,phase,done} = shot;
  const [x,y] = locations[index];
  const finished = done===skills.length;
  useEffect(()=>{
    if(reduced){setShot({index:6,phase:'complete',done:7});return;}
    const tl=gsap.timeline({paused:true,repeat:-1});
    for(let i=0;i<skills.length;i++) {
      const start=i*3.1;
      tl.call(()=>setShot({index:i,phase:'enter',done:i}),[],start)
        .call(()=>setShot({index:i,phase:'aim',done:i}),[],start+.8)
        .call(()=>setShot({index:i,phase:'fire',done:i}),[],start+1.65)
        .call(()=>setShot({index:i,phase:'hit',done:i}),[],start+1.9)
        // Only complete the checklist after the shot has hit the target.
        .call(()=>setShot({index:i,phase:i===6?'complete':'done',done:i+1}),[],start+2.25);
    }
    tl.to({}, {duration:4.5});
    let visible=false;
    const sync=()=>tl.paused(!visible||document.hidden);
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.25});
    observer.observe(section.current);document.addEventListener('visibilitychange',sync);
    return()=>{tl.kill();observer.disconnect();document.removeEventListener('visibilitychange',sync);};
  },[reduced]);
  return <section ref={section} className="section skills" id="skills">
    <div className="section-heading"><div className="eyebrow"><span className="section-number">02</span>THE TOOLKIT</div><div className="heading-row"><h2>Skills. In my sights.<br/><span>One target at a time.</span></h2><p>From a clear target to a completed task. The technologies behind my work, in motion.</p></div></div>
    <div className="game-layout"><div className="arena">
      <div className="arena-top mono"><span><Crosshair size={14}/> SKILL / SHOOTER</span><span>{String(done).padStart(2,'0')} <span className="muted">/ 07 HITS</span></span></div>
      <div className="arena-field auto-arena" role="img" aria-label="Automatic animation shooting seven skill targets and completing their checklist">
        <AnimatePresence mode="wait">{finished ? <motion.div key="finished" className="game-start" initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} exit={{opacity:0}}><motion.div initial={{scale:.3}} animate={{scale:1}} transition={{type:'spring',damping:10}} className="all-complete-icon"><Check size={38}/></motion.div><h3>Toolkit unlocked.</h3><p>Seven skills. All targets completed.</p><span className="done">ALL TASKS DONE</span></motion.div> : <motion.div key={index} className="auto-target-position" style={{left:`${x}%`,top:`${y}%`}} initial={{y:-75,opacity:0}} animate={{y:0,opacity:phase==='done'||phase==='hit'?0:1,scale:phase==='hit'?1.2:1}} exit={{opacity:0}} transition={{duration:.4}}><div className="skill-target"><span className="target-corner tl"/><span className="target-corner br"/>{skills[index]}</div></motion.div>}</AnimatePresence>
        {!finished&&<motion.div className={`auto-reticle ${phase==='fire'?'firing':''}`} animate={{left:phase==='enter'?'50%':`${x}%`,top:phase==='enter'?'88%':`${y}%`,opacity:phase==='done'?0:1}} transition={{duration:.65,ease:'easeInOut'}}><Crosshair size={58} strokeWidth={1}/></motion.div>}
        {phase==='fire'&&<svg className="shot-tracer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><motion.line x1="50" y1="100" x2={x} y2={y} stroke="#a6ffdf" strokeWidth=".45" initial={{pathLength:0,opacity:1}} animate={{pathLength:1,opacity:0}} transition={{duration:.25}}/></svg>}
        {(phase==='fire'||phase==='hit')&&<div className="blast" key={`burst-${index}`} style={{left:`${x}%`,top:`${y}%`}}><span/><b>+1</b></div>}
        <span className="arena-coordinate mono">X : BUILD / Y : LEARN</span>
      </div>
      <div className="arena-bottom mono"><span><span className="status-dot"/> {finished?'ALL TARGETS CLEARED':phase==='fire'||phase==='hit'?'TARGET HIT':phase==='aim'?'TARGET LOCKED':'SCANNING SKILLS'}</span><span>AUTO SEQUENCE</span></div>
    </div><div className="checklist"><div className="checklist-heading"><span className="eyebrow">MY SKILL LIST</span><span className="mono">{done}/7</span></div>
      {skills.map((skill,i)=><div key={skill} className={`skill-row ${i<done?'complete':''}`}><span className="skill-check">{i<done&&<Check size={12}/>}</span><span className="skill-label">{skill}</span>{i<done?<motion.span initial={{scale:.6,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',damping:12}} className="done">DONE</motion.span>:<span className="skill-id mono">0{i+1}</span>}</div>)}
      <p>{finished?'Every target cleared. Every task complete.':'Learning is a continuous loop.'}<br/>This toolkit keeps growing.</p>
    </div></div>
  </section>;
}
