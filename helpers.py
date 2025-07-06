import re

def bibtex_to_dict(bibtex_entry):
    # Extract the entry type and key (optional, not used here)
    entry_match = re.match(r'@\w+\{([^,]+),', bibtex_entry)
    entry_id = entry_match.group(1) if entry_match else None

    # Extract all key-value pairs
    fields = dict(re.findall(r'(\w+)\s*=\s*[{"]([^}"]+)[}"],?', bibtex_entry))

    # Map BibTeX fields to JSON format
    result = {
        "title": fields.get("title", "").strip(),
        "file": entry_id or re.sub(r'\W+', '', fields.get("title", "").lower()),  # fallback to slug
        "year": int(fields.get("year", 0)),
        "conference": fields.get("booktitle", fields.get("journal", "")).strip(),
        "doi": f"https://doi.org/{fields.get('doi')}" if "doi" in fields else "",
        "pdf": f"{entry_id or re.sub(r'\\W+', '', fields.get('title', '').lower())}.pdf"
    }

    return result
