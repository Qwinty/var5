import AbstractView from '../view/AbstractView.js';

/**
 * Создает шаблон для фильтра фильмов
 * @param {string} currentFilter - Текущий выбранный фильтр
 * @returns {string} HTML-строка с разметкой фильтра
 */
const createMovieFilterTemplate = (currentFilter) => {
  return `
    <div class="movie-filter">
      <p class="movie-filter__title">Фильтровать по статусу:</p>
      <div class="movie-filter__buttons">
        <button class="movie-filter__button ${currentFilter === 'all' ? 'movie-filter__button--active' : ''}" data-filter="all">
          Все
        </button>
        <button class="movie-filter__button ${currentFilter === 'watched' ? 'movie-filter__button--active' : ''}" data-filter="watched">
          Просмотренные
        </button>
        <button class="movie-filter__button ${currentFilter === 'unwatched' ? 'movie-filter__button--active' : ''}" data-filter="unwatched">
          Не просмотренные
        </button>
      </div>
    </div>
  `;
};

/**
 * Класс представления фильтра фильмов
 */
export default class MovieFilterView extends AbstractView {
  #currentFilter = 'all';

  /**
   * Создает экземпляр представления фильтра
   * @param {string} currentFilter - Текущий выбранный фильтр
   */
  constructor(currentFilter) {
    super();
    this.#currentFilter = currentFilter;
    this._setInnerHandlers();
  }

  get template() {
    return createMovieFilterTemplate(this.#currentFilter);
  }

  /**
   * Устанавливает обработчик изменения фильтра
   * @param {Function} callback - Функция-обработчик
   */
  setFilterChangeHandler(callback) {
    this._callback.filterChange = callback;
    this.element.addEventListener('click', this.#filterChangeHandler);
  }

  /**
   * Обработчик изменения фильтра
   * @param {Event} evt - Объект события
   */
  #filterChangeHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    const filterType = evt.target.dataset.filter;
    if (filterType && filterType !== this.#currentFilter) {
      this._callback.filterChange(filterType);
    }
  }

  /**
   * Установка внутренних обработчиков
   */
  _setInnerHandlers() {
    this._callback = {};
  }
} 