import ImageApiService from './image-service';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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

  if (!e.currentTarget.elements.query.value.trim()) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  clearImagesContainer();
  imageApiService.query = e.currentTarget.elements.query.value.trim();

  imageApiService.resetPage();
  imageApiService.fetchArticles().then(images => {
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
  imageApiService.fetchArticles().then(images => {
    const imagesElements = images.hits.map(makeImagesMarkup).join('');
    refs.imagesContainer.insertAdjacentHTML('beforeend', imagesElements);
    lightbox.refresh();

    if (imageApiService.page > imageApiService.pagesQuantity) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  });
}

function makeImagesMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
        <div class="gallery__item">
          <a class="gallery__link" href="${largeImageURL}">
            <img
              class="gallery__image"
              src="${webformatURL}"
              alt="${tags}"
              loading="lazy"
            />
          </a>
        </div>
        <div class="info">
          <p class="info-item">
            <span><b>Likes</b></span>
            <span>${likes}</span>
          </p>
          <p class="info-item">
            <span><b>Views</b></span>
            <span>${views}</span>
          </p>
          <p class="info-item">
            <span><b>Comments</b></span>
            <span>${comments}</span>
          </p>
          <p class="info-item">
            <span><b>Downloads</b></span>
            <span>${downloads}</span>
          </p>
        </div>
      </div>`;
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}
