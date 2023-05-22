import { BASE_URL, API_KEY } from './data.js';
import axios from 'axios';

export default class PixabayApiService {
  constructor(query) {
    this.searchQuery = query;
    this.page = 1;
    this.perPage = 40;
  }
  async fetchCards() {
    console.log(this);
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;
    try {
      const { data: { totalHits, hits } } = await axios.get(url);
      const isLastPage = this.page * this.perPage >= totalHits;
      const isFirstPage = this.page === 1;
      this.incrementPage();
      return { images: hits, totalImages: totalHits, isLastPage, isFirstPage };
    } catch (error) {
      console.log(error);
    }
  }
  incrementPage() {
    this.page += 1;
  }
}
