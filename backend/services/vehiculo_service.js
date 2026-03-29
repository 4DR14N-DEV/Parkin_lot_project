import Vehiculo from "../models/vehiculo.js";
import db from "../config/MySQLDatabase.js";

class VehiculoService {
  async crearVehiculo({ placa, color, modelo, marca, tipo, usuario }) {
    const vehiculo = new Vehiculo({
      placa,
      color,
      modelo,
      marca,
      tipo,
      usuario,
    });

    //Conectar si aun hay conexion activa
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    //INSERT usando los getters del objeto para respetar la encapsulacion
    const pool = db.getConnection();
    const [result] = await pool.query(
      "INSERT INTO vehiculo (placa, color, modelo, marca, tipo, usuario_id_usuario) VALUES (?, ?, ?, ?, ?, ?)",
      [
        vehiculo.placa,
        vehiculo.color,
        vehiculo.modelo,
        vehiculo.marca,
        vehiculo.tipo,
        vehiculo.usuario,
      ],
    );

    vehiculo.id = result.insertId;
    return vehiculo;
  }

  async listarVehiculos() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query(
      "SELECT id, placa, color, modelo, marca, tipo, usuario_id_usuario FROM vehiculo",
    );

    const vehiculos = rows.map((row) => {
      const vehiculo = new Vehiculo({
        id: row.id,
        placa: row.placa,
        color: row.color,
        modelo: row.modelo,
        marca: row.marca,
        tipo: row.tipo,
        usuario: row.usuario_id_usuario,
      });
      return vehiculo;
    });
    return vehiculos;
  }

  async obtenerVehiculoPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query(
      "SELECT id, placa, color, modelo, marca, tipo, usuario_id_usuario FROM vehiculo WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    const vehiculo = new Vehiculo({
      id: row.id,
      placa: row.placa,
      color: row.color,
      modelo: row.modelo,
      marca: row.marca,
      tipo: row.tipo,
      usuario: row.usuario_id_usuario,
    });
    return vehiculo;
  }

  //Listar vehiculo por Usuario; Útil para listar los vehiculos asociados a un usuario
  async listarVehiculosPorUsuario(usuarioId) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const pool = db.getConnection();
    const [rows] = await pool.query(
      "SELECT id, placa, color, modelo, marca, tipo, usuario_id_usuario FROM vehiculo WHERE usuario_id_usuario = ?",
      [usuarioId],
    );

    if (rows.length === 0) return null;

    const vehiculos = rows.map((row) => {
      return new Vehiculo({
        id: row.id,
        placa: row.placa,
        color: row.color,
        modelo: row.modelo,
        marca: row.marca,
        tipo: row.tipo,
        usuario: row.usuario_id_usuario,
      });
    });
    return vehiculos;
  }

  async actualizarVehiculo(id, datosActualizados) {
    //Obtener el objeto desde la base de datos
    const vehiculo = await this.obtenerVehiculoPorId(id);
    if (!vehiculo) return null;

    //Aplicar cambios sobre el objeto usando los setters nativos
    if (datosActualizados.placa !== undefined)
      vehiculo.placa = datosActualizados.placa;
    if (datosActualizados.color !== undefined)
      vehiculo.color = datosActualizados.color;
    if (datosActualizados.modelo !== undefined)
      vehiculo.modelo = datosActualizados.modelo;
    if (datosActualizados.marca !== undefined)
      vehiculo.marca = datosActualizados.marca;
    if (datosActualizados.tipo !== undefined)
      vehiculo.tipo = datosActualizados.tipo;
    if (datosActualizados.usuario !== undefined)
      vehiculo.usuario = datosActualizados.usuario;

    //Persistir en la base de datos usando los getters del objeto actualizado
    const pool = db.getConnection();
    await pool.query(
      "UPDATE vehiculo SET placa = ?, color = ?, modelo = ?, marca = ?, tipo = ?,  usuario_id_usuario = ? WHERE id = ?",
      [
        vehiculo.placa,
        vehiculo.color,
        vehiculo.modelo,
        vehiculo.marca,
        vehiculo.tipo,
        vehiculo.usuario,
        vehiculo.id,
      ],
    );

    return vehiculo;
  }

  async eliminarVehiculo(id) {
    //Obtener el objeto desde la base de datos
    const vehiculo = await this.obtenerVehiculoPorId(id);
    if (!vehiculo) return null;

    const pool = db.getConnection();
    await pool.query("DELETE FROM vehiculo WHERE id = ?", [vehiculo.id]);
    return vehiculo;
  }
}

export default new VehiculoService();
