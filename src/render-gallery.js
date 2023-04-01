export default function makeImagesMarkup({
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
