const API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async (query, maxResults = 20) => {
  try {
    const url = API_KEY
      ? `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
      : `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch books');
    const data = await response.json();

    return data.items?.map(item => ({
      id: item.id,
      title: item.volumeInfo.title || 'Unknown Title',
      author: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
      year: item.volumeInfo.publishedDate?.substring(0, 4) || 'N/A',
      description: item.volumeInfo.description || 'No description available.',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      publisher: item.volumeInfo.publisher || 'Unknown Publisher',
      pageCount: item.volumeInfo.pageCount || 'N/A',
    })) || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const searchByISBN = async (isbn) => {
  const results = await searchBooks(`isbn:${isbn}`, 1);
  return results[0] ?? null;
};