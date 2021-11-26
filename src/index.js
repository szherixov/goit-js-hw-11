import './CSS/style.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from './main.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const button = document.querySelector('.load-more');

button.classList.add('hidden');
let page = 1;
const per_page = 40;
let inputName = '';
let gallery = {};
formEl.addEventListener('submit', onFormSubmit);
button.addEventListener('click', onBtnclick);

async function onFormSubmit(e) {
  e.preventDefault();
  galleryEl.innerHTML = '';
  page = 1;
  button.classList.add('hidden');
  inputName = e.target.searchQuery.value;

  if (inputName.trim() === '') {
    return;
  }
  try {
    const data = await getImages(inputName.trim(), page, per_page);
    console.log(getImages());
    if (data.hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
        timeout: 5000,
      });
    } else {
      Notify.success(`Hooray! We found ${data.totalHits} images`, { timeout: 2500 });
      markImage(data.hits);
      gallery = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
      page * per_page <= data.totalHits && button.classList.remove('hidden');

      page += 1;
    }
  } catch (error) {
    console.log(error.message);
  }
}
async function onBtnclick(e) {
  try {
    const data = await getImages(inputName.trim(), page, per_page);
    if (page * per_page >= data.totalHits) {
      button.classList.add('hidden');
      Notify.info("We're sorry, but you've reached the end of search results.", { timeout: 4000 });
    }
    markImage(data.hits);
    gallery.refresh();
    page += 1;
    const { height } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: height * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error.message);
  }
}

function markImage(images) {
  const mark = images
    .map(image => {
      const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
      return `<a class="gallery__item" href="${largeImageURL}">
    <div class="photo-card">
      <div class="wrapper-img">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </div>  
      <div class="info">
        <p class="info-item">
          <b>Likes </b>${likes}
        </p>
        <p class="info-item">
          <b>Views </b>${views}
        </p>
        <p class="info-item">
          <b>Comments </b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads </b>${downloads}
        </p>
      </div>
    </div>
  </a>`;
    })
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', mark);
}