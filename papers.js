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
    const article = document.createElement('article');

    // First line: [title], [year] - [journal]
    let firstLine = `<strong>${paper.title || ''}</strong>`;
    if (paper.year) firstLine += `, ${paper.year}`;
    if (paper.journal) firstLine += ` – <em>${paper.journal}</em>`;

    // Second line: Author names (space separated, no label)
    let authorsLine = '';
    if (paper.authors && Array.isArray(paper.authors)) {
      authorsLine = `<div style="font-size: smaller; margin-bottom: 0.7em;">
        ${
          paper.authors
            .map(name =>
              name.includes('Iatropoulos')
                ? `<b>${name}</b>`
                : name
            )
            .join(', ')
        }
      </div>`;
    }

    // Collect links based on fields array
    let links = [];

    if (fields.includes('link') && paper.link && paper.link !== null) links.push(`<a href="${paper.link}" target="_blank" class="paper-btn">Link</a>`);
    if (fields.includes('pdf') && paper.pdf && paper.pdf !== null) links.push(`<a href="${paper.pdf}" target="_blank" class="paper-btn">PDF</a>`);
    if (fields.includes('code') && paper.code && paper.code !== null) links.push(`<a href="${paper.code}" target="_blank" class="paper-btn">Code</a>`);
    if (fields.includes('bibtex') && paper.bibtex) {
      links.push(`<a href="#" class="paper-btn" onclick="showBibtex(\`${paper.bibtex.replace(/`/g, '\\`')}\`);return false;">BibTeX</a>`);
    }

    let linksLine = '';
    if (links.length > 0) {
      linksLine = `<div style="margin-bottom: 0.7em; display: flex; gap: 0.5em; flex-wrap: wrap;">${links.join('')}</div>`;
    }

    // Set the article content
    article.innerHTML = `${firstLine}${authorsLine}${linksLine}`;
    container.appendChild(article);
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