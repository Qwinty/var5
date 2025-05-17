import MovieItemView from '../components/MovieItemView.js';
import MovieFormView from '../components/MovieFormView.js';
import MovieEditFormView from '../components/MovieEditFormView.js';
import MovieFilterView from '../components/MovieFilterView.js';

/**
 * Метод для отрисовки элемента в контейнере
 * @param {HTMLElement} container - Контейнер для отрисовки
 * @param {HTMLElement} element - Элемент для отрисовки
 * @param {string} place - Место вставки элемента
 */
const render = (container, element, place = 'beforeend') => {
  container.insertAdjacentElement(place, element);
};

/**
 * Метод для замены одного элемента на другой
 * @param {HTMLElement} newElement - Новый элемент
 * @param {HTMLElement} oldElement - Старый элемент
 */
const replace = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    return;
  }

  const parent = oldElement.parentElement;

  if (parent === null) {
    return;
  }

  parent.replaceChild(newElement, oldElement);
};

/**
 * Метод для удаления элемента
 * @param {HTMLElement} element - Элемент для удаления
 */
const remove = (element) => {
  if (element === null) {
    return;
  }

  element.remove();
};

// Класс презентера списка фильмов
export default class MovieListPresenter {
  #movieListContainer = null;
  #movieModel = null;
  #movieListView = null;
  #movieFormView = null;
  #movieFilterView = null;
  #movieListElement = null;
  #movieComponents = new Map();
  #editFormComponent = null;
  #editingMovie = null;

  constructor(movieListContainer, movieModel, movieListView) {
    this.#movieListContainer = movieListContainer;
    this.#movieModel = movieModel;
    this.#movieListView = movieListView;
    this.#movieFormView = new MovieFormView();
    this.#movieFilterView = new MovieFilterView(this.#movieModel.currentFilter);

    this.#movieModel.addObserver(this.#handleModelChange);
  }

  
  // Инициализирует компонент
  init() {
    this.#renderFilter();
    this.#renderForm();
    this.#renderMovieList();
  }

  // Отрисовывает фильтр фильмов
  #renderFilter() {
    render(this.#movieListContainer, this.#movieFilterView.element, 'afterbegin');
    this.#movieFilterView.setFilterChangeHandler(this.#handleFilterChange);
  }

  // Отрисовывает форму добавления фильма
  #renderForm() {
    render(this.#movieListContainer, this.#movieFormView.element);
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
    movieItemView.setEditClickHandler(this.#handleMovieEdit);
    movieItemView.setWatchedClickHandler(this.#handleWatchedToggle);
    
    render(this.#movieListElement, movieItemView.element);
  }

  /**
   * Очищает список фильмов
   */
  #clearMovieList() {
    this.#movieComponents.forEach((component) => {
      remove(component.element);
      component.removeElement();
    });
    this.#movieComponents.clear();
    
    const emptyMessage = this.#movieListElement.querySelector('.movies-list__empty-message');
    if (emptyMessage) {
      emptyMessage.remove();
    }
  }

  /**
   * Отменяет редактирование фильма
   */
  #closeEditForm() {
    if (this.#editFormComponent) {
      remove(this.#editFormComponent.element);
      this.#editFormComponent.removeElement();
      this.#editFormComponent = null;
    }

    if (this.#editingMovie) {
      const movieComponent = this.#movieComponents.get(this.#editingMovie.id);
      if (movieComponent) {
        render(this.#movieListElement, movieComponent.element);
      }
      this.#editingMovie = null;
    }
  }

  // Обработчик изменения данных в модели
  #handleModelChange = () => {
    this.#closeEditForm();
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

  /**
   * Обработчик редактирования фильма
   * @param {Object} movie - Объект с данными фильма
   */
  #handleMovieEdit = (movie) => {
    // Закрываем предыдущую форму редактирования, если она открыта
    this.#closeEditForm();

    // Создаем форму редактирования
    this.#editFormComponent = new MovieEditFormView(movie);
    this.#editingMovie = movie;

    // Удаляем компонент фильма из DOM
    const movieComponent = this.#movieComponents.get(movie.id);
    if (movieComponent) {
      replace(this.#editFormComponent.element, movieComponent.element);
    }

    // Устанавливаем обработчики для формы редактирования
    this.#editFormComponent.setFormSubmitHandler(this.#handleEditFormSubmit);
    this.#editFormComponent.setCancelClickHandler(this.#handleEditFormCancel);
  };

  /**
   * Обработчик отправки формы редактирования
   * @param {string} id - Идентификатор фильма
   * @param {Object} formData - Данные из формы
   */
  #handleEditFormSubmit = (id, formData) => {
    this.#movieModel.updateMovie(id, formData);
    this.#closeEditForm();
  };

  /**
   * Обработчик отмены редактирования
   */
  #handleEditFormCancel = () => {
    this.#closeEditForm();
  };

  /**
   * Обработчик изменения статуса просмотра фильма
   * @param {Object} movie - Объект с данными фильма
   */
  #handleWatchedToggle = (movie) => {
    this.#movieModel.toggleWatchedStatus(movie.id);
  };

  /**
   * Обработчик изменения фильтра
   * @param {string} filterType - Тип фильтра
   */
  #handleFilterChange = (filterType) => {
    this.#movieModel.setFilter(filterType);
    
    // Обновляем компонент фильтра
    const newFilterComponent = new MovieFilterView(filterType);
    replace(newFilterComponent.element, this.#movieFilterView.element);
    this.#movieFilterView.removeElement();
    this.#movieFilterView = newFilterComponent;
    this.#movieFilterView.setFilterChangeHandler(this.#handleFilterChange);
  };
} 