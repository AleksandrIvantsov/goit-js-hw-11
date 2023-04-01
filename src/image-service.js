const API_KEY = '34935791-73eb810d15f915878d8eca6fb';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.totalHits = 0;
    this.pagesQuantity = 0;
  }

  fetchArticles() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        this.incrementPage();

        return data;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    return (this.searchQuery = newQuery);
  }

  get totalImages() {
    return this.totalHits;
  }

  set totalImages(newValue) {
    return (this.totalHits = newValue);
  }

  countPagesQuantity() {
    this.pagesQuantity = Math.ceil(this.totalHits / this.perPage);
  }
}
