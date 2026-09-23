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

  // Iniciar autoplay
  startAutoplay();
});
