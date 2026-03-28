import PerfilUsuario from "./perfil_usuario.js";

class Usuario {
  #id;
  #tipoDocumento;
  #numeroDocumento;
  #primerNombre;
  #segundoNombre;
  #primerApellido;
  #segundoApellido;
  #direccionCorreo;
  #numeroCelular;
  #fotoPerfil;
  #estado;
  #clave;
  #perfilUsuario;

  /**
   * @param {Object} usuario - objeto que contiene las propiedades para crear usuario
   * @param {number} id - Id de creacion del usuario
   * @param {string} tipoDocumento - tipo documento del usuario
   * @param {string} numeroDocumento - Numero de identificación del usuario
   * @param {string} primerNombre - primer nombre del usuario
   * @param {string} segundoNombre - Segundo nombre del usuario
   * @param {string} primerApellido - primer apellido del usuario
   * @param {string} segundoApellido - segundo apellido del usuario
   * @param {string} direccionCorreo - correo del usuario
   * @param {string} numeroCelular - numero de celular del usuario
   * @param {string} fotoPerfil - foto del usuario
   * @param {string} estado - estado actual del usuario (activo/inactivo)
   * @param {string} clave - clave del usuario
   * @param {number} perfilUsuario - ID del Perfil de usuario (clase perfil_usuario)
   */

  constructor({
    id,
    tipoDocumento,
    numeroDocumento,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    direccionCorreo,
    numeroCelular,
    fotoPerfil,
    estado,
    clave,
    perfilUsuario,
  }) {
    this.#id = id;
    this.#tipoDocumento = tipoDocumento;
    this.#numeroDocumento = numeroDocumento;
    this.#primerNombre = primerNombre;
    this.#segundoNombre = segundoNombre;
    this.#primerApellido = primerApellido;
    this.#segundoApellido = segundoApellido;
    this.#direccionCorreo = direccionCorreo;
    this.#numeroCelular = numeroCelular;
    this.#fotoPerfil = fotoPerfil;
    this.#estado = estado;
    this.#clave = clave;
    this.#perfilUsuario = perfilUsuario;
  }

  // GETTERS NATIVOS
  get id() {
    return this.#id;
  }
  get tipoDocumento() {
    return this.#tipoDocumento;
  }
  get numeroDocumento() {
    return this.#numeroDocumento;
  }
  get primerNombre() {
    return this.#primerNombre;
  }
  get segundoNombre() {
    return this.#segundoNombre;
  }
  get primerApellido() {
    return this.#primerApellido;
  }
  get segundoApellido() {
    return this.#segundoApellido;
  }
  get direccionCorreo() {
    return this.#direccionCorreo;
  }
  get numeroCelular() {
    return this.#numeroCelular;
  }
  get fotoPerfil() {
    return this.#fotoPerfil;
  }
  get estado() {
    return this.#estado;
  }
  get clave() {
    return this.#clave;
  }
  get perfilUsuario() {
    return this.#perfilUsuario;
  }

  // SETTERS NATIVOS
  set id(valor) {
    this.#id = valor;
  }
  set tipoDocumento(valor) {
    this.#tipoDocumento = valor;
  }
  set numeroDocumento(valor) {
    this.#numeroDocumento = valor;
  }
  set primerNombre(valor) {
    this.#primerNombre = valor;
  }
  set segundoNombre(valor) {
    this.#segundoNombre = valor;
  }
  set primerApellido(valor) {
    this.#primerApellido = valor;
  }
  set segundoApellido(valor) {
    this.#segundoApellido = valor;
  }
  set direccionCorreo(valor) {
    this.#direccionCorreo = valor;
  }
  set numeroCelular(valor) {
    this.#numeroCelular = valor;
  }
  set fotoPerfil(valor) {
    this.#fotoPerfil = valor;
  }
  set estado(valor) {
    this.#estado = valor;
  }
  set clave(valor) {
    this.#clave = valor;
  }
  set perfilUsuario(valor) {
    this.#perfilUsuario = valor;
  }

  toJSON() {
    return {
      id: this.#id,
      tipoDocumento: this.#tipoDocumento,
      numeroDocumento: this.#numeroDocumento,
      primerNombre: this.#primerNombre,
      segundoNombre: this.#segundoNombre,
      primerApellido: this.#primerApellido,
      segundoApellido: this.#segundoApellido,
      direccionCorreo: this.#direccionCorreo,
      numeroCelular: this.#numeroCelular,
      fotoPerfil: this.#fotoPerfil,
      estado: this.#estado,
      clave: this.#clave,
      perfilUsuario: this.#perfilUsuario,
    };
  }
}

export default Usuario;
