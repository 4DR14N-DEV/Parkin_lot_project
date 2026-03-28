import PerfilUsuario from "../models/perfil_usuario.js";
import db from "../config/MySQLDatabase.js";

class PerfilUsuarioService {
  async crearPerfilUsuario({ perfil }) {
    const perfilUsuario = new PerfilUsuario({
      perfil,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [result] = await pool.query(
      "INSERT INTO perfil_usuario (perfil) VALUES (?)",
      [perfilUsuario.perfil],
    );

    perfilUsuario.id = result.insertId;
    return perfilUsuario;
  }

  async listarPerfilesUsuario() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query("SELECT id, perfil FROM perfil_usuario");

    const perfilesUsuario = rows.map((row) => {
      const perfilUsuario = new PerfilUsuario({
        id: row.id,
        perfil: row.perfil,
      });
      return perfilUsuario;
    });
    return perfilesUsuario;
  }

  async obtenerPerfilUsuarioPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query(
      "SELECT id, perfil FROM perfil_usuario WHERE id = ?",
      [id],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const perfilUsuario = new PerfilUsuario({
      id: row.id,
      perfil: row.perfil,
    });
    return perfilUsuario;
  }

  async actualizarPerfilUsuario(id, datosActualizados) {
    const perfilUsuario = await this.obtenerPerfilUsuarioPorId(id);
    if (!perfilUsuario) return null;

    if (datosActualizados.perfil !== undefined)
      perfilUsuario.perfil = datosActualizados.perfil;

    const pool = db.getConnection();
    await pool.query("UPDATE perfil_usuario SET perfil = ? WHERE id = ?", [
      perfilUsuario.perfil,
      perfilUsuario.id,
    ]);

    return perfilUsuario;
  }

  async eliminarPerfilUsuario(id) {
    const perfilUsuario = await this.obtenerPerfilUsuarioPorId(id);
    if (!perfilUsuario) return null;

    const pool = db.getConnection();
    await pool.query("DELETE FROM perfil_usuario WHERE id = ?", [
      perfilUsuario.id,
    ]);
    return perfilUsuario;
  }
}

export default new PerfilUsuarioService();
