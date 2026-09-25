document.addEventListener('DOMContentLoaded', function() {
  const carouselProgramacion = document.getElementById('carouselProgramacion');
  
  if (!carouselProgramacion) return;

  const track = document.getElementById('carouselTrackProgramacion');
  const dotsContainer = document.getElementById('dotsProgramacion');
  const slides = track.querySelectorAll('.carousel-slide');
  
  let currentIndex = 0;
  let autoplayInterval;
  let isPaused = false;

  // Crear dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  function goToSlide(index) {
    currentIndex = index;
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
  }

  function startAutoplay() {
    if (!isPaused) {
      autoplayInterval = setInterval(nextSlide, 3000);
    }
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Pause on hover, resume on leave
  carouselProgramacion.addEventListener('mouseenter', stopAutoplay);
  carouselProgramacion.addEventListener('mouseleave', startAutoplay);

  // Deslizar con el dedo (móvil/tablet): izquierda = siguiente, derecha = anterior.
  // touch-action:pan-y deja que el scroll vertical de la página siga funcionando.
  let startX = 0, startY = 0, tracking = false;
  carouselProgramacion.style.touchAction = 'pan-y';
  carouselProgramacion.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
    stopAutoplay();
  }, { passive: true });
  carouselProgramacion.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        nextSlide();
      } else {
        goToSlide((currentIndex - 1 + slides.length) % slides.length);
      }
    }
    stopAutoplay();
    startAutoplay();
  }, { passive: true });

  // Iniciar autoplay
  startAutoplay();
});
