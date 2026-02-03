// ===== Helpers =====
    const qs = (s, el=document) => el.querySelector(s);
    const qsa = (s, el=document) => [...el.querySelectorAll(s)];
    const toast = (msg) => { const t = qs('#toast'); t.textContent = msg; t.style.opacity=1; t.style.transform='translateY(0)'; setTimeout(()=>{t.style.opacity=0; t.style.transform='translateY(-10px)';}, 2200)}

    // ===== Preloader =====
    window.addEventListener('load',()=>{ qs('#preloader').style.display='none'; });

    // ===== Year =====
    qs('#year').textContent = new Date().getFullYear();

    // ===== Navbar =====
    const nav = qs('#navLinks');
    qs('#hamburger').onclick = () => nav.classList.toggle('open');

    // Active section highlight
    const links = qsa('.nav-links a');
    const sections = links.map(a => qs(a.getAttribute('href')));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){
          links.forEach(l=>l.classList.toggle('active', l.getAttribute('href')==='#'+e.target.id));
        }
      })
    }, {threshold:0.6});
    sections.forEach(s=>s && io.observe(s));

    // Smooth scroll (native via CSS; ensure close mobile menu on click)
    links.forEach(l=>l.addEventListener('click',()=> nav.classList.remove('open')));

    // ===== Theme toggle & color picker =====
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    const savedColor = localStorage.getItem('primary');
    if(savedColor) root.style.setProperty('--primary', savedColor);

    // ===== Typing animation =====
    const phrases = ["FrontEnd Developer","BackEnd Developer", "UI Designer", "Web Developer", "Open Source Lover"];
    let pi=0, ci=0, del=false; const el=qs('#typing');
    function type(){
      const p = phrases[pi];
      el.textContent = (del? p.slice(0,ci--) : p.slice(0,ci++));
      if(!del && ci>p.length+8) del=true; else if(del && ci<0){ del=false; pi=(pi+1)%phrases.length; }
      setTimeout(type, del? 60: 120);
    } type();

    // ===== Reveal on scroll =====
    const revIO = new IntersectionObserver(es => es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); if(e.target.querySelector('.bar > span')){ e.target.querySelectorAll('.bar > span').forEach(b=> b.style.width = b.style.getPropertyValue('--w')) } } }), {threshold:0.2});
    qsa('.reveal').forEach(el=>revIO.observe(el));

    // ===== Counters =====
    const countIO = new IntersectionObserver(es=> es.forEach(e=>{ if(e.isIntersecting){ const n=e.target; const tgt=+n.dataset.target; let c=0; const step = Math.max(1, Math.round(tgt/60)); const iv = setInterval(()=>{ c+=step; if(c>=tgt){ c=tgt; clearInterval(iv);} n.textContent=c; }, 20); countIO.unobserve(n); } }));
    qsa('.counter h3').forEach(n=>countIO.observe(n));

    // ===== Projects filter =====
    const filter = qs('#filter');
    filter.addEventListener('click', (e)=>{
      if(e.target.tagName!=='BUTTON') return; qsa('#filter button').forEach(b=>b.classList.remove('active')); e.target.classList.add('active');
      const cat = e.target.dataset.filter; qsa('#gallery .card').forEach(c=>{
        const show = cat==='all' || c.dataset.cat===cat; c.style.opacity = show?1:0; c.style.transform = show? 'scale(1)': 'scale(.95)'; c.style.pointerEvents = show? 'auto':'none';
      })
    })

    // ===== Project modal =====
    const modal = qs('#modal');
    function openModal(data){
      qs('#modalTitle').textContent = data.title; qs('#modalDesc').textContent = data.desc; qs('#modalTech').textContent = 'Tech: '+data.tech; const wrap = qs('#modalImgs'); wrap.innerHTML='';
      data.imgs.forEach(src=>{ const i = new Image(); i.src=src; i.alt=data.title; i.loading='lazy'; wrap.appendChild(i) });
      modal.classList.add('open');
    }
    qsa('[data-modal]').forEach(btn=> btn.addEventListener('click', ()=> openModal(JSON.parse(btn.dataset.modal))));
    qs('#closeModal').onclick = ()=> modal.classList.remove('open');
    modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('open') })

    // ===== Testimonials slider =====
    let idx=0; const slides = qs('#slides'); const total = slides.children.length;
    function go(i){ idx=(i+total)%total; slides.style.transform = `translateX(-${idx*100}%)`; }
    qs('#prev').onclick = ()=> go(idx-1); qs('#next').onclick = ()=> go(idx+1);
    setInterval(()=> go(idx+1), 5000);

    // ===== Contact form =====
    qs('#contactForm').addEventListener('submit', (e)=>{
      e.preventDefault(); const f=new FormData(e.target); const name=f.get('name').trim(); const email=f.get('email').trim(); const msg=f.get('message').trim();
      if(!name || !email || !msg || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast('Please fill all fields with a valid email.');
      // Simulate success (replace with your backend endpoint)
      toast('Message sent! I will reply soon.'); e.target.reset();
    })

    // ===== Scroll to top =====
    const st = qs('#scrollTop');
    window.addEventListener('scroll',()=>{ st.classList.toggle('show', window.scrollY>600) });
    st.onclick = ()=> window.scrollTo({top:0, behavior:'smooth'});

    // ===== Floating Hire Me -> opens contact =====
    qs('#hireMe').onclick = ()=> qs('#contact').scrollIntoView({behavior:'smooth'});

    // ===== Language switcher (EN ↔ FR sample) =====
    const i18n = {
      en: { about:'About Me', projects:'Projects', testimonials:'Testimonials', blog:'Blog & Case Studies', contact:'Contact', hire:'Hire Me', resume:'Resume' },
      fr: { about:"À propos", projects:'Projets', testimonials:'Témoignages', blog:'Blog & Études de cas', contact:'Contact', hire:'Embauchez-moi', resume:'CV' }
    }
    let lang='en';
    function applyLang(){
      qs('#about .section-title').textContent = i18n[lang].about;
      qs('#projects .section-title').textContent = i18n[lang].projects;
      qs('#testimonials .section-title').textContent = i18n[lang].testimonials;
      qs('#blog .section-title').textContent = i18n[lang].blog;
      qs('#contact .section-title').textContent = i18n[lang].contact;
      qs('#hireMe').lastChild.textContent = ' '+i18n[lang].hire;
      qs('#downloadCV').lastChild.textContent = ' '+i18n[lang].resume;
      qs('#langToggle').textContent = lang.toUpperCase();
    }
    qs('#langToggle').onclick = ()=>{ lang = (lang==='en'?'fr':'en'); applyLang(); }
    applyLang();

    // ===== Particles background (lightweight) =====
    const canvas = qs('#particles'); const ctx = canvas.getContext('2d');
    let W,H,parts=[]; function resize(){ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; }
    window.addEventListener('resize', resize); resize();
    for(let i=0;i<60;i++) parts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,r:Math.random()*2+1});
    (function loop(){ requestAnimationFrame(loop); ctx.clearRect(0,0,W,H); parts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--primary'); ctx.globalAlpha=.8; ctx.fill(); ctx.globalAlpha=1; }); })();

    // ===== Background audio toggle =====
    const audio = qs('#bgAudio');
    const audioToggle = qs('#audioToggle');
    audioToggle.addEventListener('change',()=>{ if(audioToggle.checked) audio.play(); else audio.pause(); });

    // ===== Voice command navigation (basic) =====
    if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition; const rec = new SR(); rec.lang='en-US'; rec.continuous=false; rec.interimResults=false;
      // Hold Shift key + V to activate
      window.addEventListener('keydown',(e)=>{ if(e.shiftKey && e.key.toLowerCase()==='v'){ rec.start(); toast('Listening… say: about, projects, contact'); } });
      rec.onresult = (e)=>{
        const t = e.results[0][0].transcript.toLowerCase();
        if(t.includes('about')) qs('#about').scrollIntoView({behavior:'smooth'});
        else if(t.includes('project')) qs('#projects').scrollIntoView({behavior:'smooth'});
        else if(t.includes('contact')) qs('#contact').scrollIntoView({behavior:'smooth'});
        else toast('Try: about / projects / contact');
      }
    }

    // Smooth bounce animation for counters
qsa('#about .counter h3').forEach(n => {
  const original = n.textContent;
  n.style.transition = 'transform 0.15s ease';
  let stepBounce = () => {
    n.style.transform = 'scale(1.2)';
    setTimeout(()=> n.style.transform = 'scale(1)', 120);
  };
  const observer = new IntersectionObserver(es => {
    es.forEach(e => {
      if(e.isIntersecting){
        let tgt = +n.dataset.target;
        let c=0;
        const step = Math.max(1, Math.round(tgt/60));
        const iv = setInterval(()=>{
          c += step;
          if(c >= tgt){ c = tgt; clearInterval(iv); }
          n.textContent = c;
          stepBounce();
        }, 20);
        observer.unobserve(n);
      }
    });
  }, {threshold: 0.5});
  observer.observe(n);
});
