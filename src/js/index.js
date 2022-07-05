import './../css/styles.css';
import  { Notify } from 'notiflix';
import {GetApiPixabay} from './pixabay'; 
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const galleryItems = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const loadButton = document.querySelector('.load-more')

searchForm.addEventListener('submit', onFormSubmit);
loadButton.addEventListener('click', onClickLoad);


const getApiPixabay = new GetApiPixabay();
    

    function galleryMarkup(searchImages) {
         return searchImages.map(({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            comments,
            views,
            downloads,
         }) => `<div class="photo-card">
         <a href="${largeImageURL}">
         <img src="${webformatURL}" alt="${tags}" loading="lazy" />
         <div class="info">
           <p class="info-item">
             <b>Likes: ${likes}</b>
           </p>
           <p class="info-item">
             <b>Views: ${views}</b>
           </p>
           <p class="info-item">
             <b>Comments: ${comments}</b>
           </p>
           <p class="info-item">
             <b>Downloads: ${downloads}</b>
           </p></a>
           </div>
         </div>
       `).join('');
    }

function renderGalleryMarkup(searchImages) {
    galleryItems.insertAdjacentHTML('beforeend', galleryMarkup(searchImages));
}


async function onFormSubmit(evt) {
    evt.preventDefault();
    clearInput();
    getApiPixabay.resetPage();
    const reqmessage = evt.target.elements.searchQuery.value.trim();
        if(!reqmessage) 
            return Notify.info('Input some text to search')
        

    getApiPixabay.searchQueryItem = reqmessage;
        try {  
    const {hits, totalHits} = await getApiPixabay.fetchImages();
    if(!totalHits)
        return Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
    );
    Notify.success (
        `Hooray! We found ${totalHits} images.`);
    renderGalleryMarkup(hits);
    lightbox.refresh();
}    catch(error) {
     console.log(error);
}
    evt.target.reset();
}

async function onClickLoad() {
    try {
    const { hits, totalHits } = await getApiPixabay.fetchImages();
    renderGalleryMarkup(hits);
    lightbox.refresh();

    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
  
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });


} catch(error) {
        console.log(error);
    }
}

function clearInput() {
    galleryItems.innerHTML = '';   
}

const lightbox = new SimpleLightbox('.gallery a', {
     captionsData: 'alt',
     captionDelay: 300,
 });