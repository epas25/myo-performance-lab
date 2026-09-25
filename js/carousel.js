// MYO Performance Lab — Carousel Controller
// Autoplay cada 3 segundos, navegación manual, dots interactivos

(function() {
  const carouselTrack = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('dotsContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!carouselTrack || !dotsContainer || !prevBtn || !nextBtn) {
    console.warn('Carousel: elementos no encontrados');
    return;
  }

  const slides = document.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoplayInterval;

  // Crear dots
  function createDots() {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Ir a slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Ir a slide específica
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetAutoplay();
  }

  // Siguiente slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  // Slide anterior
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  // Actualizar carousel (posición + dots)
  function updateCarousel() {
    const offset = -currentIndex * 100;
    carouselTrack.style.transform = `translateX(${offset}%)`;

    document.querySelectorAll('.dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      nextSlide();
    }, 3000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // Event listeners
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  // Pausar al pasar el mouse
  const wrapper = document.querySelector('.carousel-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => {
      clearInterval(autoplayInterval);
    });

    wrapper.addEventListener('mouseleave', () => {
      startAutoplay();
    });
  }

  // Deslizar con el dedo (móvil/tablet): izquierda = siguiente, derecha = anterior.
  // touch-action:pan-y deja que el scroll vertical de la página siga funcionando.
  if (wrapper) {
    let startX = 0, startY = 0, tracking = false;
    wrapper.style.touchAction = 'pan-y';
    wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
      clearInterval(autoplayInterval);
    }, { passive: true });
    wrapper.addEventListener('touchend', (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) nextSlide(); else prevSlide();
      }
      resetAutoplay();
    }, { passive: true });
  }

  // Inicializar
  createDots();
  startAutoplay();

  // Log de inicialización (opcional)
  console.log('✓ Carousel MYO initialized — 6 slides, autoplay 3s');
})();
