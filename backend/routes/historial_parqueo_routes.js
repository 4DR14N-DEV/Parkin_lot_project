import express from "express";
import HistorialParqueoService from "../services/historial_parqueo_service.js";
const routerHistorialParqueo = express.Router();

/**
 * @swagger
 * /api/historial-parqueo:
 *   get:
 *     summary: Listar todos los historiales de parqueo
 *     tags: [Historial de Parqueo]
 *     responses:
 *       200:
 *         description: Lista de historiales de parqueo obtenida exitosamente
 */
//Listar todo el historial de parqueo
routerHistorialParqueo.get("/", async (req, res) => {
  try {
    const historialParqueos = await HistorialParqueoService.listarHistorial();
    res.status(200).json({
      success: true,
      data: historialParqueos,
      message: "Historial de parqueos obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener historial de parqueos",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/historial-parqueo/celda/{celdaId}/vehiculo/{vehiculoId}:
 *   get:
 *     summary: Obtener un historial de parqueo por celda y vehículo
 *     tags: [Historial de Parqueo]
 *     parameters:
 *       - in: path
 *         name: celdaId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: vehiculoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial de parqueo obtenido exitosamente
 *       404:
 *         description: Historial de parqueo no encontrado
 */
//Obtener historial de parqueo por ID
routerHistorialParqueo.get(
  "/celda/:celdaId/vehiculo/:vehiculoId",
  async (req, res) => {
    try {
      const celdaId = parseInt(req.params.celdaId);
      const vehiculoId = parseInt(req.params.vehiculoId);
      const historialParqueo = await HistorialParqueoService.obtenerHistorial(
        celdaId,
        vehiculoId,
      );

      if (!historialParqueo) {
        return res.status(404).json({
          success: false,
          message: "Historial de parqueo no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: historialParqueo,
        message: "Historial de parqueo obtenido exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener historial de parqueo",
        error: error.message,
      });
    }
  },
);

/**
 * @swagger
 * /api/historial-parqueo:
 *   post:
 *     summary: Crear un nuevo historial de parqueo
 *     tags: [Historial de Parqueo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - celda
 *               - vehiculo
 *               - fechaHora
 *             properties:
 *               celda: {type: integer}
 *               vehiculo: {type: integer}
 *               fechaHora: {type: string}
 *     responses:
 *       201:
 *         description: Historial de parqueo creado exitosamente
 */
//Crear nuevo historial de parqueo
routerHistorialParqueo.post("/", async (req, res) => {
  try {
    const { celda, vehiculo, fechaHora } = req.body;

    if (!celda || !vehiculo || !fechaHora) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: celda, vehiculo, fechaHora",
      });
    }

    const historialParqueo =
      await HistorialParqueoService.crearHistorialParqueo({
        celda,
        vehiculo,
        fechaHora,
      });

    res.status(201).json({
      success: true,
      data: historialParqueo,
      message: "Historial de parqueo creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear historial de parqueo",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/historial-parqueo/celda/{celdaId}/vehiculo/{vehiculoId}:
 *   delete:
 *     summary: Eliminar un historial de parqueo
 *     tags: [Historial de Parqueo]
 *     parameters:
 *       - in: path
 *         name: celdaId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: vehiculoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial de parqueo eliminado exitosamente
 *       404:
 *         description: Historial de parqueo no encontrado
 */
//Eliminar historial de parqueo
routerHistorialParqueo.delete(
  "/celda/:celdaId/vehiculo/vehiculoId",
  async (req, res) => {
    try {
      const celdaId = parseInt(req.params.celdaId);
      const vehiculoId = parseInt(req.params.vehiculoId);
      const historialParqueoEliminado =
        await HistorialParqueoService.eliminarHistorial(celdaId, vehiculoId);

      if (!historialParqueoEliminado) {
        return res.status(404).json({
          success: false,
          message: "Historial de parqueo no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Historial de parqueo eliminado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar historial de parqueo",
        error: error.message,
      });
    }
  },
);

export default routerHistorialParqueo;
