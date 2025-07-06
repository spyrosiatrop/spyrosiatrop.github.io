// This function fetches the HTML content for each paper and appends it to the target element
fetch('data/papers.json')
  .then(res => res.json())
  .then(data => {
    // Example: show title, year, and pdf link only for leading papers
    loadAndRenderPapers(data.leadingPapers, "leading-papers", ["title", "authors", "year", "doi", "pdf", "code", "bibtex"]);
    
    // Example: show full info for contributing papers
    loadAndRenderPapers(data.contributingPapers, "contributing-papers", ["title", "authors", "year", "journal", "doi", "pdf", "code", "bibtex"]);
  });

/**
 * 
 * @param {Array} papers - array of paper objects
 * @param {string} targetId - ID of container element
 * @param {Array} fields - array of metadata keys to display in order
 */
function loadAndRenderPapers(papers, targetId, fields) {
  papers.sort((a, b) => b.year - a.year);

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
      authorsLine = `<div style="font-size: smaller;">
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

    // Collect links for one-line display
    let links = [];
    if (paper.doi) links.push(`<a href="${paper.doi}" target="_blank">DOI</a>`);
    if (paper.pdf) links.push(`<a href="${paper.pdf}" target="_blank">PDF</a>`);
    if (paper.code) links.push(`<a href="${paper.code}" target="_blank">Code</a>`);
    if (paper.bibtex) {
      links.push(`<a href="#" onclick="showBibtex(\`${paper.bibtex.replace(/`/g, '\\`')}\`);return false;">BibTeX</a>`);
    }

    let linksLine = '';
    if (links.length > 0) {
      linksLine = `<div>${links.join(' | ')}</div>`;
    }

    // Other fields (skip doi, pdf, code, bibtex, title, year, journal, authors)
    let otherFields = '';
    fields.forEach(field => {
      if (!['title', 'year', 'journal', 'authors', 'doi', 'pdf', 'code', 'bibtex'].includes(field) && paper[field]) {
        otherFields += `<p>${paper[field]}</p>`;
      }
    });

    article.innerHTML = `${firstLine}${authorsLine}${linksLine}${otherFields}`;
    container.appendChild(article);
});
}

// Add this function at the end of your JS file:
function showBibtex(bibtex) {
  document.getElementById('bibtex-content').textContent = bibtex;
  document.getElementById('bibtex-modal').style.display = 'flex';
}