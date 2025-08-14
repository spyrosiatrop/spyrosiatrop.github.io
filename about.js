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

// Load and display latest publications with counts
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
    
    // Categorize papers first
    const { leading, contributing } = categorizeByFirstAuthor(allPapers);
    
    // Sort all papers by date (newest first) and get the latest 2
    const sortedPapers = allPapers.sort((a, b) => {
      const dateA = new Date(a.published || a.year);
      const dateB = new Date(b.published || b.year);
      return dateB - dateA; // Newest first
    });
    
    const latestTwoPapers = sortedPapers.slice(0, 2);
    
    // Count total publications
    const totalCount = allPapers.length;
    
    // Display latest publications
    const latestDiv = document.getElementById('latest-publication');
    
    // Function to create paper HTML
    function createPaperHTML(paper) {
      let firstLine = `<strong>${paper.title || ''}</strong>`;
      if (paper.year) firstLine += `, ${paper.year}`;
      if (paper.journal) firstLine += ` – <em>${paper.journal}</em>`;
      
      let authorsLine = '';
      if (paper.authors && Array.isArray(paper.authors)) {
        authorsLine = `<div style="font-size: smaller; margin-bottom: 0.7em;">
          ${paper.authors
            .map(name => name.includes('Iatropoulos') ? `<b>${name}</b>` : name)
            .join(', ')
          }
        </div>`;
      }
      
      // Create buttons
      let links = [];
      if (paper.link) links.push(`<a href="${paper.link}" target="_blank" class="paper-btn">Link</a>`);
      if (paper.code) links.push(`<a href="${paper.code}" target="_blank" class="paper-btn">Code</a>`);
      if (paper.bibtex) {
        links.push(`<a href="#" class="paper-btn" onclick="showBibtex(\`${paper.bibtex.replace(/`/g, '\\`')}\`);return false;">BibTeX</a>`);
      }
      
      let linksLine = '';
      if (links.length > 0) {
        linksLine = `<div style="margin-bottom: 0.7em; display: flex; gap: 0.5em; flex-wrap: wrap;">${links.join('')}</div>`;
      }
      
      return `${firstLine}${authorsLine}${linksLine}`;
    }
    
    // Generate HTML for latest two papers
    const papersHTML = latestTwoPapers.map(paper => `
      <div class="cv-item" style="background: white; padding: 1rem; border-radius: 6px; border: 1px solid #e0e0e0; margin-bottom: 1rem;">
        ${createPaperHTML(paper)}
      </div>
    `).join('');
    
    latestDiv.innerHTML = papersHTML;
    
    // Update the link text with total count only
    const linkElement = document.getElementById('publications-link');
    linkElement.textContent = `→ View all ${totalCount} publications`;
  })
  .catch(error => {
    console.error('Error loading publications:', error);
    document.getElementById('latest-publication').innerHTML = '<p>Error loading latest publications.</p>';
  });

// BibTeX modal function
function showBibtex(bibtex) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('bibtex-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'bibtex-modal';
    modal.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center;';
    modal.innerHTML = `
      <div style="background:#fff;padding:1em;max-width:90vw;max-height:80vh;overflow:auto;position:relative;">
        <button onclick="document.getElementById('bibtex-modal').style.display='none'" style="position:absolute;top:0.5em;right:0.5em;">Close</button>
        <pre id="bibtex-content" style="white-space:pre-wrap;"></pre>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  document.getElementById('bibtex-content').textContent = bibtex;
  modal.style.display = 'flex';
}