import MovieItemView from '../components/MovieItemView.js';
import MovieFormView from '../components/MovieFormView.js';

/**
 * Метод для отрисовки элемента в контейнере
 * @param {HTMLElement} container - Контейнер для отрисовки
 * @param {HTMLElement} element - Элемент для отрисовки
 * @param {string} place - Место вставки элемента
 */
const render = (container, element, place = 'beforeend') => {
  container.insertAdjacentElement(place, element);
};

// Класс презентера списка фильмов
export default class MovieListPresenter {
  #movieListContainer = null;
  #movieModel = null;
  #movieListView = null;
  #movieFormView = null;
  #movieListElement = null;
  #movieComponents = new Map();

  constructor(movieListContainer, movieModel, movieListView) {
    this.#movieListContainer = movieListContainer;
    this.#movieModel = movieModel;
    this.#movieListView = movieListView;
    this.#movieFormView = new MovieFormView();

    this.#movieModel.addObserver(this.#handleModelChange);
  }

  
  // Инициализирует компонент
  init() {
    this.#renderForm();
    this.#renderMovieList();
  }


  // Отрисовывает форму добавления фильма
  #renderForm() {
    render(this.#movieListContainer, this.#movieFormView.element, 'afterbegin');
    this.#movieFormView.setFormSubmitHandler(this.#handleMovieAdd);
  }

  // Отрисовывает список фильмов
  #renderMovieList() {
    const movies = this.#movieModel.movies;
    render(this.#movieListContainer, this.#movieListView.element);
    this.#movieListElement = this.#movieListView.element;

    this.#clearMovieList();

    if (movies.length === 0) {
      // Если список фильмов пуст, показать сообщение
      const messageElement = document.createElement('p');
      messageElement.textContent = 'Список фильмов пуст!';
      messageElement.classList.add('movies-list__empty-message');
      render(this.#movieListElement, messageElement);
      return;
    }

    // Отрисовываем каждый фильм
    movies.forEach((movie) => {
      this.#renderMovie(movie);
    });
  }

  /**
   * Отрисовывает один элемент фильма
   * @param {Object} movie - Объект с данными фильма
   */
  #renderMovie(movie) {
    const movieItemView = new MovieItemView(movie);
    this.#movieComponents.set(movie.id, movieItemView);
    
    movieItemView.setDeleteClickHandler(this.#handleMovieDelete);
    render(this.#movieListElement, movieItemView.element);
  }

  /**
   * Очищает список фильмов
   */
  #clearMovieList() {
    this.#movieComponents.forEach((component) => component.element.remove());
    this.#movieComponents.clear();
    
    const emptyMessage = this.#movieListElement.querySelector('.movies-list__empty-message');
    if (emptyMessage) {
      emptyMessage.remove();
    }
  }

  // Обработчик изменения данных в модели
  #handleModelChange = () => {
    this.#renderMovieList();
  };

  // Обработчик добавления фильма
  #handleMovieAdd = (title) => {
    this.#movieModel.addMovie(title);
  };

  /**
   * Обработчик удаления фильма
   * @param {Object} movie - Объект с данными фильма
   */
  #handleMovieDelete = (movie) => {
    this.#movieModel.deleteMovie(movie.id);
  };
} 