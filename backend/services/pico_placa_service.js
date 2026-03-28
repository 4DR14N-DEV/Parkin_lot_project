import db from "../config/MySQLDatabase.js";
import PicoPlaca from "../models/pico_placa.js";

class PicoPlacaService {
  async crearPicoPlaca({ tipoVehiculo, numero, dia }) {
    const picoPlaca = new PicoPlaca({
      tipoVehiculo,
      numero,
      dia,
    });

    //Conectar si aun hay conexión activa
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    //INSERT usando los getters del objeto para respetar la encapsulacion
    const pool = db.getConnection();
    const [result] = await pool.query(
      "INSERT INTO pico_placa (tipo_vehiculo, numero, dia) VALUES (?, ?, ?)",
      [picoPlaca.tipoVehiculo, picoPlaca.numero, picoPlaca.dia],
    );

    picoPlaca.id = result.insertId;
    return picoPlaca;
  }

  async listarPicoPlaca() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query(
      "SELECT id, tipo_vehiculo, numero, dia FROM pico_placa",
    );

    const picoPlacas = rows.map((row) => {
      const picoPlaca = new PicoPlaca({
        id: row.id,
        tipoVehiculo: row.tipo_vehiculo,
        numero: row.numero,
        dia: row.dia,
      });
      return picoPlaca;
    });
    return picoPlacas;
  }

  async obtenerPicoPlacaPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query(
      "SELECT id, tipo_vehiculo, numero, dia FROM pico_placa WHERE id = ?",
      [id],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const picoPlaca = new PicoPlaca({
      id: row.id,
      tipoVehiculo: row.tipo_vehiculo,
      numero: row.numero,
      dia: row.dia,
    });
    return picoPlaca;
  }

  async actualizarPicoPlaca(id, datosActualizados) {
    const picoPlaca = await this.obtenerPicoPlacaPorId(id);
    if (!picoPlaca) return null;

    if (datosActualizados.tipoVehiculo !== undefined)
      picoPlaca.tipoVehiculo = datosActualizados.tipoVehiculo;
    if (datosActualizados.numero !== undefined)
      picoPlaca.numero = datosActualizados.numero;
    if (datosActualizados.dia !== undefined)
      picoPlaca.dia = datosActualizados.dia;

    const pool = db.getConnection();
    await pool.query(
      "UPDATE pico_placa SET tipo_vehiculo = ?, numero = ?, dia = ? WHERE id = ?",
      [picoPlaca.tipoVehiculo, picoPlaca.numero, picoPlaca.dia, picoPlaca.id],
    );

    return picoPlaca;
  }

  async eliminarPicoPlaca(id) {
    const picoPlaca = await this.obtenerPicoPlacaPorId(id);
    if (!picoPlaca) return null;

    const pool = db.getConnection();
    await pool.query("DELETE FROM pico_placa WHERE id = ?", [picoPlaca.id]);
    return picoPlaca;
  }
}

export default new PicoPlacaService();
