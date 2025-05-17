import AbstractView from '../view/AbstractView.js';

/**
 * Создает шаблон элемента фильма
 * @param {Object} movie - Объект с данными фильма
 * @returns {string} HTML-строка с разметкой элемента фильма
 */
const createMovieItemTemplate = (movie) => {
  const { title, isWatched } = movie;
  const watchedStatus = isWatched ? 'Просмотрено' : 'Не просмотрено';

  return (
    `<li class="movie-item">
      <span class="movie-item__title">${title}</span>
      <div class="movie-item__controls">
        <span class="movie-item__status">(${watchedStatus})</span>
        <button type="button" class="movie-item__delete-button">Удалить</button>
      </div>
    </li>`
  );
};

// Класс представления элемента фильма
export default class MovieItemView extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
    this._setInnerHandlers();
  }

  get template() {
    return createMovieItemTemplate(this.#movie);
  }

  /**
   * Возвращает данные фильма
   * @returns {Object} Объект с данными фильма
   */
  get movie() {
    return this.#movie;
  }

  /**
   * Устанавливает обработчик для кнопки удаления
   * @param {Function} callback - Функция-обработчик
   */
  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.element.querySelector('.movie-item__delete-button')
      .addEventListener('click', this.#deleteClickHandler);
  }

  /**
   * Обработчик клика по кнопке удаления
   * @param {Event} evt - Объект события
   */
  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(this.#movie);
  }

  // Установка внутренних обработчиков
  _setInnerHandlers() {
    this._callback = {};
  }
} 