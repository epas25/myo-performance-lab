// incluir.js — inyecta el header y footer compartidos en cada página
// y marca el link de navegación activo según <body data-page="...">.
// Cada página HTML solo necesita:
//   <div id="header"></div>  ...  <div id="footer"></div>
//   <script src="js/incluir.js" defer></script>

(async function () {
  async function injectPartial(url, mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`No se pudo cargar ${url}: ${res.status}`);
      mount.innerHTML = await res.text();
    } catch (err) {
      console.error('[incluir.js]', err);
    }
  }

  await Promise.all([
    injectPartial('header.html', 'header'),
    injectPartial('footer.html', 'footer'),
  ]);

  // Marca el link de nav activo
  const currentPage = document.body.dataset.page;
  if (currentPage) {
    const activeLink = document.querySelector(`nav a[data-page="${currentPage}"]`);
    if (activeLink) activeLink.classList.add('active');
  }

  // Menú móvil: abrir/cerrar
  const toggle = document.querySelector('.menu-toggle');
  const header = document.querySelector('header');
  if (toggle && header) {
    toggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Cierra el menú al pulsar un link (útil en móvil, una sola página visible a la vez)
    header.querySelectorAll('nav a, .nav-cta').forEach((link) => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Notifica que los partials están listos, por si otro script necesita esperar
  document.dispatchEvent(new CustomEvent('partials:loaded'));
})();
