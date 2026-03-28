import express from "express";
import PerfilUsuarioService from "../services/perfil_usuario_service.js";
const routerPerfilUsuario = express.Router();

/**
 * @swagger
 * /api/perfiles-usuario:
 *   get:
 *     summary: Listar todos los perfiles de usuario
 *     tags: [Perfiles de Usuario]
 *     responses:
 *       200:
 *         description: Lista de perfiles de usuario obtenida exitosamente
 */
//Listar perfiles de usuario
routerPerfilUsuario.get("/", async (req, res) => {
  try {
    const perfilUsuarios = await PerfilUsuarioService.listarPerfilesUsuario();
    res.status(200).json({
      success: true,
      data: perfilUsuarios,
      message: "Perfiles de usuario obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los perfiles de usuario",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/perfiles-usuario/{id}:
 *   get:
 *     summary: Obtener un perfil de usuario por ID
 *     tags: [Perfiles de Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Perfil de usuario obtenido exitosamente
 *       404:
 *         description: Perfil de usuario no encontrado
 */
//Obtener perfil de usuario por ID
routerPerfilUsuario.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const perfilUsuario =
      await PerfilUsuarioService.obtenerPerfilUsuarioPorId(id);

    if (!perfilUsuario) {
      return res.status(404).json({
        success: false,
        message: "Perfil de usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: perfilUsuario,
      message: "Perfil de usuario obtenido exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener perfil de usuario",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/perfiles-usuario:
 *   post:
 *     summary: Crear un nuevo perfil de usuario
 *     tags: [Perfiles de Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - perfil
 *             properties:
 *               perfil: {type: string}
 *     responses:
 *       201:
 *         description: Perfil de usuario creado exitosamente
 */
//Crear nuevo perfil de usuario
routerPerfilUsuario.post("/", async (req, res) => {
  try {
    const { perfil } = req.body;

    if (!perfil) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: perfil",
      });
    }

    const perfilUsuario = await PerfilUsuarioService.crearPerfilUsuario({
      perfil,
    });

    res.status(201).json({
      success: true,
      data: perfilUsuario,
      message: "Perfil de usuario creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear perfil de usuario",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/perfil-usuarios/{id}:
 *   put:
 *     summary: Actualizar un perfil de usuario
 *     tags: [Perfiles de Usuario]
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
 *               perfil: {type: string}
 *     responses:
 *       200:
 *         description: Perfil de usuario actualizado exitosamente
 *       404:
 *         description: Perfil de usuario no encontrado
 */
//Actualizar Perfil de usuario
routerPerfilUsuario.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const perfilUsuarioActualizado =
      await PerfilUsuarioService.actualizarPerfilUsuario(id, datosActualizados);

    if (!perfilUsuarioActualizado) {
      return res.status(404).json({
        success: false,
        message: "Perfil de usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: perfilUsuarioActualizado,
      message: "Perfil de usuario actualizado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar perfil de usuario",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/perfil-usuarios/{id}:
 *   delete:
 *     summary: Eliminar un perfil de usuario
 *     tags: [Perfiles de Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Perfil de usuario eliminado exitosamente
 *       404:
 *         description: Perfil de usuario no encontrado
 */
//Eliminar perfil de usuario
routerPerfilUsuario.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const perfilUsuarioEliminado =
      await PerfilUsuarioService.eliminarPerfilUsuario(id);

    if (!perfilUsuarioEliminado) {
      return res.status(404).json({
        success: false,
        message: "Perfil de usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Perfil de usuario eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar perfil de usuario",
      error: error.message,
    });
  }
});

export default routerPerfilUsuario;
