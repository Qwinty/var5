import MovieItemView from '../components/MovieItemView.js';

const render = (container, element, place = 'beforeend') => {
  container.insertAdjacentElement(place, element);
};

export default class MovieListPresenter {
  #movieListContainer = null;
  #movieModel = null;
  #movieListView = null;

  constructor(movieListContainer, movieModel, movieListView) {
    this.#movieListContainer = movieListContainer;
    this.#movieModel = movieModel;
    this.#movieListView = movieListView;
  }

  init() {
    const movies = this.#movieModel.movies;
    render(this.#movieListContainer, this.#movieListView.element);

    if (movies.length === 0) {
      // Спрятать список фильмов и показать сообщение
      const messageElement = document.createElement('p');
      messageElement.textContent = 'Список фильмов пуст!';
      render(this.#movieListView.element, messageElement);
      return;
    }

    for (const movie of movies) {
      const movieItemView = new MovieItemView(movie);
      render(this.#movieListView.element, movieItemView.element);
    }
  }
} 