import ImageApiService from './image-service';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import makeImagesMarkup from './render-gallery';

const refs = {
  searchForm: document.querySelector('#search-form'),
  imagesContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const imageApiService = new ImageApiService();
const lightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  clearImagesContainer();
  refs.loadMoreBtn.classList.add('is-hidden');
  if (!e.currentTarget.elements.query.value.trim()) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  imageApiService.query = e.currentTarget.elements.query.value.trim();

  imageApiService.resetPage();
  imageApiService.getImages().then(images => {
    if (images.hits.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    const imagesElements = images.hits.map(makeImagesMarkup).join('');
    refs.imagesContainer.insertAdjacentHTML('beforeend', imagesElements);
    refs.loadMoreBtn.classList.remove('is-hidden');
    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
    imageApiService.totalImages = images.totalHits;
    imageApiService.countPagesQuantity();
    lightbox.refresh();
  });
}

function onLoadMore() {
  refs.loadMoreBtn.classList.add('is-hidden');
  imageApiService.getImages().then(images => {
    const imagesElements = images.hits.map(makeImagesMarkup).join('');
    refs.imagesContainer.insertAdjacentHTML('beforeend', imagesElements);
    lightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (imageApiService.page > imageApiService.pagesQuantity) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  });
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}
