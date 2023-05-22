import { BASE_URL, API_KEY } from './data.js'

export default class PixabayApiService {
  constructor(query) {
    this.searchQuery = query;
    this.page = 1;
    this.perPage = 40;
  }
  fetchCards() {
    console.log(this);
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;

    return fetch(url)
      .then(response => {
        if (!response.ok) {
            throw new Error(!response.status)
          }
        return response.json()
    })
      .then(({ totalHits, hits }) => {
        const isLastPage = this.page * this.perPage >= totalHits ;
        const isFirstPage = this.page === 1;
        this.incrementPage();
        return {images: hits, totalImages: totalHits, isLastPage, isFirstPage};
      })
      .catch();
  }

  incrementPage() {
    this.page += 1;
  }
}