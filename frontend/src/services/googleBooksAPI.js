const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async (query, maxResults = 20) => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

    // ── Build a structured query to prefer original works ──────────────────
    // intitle: scopes the search to the title field, reducing off-topic hits
    // (e.g. books *about* Harry Potter instead of the novels themselves)
    const structuredQuery = `intitle:${query}`;

    // Request more results than needed so we have room to filter
    const fetchCount = Math.min(maxResults * 2, 40);
    const params = new URLSearchParams({
      q: structuredQuery,
      maxResults: fetchCount,
      langRestrict: 'en',
      printType: 'books',
      orderBy: 'relevance',
      ...(apiKey && { key: apiKey }),
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) throw new Error('Failed to fetch books');

    const data = await response.json();
    if (!data.items) return [];

    const queryWords = query.toLowerCase().split(/\s+/);

    const results = data.items
      // ── Filter out low-quality results ──────────────────────────────────
      .filter((item) => {
        const info = item.volumeInfo;

        // Must have a real title and at least one author
        if (!info.title || !info.authors?.length) return false;

        // Skip books with placeholder-style titles
        if (info.title === 'Unknown Title') return false;

        // Must have a thumbnail (a good signal the entry is complete)
        if (!info.imageLinks?.thumbnail) return false;

        // Skip non-English results that slipped through langRestrict
        const lang = info.language;
        if (lang && lang !== 'en') return false;

        // ── NEW: Drop results where none of the query words appear in the title
        // This eliminates books *about* the query (studies, guides, analyses)
        const titleLower = info.title.toLowerCase();
        const matchCount = queryWords.filter((w) => titleLower.includes(w)).length;
        if (matchCount === 0) return false;

        return true;
      })
      // ── NEW: Sort — exact/close title matches float above derivative works ─
      // Prevents play adaptations, study guides, etc. from outranking the original
      .sort((a, b) => {
        const titleA = a.volumeInfo.title.toLowerCase();
        const titleB = b.volumeInfo.title.toLowerCase();
        const q = query.toLowerCase();

        const score = (title) => {
          if (title === q) return 3;                  // exact match
          if (title.startsWith(q)) return 2;          // starts with query (e.g. "Harry Potter and the…")
          if (title.includes(q)) return 1;            // contains full query
          return 0;                                   // partial word match only
        };

        return score(titleB) - score(titleA);
      })
      // ── Map to your book structure ────────────────────────────────────────
      .map((item) => {
        const info = item.volumeInfo;
        return {
          id: item.id,
          title: info.title,
          author: info.authors.join(', '),
          year: info.publishedDate?.substring(0, 4) || '',
          description: info.description || '',
          thumbnail: info.imageLinks.thumbnail.replace('http://', 'https://'),
          publisher: info.publisher || '',
          pageCount: info.pageCount || null,
        };
      })
      // Trim to the requested max after filtering
      .slice(0, maxResults);

    return results;
  } catch (error) {
    console.error('Error fetching books:', error?.message ?? String(error));
    throw error;
  }
};