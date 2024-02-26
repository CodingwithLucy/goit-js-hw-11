require('dotenv').config();
import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = process.env.API_KEY;

let searchQuery = '';
let page = 1;

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

loadMoreButton.style.display = 'none';

form.addEventListener('submit', async event => {
  event.preventDefault();
  gallery.innerHTML = '';
  searchQuery = event.currentTarget.elements.searchQuery.value;
  page = 1;
  loadMoreButton.style.display = 'none';
  fetchImages();
});

loadMoreButton.addEventListener('click', fetchImages);

async function fetchImages() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    const images = response.data.hits;
    const totalHits = response.data.totalHits;
    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      images.forEach(image => {
        const imageCard = createImageCard(image);
        gallery.insertAdjacentHTML('beforeend', imageCard);
      });
      loadMoreButton.style.display = 'block';
      if (images.length < 40) {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      Notiflix.Notify.success(`Hooray! We found ${totalHits} results.`);
    }
    page += 1;
  } catch (error) {
    console.error('Error:', error);
    Notiflix.Notify.failure('Something went wrong, please try again later.');
  }
}

function createImageCard(image) {
  return `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
              <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${image.downloads}
        </p>
      </div>
    </div>
  `;
}
