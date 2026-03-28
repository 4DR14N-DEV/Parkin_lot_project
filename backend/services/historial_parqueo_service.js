import HistorialParqueo from "../models/historial_parqueo.js";
import db from "../config/MySQLDatabase.js";

class HistorialParqueoService {
  async crearHistorialParqueo({ celda, vehiculo, fechaHora }) {
    const historialParqueo = new HistorialParqueo({
      celda,
      vehiculo,
      fechaHora,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    await pool.query(
      "INSERT INTO historial_parqueo (vehiculo_id, celda_id, fecha_hora) VALUES (?, ?, ?)",
      [
        historialParqueo.vehiculo,
        historialParqueo.celda,
        historialParqueo.fechaHora,
      ],
    );

    return historialParqueo;
  }

  async listarHistorial() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query(
      "SELECT vehiculo_id, celda_id, fecha_hora FROM historial_parqueo",
    );

    const historialParqueos = rows.map((row) => {
      const historialParqueo = new HistorialParqueo({
        vehiculo: row.vehiculo_id,
        celda: row.celda_id,
        fechaHora: row.fecha_hora,
      });
      return historialParqueo;
    });
    return historialParqueos;
  }

  async obtenerHistorial(vehiculoId, celdaId) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query(
      "SELECT vehiculo_id, celda_id, fecha_hora FROM historial_parqueo WHERE vehiculo_id = ? AND celda_id = ?",
      [vehiculoId, celdaId],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const historialParqueo = new HistorialParqueo({
      vehiculo: row.vehiculo_id,
      celda: row.celda_id,
      fechaHora: row.fecha_hora,
    });

    return historialParqueo;
  }

  async eliminarHistorial(vehiculoId, celdaId) {
    const historialParqueo = await this.obtenerHistorial(vehiculoId, celdaId);
    if (!historialParqueo) return null;

    const pool = db.getConnection();
    await pool.query(
      "DELETE FROM historial_parqueo WHERE vehiculo_id = ? AND celda_id = ?",
      [historialParqueo.vehiculo, historialParqueo.celda],
    );
    return historialParqueo;
  }
}

export default new HistorialParqueoService();
