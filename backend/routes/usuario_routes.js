import express from "express";
import UsuarioService from "../services/usuario_service.js";
const routerUsuario = express.Router();

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 */
routerUsuario.get("/", async (req, res) => {
  try {
    const usuarios = await UsuarioService.listarUsuarios();
    res.status(200).json({
      success: true,
      data: usuarios,
      message: "Usuarios obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
routerUsuario.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const usuario = await UsuarioService.obtenerUsuarioPorId(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: usuario,
      message: "Usuario obtenido exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoDocumento
 *               - numeroDocumento
 *               - primerNombre
 *               - primerApellido
 *               - clave
 *               - perfilUsuario
 *             properties:
 *               tipoDocumento: {type: string}
 *               numeroDocumento: {type: string}
 *               primerNombre: {type: string}
 *               primerApellido: {type: string}
 *               clave: {type: string}
 *               perfilUsuario: {type: integer}
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
routerUsuario.post("/", async (req, res) => {
  try {
    const {
      tipoDocumento,
      numeroDocumento,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      direccionCorreo,
      numeroCelular,
      fotoPerfil,
      estado,
      clave,
      perfilUsuario,
    } = req.body;

    if (
      !tipoDocumento ||
      !numeroDocumento ||
      !primerNombre ||
      !primerApellido ||
      !clave ||
      !perfilUsuario
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan campos obligatorios: tipoDocumento, numeroDocumento, primerNombre, primerApellido, clave, perfilUsuario",
      });
    }

    const usuario = await UsuarioService.crearUsuario({
      tipoDocumento,
      numeroDocumento,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      direccionCorreo,
      numeroCelular,
      fotoPerfil,
      estado,
      clave,
      perfilUsuario,
    });

    res.status(201).json({
      success: true,
      data: usuario,
      message: "Usuario creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear usuario",
      error: error.message,
    });
  }
});

routerUsuario.post("/login", async (req, res) => {
  try {
    const { numeroDocumento, clave, perfilUsuario } = req.body;

    const usuario = await UsuarioService.iniciarSesion(
      numeroDocumento,
      clave,
      perfilUsuario,
    );

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Credenciales Invalidas",
      });
    }

    res.status(200).json({
      success: true,
      data: usuario,
      message: "Acceso exitoso",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesion",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 */
routerUsuario.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const usuarioActualizado = await UsuarioService.actualizarUsuario(
      id,
      datosActualizados,
    );

    if (!usuarioActualizado) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: usuarioActualizado,
      message: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 */
routerUsuario.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const usuarioEliminado = await UsuarioService.eliminarUsuario(id);

    if (!usuarioEliminado) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
});

export default routerUsuario;
