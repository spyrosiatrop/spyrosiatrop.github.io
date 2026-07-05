function createHeadElements() {
  return `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-5XVTGEY33B"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-5XVTGEY33B');
    </script>
    
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    
    <!-- Favicon and touch icons -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="msapplication-TileColor" content="#2c3e50">
    <meta name="theme-color" content="#2c3e50">
    
    <link rel="stylesheet" href="style.css" />
  `;
}

function createHeader(activePage) {
  return `
    <header>
      <h1>Spyros Iatropoulos MD, MSc, PhD</h1>
      <p>Sports Medicine | Data Analysis</p>
      
      <!-- Hamburger menu button (mobile only) -->
      <button class="menu-toggle" onclick="toggleMobileMenu()">
        <span class="hamburger"></span>
      </button>
      
      <!-- Regular navigation (desktop) -->
      <nav>
        <a href="index.html" ${activePage === 'home' ? 'class="active"' : ''}>Home</a>
        <a href="about.html" ${activePage === 'about' ? 'class="active"' : ''}>About</a>
        <a href="research.html" ${activePage === 'research' ? 'class="active"' : ''}>Research</a>
        <a href="contact.html" ${activePage === 'contact' ? 'class="active"' : ''}>Contact</a>
        <a href="newsletter.html" ${activePage === 'newsletter' ? 'class="active"' : ''}>Newsletter</a>
      </nav>
    </header>
    
    <!-- Mobile navigation backdrop -->
    <div class="nav-backdrop" id="mobile-backdrop" onclick="closeMobileMenu()"></div>
    
    <!-- Mobile navigation slide-in panel -->
    <div class="nav-overlay" id="mobile-nav">
      <nav>
        <a href="index.html" ${activePage === 'home' ? 'class="active"' : ''} onclick="closeMobileMenu()">Home</a>
        <a href="about.html" ${activePage === 'about' ? 'class="active"' : ''} onclick="closeMobileMenu()">About</a>
        <a href="research.html" ${activePage === 'research' ? 'class="active"' : ''} onclick="closeMobileMenu()">Research</a>
        <a href="contact.html" ${activePage === 'contact' ? 'class="active"' : ''} onclick="closeMobileMenu()">Contact</a>
        <a href="newsletter.html" ${activePage === 'newsletter' ? 'class="active"' : ''} onclick="closeMobileMenu()">Newsletter</a>
      </nav>
    </div>
  `;
}

function createFooter() {
  return `
    <footer>
      <p>&copy; 2025 Spyros Iatropoulos</p>
    </footer>
  `;
}

// Mobile menu functions
function toggleMobileMenu() {
  const overlay = document.getElementById('mobile-nav');
  const backdrop = document.getElementById('mobile-backdrop');
  const button = document.querySelector('.menu-toggle');
  
  overlay.classList.toggle('active');
  backdrop.classList.toggle('active');
  button.classList.toggle('active');
  
  // Prevent body scroll when menu is open
  document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
  const overlay = document.getElementById('mobile-nav');
  const backdrop = document.getElementById('mobile-backdrop');
  const button = document.querySelector('.menu-toggle');
  
  overlay.classList.remove('active');
  backdrop.classList.remove('active');
  button.classList.remove('active');
  document.body.style.overflow = '';
}

// Load header and footer when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const headerContainer = document.getElementById('header-container');
  const footerContainer = document.getElementById('footer-container');
  const activePage = document.body.getAttribute('data-page');
  
  if (headerContainer) {
    headerContainer.innerHTML = createHeader(activePage);
  }
  if (footerContainer) {
    footerContainer.innerHTML = createFooter();
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    const overlay = document.getElementById('mobile-nav');
    const button = document.querySelector('.menu-toggle');
    
    if (overlay && overlay.classList.contains('active') && 
        !overlay.contains(e.target) && !button.contains(e.target)) {
      closeMobileMenu();
    }
  });
});