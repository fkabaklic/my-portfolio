function toggleMenu() {
  const overlay = document.getElementById('menuOverlay');
  const main = document.getElementById('main-content');
  overlay.classList.toggle('active');
  main.style.display = main.style.display === 'none' ? 'block' : 'none';
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Text cycling functionality
document.addEventListener('DOMContentLoaded', function() {
  const texts = document.querySelectorAll('.cycling-text');
  let currentIndex = 0;

  // Set initial active text
  texts[0].classList.add('active');

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
