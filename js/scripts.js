function toggleMenu() {
  const overlay = document.getElementById('menuOverlay');
  const main = document.getElementById('main-content');
  const hamburger = document.getElementById('hamburgerBtn');
  overlay.classList.toggle('active');
  main.style.display = main.style.display === 'none' ? 'block' : 'none';
  if (hamburger) {
    hamburger.classList.toggle('open');
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  // Save preference
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
}

// On page load, apply dark mode if previously enabled
document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
  }

  const texts = document.querySelectorAll('.cycling-text');
  let currentIndex = 0;

  // Set initial active text
  if (texts.length > 0) texts[0].classList.add('active');

  function cycleText() {
      // Remove active class from current text
      texts[currentIndex].classList.remove('active');
      
      // Move to next text
      currentIndex = (currentIndex + 1) % texts.length;
      
      // Add active class to new text
      texts[currentIndex].classList.add('active');
  }

  // Change text every 3 seconds
  setInterval(cycleText, 3000);
});

function goBack() {
  window.history.back();
}
