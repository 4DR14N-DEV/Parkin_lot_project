import Celda from "../models/celda.js";
import db from "../config/MySQLDatabase.js";
class CeldaService {
  async crearCelda({ tipo, estado }) {
    const celda = new Celda({
      tipo,
      estado,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [result] = await pool.query(
      "INSERT INTO celda (tipo, estado) VALUES (?, ?)",
      [celda.tipo, celda.estado],
    );

    celda.id = result.insertId;
    return celda;
  }

  async listarCeldas() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query("SELECT id, tipo, estado FROM celda");

    const celdas = rows.map((row) => {
      const celda = new Celda({
        id: row.id,
        tipo: row.tipo,
        estado: row.estado,
      });
      return celda;
    });
    return celdas;
  }

  async obtenerCeldaPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query(
      "SELECT id, tipo, estado FROM celda WHERE id = ?",
      [id],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const celda = new Celda({
      id: row.id,
      tipo: row.tipo,
      estado: row.estado,
    });
    return celda;
  }

  async actualizarCelda(id, datosActualizados) {
    const celda = await this.obtenerCeldaPorId(id);
    if (!celda) return null;

    if (datosActualizados.tipo !== undefined)
      celda.tipo = datosActualizados.tipo;
    if (datosActualizados.estado !== undefined)
      celda.estado = datosActualizados.estado;

    const pool = db.getConnection();
    await pool.query("UPDATE celda SET tipo = ?, estado = ? WHERE id = ?", [
      celda.tipo,
      celda.estado,
      celda.id,
    ]);

    return celda;
  }

  async eliminarCelda(id) {
    const celda = await this.obtenerCeldaPorId(id);
    if (!celda) return null;

    const pool = db.getConnection();
    await pool.query("DELETE FROM celda WHERE id = ?", [celda.id]);
    return celda;
  }
}

export default new CeldaService();
