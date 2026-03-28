import AccesoSalida from "../models/acceso_salida.js";
import db from "../config/MySQLDatabase.js";

class AccesoSalidaService {
  async crearAccesoSalida({
    movimiento,
    fechaHora,
    puerta,
    tiempoEstadia,
    vehiculo,
  }) {
    const accesoSalida = new AccesoSalida({
      movimiento,
      fechaHora,
      puerta,
      tiempoEstadia,
      vehiculo,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [result] = await pool.query(
      "INSERT INTO acceso_salidas (movimiento, fecha_hora, puerta, tiempo_estadia, vehiculo_id) VALUES (?, ?, ?, ?, ?)",
      [
        accesoSalida.movimiento,
        accesoSalida.fechaHora,
        accesoSalida.puerta,
        accesoSalida.tiempoEstadia,
        accesoSalida.vehiculo,
      ],
    );

    accesoSalida.id = result.insertId;
    return accesoSalida;
  }

  async listarAccesoSalida() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query(
      "SELECT id, movimiento, fecha_hora, puerta, tiempo_estadia, vehiculo_id FROM acceso_salidas",
    );

    const accesosSalidas = rows.map((row) => {
      return new AccesoSalida({
        id: row.id,
        movimiento: row.movimiento,
        fechaHora: row.fecha_hora,
        puerta: row.puerta,
        tiempoEstadia: row.tiempo_estadia,
        vehiculo: row.vehiculo_id,
      });
    });

    return accesosSalidas;
  }

  // Renombrado para ser más claro e implementando la Opción A (solo ID)
  async obtenerAccesoSalidaPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    // Consulta filtrando únicamente por id
    const [rows] = await pool.query(
      "SELECT id, movimiento, fecha_hora, puerta, tiempo_estadia, vehiculo_id FROM acceso_salidas WHERE id = ?",
      [id],
    );

    // Bug lógico corregido
    if (rows.length === 0) return null;

    const row = rows[0];
    return new AccesoSalida({
      id: row.id,
      movimiento: row.movimiento,
      fechaHora: row.fecha_hora,
      puerta: row.puerta,
      tiempoEstadia: row.tiempo_estadia,
      vehiculo: row.vehiculo_id,
    });
  }

  async actualizarAccesoSalida(id, datosActualizados) {
    // Busca únicamente por ID
    const accesoSalida = await this.obtenerAccesoSalidaPorId(id);
    if (!accesoSalida) return null;

    if (datosActualizados.movimiento !== undefined)
      accesoSalida.movimiento = datosActualizados.movimiento;
    if (datosActualizados.fechaHora !== undefined)
      accesoSalida.fechaHora = datosActualizados.fechaHora;
    if (datosActualizados.puerta !== undefined)
      accesoSalida.puerta = datosActualizados.puerta;
    if (datosActualizados.tiempoEstadia !== undefined)
      accesoSalida.tiempoEstadia = datosActualizados.tiempoEstadia;

    const pool = db.getConnection();
    // Actualiza únicamente usando el WHERE id = ?
    await pool.query(
      "UPDATE acceso_salidas SET movimiento = ?, fecha_hora = ?, puerta = ?, tiempo_estadia = ? WHERE id = ?",
      [
        accesoSalida.movimiento,
        accesoSalida.fechaHora,
        accesoSalida.puerta,
        accesoSalida.tiempoEstadia,
        accesoSalida.id,
      ],
    );

    return accesoSalida;
  }

  async eliminarAccesoSalida(id) {
    // Busca únicamente por ID
    const accesoSalida = await this.obtenerAccesoSalidaPorId(id);
    if (!accesoSalida) return null;

    const pool = db.getConnection();
    // Elimina únicamente usando el WHERE id = ?
    await pool.query("DELETE FROM acceso_salidas WHERE id = ?", [
      accesoSalida.id,
    ]);

    return accesoSalida;
  }
}

export default new AccesoSalidaService();
