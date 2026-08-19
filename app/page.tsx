"use client";

import { FormEvent, useEffect, useState } from "react";

const photos = {
  chainsaw: "/images/92592666_10220383047379675_1945451191009804288_n.jpg",
  portrait: "/images/92520095_10220383008778710_6852327421178281984_n.jpg",
  worker: "/images/92363320_10220383117381425_6316937173383774208_n.jpg",
  stump: "/images/stump-grinding-service.png",
};

const services = [
  { n:"01", title:"Tree Removal & Takedowns", text:"Safe, controlled removal of hazardous, dead, or unwanted trees, even when access is tight.", image:photos.chainsaw, alt:"Crew member cutting a fallen log with a chainsaw" },
  { n:"02", title:"Precision Pruning & Trimming", text:"Careful cuts that improve health, structure, shape, sunlight, and views without working against nature.", image:photos.worker, alt:"Arborist in helmet and visor assessing work overhead" },
  { n:"03", title:"Emergency Storm Damage", text:"Fast, responsive clearing and hazard mitigation when Hudson Valley weather leaves trees unstable.", image:photos.portrait, alt:"Lyall Property Care crew member in full safety gear" },
  { n:"04", title:"Stump Grinding & Land Clearing", text:"A clean, level finish that leaves your yard ready for the next thing you want to grow or build.", image:photos.stump, alt:"Arborist operating a stump grinder on a wooded property" },
];

