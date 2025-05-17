import AbstractView from '../view/AbstractView.js';

/**
 * Создает шаблон формы редактирования фильма
 * @param {Object} movie - Объект с данными фильма
 * @returns {string} HTML-строка с разметкой формы редактирования
 */
const createMovieEditFormTemplate = (movie) => {
  const { title, isWatched } = movie;

  return `
    <form class="movie-edit-form">
      <input 
        type="text" 
        class="movie-edit-form__input" 
        value="${title}" 
        placeholder="Название фильма" 
        required
      >
      <div class="movie-edit-form__watched-wrapper">
        <label class="movie-edit-form__watched-label">
          <input type="checkbox" class="movie-edit-form__watched-checkbox" ${isWatched ? 'checked' : ''}>
          Просмотрено
        </label>
      </div>
      <div class="movie-edit-form__buttons">
        <button type="submit" class="movie-edit-form__save-button">Сохранить</button>
        <button type="button" class="movie-edit-form__cancel-button">Отмена</button>
      </div>
    </form>
  `;
};

/**
 * Класс представления формы редактирования фильма
 */
export default class MovieEditFormView extends AbstractView {
  #movie = null;

  /**
   * Создает экземпляр формы редактирования
   * @param {Object} movie - Объект с данными фильма
   */
  constructor(movie) {
    super();
    this.#movie = movie;
    this._setInnerHandlers();
  }

  get template() {
    return createMovieEditFormTemplate(this.#movie);
  }

  /**
   * Получает данные из формы редактирования
   * @returns {Object} Объект с данными фильма из формы
   */
  getFormData() {
    const formData = {
      title: this.element.querySelector('.movie-edit-form__input').value.trim(),
      isWatched: this.element.querySelector('.movie-edit-form__watched-checkbox').checked,
    };

    return formData;
  }

  /**
   * Устанавливает обработчик сохранения изменений
   * @param {Function} callback - Функция-обработчик
   */
  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  }

  /**
   * Устанавливает обработчик отмены редактирования
   * @param {Function} callback - Функция-обработчик
   */
  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
    this.element.querySelector('.movie-edit-form__cancel-button')
      .addEventListener('click', this.#cancelClickHandler);
  }

  /**
   * Обработчик отправки формы
   * @param {Event} evt - Объект события
   */
  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const formData = this.getFormData();
    
    if (formData.title) {
      this._callback.formSubmit(this.#movie.id, formData);
    }
  }

  /**
   * Обработчик нажатия на кнопку отмены
   * @param {Event} evt - Объект события
   */
  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cancelClick();
  }

  /**
   * Установка внутренних обработчиков
   */
  _setInnerHandlers() {
    this._callback = {};
  }
} 