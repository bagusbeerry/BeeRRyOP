// BeeRRy personal profile - typewriter animation & hamburger menu
document.addEventListener('DOMContentLoaded', function () {
  // Typewriter animation
  const heroText = document.getElementById('hero-text');
  if (heroText) {
    heroText.style.animation = 'none';
    setTimeout(() => {
      heroText.style.animation = '';
    }, 10);
  }

  // Hamburger menu functionality
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerBtn && navMenu) {
    // Toggle menu on hamburger click
    hamburgerBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a navigation link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        // Don't prevent default for external links
        if (this.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
        // Close menu after clicking any link
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside navbar
    document.addEventListener('click', function (e) {
      if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  console.log('BeeRRy personal profile page loaded.');
});

