import express from "express";
import PicoPlacaService from "../services/pico_placa_service.js";
const routerPicoPlaca = express.Router();

/**
 * @swagger
 * /api/pico-y-placa:
 *   get:
 *     summary: Listar todos los pico y placa
 *     tags: [Pico y Placa]
 *     responses:
 *       200:
 *         description: Lista de pico y placa obtenida exitosamente
 */
//Listar todos los pico y placa
routerPicoPlaca.get("/", async (req, res) => {
  try {
    const picoPlacas = await PicoPlacaService.listarPicoPlaca();
    res.status(200).json({
      success: true,
      data: picoPlacas,
      message: "Pico y placa obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener pico y placas",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/pico-y-placa/{id}:
 *   get:
 *     summary: Obtener un pico y placa por ID
 *     tags: [Pico y Placa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pico y placa obtenido exitosamente
 *       404:
 *         description: Pico y placa no encontrado
 */
//Obtener pico y placa por ID
routerPicoPlaca.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const picoPlaca = await PicoPlacaService.obtenerPicoPlacaPorId(id);
    if (!picoPlaca) {
      return res.status(404).json({
        success: false,
        message: "Pico y placa no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: picoPlaca,
      message: "Pico y placa obtenido exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener pico y placa",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/pico-y-placa:
 *   post:
 *     summary: Crear un nuevo pico y placa
 *     tags: [Pico y Placa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoVehiculo
 *               - numero
 *               - dia
 *             properties:
 *               tipoVehiculo: {type: string}
 *               numero: {type: integer}
 *               dia: {type: string}
 *     responses:
 *       201:
 *         description: Pico y placa creado exitosamente
 */
//Crear nuevo pico y placa
routerPicoPlaca.post("/", async (req, res) => {
  try {
    const { tipoVehiculo, numero, dia } = req.body;

    if (!tipoVehiculo || !numero || !dia) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: tipoVehiculo, numero, dia",
      });
    }

    const picoPlaca = await PicoPlacaService.crearPicoPlaca({
      tipoVehiculo,
      numero,
      dia,
    });

    res.status(201).json({
      success: true,
      data: picoPlaca,
      message: "Pico y placa creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear pico y placa",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/pico-y-placa/{id}:
 *   put:
 *     summary: Actualizar un pico y placa
 *     tags: [Pico y Placa]
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
 *               tipoVehiculo: {type: string}
 *               numero: {type: integer}
 *               dia: {type: string}
 *     responses:
 *       200:
 *         description: Pico y placa actualizado exitosamente
 *       404:
 *         description: Pico y placa no encontrado
 */
//Actualizar pico y placa
routerPicoPlaca.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const PicoPlacaActualizado = await PicoPlacaService.actualizarPicoPlaca(
      id,
      datosActualizados,
    );

    if (!PicoPlacaActualizado) {
      return res.status(404).json({
        success: false,
        message: "Pico y placa no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: PicoPlacaActualizado,
      message: "Pico y placa actualizado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar pico y placa",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/pico-y-placa/{id}:
 *   delete:
 *     summary: Eliminar un pico y placa
 *     tags: [Pico y Placa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pico y placa eliminado exitosamente
 *       404:
 *         description: Pico y placa no encontrado
 */
//Eliminar Pico y placa
routerPicoPlaca.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const picoPlacaEliminado = await PicoPlacaService.eliminarPicoPlaca(id);

    if (!picoPlacaEliminado) {
      return res.status(404).json({
        success: false,
        message: "Pico y placa no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pico y placa eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar pico y placa",
      error: error.message,
    });
  }
});

export default routerPicoPlaca;
