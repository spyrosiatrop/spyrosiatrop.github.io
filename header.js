function createHeader(activePage) {
  return `
    <header>
      <h1>Spyros Iatropoulos MD, MSc</h1>
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
    
    <!-- Mobile navigation overlay -->
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
  const button = document.querySelector('.menu-toggle');
  
  overlay.classList.toggle('active');
  button.classList.toggle('active');
  
  // Prevent body scroll when menu is open
  document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
  const overlay = document.getElementById('mobile-nav');
  const button = document.querySelector('.menu-toggle');
  
  overlay.classList.remove('active');
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