import express from "express";
import ReporteIncidenciaService from "../services/reporte_incidencia_service.js";
const routerReporteIncidencia = express.Router();

/**
 * @swagger
 * /api/reporte-incidencias:
 *   get:
 *     summary: Listar todos los reportes de incidencia
 *     tags: [Reportes de Incidencia]
 *     responses:
 *       200:
 *         description: Lista de reportes de incidencia obtenida exitosamente
 */
//Listar todos los reporte de incidencia
routerReporteIncidencia.get("/", async (req, res) => {
  try {
    const reportesIncidencias =
      await ReporteIncidenciaService.listarReporteIncidencia();
    res.status(200).json({
      success: true,
      data: reportesIncidencias,
      message: "Reportes de incidencias obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reportes de incidencias",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/reporte-incidencias/vehiculo/{vehiculoId}/incidencia/{incidenciaId}:
 *   get:
 *     summary: Obtener un reporte de incidencia por vehículo e incidencia
 *     tags: [Reportes de Incidencia]
 *     parameters:
 *       - in: path
 *         name: vehiculoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: incidenciaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte de incidencia obtenido exitosamente
 *       404:
 *         description: Reporte de incidencia no encontrado
 */
//Obtener reporte de incidencia por ID
routerReporteIncidencia.get(
  "/vehiculo/:vehiculoId/incidencia/:incidenciaId",
  async (req, res) => {
    try {
      const vehiculoId = parseInt(req.params.vehiculoId);
      const incidenciaId = parseInt(req.params.incidenciaId);
      const reporteIncidencia =
        await ReporteIncidenciaService.obtenerReporteIncidencia(
          vehiculoId,
          incidenciaId,
        );

      if (!reporteIncidencia) {
        return res.status(404).json({
          success: false,
          message: "Reporte de incidencia no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: reporteIncidencia,
        message: "Reporte de incidencia obtenido exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener reporte de incidencia",
        error: error.message,
      });
    }
  },
);

/**
 * @swagger
 * /api/reporte-incidencias:
 *   post:
 *     summary: Crear un nuevo reporte de incidencia
 *     tags: [Reportes de Incidencia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehiculo
 *               - incidencia
 *               - fechaHora
 *             properties:
 *               vehiculo: {type: integer}
 *               incidencia: {type: integer}
 *               fechaHora: {type: string}
 *     responses:
 *       201:
 *         description: Reporte de incidencia creado exitosamente
 */
//Crear nuevo reporte de incidencia|
routerReporteIncidencia.post("/", async (req, res) => {
  try {
    const { vehiculo, incidencia, fechaHora } = req.body;

    if (!vehiculo || !incidencia || !fechaHora) {
      return res.status(400).json({
        success: false,
        message: "faltan campos obligatorios: vehiculo, incidencia, fechaHora",
      });
    }

    const reporteIncidencia =
      await ReporteIncidenciaService.crearReporteIncidencia({
        vehiculo,
        incidencia,
        fechaHora,
      });

    res.status(201).json({
      success: true,
      data: reporteIncidencia,
      message: "Reporte de incidencia creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear reporte de incidencia",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/reporte-incidencias/vehiculo/{vehiculoId}/incidencia/{incidenciaId}:
 *   put:
 *     summary: Actualizar un reporte de incidencia
 *     tags: [Reportes de Incidencia]
 *     parameters:
 *       - in: path
 *         name: vehiculoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: incidenciaId
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
 *               vehiculo: {type: integer}
 *               incidencia: {type: integer}
 *               fechaHora: {type: string}
 *     responses:
 *       200:
 *         description: Reporte de incidencia actualizado exitosamente
 *       404:
 *         description: Reporte de incidencia no encontrado
 */
//Actualizar reporte de incidencia
routerReporteIncidencia.put(
  "/vehiculo/:vehiculoId/incidencia/:incidenciaId",
  async (req, res) => {
    try {
      const vehiculoId = parseInt(req.params.vehiculoId);
      const incidenciaId = parseInt(req.params.incidenciaId);
      const datosActualizados = req.body;

      const reporteIncidenciaActualizado =
        await ReporteIncidenciaService.actualizarReporteIncidencia(
          vehiculoId,
          incidenciaId,
          datosActualizados,
        );

      if (!reporteIncidenciaActualizado) {
        return res.status(404).json({
          success: false,
          message: "Reporte de incidencia no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: reporteIncidenciaActualizado,
        message: "Reporte de incidencia actualizado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar reporte de incidencia",
        error: error.message,
      });
    }
  },
);

/**
 * @swagger
 * /api/reporte-incidencias/vehiculo/{vehiculoId}/incidencia/{incidenciaId}:
 *   delete:
 *     summary: Eliminar un reporte de incidencia
 *     tags: [Reportes de Incidencia]
 *     parameters:
 *       - in: path
 *         name: vehiculoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: incidenciaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte de incidencia eliminado exitosamente
 *       404:
 *         description: Reporte de incidencia no encontrado
 */
//Eliminar reporte de incidencia
routerReporteIncidencia.delete(
  "/vehiculo/:vehiculoId/incidencia/:incidenciaId",
  async (req, res) => {
    try {
      const vehiculoId = parseInt(req.params.vehiculoId);
      const incidenciaId = parseInt(req.params.incidenciaId);
      const reporteIncidenciaEliminado =
        await ReporteIncidenciaService.eliminarReporteIncidencia(
          vehiculoId,
          incidenciaId,
        );

      if (!reporteIncidenciaEliminado) {
        return res.status(404).json({
          success: false,
          message: "Reporte de incidencia no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Reporte de incidencia eliminado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar reporte de incidencia",
        error: error.message,
      });
    }
  },
);

export default routerReporteIncidencia;
