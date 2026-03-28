import express from "express";
import VehiculoService from "../services/vehiculo_service.js";
const routerVehiculo = express.Router();

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Listar todos los vehículos
 *     tags: [Vehiculos]
 *     responses:
 *       200:
 *         description: Lista de vehículos obtenida exitosamente
 */
routerVehiculo.get("/", async (req, res) => {
  try {
    const vehiculos = await VehiculoService.listarVehiculos();
    res.status(200).json({
      success: true,
      data: vehiculos,
      message: "Vehiculos obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener vehiculos",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtener un vehículo por ID
 *     tags: [Vehiculos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehículo obtenido exitosamente
 *       404:
 *         description: Vehículo no encontrado
 */
routerVehiculo.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const vehiculo = await VehiculoService.obtenerVehiculoPorId(id);

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: "Vehiculo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: vehiculo,
      message: "Vehiculo obtenido exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener vehiculo",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crear un nuevo vehículo
 *     tags: [Vehiculos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - placa
 *               - color
 *               - modelo
 *               - marca
 *               - usuario
 *             properties:
 *               tipo: {type: string}
 *               placa: {type: string}
 *               color: {type: string}
 *               modelo: {type: string}
 *               marca: {type: string}
 *               usuario: {type: integer}
 *     responses:
 *       201:
 *         description: Vehículo creado exitosamente
 */
//Crear un nuevo vehiculo
routerVehiculo.post("/", async (req, res) => {
  try {
    const { tipo, placa, color, modelo, marca, usuario } = req.body;

    if (!tipo || !placa || !color || !modelo || !marca || !usuario) {
      return res.status(400).json({
        success: false,
        message:
          "Se requiere campos obligatorios: tipo, placa, color, modelo, marca, usuario",
      });
    }

    const vehiculo = await VehiculoService.crearVehiculo({
      tipo,
      placa,
      color,
      modelo,
      marca,
      usuario,
    });

    res.status(201).json({
      success: true,
      data: vehiculo,
      message: "Vehiculo creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear vehiculo",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualizar un vehículo
 *     tags: [Vehiculos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo: {type: string}
 *               placa: {type: string}
 *               color: {type: string}
 *               modelo: {type: string}
 *               marca: {type: string}
 *               usuario: {type: integer}
 *     responses:
 *       200:
 *         description: Vehículo actualizado exitosamente
 *       404:
 *         description: Vehículo no encontrado
 */
//Actualizar vehiculo
routerVehiculo.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const vehiculoActualizado = await VehiculoService.actualizarVehiculo(
      id,
      datosActualizados,
    );

    if (!vehiculoActualizado) {
      return res.status(404).json({
        success: false,
        message: "Vehiculo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: vehiculoActualizado,
      message: "Vehiculo actualizado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar vehiculo",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Eliminar un vehículo
 *     tags: [Vehiculos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehículo eliminado exitosamente
 *       404:
 *         description: Vehículo no encontrado
 */
//Eliminar un vehiculo
routerVehiculo.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const vehiculoEliminado = await VehiculoService.eliminarVehiculo(id);

    if (!vehiculoEliminado) {
      return res.status(404).json({
        success: false,
        message: "Vehiculo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehiculo eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar vehiculo",
      error: error.message,
    });
  }
});

export default routerVehiculo;
