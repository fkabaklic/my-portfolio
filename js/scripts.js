function toggleOverlay() {
    const overlay = document.getElementById('menuOverlay');
    overlay.classList.toggle('open');
    if (overlay.classList.contains('open')) {
      const links = overlay.querySelectorAll('a');
      links.forEach(link => {
        link.style.animation = 'none';
        void link.offsetWidth;
        link.style.animation = '';
      });
    }
  }
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }