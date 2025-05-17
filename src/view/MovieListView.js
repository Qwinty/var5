import AbstractView from './AbstractView.js';

// Создает HTML-шаблон для списка фильмов
const createMovieListTemplate = () => '<ul class="movies-list"></ul>';

// Класс представления списка фильмов
// Отвечает за отображение контейнера для элементов фильмов
export default class MovieListView extends AbstractView {
  // Возвращает HTML-шаблон списка фильмов
  get template() {
    return createMovieListTemplate();
  }
} 