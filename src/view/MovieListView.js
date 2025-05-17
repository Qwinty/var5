import AbstractView from './AbstractView.js';

const createMovieListTemplate = () => '<ul class="movies-list"></ul>';

export default class MovieListView extends AbstractView {
  get template() {
    return createMovieListTemplate();
  }
} 