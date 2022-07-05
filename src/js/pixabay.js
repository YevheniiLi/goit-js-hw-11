import axios from "axios"
const API_KEY = '28455175-f502e132fbd640f049fb7efc9';

axios.defaults.baseURL = 'https://pixabay.com/api/';





export class GetApiPixabay {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

        async fetchImages() {
            const options = new URLSearchParams({
                key: API_KEY,
                q: this.searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: this.page,
                per_page: 40,
            });

        const {data} = await axios.get(`?${options}`);
        this.incrementPage();
        return data;
    }


     get searchQueryItem() {
      return this.searchQuery;
     }

     set searchQueryItem(newSearchQuery) {
        this.searchQuery = newSearchQuery;
     }

        incrementPage() {
            this.page += 1;
        }
        resetPage() {
            this.page = 1;
        }
}

