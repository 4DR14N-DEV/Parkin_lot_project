import Vehiculo from "./vehiculo.js";

class AccesoSalida {
  #id;
  #movimiento;
  #fechaHora;
  #puerta;
  #tiempoEstadia;
  #vehiculo;

  /**
   * @param {Object} accesoSalida - objeto que contiene las propiedades para crear acceso y salida
   * @param {number} id - Id de acceso y salida
   * @param {string} movimiento - Movimientos dentro del parqueadero (acceso/salida)
   * @param {string} fechaHora - Fecha hora del movimiento
   * @param {string} puerta - Puerta donde se realizo el movimiento
   * @param {string} tiempoEstadia - Tiempo de estadia dentro del parqueadero
   * @param {number} vehiculo - Vehiculo que registro el movimiento (clase vehiculo)
   */

  constructor({ id, movimiento, fechaHora, puerta, tiempoEstadia, vehiculo }) {
    this.#id = id;
    this.#movimiento = movimiento;
    this.#fechaHora = fechaHora;
    this.#puerta = puerta;
    this.#tiempoEstadia = tiempoEstadia;
    this.#vehiculo = vehiculo;
  }

  //GETTERS
  get id() {
    return this.#id;
  }
  get movimiento() {
    return this.#movimiento;
  }
  get fechaHora() {
    return this.#fechaHora;
  }
  get puerta() {
    return this.#puerta;
  }
  get tiempoEstadia() {
    return this.#tiempoEstadia;
  }
  get vehiculo() {
    return this.#vehiculo;
  }

  //SETTERS
  set id(valor) {
    this.#id = valor;
  }
  set movimiento(valor) {
    this.#movimiento = valor;
  }
  set fechaHora(valor) {
    this.#fechaHora = valor;
  }
  set puerta(valor) {
    this.#puerta = valor;
  }
  set tiempoEstadia(valor) {
    this.#tiempoEstadia = valor;
  }

  set vehiculo(valor) {
    this.#vehiculo = valor;
  }

  toJSON() {
    return {
      id: this.#id,
      movimiento: this.#movimiento,
      fechaHora: this.#fechaHora,
      puerta: this.#puerta,
      tiempoEstadia: this.#tiempoEstadia,
      vehiculo: this.#vehiculo,
    };
  }
}

export default AccesoSalida;
