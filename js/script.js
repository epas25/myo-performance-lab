// Ambient full-hero waveform — large, slow, sits behind the whole hero (and reused en Prueba social)
// Solo existe en Inicio: si estos elementos no están en la página, no hacemos nada (sin esto,
// un error aquí cortaba TODO el script.js y dejaba las demás páginas sin animaciones ni contenido visible).
(function () {
  const ambLine1 = document.getElementById('amb-line-1');
  const ambLine2 = document.getElementById('amb-line-2');
  const ambLine3 = document.getElementById('amb-line-3');
  if (!ambLine1 || !ambLine2 || !ambLine3) return;

  const ambLine1b = document.getElementById('amb-line-1b');
  const ambLine2b = document.getElementById('amb-line-2b');
  const ambLine3b = document.getElementById('amb-line-3b');
  const AW = 1000, AH = 600, AMID = 340;

  function buildAmbientWave(t, amp, freq, phase) {
    let d = `M -20 ${AMID}`;
    for (let x = -20; x <= AW + 20; x += 10) {
      const y = AMID
        - Math.sin((x * freq) + t + phase) * amp
        - Math.sin((x * freq * 1.9) + t * 1.3 + phase) * (amp * 0.35);
      d += ` L ${x} ${y.toFixed(1)}`;
    }
    return d;
  }

  let at = 0;
  function animateAmbient() {
    at += 0.012;
    ambLine1.setAttribute('d', buildAmbientWave(at, 62, 0.006, 0));
    ambLine2.setAttribute('d', buildAmbientWave(at * 0.7, 90, 0.0045, 1.4));
    ambLine3.setAttribute('d', buildAmbientWave(at * 0.45, 120, 0.003, 2.6));
    if (ambLine1b) {
      ambLine1b.setAttribute('d', buildAmbientWave(at * 0.85 + 3, 62, 0.006, 0.6));
      ambLine2b.setAttribute('d', buildAmbientWave(at * 0.6 + 3, 90, 0.0045, 2.0));
      ambLine3b.setAttribute('d', buildAmbientWave(at * 0.4 + 3, 120, 0.003, 3.2));
    }
    requestAnimationFrame(animateAmbient);
  }
  animateAmbient();
})();

// Count-up stats — presente solo en algunas páginas, pero es seguro en todas (querySelectorAll
// nunca falla aunque no haya ningún elemento [data-count]).
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let cur = 0;
        const step = () => {
          cur += Math.max(1, target / 40);
          if (cur >= target) {
            el.textContent = target + suffix;
          } else {
            el.textContent = Math.floor(cur) + suffix;
            requestAnimationFrame(step);
          }
        };
        step();
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObserver.observe(c));
})();

// Efecto máquina de escribir — solo si existe #tw-text en la página
(function () {
  const twText = document.getElementById('tw-text');
  if (!twText) return;
  const twObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const full = twText.dataset.full;
        let i = 0;
        const typeStep = () => {
          if (i <= full.length) {
            twText.textContent = full.slice(0, i);
            i++;
            setTimeout(typeStep, 38);
          }
        };
        typeStep();
        twObserver.unobserve(twText);
      }
    });
  }, { threshold: 0.6 });
  twObserver.observe(twText);
})();

// Tarjetas giratorias — clic/toque además de hover, para pantallas táctiles
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });
});

// Reveal on scroll — se usa en TODAS las páginas, por eso va sin depender de nada más arriba
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// 3D parallax on mouse move — cuñas del hero de Inicio, solo si existen esos elementos
(function () {
  const heroSection = document.getElementById('hero');
  const parallaxField = document.getElementById('parallax-field');
  const heroWaveAmbient = document.getElementById('hero-waveform-ambient');
  if (!heroSection || !parallaxField || !heroWaveAmbient) return;

  const layers = parallaxField.querySelectorAll('.p-layer');
  const layerDepth = { back: 5, mid: 10, front: 16 };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    layers.forEach(layer => {
      const depth = layerDepth[[...layer.classList].find(c => layerDepth[c])] || 8;
      layer.style.transform = `translate(${px * depth * -1}px, ${py * depth * -1}px)`;
    });

    heroWaveAmbient.style.transform = `translate(${px * -6}px, ${py * -5}px) scale(1.015)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    layers.forEach(layer => { layer.style.transform = 'translate(0,0)'; });
    heroWaveAmbient.style.transform = 'translate(0,0) scale(1)';
  });
})();

// Parallax de scroll muy sutil, fuera del hero — rejilla de fondo y cuñas sueltas
(function () {
  const scrollParallaxEls = document.querySelectorAll('[data-parallax]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !scrollParallaxEls.length) return;

  let ticking = false;
  function updateScrollParallax() {
    const y = window.scrollY;
    scrollParallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax);
      const offset = y * speed;
      el.style.transform = el.classList.contains('drift-wedge')
        ? `translateY(${offset}px) skewX(-20deg)`
        : `translateY(${offset}px)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollParallax);
      ticking = true;
    }
  }, { passive: true });
  updateScrollParallax();
})();

// Calendly popup — botones "Reserva tu llamada" en TODAS las páginas (header + CTAs propios de cada página).
// Delegación de eventos en document en vez de enganchar listeners uno a uno: el botón del header
// se inyecta de forma asíncrona vía incluir.js y puede no existir todavía cuando este script corre.
// Con delegación no importa cuándo aparezca el botón en el DOM, siempre se captura el clic.
// Si el script de Calendly aún no ha cargado, el href normal del botón sirve de fallback y abre calendly.com directamente.
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-cta="calendly"]');
  if (!btn) return;
  if (typeof Calendly !== 'undefined') {
    e.preventDefault();
    Calendly.initPopupWidget({ url: 'https://calendly.com/myo-performance-lab-coach/30min' });
  }
});
