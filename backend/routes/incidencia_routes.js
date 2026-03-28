import express from "express";
import IncidenciaService from "../services/incidencia_service.js";
const routerIncidencia = express.Router();

/**
 * @swagger
 * /api/incidencias:
 *   get:
 *     summary: Listar todas las incidencias
 *     tags: [Incidencias]
 *     responses:
 *       200:
 *         description: Lista de incidencias obtenida exitosamente
 */
//Listar todas las incidencias
routerIncidencia.get("/", async (req, res) => {
  try {
    const incidencias = await IncidenciaService.listarIncidencias();
    res.status(200).json({
      success: true,
      data: incidencias,
      message: "Incidencias obtenidas exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener incidencias",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/incidencias/{id}:
 *   get:
 *     summary: Obtener una incidencia por ID
 *     tags: [Incidencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Incidencia obtenida exitosamente
 *       404:
 *         description: Incidencia no encontrada
 */
//Obtener incidencia por ID
routerIncidencia.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const incidencia = await IncidenciaService.obtenerIncidenciaPorId(id);

    if (!incidencia) {
      return res.status(404).json({
        success: false,
        message: "Incidencia no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: incidencia,
      message: "Incidencia obtenida exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener incidencia",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/incidencias:
 *   post:
 *     summary: Crear una nueva incidencia
 *     tags: [Incidencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre: {type: string}
 *     responses:
 *       201:
 *         description: Incidencia creada exitosamente
 */
//Crear nueva incidencia
routerIncidencia.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: nombre",
      });
    }

    const incidencia = await IncidenciaService.crearIncidencia({ nombre });

    res.status(201).json({
      success: true,
      data: incidencia,
      message: "Incidencia creada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear incidencia",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/incidencias/{id}:
 *   put:
 *     summary: Actualizar una incidencia
 *     tags: [Incidencias]
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
 *               nombre: {type: string}
 *     responses:
 *       200:
 *         description: Incidencia actualizada exitosamente
 *       404:
 *         description: Incidencia no encontrada
 */
//Actualizar incidencia
routerIncidencia.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const incidenciaActualizada = await IncidenciaService.actualizarIncidencia(
      id,
      datosActualizados,
    );
    if (!incidenciaActualizada) {
      return res.status(404).json({
        success: false,
        message: "Incidencia no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: incidenciaActualizada,
      message: "Incidencia actualizada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar incidencia",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/incidencias/{id}:
 *   delete:
 *     summary: Eliminar una incidencia
 *     tags: [Incidencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Incidencia eliminada exitosamente
 *       404:
 *         description: Incidencia no encontrada
 */
//Eliminar incidencia
routerIncidencia.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const incidenciaEliminada = await IncidenciaService.eliminarIncidencia(id);

    if (!incidenciaEliminada) {
      return res.status(404).json({
        success: false,
        message: "Incidencia no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Incidencia eliminada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar incidencia",
      error: error.message,
    });
  }
});

export default routerIncidencia;
