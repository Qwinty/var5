import AbstractView from '../view/AbstractView.js';

// Создает шаблон формы добавления фильма
// @returns {string} HTML-строка с разметкой формы
const createMovieFormTemplate = () => {
  return `
    <form class="movie-form">
      <input 
        type="text" 
        class="movie-form__input" 
        placeholder="Введите название фильма" 
        required
      >
      <button type="submit" class="movie-form__button">Добавить</button>
    </form>
  `;
};

/**
 * Класс представления формы добавления фильма
 */
export default class MovieFormView extends AbstractView {
  constructor() {
    super();
    this._setInnerHandlers();
  }

  get template() {
    return createMovieFormTemplate();
  }

  // Устанавливает обработчик отправки формы
  // @param {Function} callback - Функция-обработчик
  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  }

  /**
   * Обработчик события отправки формы
   * @param {Event} evt - Объект события
   */
  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const input = this.element.querySelector('.movie-form__input');
    const title = input.value.trim();
    
    if (title) {
      this._callback.formSubmit(title);
      input.value = '';
    }
  }

  /**
   * Установка внутренних обработчиков
   */
  _setInnerHandlers() {
    this._callback = {};
  }
} 