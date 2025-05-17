export default class AbstractView {
  #element = null;

  constructor() {
    if (new.target === AbstractView) {
      throw new Error("Can't instantiate AbstractView, only concrete one.");
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = this._createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  _createElement(template) {
    const newElement = document.createElement('div');
    newElement.innerHTML = template;
    return newElement.firstElementChild;
  }

  removeElement() {
    this.#element = null;
  }
} 