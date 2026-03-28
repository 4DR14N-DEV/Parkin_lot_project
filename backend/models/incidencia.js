class Incidencia {
  #id;
  #nombre;

  /**
   * @param {Object} incidencia - objeto que contiene las propiedades para crear incidencia
   * @param {number} id - Id de Incidencia
   * @param {string} nombre - Nombre de la Incidencia
   */

  constructor({ id, nombre }) {
    this.#id = id;
    this.#nombre = nombre;
  }

  //GETTERS
  get id() {
    return this.#id;
  }
  get nombre() {
    return this.#nombre;
  }

  //SETTERS
  set id(valor) {
    this.#id = valor;
  }

  set nombre(valor) {
    this.#nombre = valor;
  }

  toJSON() {
    return {
      id: this.#id,
      nombre: this.#nombre,
    };
  }
}

export default Incidencia;
