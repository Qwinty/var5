import AbstractView from '../view/AbstractView.js';

const createMovieItemTemplate = (movie) => {
  const { title, isWatched } = movie;
  const watchedStatus = isWatched ? 'Просмотрено' : 'Не просмотрено';

  return (
    `<li class="movie-item">
      <span class="movie-item__title">${title}</span>
      <span class="movie-item__status">(${watchedStatus})</span>
    </li>`
  );
};

export default class MovieItemView extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMovieItemTemplate(this.#movie);
  }
} 