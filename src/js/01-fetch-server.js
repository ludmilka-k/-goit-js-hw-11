import '../css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');


import PixabayApiService from './01-fetch-api.js'; // API
import getRefs from './get-refs.js';
import imagesTpl from './templates/images.hbs';
import LoadMoreBtn from './components/load-more-btn.js';

const DEBOUNCE_DELAY = 300;
const lightbox = getLightbox();
const refs = getRefs();
let pixabayApiService = new PixabayApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    isHidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.btnRefs.button.addEventListener('click', onLoadMore);

function onSearch(evn){
    evn.preventDefault();
    // refs.searchForm.reset();

    const query = evn.currentTarget.elements.searchQuery.value.trim();
    if(query === '') {
        return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    pixabayApiService = new PixabayApiService(query);
    
    loadMoreBtn.show();
    clearCardsContainer();
    loadCards();
   
}

function loadCards() {
    loadMoreBtn.disable();
    // loadMoreBtn.hide();
    pixabayApiService.fetchCards()
    .then(({images, totalImages, isLastPage, isFirstPage}) => {
        appendCardsMarkup(images);
        if (images.length === 0) throw new Error(`Sorry, there are no images matching your search query. Please try again.`);
        if (isFirstPage) Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
        if (isLastPage) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.hide();

        } else {
            loadMoreBtn.enable();
        }
        // refs.lightbox.refresh('changed.simplelightbox');

    })
    .catch(onFetchError);
    refs.searchForm.reset();
}  

function onLoadMore() {
    loadCards();
}

function appendCardsMarkup(images) {
    refs.cardsContainer.insertAdjacentHTML('beforeend', imagesTpl(images))
    lightbox.refresh();
}

function clearCardsContainer(){
    refs.cardsContainer.innerHTML = '';
    lightbox.refresh();
}

function onFetchError(error) {
  console.error(error);
  Notiflix.Notify.failure(error.message);
}

function getLightbox() {
    return new SimpleLightbox('.gallery li a', {
        captions: true,
        captionsData: "alt",
        captionDelay: 250,
        captionPosition: 'bottom',
        
    });
}

//! Infinite scroll
// function handleScroll() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

//   if (scrollTop + clientHeight >= scrollHeight - 5) {
//     fetchCards();
//   }
// }

// window.addEventListener("scroll", handleScroll);