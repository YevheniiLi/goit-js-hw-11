import './../css/styles.css';
import  Notiflix, { Notify } from 'notiflix';
import {GetApiPixabay} from './pixabay'; 
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const galleryItems = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const loadButton = document.querySelector('.load-more');



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
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg>
             <b>${likes}</b>
           </p>
           <p class="info-item">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
           <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
           <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
         </svg>
             <b>${views}</b>
           </p>
           <p class="info-item">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
</svg>
             <b>${comments}</b>
           </p>
           <p class="info-item">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
           <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"/>
         </svg>
             <b>${downloads}</b>
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

   
    const request = evt.target.elements.searchQuery.value.trim();
        if(!request)
          
            return Notify.info('Input some text to search');
            clearInput();
            getApiPixabay.resetPage();
            evt.target.reset();
            
          

    getApiPixabay.searchQueryItem = request;
        try {    
    const {hits, totalHits} = await getApiPixabay.fetchImages();

    if(!totalHits) {
        
       return Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
    );

        }
    
    
    Notify.success (
        `Hooray! We found ${totalHits} images.`);
    renderGalleryMarkup(hits);
    lightbox.refresh();
    onInfiniteScroll();
    
}    catch(error) {
     console.log(error)}
    

    
}


async function onClickLoad() {
    try {
    const { hits, totalHits } = await getApiPixabay.fetchImages();
    renderGalleryMarkup(hits);

    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
  
  window.scrollBy({
    top: cardHeight * 0,
    behavior: "smooth",
  });


  const total = document.querySelectorAll('.photo-card').length;
  
  if (total >= totalHits) {
    
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }

    lightbox.refresh();



} catch(error) {
        console.log(error);
        
    }
};

function clearInput() {
    galleryItems.innerHTML = '';   
}

const lightbox = new SimpleLightbox('.gallery a', {
     captionsData: 'alt',
     captionDelay: 300,
 });



function onInfiniteScroll() {

const options = {
  
  threshold: 1.0, 
  rootMargin: '200px',
};


 const observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    if(entry.isIntersecting) {
    onClickLoad();
    }
  });
}, options);


 observer.observe(document.querySelector('.scroll-guard'));

 
}


Notify.init({
  position:'from-right',
  timeout: 2000,
  cssAnimationStyle: 'from-right',
  showOnlyTheLastOne: true,
})


