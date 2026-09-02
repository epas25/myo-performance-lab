// Cuñas 3D con parallax al mover el ratón — mismo motivo que la portada
  (function(){
    const ctaSection = document.getElementById('cta-close');
    const ctaField = document.getElementById('cta-parallax-field');
    if(!ctaSection || !ctaField) return;
    const layers = ctaField.querySelectorAll('.p-layer');
    const layerDepth = {back:5, mid:10, front:16};
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion) return;

    ctaSection.addEventListener('mousemove', (e)=>{
      const rect = ctaSection.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      layers.forEach(layer=>{
        const depth = layerDepth[[...layer.classList].find(c=>layerDepth[c])] || 8;
        layer.style.transform = `translate(${px*depth*-1}px, ${py*depth*-1}px)`;
      });
    });
    ctaSection.addEventListener('mouseleave', ()=>{
      layers.forEach(layer=>{ layer.style.transform = 'translate(0,0)'; });
    });
  })();

  // Efecto máquina de escribir — mismo mecanismo que Inicio, generalizado a cualquier .tw-target
  document.querySelectorAll('.tw-target').forEach(twEl=>{
    const twObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const full = twEl.dataset.full;
          let i = 0;
          const typeStep = () => {
            if(i <= full.length){
              twEl.textContent = full.slice(0, i);
              i++;
              setTimeout(typeStep, 42);
            }
          };
          typeStep();
          twObserver.unobserve(twEl);
        }
      });
    }, {threshold:0.6});
    twObserver.observe(twEl);
  });

  // Curva de esfuerzo incremental — dibuja el trazo y sincroniza los readouts en vivo
  (function(){
    const wrap = document.querySelector('.protocol-chart');
    if(!wrap) return;
    const path = document.getElementById('pc-path');
    const dot = document.getElementById('pc-dot');
    const peak = document.getElementById('pc-peak');
    const peakLabel = document.getElementById('pc-peak-label');
    const elTime = document.getElementById('pc-time');
    const elSpeed = document.getElementById('pc-speed');
    const elPhase = document.getElementById('pc-phase');

    const total = path.getTotalLength();
    path.style.strokeDasharray = total;
    path.style.strokeDashoffset = total;

    // Escalones reales del protocolo: 5' de calentamiento a 8 km/h, luego +0,5 km/h cada minuto
    function speedAtMinute(min){
      if(min <= 5) return 8.0;
      const step = Math.min(Math.floor(min - 5) + 1, 10);
      return 8.0 + step * 0.5;
    }
    function phaseAtMinute(min, t){
      if(t >= 0.995) return 'AGOTAMIENTO';
      if(min <= 5) return 'CALENTAMIENTO';
      return 'INCREMENTO';
    }
    function fmtTime(min){
      const m = Math.floor(min);
      const s = Math.floor((min - m) * 60);
      return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
    }

    let playing = false;
    function play(){
      if(playing) return;
      playing = true;
      const duration = 4200;
      const start = performance.now();

      function frame(now){
        const t = Math.min((now - start) / duration, 1);
        const eased = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;

        path.style.strokeDashoffset = String(total * (1 - eased));

        const pt = path.getPointAtLength(total * eased);
        dot.setAttribute('cx', pt.x);
        dot.setAttribute('cy', pt.y);
        dot.style.opacity = t > 0.01 ? '1' : '0';

        const min = Math.max(0, Math.min(15, ((pt.x - 40) / 50)));
        elTime.textContent = fmtTime(min);
        elSpeed.innerHTML = speedAtMinute(min).toFixed(1) + ' <em>km/h</em>';
        elPhase.textContent = phaseAtMinute(min, t);

        if(t < 1){
          requestAnimationFrame(frame);
        } else {
          dot.style.opacity = '0';
          peak.style.opacity = '1';
          peakLabel.style.opacity = '1';
        }
      }
      requestAnimationFrame(frame);
    }

    const pcObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          play();
          pcObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.4});
    pcObserver.observe(wrap);
  })();

  document.querySelectorAll('.faq-item').forEach(item=>{
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if(!answer) return;
    btn.addEventListener('click', ()=>{
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem=>{
        openItem.classList.remove('open');
        const a = openItem.querySelector('.faq-a');
        if(a) a.style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
