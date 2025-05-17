import { mockMovies } from '../../mock/mock.js';

export default class MovieModel {
  #movies = mockMovies;

  get movies() {
    return this.#movies;
  }
} 