// Subtle parallax for floating items and hover micro-interactions
(function(){
  const floats = document.querySelectorAll('.float-item');
  window.addEventListener('mousemove', (e)=>{
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    const dx = (e.clientX - cx)/cx;
    const dy = (e.clientY - cy)/cy;
    floats.forEach(el=>{
      const speed = parseFloat(el.dataset.speed)||1;
      el.style.transform = `translate3d(${dx*20*speed}px,${dy*12*speed}px,0) scale(${1 - speed*0.02})`;
    })
  })

  // Tool hover lift micro-interaction
  document.querySelectorAll('.tool').forEach(tool=>{
    tool.addEventListener('mouseenter', ()=>tool.classList.add('hover'))
    tool.addEventListener('mouseleave', ()=>tool.classList.remove('hover'))
  })

  // Tiny sparkle animation for inline svg
  const sparks = document.querySelectorAll('.sparkles circle');
  let t=0;
  function tick(){
    t+=0.02;
    sparks.forEach((c,i)=>{
      const s = 1 + Math.sin(t*1.5 + i)*0.06;
      c.setAttribute('r', 4 + Math.sin(t + i)*1.6 * s);
      c.style.opacity = 0.7 + Math.sin(t*1.3 + i)*0.2;
    })
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)

  // Animate connection lines in SVG asset if present
  const conns = document.querySelectorAll('svg .conn');
  conns.forEach(path=>{
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.2,.9,.2,1)';
    setTimeout(()=>{ path.style.strokeDashoffset = '0'; }, 400);
  })

  // Gentle toolbox bob for svg illustration
  const svgs = document.querySelectorAll('svg g');
  svgs.forEach((g,i)=>{
    g.style.willChange = 'transform';
    g.animate([{transform: 'translateY(0px)'},{transform:'translateY(-6px)'},{transform:'translateY(0px)'}],{duration: 5200 + i*300, iterations: Infinity, easing: 'ease-in-out'})
  })

  // Button micro-ripple (simple)
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      btn.animate([{transform:'scale(0.98)'},{transform:'scale(1)'}],{duration:160,easing:'ease-out'})
    })
  })

  // Sample mock generation outputs
  const sample = {
    'AI Title Generator': 'Handmade Ceramic Mug — Cozy Boho Coffee Cup, Dishwasher Safe, Perfect Gift',
    'Product Description Generator': 'This handmade ceramic mug features a warm, textured glaze and a comfortable handle for everyday use. Microwave and dishwasher safe, it makes a thoughtful gift for coffee and tea lovers.',
    'Etsy Tags Generator': 'handmade,ceramic,mug,boho,gift,coffee,tea,kitchen,ceramic mug',
    'Keyword Research': 'boho mug, handmade mug, ceramic coffee cup, unique kitchen gifts, artisan mug',
    'Shop Bio Generator': 'SellerSpark Studio — Crafting thoughtful, functional homeware with sustainable materials. Fast shipping and curated packaging.',
    'Listing SEO Optimizer': 'Optimized title & tags: Handmade Ceramic Mug • Cozy Boho Coffee Cup | Tags: handmade,boho,mug,ceramic'
  };

  // Modal elements
  const modal = document.getElementById('demo-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const copyBtn = document.getElementById('copy-btn');
  const closeBtn = document.getElementById('close-btn');
  const modalClose = document.querySelector('.modal-close');

  function openModal(title, body){
    modal.setAttribute('aria-hidden','false');
    modalTitle.textContent = title;
    modalBody.textContent = body;
  }
  function closeModal(){ modal.setAttribute('aria-hidden','true'); }

  // Wire generate buttons
  document.querySelectorAll('.tool .btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const tool = btn.closest('.tool');
      const titleEl = tool.querySelector('h3');
      const title = titleEl ? titleEl.textContent.trim() : 'Preview';
      const text = sample[title] || 'Generated content will appear here.';
      openModal(title, text);
    })
  })

  // copy action
  copyBtn.addEventListener('click', ()=>{
    navigator.clipboard.writeText(modalBody.textContent).then(()=>{
      copyBtn.textContent = 'Copied';
      setTimeout(()=>copyBtn.textContent = 'Copy',900);
    })
  })
  closeBtn.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);

})();

