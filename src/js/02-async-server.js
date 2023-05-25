import '../css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import PixabayApiService from './02-async-api.js'; // API
import getRefs from './get-refs.js';
import imagesTpl from '../templates/images.hbs';

const lightbox = getLightbox();
const refs = getRefs();
const pixabayApiService = new PixabayApiService();
let scrollEnabled = false;
let lastPageReached = false;

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(evn) {
  evn.preventDefault();
  clearCardsContainer();
  const query = evn.currentTarget.elements.searchQuery.value.trim();

  if (query === '') {
    return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  } else {
    pixabayApiService.newQuery(query);
    lastPageReached = false;

    clearCardsContainer();
    loadCards();
  }
}

 function loadCards() {
  scrollEnabled = false;
  
  if (lastPageReached) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    loadCardsAsync();
  }
}

async function loadCardsAsync() {
  try {
    const { images, totalImages, isLastPage, isFirstPage } = await pixabayApiService.fetchCards();

    if (images.length === 0) {
      throw new Error(`Sorry, there are no images matching your search query. Please try again.`);
    }

    appendCardsMarkup(images);

    if (isFirstPage) {
      Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
    }

    if (isLastPage) {
      lastPageReached = true;
    }
    scrollEnabled = true;

  } catch (error) {
    onFetchError(error);
  } finally {
    refs.searchForm.reset();
  }
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
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  refs.cardsContainer.innerHTML = '<p>Not found!</p>';
}

function getLightbox() {
  return new SimpleLightbox('.gallery li a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });
}

//! Infinite scroll
function handleScroll() {
  if (scrollEnabled) {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadCards();
    }
  }
}

window.addEventListener('scroll', handleScroll);
