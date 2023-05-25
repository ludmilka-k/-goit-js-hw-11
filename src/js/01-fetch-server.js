import '../css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import PixabayApiService from './01-fetch-api.js'; // API
import getRefs from './get-refs.js';
import imagesTpl from '../templates/images.hbs';
import LoadMoreBtn from './components/load-more-btn.js';

const refs = getRefs();
const lightbox = getLightbox();
const pixabayApiService = new PixabayApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.button.addEventListener('click', onLoadMore);

function onSearch(evn) {
  evn.preventDefault();
  clearCardsContainer()
  const query = evn.currentTarget.elements.searchQuery.value.trim();
  if (query === '') {
    return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  } else {
    pixabayApiService.newQuery(query);

    loadMoreBtn.show();
    clearCardsContainer();
    loadCards().finally(() => refs.searchForm.reset());
  }
}

function loadCards() {
  loadMoreBtn.disable();
  return pixabayApiService.fetchCards()
    .then(({ images, totalImages, isLastPage, isFirstPage }) => {
      appendCardsMarkup(images);
      if (images.length === 0) {
        loadMoreBtn.hide();
        throw new Error(`Sorry, there are no images matching your search query. Please try again.`);
      }
      if (isFirstPage)
        Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
      if (isLastPage) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        loadMoreBtn.end();
        // loadMoreBtn.hide();
      } else {
        loadMoreBtn.enable();
      }
    })
    .catch(onFetchError)
    .finally(refs.searchForm.reset());
}

function onLoadMore() {
  loadCards();
}

function appendCardsMarkup(images) {
  refs.cardsContainer.insertAdjacentHTML('beforeend', imagesTpl(images));
  lightbox.refresh();
}

function clearCardsContainer() {
  refs.cardsContainer.innerHTML = '';
  lightbox.refresh();
}

function onFetchError(error) {
  console.error(error);
  Notiflix.Notify.failure(error.message);
  loadMoreBtn.hide();
  refs.cardsContainer.innerHTML = "<p>Not found!</p>";
}

function getLightbox() {
  return new SimpleLightbox('.gallery li a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });
}