export default function Home(){
  const [menu,setMenu]=useState(false); const [files,setFiles]=useState<File[]>([]); const [status,setStatus]=useState("");
  useEffect(()=>{const o=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("shown")),{threshold:.12});document.querySelectorAll(".rise").forEach(e=>o.observe(e));return()=>o.disconnect()},[]);
  async function send(e:FormEvent<HTMLFormElement>){e.preventDefault();setStatus("Sending your request…");const form=e.currentTarget,body=new FormData(form);files.forEach(f=>body.append("photos",f));try{const r=await fetch("/api/quote",{method:"POST",body});if(!r.ok)throw new Error();form.reset();setFiles([]);setStatus("Thanks. Lyall Property Care LLC received your request and photos and will follow up soon.")}catch{setStatus("Your request could not be sent. Please try again.")}}
  return <main>
    <section id="top" className="hero" style={{backgroundImage:"linear-gradient(180deg, rgba(4,25,14,.34), rgba(4,24,13,.8)), url('/images/hero-chainsaw-borderless.png')"}}>
      <nav className="nav"><a href="#top" className="logo" aria-label="Lyall Property Care LLC"><img src="/images/Tree_Logo_Design.png" alt="Lyall Property Care"/><small>LLC</small></a><button className="menuBtn" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">{menu?"Close":"Menu"}</button><div className={menu?"navlinks open":"navlinks"}><a href="#about">About</a><a href="#services">Services</a><a href="#process">Approach</a><a href="#quote">Contact</a></div><a className="navCta" href="#quote">Free estimate ↗</a></nav>
      <div className="heroNote">Local knowledge. Careful work.<br/>A property left cleaner than we found it.</div>
      <div className="heroContent wrap"><p className="tag"><i/> Hudson Valley tree specialists</p><h1>Expert Tree Care.<br/><em>Rooted in the</em><br/>Hudson Valley.</h1><div className="heroBottom"><p>From precision pruning to complex removals, Lyall Property Care LLC protects your property, enhances nature, and keeps your property beautiful.</p><a className="button lime" href="#quote">Start your project <span>↗</span></a></div></div>
      <div className="scroll">Scroll to explore ↓</div>
    </section>

    <section id="about" className="intro pad wrap">
      <div className="sideStat rise"><p className="tag dark"><i/> Local tree care</p><strong>20<sup>+</sup></strong><span>Years of trusted<br/>local experience</span></div>
      <div className="introCopy rise"><h2>Experienced, skilled, and nature focused. <em>Every property gets personal care.</em></h2><p>For years, Lyall Property Care LLC has been the go to tree specialist in Woodstock and the surrounding Catskills region. Known for deep understanding of local arboriculture, a safety first approach, and immaculate cleanups, we treat every property like our own.</p><div className="pillRow"><span>Fully insured</span><span>Safety first</span><span>Local expertise</span></div><a className="button green" href="#quote">Talk with us <span>↗</span></a></div>
    </section>

    <section className="photoBand"><div className="photoTall rise"><img src={photos.portrait} alt="Lyall Property Care crew member in helmet and hearing protection"/><span>Woodstock<br/>New York</span><small className="photoCredit">Photo · Leon Steel</small></div><div className="quoteBlock rise"><p>“Lyall Property Care treats every property like our own, with a clear plan, careful execution, and an immaculate cleanup.”</p><small>The standard on every job</small></div></section>

    <section id="services" className="services pad"><div className="wrap serviceHead rise"><p className="tag"><i/> Core services</p><h2>Work that protects what matters and <em>lets the landscape breathe.</em></h2></div><div className="serviceList wrap">{services.map((s,i)=><article className="service rise" key={s.n}><span className="num">{s.n}</span><div className="thumb"><img src={s.image} alt={s.alt}/></div><h3>{s.title}</h3><p>{s.text}</p><a href="#quote" aria-label={`Request ${s.title}`}>↗</a></article>)}</div></section>

    <section id="process" className="process pad"><div className="wrap processGrid"><div className="processTitle rise"><p className="tag"><i/> The process</p><h2>Simple from the first photo to the final cleanup.</h2></div><div className="processSteps">{[["01","Show us the job","Send details and upload a few photos so we can understand what is happening."],["02","Walk the property","We review access, tree health, risk, and the safest way to complete the work."],["03","Complete with care","The work is handled with control, then the property is cleaned before the crew leaves."]].map(x=><div className="pstep rise" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}</div></div></section>

    <section className="statement" style={{backgroundImage:"linear-gradient(90deg, rgba(5,31,18,.9), rgba(5,31,18,.15)), url('/images/statement-worker-borderless.png')"}}><div className="wrap rise"><p>Serving Woodstock and the surrounding Catskills</p><h2>Safer trees.<br/>Better views.<br/><em>A property you love.</em></h2><a className="button lime" href="#quote">Request an estimate <span>↗</span></a></div></section>

    <section id="quote" className="quote pad"><div className="wrap quoteGrid"><div className="quoteIntro rise"><p className="tag"><i/> Free estimates</p><h2>Send the details.<br/><em>Show us the tree.</em></h2><p>Upload wide shots, the tree base, any visible damage, and nearby buildings or wires. The photos help our team prepare before the site visit.</p><div className="emergency"><small>Storm damage or immediate hazard</small><b>Request a fast response below</b></div></div><form onSubmit={send} className="form rise"><div className="fields"><label>Name<input name="name" required placeholder="Full name"/></label><label>Phone<input name="phone" required type="tel" placeholder="(845) 000 0000"/></label><label>Email<input name="email" required type="email" placeholder="you@email.com"/></label><label>Property location<input name="location" required placeholder="Town or address"/></label></div><label>Service<select name="service" required defaultValue=""><option value="" disabled>Choose a service</option>{services.map(s=><option key={s.n}>{s.title}</option>)}<option>Not sure yet</option></select></label><label>What is happening?<textarea name="message" required rows={4} placeholder="Describe the tree, concern, access, and anything nearby."/></label><label className="drop"><input type="file" accept="image/*" multiple onChange={e=>setFiles(Array.from(e.target.files||[]).slice(0,6))}/><b>＋ Add job photos</b><span>Up to 6 JPG, PNG, or WEBP images</span>{files.length>0&&<strong>{files.length} photo{files.length>1?"s":""} ready</strong>}</label><button type="submit">Request my free estimate <span>↗</span></button>{status&&<p className="status" role="status">{status}</p>}</form></div></section>
    <footer className="footer wrap"><a href="#top" className="footerLogo" aria-label="Lyall Property Care LLC"><img src="/images/lyall-property-care-logo.png" alt="Lyall Property Care"/><span>LLC</span></a><p>Professional, fully insured tree care<br/>in the Hudson Valley.</p><div><a href="#about">About</a><a href="#services">Services</a><a href="#quote">Contact</a></div><small>© 2026 Lyall Property Care LLC · Field photography by Leon Steel</small><p className="devCredit">Designed and Developed by <a href="https://alchemydev.io/" target="_blank" rel="noopener noreferrer">Alchemy Dev</a></p></footer>
  </main>
}
