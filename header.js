function createHeader(activePage) {
  return `
    <header>
      <h1>Spyros Iatropoulos MD, MSc</h1>
      <p>Sports Medicine | Data Analysis</p>
      <nav>
        <a href="index.html" ${activePage === 'home' ? 'class="active"' : ''}>Home</a>
        <a href="about.html" ${activePage === 'about' ? 'class="active"' : ''}>About</a>
        <a href="research.html" ${activePage === 'research' ? 'class="active"' : ''}>Research</a>
        <a href="contact.html" ${activePage === 'contact' ? 'class="active"' : ''}>Contact</a>
        <a href="newsletter.html" ${activePage === 'newsletter' ? 'class="active"' : ''}>Newsletter</a>
      </nav>
    </header>
  `;
}

function createFooter() {
  return `
    <footer>
      <p>&copy; 2025 Spyros Iatropoulos</p>
    </footer>
  `;
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
});