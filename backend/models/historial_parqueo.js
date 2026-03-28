class HistorialParqueo {
  #celda;
  #vehiculo;
  #fechaHora;

  /**
   * @param {Object} historialParqueo - objeto que contiene las propiedades para crear historial de parqueo
   * @param {number} celda - Celda relacionada con el historial de parqueo (clase celda)
   * @param {number} vehiculo - Vehiculo relacionado con el historial de parqueo (clase vehiculo)
   * @param {string} fechaHora - Fecha y hora seleccionada
   */

  constructor({ celda, vehiculo, fechaHora }) {
    this.#celda = celda;
    this.#vehiculo = vehiculo;
    this.#fechaHora = fechaHora;
  }

  //GETTERS
  get celda() {
    return this.#celda;
  }
  get vehiculo() {
    return this.#vehiculo;
  }
  get fechaHora() {
    return this.#fechaHora;
  }

  //SETTERS
  set celda(valor) {
    this.#celda = valor;
  }

  set vehiculo(valor) {
    this.#vehiculo = valor;
  }

  set fechaHora(valor) {
    this.#fechaHora = valor;
  }

  toJSON() {
    return {
      celda: this.#celda,
      vehiculo: this.#vehiculo,
      fechaHora: this.#fechaHora,
    };
  }
}

export default HistorialParqueo;
