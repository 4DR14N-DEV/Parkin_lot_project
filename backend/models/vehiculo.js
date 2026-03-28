import Usuario from "./usuario.js";

class Vehiculo {
  #id;
  #placa;
  #color;
  #modelo;
  #marca;
  #tipo;
  #usuario;

  /**
   * @param {Object} vehiculo - objeto que contiene las propiedades para crear vehiculo
   * @param {number} id - id del vehiculo
   * @param {string} tipo - tipo de vehiculo
   * @param {string} placa - placa registrada del vehiculo
   * @param {string} color - color del vehiculo
   * @param {string} modelo - modelo del vehiculo
   * @param {string} marca - marca del vehiculo
   * @param {number} usuario - Usuario al que pertenece el vehiculo (clase usuario)
   */

  constructor({ id, placa, color, modelo, marca, tipo, usuario }) {
    this.#id = id;
    this.#placa = placa;
    this.#color = color;
    this.#modelo = modelo;
    this.#marca = marca;
    this.#tipo = tipo;
    this.#usuario = usuario;
  }

  //GETTERS
  get id() {
    return this.#id;
  }

  get placa() {
    return this.#placa;
  }
  get color() {
    return this.#color;
  }
  get modelo() {
    return this.#modelo;
  }
  get marca() {
    return this.#marca;
  }

  get tipo() {
    return this.#tipo;
  }

  get usuario() {
    return this.#usuario;
  }

  //SETTERS
  set id(valor) {
    this.#id = valor;
  }

  set placa(valor) {
    this.#placa = valor;
  }

  set color(valor) {
    this.#color = valor;
  }

  set modelo(valor) {
    this.#modelo = valor;
  }

  set marca(valor) {
    this.#marca = valor;
  }

  set tipo(valor) {
    this.#tipo = valor;
  }

  set usuario(usuario) {
    this.#usuario = usuario;
  }

  toJSON() {
    return {
      id: this.#id,
      tipo: this.#tipo,
      placa: this.#placa,
      color: this.#color,
      modelo: this.#modelo,
      marca: this.#marca,
      usuario: this.#usuario,
    };
  }
}

export default Vehiculo;
