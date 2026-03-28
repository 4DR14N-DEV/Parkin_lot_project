class Celda {
  #id;
  #tipo;
  #estado;

  /**
   * @param {Object} celda - objeto que contiene las propiedades para crear celda
   * @param {number} id - Id de celda
   * @param {string} tipo - Tipo de celda
   * @param {string} estado - Estado actual de la celda
   */

  constructor({ id, tipo, estado }) {
    this.#id = id;
    this.#tipo = tipo;
    this.#estado = estado;
  }

  //GETTERS
  get id() {
    return this.#id;
  }
  get tipo() {
    return this.#tipo;
  }
  get estado() {
    return this.#estado;
  }

  //SETTERS
  set id(valor) {
    this.#id = valor;
  }
  set tipo(valor) {
    this.#tipo = valor;
  }
  set estado(valor) {
    this.#estado = valor;
  }

  toJSON() {
    return {
      id: this.#id,
      tipo: this.#tipo,
      estado: this.#estado,
    };
  }
}

export default Celda;
