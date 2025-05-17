// Абстрактный класс представления
// Базовый класс для всех представлений в приложении
export default class AbstractView {
  #element = null;

  /**
   * Конструктор абстрактного класса
   * Запрещает создание экземпляров AbstractView напрямую
   */
  constructor() {
    if (new.target === AbstractView) {
      throw new Error("Can't instantiate AbstractView, only concrete one.");
    }
  }

  /**
   * Получает DOM-элемент представления
   * Создает элемент при первом обращении
   */
  get element() {
    if (!this.#element) {
      this.#element = this._createElement(this.template);
    }
    return this.#element;
  }

  // Абстрактный геттер шаблона
  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  // Создает DOM-элемент из HTML-строки
  _createElement(template) {
    const newElement = document.createElement('div');
    newElement.innerHTML = template;
    return newElement.firstElementChild;
  }

  // Используется для освобождения памяти
  removeElement() {
    this.#element = null;
  }
} 