class PicoPlaca {
  #id;
  #tipoVehiculo;
  #numero;
  #dia;

  /**
   * @param {Object} PicoPlaca - objeto que contiene las propiedades para crear pico y placa
   * @param {number} id - Id del pico y placa
   * @param {string} tipoVehiculo - Tipo de vehiculo a restringir
   * @param {number} numero - Numero a restringir
   * @param {string} dia - Dia a restringir
   */

  constructor({ id, tipoVehiculo, numero, dia }) {
    this.#id = id;
    this.#tipoVehiculo = tipoVehiculo;
    this.#numero = numero;
    this.#dia = dia;
  }

  //GETTERS
  get id() {
    return this.#id;
  }
  get tipoVehiculo() {
    return this.#tipoVehiculo;
  }
  get numero() {
    return this.#numero;
  }
  get dia() {
    return this.#dia;
  }

  //SETTERS
  set id(valor) {
    this.#id = valor;
  }
  set tipoVehiculo(valor) {
    this.#tipoVehiculo = valor;
  }
  set numero(valor) {
    this.#numero = valor;
  }
  set dia(valor) {
    this.#dia = valor;
  }

  toJSON() {
    return {
      id: this.#id,
      tipoVehiculo: this.#tipoVehiculo,
      numero: this.#numero,
      dia: this.#dia,
    };
  }
}

export default PicoPlaca;
