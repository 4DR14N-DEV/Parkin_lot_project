class PerfilUsuario {
  #id;
  #perfil;

  /**
   * @param {Object} perfilUsuario - objeto que contiene las propiedades para crear perfil de usuario
   * @param {number} id - id de perfil de usuario
   * @param {string} perfil - tipo de perfil de usuario (administrador, operador, usuario)
   */

  constructor({ id, perfil }) {
    this.#id = id;
    this.#perfil = perfil;
  }

  //GETTERS

  get id() {
    return this.#id;
  }
  get perfil() {
    return this.#perfil;
  }

  //SETTERS
  set id(valor) {
    this.#id = valor;
  }

  set perfil(valor) {
    this.#perfil = valor;
  }

  toJSON() {
    return {
      id: this.#id,
      perfil: this.#perfil,
    };
  }
}

export default PerfilUsuario;
