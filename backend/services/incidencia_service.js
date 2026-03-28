import Incidencia from "../models/incidencia.js";
import db from "../config/MySQLDatabase.js";

class IncidenciaService {
  async crearIncidencia({ nombre }) {
    const incidencia = new Incidencia({
      nombre,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [result] = await pool.query(
      "INSERT INTO incidencia (nombre) VALUES (?)",
      [incidencia.nombre],
    );

    incidencia.id = result.insertId;
    return incidencia;
  }

  async listarIncidencias() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query("SELECT id, nombre FROM incidencia");

    const incidencias = rows.map((row) => {
      const incidencia = new Incidencia({
        id: row.id,
        nombre: row.nombre,
      });
      return incidencia;
    });
    return incidencias;
  }

  async obtenerIncidenciaPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query(
      "SELECT id, nombre FROM incidencia WHERE id = ?",
      [id],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const incidencia = new Incidencia({
      id: row.id,
      nombre: row.nombre,
    });
    return incidencia;
  }

  async actualizarIncidencia(id, datosActualizados) {
    const incidencia = await this.obtenerIncidenciaPorId(id);
    if (!incidencia) return null;

    if (datosActualizados.nombre !== undefined)
      incidencia.nombre = datosActualizados.nombre;

    const pool = db.getConnection();
    await pool.query("UPDATE incidencia SET nombre = ? WHERE id = ?", [
      incidencia.nombre,
      incidencia.id,
    ]);
    return incidencia;
  }

  async eliminarIncidencia(id) {
    const incidencia = await this.obtenerIncidenciaPorId(id);
    if (!incidencia) return null;

    const pool = db.getConnection();
    await pool.query("DELETE FROM incidencia WHERE id = ?", [incidencia.id]);
    return incidencia;
  }
}

export default new IncidenciaService();
