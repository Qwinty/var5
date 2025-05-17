import { mockMovies } from '../../mock/mock.js';

// Класс модели фильмов
export default class MovieModel {
  #movies = mockMovies;
  #observers = [];
  #currentFilter = 'all'; // Значение по умолчанию - все фильмы

  /**
   * Возвращает список фильмов
   * @returns {Array} Массив с объектами фильмов
   */
  get movies() {
    switch (this.#currentFilter) {
      case 'watched':
        return this.#movies.filter((movie) => movie.isWatched);
      case 'unwatched':
        return this.#movies.filter((movie) => !movie.isWatched);
      default:
        return this.#movies;
    }
  }

  /**
   * Возвращает все фильмы без фильтрации
   * @returns {Array} Массив со всеми фильмами
   */
  get allMovies() {
    return this.#movies;
  }

  /**
   * Возвращает текущий фильтр
   * @returns {string} Текущий фильтр
   */
  get currentFilter() {
    return this.#currentFilter;
  }

  /**
   * Устанавливает фильтр для списка фильмов
   * @param {string} filterType - Тип фильтра ('all', 'watched', 'unwatched')
   */
  setFilter(filterType) {
    this.#currentFilter = filterType;
    this._notify();
  }

  /**
   * Добавляет наблюдателя для отслеживания изменений в модели
   * @param {Function} observer - Функция-наблюдатель
   */
  addObserver(observer) {
    this.#observers.push(observer);
  }

  /**
   * Удаляет наблюдателя
   * @param {Function} observer - Функция-наблюдатель
   */
  removeObserver(observer) {
    this.#observers = this.#observers.filter((existingObserver) => existingObserver !== observer);
  }

  /**
   * Уведомляет всех наблюдателей об изменении данных
   */
  _notify() {
    this.#observers.forEach((observer) => observer(this.#movies));
  }

  /**
   * Добавляет новый фильм в список
   * @param {string} title - Название фильма
   */
  addMovie(title) {
    const newMovie = {
      id: String(Date.now()),
      title,
      isWatched: false,
    };

    this.#movies = [newMovie, ...this.#movies];
    this._notify();
  }

  /**
   * Удаляет фильм из списка
   * @param {string} id - Идентификатор фильма
   */
  deleteMovie(id) {
    this.#movies = this.#movies.filter((movie) => movie.id !== id);
    this._notify();
  }

  /**
   * Обновляет данные фильма
   * @param {string} id - Идентификатор фильма
   * @param {Object} updatedData - Обновленные данные фильма
   */
  updateMovie(id, updatedData) {
    this.#movies = this.#movies.map((movie) => 
      movie.id === id ? {...movie, ...updatedData} : movie
    );
    this._notify();
  }

  /**
   * Изменяет статус просмотра фильма
   * @param {string} id - Идентификатор фильма
   */
  toggleWatchedStatus(id) {
    this.#movies = this.#movies.map((movie) => 
      movie.id === id ? {...movie, isWatched: !movie.isWatched} : movie
    );
    this._notify();
  }
} 