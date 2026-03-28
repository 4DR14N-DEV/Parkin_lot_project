import Incidencia from "./incidencia.js";
import Vehiculo from "./vehiculo.js";

class ReporteIncidencia {
  #vehiculo;
  #incidencia;
  #fechaHora;

  /**
   *  @param {Object} ReporteIncidencia - objeto que contiene las propiedades para crear reportes de incidencias
   * @param {number} vehiculo - Vehiculo relacionado con la incidencia (clase vehiculo)
   * @param {number} incidencia - Incidencia (clase incidencia)
   * @param {string} fechaHora - Fecha y hora de la incidencia
   */

  constructor({ vehiculo, incidencia, fechaHora }) {
    this.#vehiculo = vehiculo;
    this.#incidencia = incidencia;
    this.#fechaHora = fechaHora;
  }

  //GETTERS
  get vehiculo() {
    return this.#vehiculo;
  }
  get incidencia() {
    return this.#incidencia;
  }
  get fechaHora() {
    return this.#fechaHora;
  }

  //SETTERS
  set vehiculo(valor) {
    this.#vehiculo = valor;
  }

  set incidencia(valor) {
    this.#incidencia = valor;
  }
  set fechaHora(valor) {
    this.#fechaHora = valor;
  }

  toJSON() {
    return {
      vehiculo: this.#vehiculo,
      incidencia: this.#incidencia,
      fechaHora: this.#fechaHora,
    };
  }
}

export default ReporteIncidencia;
