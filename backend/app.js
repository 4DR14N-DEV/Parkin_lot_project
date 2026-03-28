import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import db from "./config/MySQLDatabase.js";
import routerUsuario from "../backend/routes/usuario_routes.js";
import routerVehiculo from "../backend/routes/vehiculo_routes.js";
import routerAccesoSalida from "../backend/routes/acceso_salida_routes.js";
import routerCelda from "../backend/routes/celda_routes.js";
import routerHistorialParqueo from "../backend/routes/historial_parqueo_routes.js";
import routerIncidencia from "../backend/routes/incidencia_routes.js";
import routerPerfilUsuario from "../backend/routes/perfil_usuario_routes.js";
import routerPicoPlaca from "../backend/routes/pico_placa_routes.js";
import routerReporteIncidencia from "../backend/routes/reporte_incidencia_routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Parqueadero - Documentación",
      version: "1.0.0",
      description: "API para la gestión de un sistema de parqueaderos.",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: [
    path.resolve(process.cwd(), "routes/*.js"),
    path.resolve(process.cwd(), "backend/routes/*.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const corsOptions = {
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/usuarios", routerUsuario);
app.use("/api/vehiculos", routerVehiculo);
app.use("/api/celdas", routerCelda);
app.use("/api/accesos-salidas", routerAccesoSalida);
app.use("/api/historial-parqueo", routerHistorialParqueo);
app.use("/api/incidencias", routerIncidencia);
app.use("/api/perfil-usuarios", routerPerfilUsuario);
app.use("/api/pico-y-placa", routerPicoPlaca);
app.use("/api/reporte-incidencias", routerReporteIncidencia);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API de PARQUEADERO - Backend funcionando exitosamente",
    endpoints: {
      //usuarios
      "GET /api/usuarios": "Listar todos los usuarios",
      "GET /api/usuarios/:id": "Obtener un usuario por ID",
      "POST /api/usuarios": "Crear un nuevo usuario",
      "POST /api/usuarios/login": "Iniciar sesion",
      "PUT /api/usuarios/:id": "Actualizar un usuario",
      "DELETE /api/usuarios/:id": "Eliminar un usuario",
      //vehiculos
      "GET /api/vehiculos": "Listar todos los vehiculos",
      "GET /api/vehiculos/:id": "Obtener un vehiculo por ID",
      "POST /api/vehiculos": "Crear un nuevo vehiculo",
      "PUT /api/vehiculos/:id": "Actualizar un vehiculo",
      "DELETE /api/vehiculos/:id": "Eliminar un vehiculo",
      //Celdas
      "GET /api/celdas": "Listar todos los celdas",
      "GET /api/celdas/:id": "Obtener un celda por ID",
      "POST /api/celdas": "Crear un nuevo celda",
      "PUT /api/celdas/:id": "Actualizar un celda",
      "DELETE /api/celdas/:id": "Eliminar un celda",
      //Accesos y Salidas
      "GET /api/accesos-salidas": "Listar todos los acceso y salidas",
      "GET /api/accesos-salidas/:id": "Obtener un acceso o salida por ID",
      "POST /api/accesos-salidas": "Crear un nuevo acceso o salida",
      "PUT /api/accesos-salidas/:id": "Actualizar un acceso o salida",
      "DELETE /api/accesos-salidas/:id": "Eliminar un acceso o salida",
      //Historial de Parqueos
      "GET /api/historial-parqueo": "Listar todos los historiales de parqueo",
      "GET /api/historial-parqueo/celda/:celdaId/vehiculo/:vehiculoId":
        "Obtener un historial de parqueo exacto",
      "POST /api/historial-parqueo": "Crear un nuevo historial de parqueo",
      "DELETE /api/historial-parqueo/celda/:celdaId/vehiculo/:vehiculoId":
        "Eliminar un historial de parqueo",
      //Incidencias
      "GET /api/incidencias": "Listar todas las incidencias",
      "GET /api/incidencias/:id": "Obtener una incidencia por ID",
      "POST /api/incidencias": "Crear una nueva incidencia",
      "PUT /api/incidencias/:id": "Actualizar una incidencia",
      "DELETE /api/incidencias/:id": "Eliminar una incidencia",
      //perfiles de usuario
      "GET /api/perfil-usuarios": "Listar todos los perfiles de usuario",
      "GET /api/perfil-usuarios/:id": "Obtener un perfil de usuario por ID",
      "POST /api/perfil-usuarios": "Crear un nuevo perfil de usuario",
      "PUT /api/perfil-usuarios/:id": "Actualizar un perfil de usuario",
      "DELETE /api/perfil-usuarios/:id": "Eliminar un perfil de usuario",
      //Pico y placa
      "GET /api/pico-y-placa": "Listar todos los pico y placa",
      "GET /api/pico-y-placa/:id": "Obtener un pico y placa por ID",
      "POST /api/pico-y-placa": "Crear un nuevo pico y placa",
      "PUT /api/pico-y-placa/:id": "Actualizar un pico y placa",
      "DELETE /api/pico-y-placa/:id": "Eliminar un pico y placa",
      //Reporte de incidecnias
      "GET /api/reporte-incidencias": "Listar todos los reportes de incidencia",
      "GET /api/reporte-incidencias/vehiculo/:vehiculoId/incidencia/:incidenciaId":
        "Obtener un reporte de incidencia exacto",
      "POST /api/reporte-incidencias": "Crear un nuevo reporte de incidencia",
      "PUT /api/reporte-incidencias/vehiculo/:vehiculoId/incidencia/:incidenciaId":
        "Actualizar un reporte de incidencia",
      "DELETE /api/reporte-incidencias/vehiculo/:vehiculoId/incidencia/:incidenciaId":
        "Eliminar un reporte de incidencia",
    },
  });
});

async function main() {
  try {
    await db.connect();
    app.listen(PORT, () => {
      console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`✓ API disponible en http://localhost:${PORT}/api`);
      console.log(`Presiona Crtl+C para detener el servidor`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

main();

export default app;
