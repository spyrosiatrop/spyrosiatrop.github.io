function categorizeByFirstAuthor(papers) {
  const leading = [];
  const contributing = [];
  
  papers.forEach(paper => {
    if (paper.authors && paper.authors.length > 0) {
      const firstAuthor = paper.authors[0].toLowerCase();
      if (firstAuthor.includes('iatropoulos') || firstAuthor.includes('spyridon')) {
        leading.push(paper);
      } else {
        contributing.push(paper);
      }
    }
  });
  
  return { leading, contributing };
}

function sortPapersByDate(papers) {
  return papers.sort((a, b) => {
    const dateA = new Date(a.published || a.year);
    const dateB = new Date(b.published || b.year);
    return dateB - dateA; // Newest first
  });
}

function loadAndRenderPapers(papers, targetId, fields) {
  const container = document.getElementById(targetId);
  if (!container) {
    console.error(`Container with ID "${targetId}" not found`);
    return;
  }
  
  container.innerHTML = '';  // clear existing content

  papers.forEach(paper => {
    // Create CV wrapper and section for each paper
    const cvWrapper = document.createElement('div');
    cvWrapper.className = 'cv-wrapper';
    
    // Collect links based on fields array
    let links = [];
    if (fields.includes('link') && paper.link && paper.link !== null) links.push(`<a href="${paper.link}" target="_blank" class="paper-link">Link</a>`);
    if (fields.includes('pdf') && paper.pdf && paper.pdf !== null) links.push(`<a href="${paper.pdf}" target="_blank" class="paper-link">PDF</a>`);
    if (fields.includes('code') && paper.code && paper.code !== null) links.push(`<a href="${paper.code}" target="_blank" class="paper-link">Code</a>`);
    if (fields.includes('bibtex') && paper.bibtex) {
      links.push(`<a href="#" class="paper-link" onclick="showBibtex(\`${paper.bibtex.replace(/`/g, '\\`')}\`);return false;">BibTeX</a>`);
    }

    // Format authors with bold for Iatropoulos
    let authorsDisplay = '';
    if (paper.authors && Array.isArray(paper.authors)) {
      authorsDisplay = paper.authors
        .map(name => name.includes('Iatropoulos') ? `<b>${name}</b>` : name)
        .join(', ');
    }

    // Format title with year and journal
    const titleWithYear = `${paper.title || ''}, ${paper.year || ''} - ${paper.journal || ''}`;

    cvWrapper.innerHTML = `
      <div class="cv-section">
        <div class="paper-content">
          <h4 class="paper-title">${titleWithYear}</h4>
          <div class="paper-authors">${authorsDisplay}</div>
          <div class="paper-info">
            <div class="paper-links">
              ${links.join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(cvWrapper);
  });
}

// Load papers and categorize them
fetch('data/papers.json')
  .then(response => response.json())
  .then(data => {
    console.log('Loaded data:', data); // Debug log
    
    // Handle both old and new JSON structures
    let allPapers = [];
    if (data.papers) {
      // New structure with single papers array
      allPapers = data.papers;
    } else if (data.leadingPapers && data.contributingPapers) {
      // Old structure with separate arrays
      allPapers = [...data.leadingPapers, ...data.contributingPapers];
    } else {
      throw new Error('Invalid JSON structure: no papers found');
    }
    
    // Categorize papers dynamically
    const { leading, contributing } = categorizeByFirstAuthor(allPapers);
    
    // Sort both categories by date (newest first)
    const sortedLeading = sortPapersByDate(leading);
    const sortedContributing = sortPapersByDate(contributing);
    
    console.log('Leading papers:', sortedLeading.length);
    console.log('Contributing papers:', sortedContributing.length);
    
    // Render leading papers (sorted by date)
    loadAndRenderPapers(sortedLeading, 'leading-papers', ['link', 'code', 'bibtex']);
    
    // Render contributing papers (sorted by date)
    loadAndRenderPapers(sortedContributing, 'contributing-papers', ['link', 'code', 'bibtex']);
  })
  .catch(error => {
    console.error('Error loading papers:', error);
    document.getElementById('leading-papers').innerHTML = '<p>Error loading leading papers.</p>';
    document.getElementById('contributing-papers').innerHTML = '<p>Error loading contributing papers.</p>';
  });

// Add this function at the end of your JS file:
function showBibtex(bibtex) {
  document.getElementById('bibtex-content').textContent = bibtex;
  document.getElementById('bibtex-modal').style.display = 'flex';
}