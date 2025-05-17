import MovieModel from './model/MovieModel.js';
import MovieListView from './view/MovieListView.js';
import MovieListPresenter from './presenter/MovieListPresenter.js';

const siteMainElement = document.querySelector('.main');

const movieModel = new MovieModel();
const movieListView = new MovieListView();

const movieListPresenter = new MovieListPresenter(
  siteMainElement, // Контейнер для всего компонента списка фильмов
  movieModel,
  movieListView
);

movieListPresenter.init(); 