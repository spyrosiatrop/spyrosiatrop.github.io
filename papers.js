// This function fetches the HTML content for each paper and appends it to the target element
fetch('data/papers.json')
  .then(res => res.json())
  .then(data => {
    // Example: show only for leading papers
    loadAndRenderPapers(data.leadingPapers, "leading-papers", ["title", "authors", "year", "journal", "link", "code", "bibtex"]);
    
    // Example: show full info for contributing papers
    loadAndRenderPapers(data.contributingPapers, "contributing-papers", ["title", "authors", "year", "journal", "link", "code", "bibtex"]);
  });

/**
 * 
 * @param {Array} papers - array of paper objects
 * @param {string} targetId - ID of container element
 * @param {Array} fields - array of metadata keys to display in order
 */
function loadAndRenderPapers(papers, targetId, fields) {
  // Sort by 'published' (descending), fallback to 'year' if 'published' is missing
  papers.sort((a, b) => {
    if (a.published && b.published) {
      return b.published.localeCompare(a.published);
    } else if (a.published) {
      return -1;
    } else if (b.published) {
      return 1;
    } else {
      return (b.year || 0) - (a.year || 0);
    }
  });

  const container = document.getElementById(targetId);
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

    if (fields.includes('link') && paper.link !== null) links.push(`<a href="${paper.link}" target="_blank" class="paper-btn">Link</a>`);
    if (fields.includes('pdf') && paper.pdf !== null) links.push(`<a href="${paper.pdf}" target="_blank" class="paper-btn">PDF</a>`);
    if (fields.includes('code') && paper.code !== null) links.push(`<a href="${paper.code}" target="_blank" class="paper-btn">Code</a>`);
    if (fields.includes('bibtex')) {
      links.push(`<a href="#" class="paper-btn" onclick="showBibtex(\`${paper.bibtex.replace(/`/g, '\\`')}\`);return false;">BibTeX</a>`);
    }

    let linksLine = '';
    if (links.length > 0) {
      linksLine = `<div style="margin-bottom: 0.7em; display: flex; gap: 0.5em;">${links.join('')}</div>`;
    }

    // Set the article content
    article.innerHTML = `${firstLine}${authorsLine}${linksLine}`;
    container.appendChild(article);
  });
}

// Add this function at the end of your JS file:
function showBibtex(bibtex) {
  document.getElementById('bibtex-content').textContent = bibtex;
  document.getElementById('bibtex-modal').style.display = 'flex';
}