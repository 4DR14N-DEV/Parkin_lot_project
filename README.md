# 🚗 Parking Lot Management System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

## 📋 Descripción

Sistema completo de gestión de parqueaderos con arquitectura **Full-Stack**, que permite administrar vehículos, usuarios, celdas de parqueo, incidencias, pico y placa, accesos y reportes. El sistema soporta autenticación por roles (Administrador, Operario, Usuario) con validación diferenciada de credenciales.

---

## 🏗️ Arquitectura

```
Parkin_lot_project/
├── 🖥️  backend/                    # API REST (Node.js + Express)
│   ├── app.js                      # Punto de entrada del servidor
│   ├── config/                     # Configuración de BD y variables de entorno
│   ├── models/                     # Modelos de datos (clases con encapsulación)
│   ├── services/                   # Lógica de negocio y acceso a datos
│   ├── routes/                     # Definición de endpoints REST
│   └── test/                       # Pruebas unitarias (Jest)
│
├── 🌐 frontend/                    # Interfaz de usuario (Vanilla JS)
│   ├── assets/
│   │   ├── css/                    # Estilos por vista (@media query desktop)
│   │   ├── js/                     # Lógica del cliente (ES Modules)
│   │   ├── images/                 # Recursos gráficos
│   │   └── fonts/                  # Tipografías (Poppins)
│   └── views/                      # Páginas HTML
│
├── .env                            # Variables de entorno (no tracked)
├── .gitignore                      # Archivos excluidos de Git
└── README.md                       # Documentación del proyecto
```

---

## 🚀 Características

### Backend

- **API RESTful** con Express.js
- **Base de datos MySQL** con mysql2 y pool de conexiones
- **Modelos con encapsulación** (clases con getters/setters y campos privados)
- **Autenticación por roles** con bcrypt (hashing de contraseñas)
- **Validación de credenciales** diferenciada por perfil:
  - Administrador/Operario: documento + contraseña
  - Usuario: solo documento
- **Documentación automática** con Swagger/OpenAPI
- **Pruebas unitarias** con Jest (modelos y servicios)
- **CORS configurado** para desarrollo local

### Frontend

- **10 vistas completas** con navegación consistente
- **Patrón de diseño unificado**: header, nav, footer, notificaciones
- **Notificaciones personalizadas** (slide-in, auto-dismiss)
- **Manejo de sesión** con sessionStorage
- **Control de acceso por roles**: cada vista protegida según perfil de usuario
- **Módulos ES6** con imports/exports
- **Renderizado dinámico del DOM** con Fetch API

---

## 🔌 Endpoints de la API

### Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/usuarios/login` | Iniciar sesión |
| `GET` | `/api/usuarios` | Listar todos los usuarios |
| `GET` | `/api/usuarios/:id` | Obtener usuario por ID |
| `GET` | `/api/usuarios/perfil` | Obtener perfil del usuario |
| `POST` | `/api/usuarios` | Crear nuevo usuario |
| `PUT` | `/api/usuarios/:id` | Actualizar usuario |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario |

### Vehículos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/vehiculos` | Listar vehículos |
| `GET` | `/api/vehiculos/:id` | Obtener vehículo por ID |
| `GET` | `/api/vehiculos/usuario/:usuarioId` | Vehículos de un usuario |
| `POST` | `/api/vehiculos` | Registrar vehículo |
| `PUT` | `/api/vehiculos/:id` | Actualizar vehículo |
| `DELETE` | `/api/vehiculos/:id` | Eliminar vehículo |

### Celdas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/celdas` | Listar celdas |
| `GET` | `/api/celdas/:id` | Obtener celda por ID |
| `POST` | `/api/celdas` | Crear celda |
| `PUT` | `/api/celdas/:id` | Actualizar celda |
| `DELETE` | `/api/celdas/:id` | Eliminar celda |

### Accesos y Salidas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/accesos-salidas` | Listar todos los movimientos |
| `GET` | `/api/accesos-salidas/:id` | Obtener movimiento por ID |
| `POST` | `/api/accesos-salidas` | Registrar entrada/salida |
| `PUT` | `/api/accesos-salidas/:id` | Actualizar movimiento |
| `DELETE` | `/api/accesos-salidas/:id` | Eliminar movimiento |

### Incidencias

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/incidencias` | Listar tipos de incidencia |
| `GET` | `/api/incidencias/:id` | Obtener incidencia por ID |
| `POST` | `/api/incidencias` | Crear tipo de incidencia |
| `PUT` | `/api/incidencias/:id` | Actualizar incidencia |
| `DELETE` | `/api/incidencias/:id` | Eliminar incidencia |

### Reportes de Incidencia

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/reporte-incidencias` | Listar reportes |
| `GET` | `/api/reporte-incidencias/vehiculo/:vId/incidencia/:iId` | Obtener por clave compuesta |
| `POST` | `/api/reporte-incidencias` | Crear reporte |
| `PUT` | `/api/reporte-incidencias/vehiculo/:vId/incidencia/:iId` | Actualizar reporte |
| `DELETE` | `/api/reporte-incidencias/vehiculo/:vId/incidencia/:iId` | Eliminar reporte |

### Pico y Placa

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/pico-y-placa` | Listar restricciones |
| `GET` | `/api/pico-y-placa/:id` | Obtener restricción por ID |
| `POST` | `/api/pico-y-placa` | Crear restricción |
| `PUT` | `/api/pico-y-placa/:id` | Actualizar restricción |
| `DELETE` | `/api/pico-y-placa/:id` | Eliminar restricción |

> 📖 Documentación interactiva disponible en: `http://localhost:3000/api-docs`

---

## 🛠️ Tecnologías

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | >= 18 | Runtime de JavaScript |
| Express | ^5.2.1 | Framework web |
| MySQL2 | ^3.20.0 | Conector de base de datos |
| Bcrypt | ^6.0.0 | Hashing de contraseñas |
| Swagger | ^6.2.8 | Documentación de API |
| Jest | ^30.3.0 | Framework de testing |
| Nodemon | ^3.1.14 | Desarrollo (auto-reload) |

### Frontend

| Tecnología | Propósito |
|------------|-----------|
| HTML5 | Estructura semántica |
| CSS3 | Estilos y layouts (Grid/Flexbox) |
| JavaScript (ES Modules) | Lógica del cliente |
| Fetch API | Comunicación con backend REST |
| sessionStorage | Estado de sesión y datos temporales |

---

## ⚙️ Instalación y configuración

### Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- [MySQL](https://www.mysql.com/) >= 8.0
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) con extensión Live Server (para el frontend)

### Pasos

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/4DR14N-DEV/Parkin_lot_project.git
   cd Parkin_lot_project
   ```

2. **Configurar el backend**

   ```bash
   cd backend
   npm install
   ```

3. **Configurar la base de datos**
   - Crear la base de datos `ParkingLot` en MySQL
   - Ejecutar el script SQL:

     ```bash
     mysql -u root -p ParkingLot < backend/config/parkingLot.sql
     ```

4. **Configurar variables de entorno**
   Crear archivo `.env` en la raíz del proyecto:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=ParkingLot
   ```

5. **Iniciar el backend**

   ```bash
   cd backend
   npm start
   ```

   El servidor estará disponible en: `http://localhost:3000`

6. **Iniciar el frontend**

   ```bash
   cd frontend
   # Abrir index.html con Live Server (VS Code)
   # El frontend se sirve en: http://localhost:5500
   ```

---

## 🔐 Sistema de autenticación

### Roles de usuario

| Rol | Perfil ID | Login requiere | Acceso |
|-----|-----------|----------------|--------|
| Administrador | 1 | Documento + Contraseña | Todas las vistas + gestión de usuarios |
| Operario | 2 | Documento + Contraseña | Todas las vistas excepto reportes |
| Usuario | 3 | Solo Documento | Solo perfil de usuario |

### Flujo de autenticación

1. El usuario ingresa credenciales según su rol
2. El backend valida contra la BD (bcrypt para admin/operario)
3. Los datos del usuario se guardan en `sessionStorage`
4. Cada vista verifica la sesión al cargar (`restricUserAccess()`)
5. El link "Usuarios" en el nav redirige a `perfil_usuario.html?openDialog=users`

---

## 🧪 Testing

```bash
cd backend

# Ejecutar todas las pruebas
npm test

# Ejecutar con cobertura
npm run test:coverage

# Ejecutar solo modelos
npm run test:models

# Ejecutar solo servicios
npm run test:services

# Ejecutar en modo watch
npm run test:watch
```

---

## 📸 Vistas de la aplicación

| Vista | Archivo | Descripción |
|-------|---------|-------------|
| Login | `index.html` | Autenticación por roles con validación diferenciada |
| Perfil Usuario | `perfil_usuario.html` | Datos del usuario, vehículos asociados, gestión de usuarios (admin) |
| Registro Usuario | `registro_usuario.html` | Crear nuevos usuarios con validación de campos |
| Registro Vehículo | `registro_vehiculo.html` | CRUD de vehículos con búsqueda de usuario por ID |
| Celdas de Parqueo | `celdas_parqueo.html` | Grid visual de celdas con estado (disponible/ocupado), click para ver vehículo |
| Accesos | `acceso.html` | Registro de entrada/salida con validación pico y placa, cálculo de estadía |
| Incidencias | `registro_incidencias.html` | CRUD de tipos de incidencia + reportar incidencias |
| Pico y Placa | `pico_placa.html` | CRUD de restricciones por día y tipo de vehículo |
| Reportes | `reporte_consulta.html` | 10 tipos de reporte con filtros y exportación a PDF |

### Reportes disponibles

| Reporte | Fuente de datos | Filtros |
|---------|-----------------|---------|
| Usuarios | `GET /api/usuarios` | Búsqueda por ID o documento |
| Vehículos | `GET /api/vehiculos` | Búsqueda por ID o placa |
| Entradas | `GET /api/accesos-salidas` | Fecha, ID vehículo |
| Salidas | `GET /api/accesos-salidas` | Fecha, ID vehículo |
| Incidencias | `GET /api/reporte-incidencias` | Fecha, ID vehículo |
| Pico y Placa | `GET /api/pico-y-placa` | Búsqueda por día o tipo |
| Celdas Ocupadas | `GET /api/celdas` | - |
| Estado de Celdas | `GET /api/celdas` | Búsqueda por tipo o estado |
| Vehículos Frecuentes | `GET /api/accesos-salidas` + `/api/vehiculos` | Búsqueda por placa |
| Horas Pico | `GET /api/accesos-salidas` | Fecha |

---

## 📊 Estado del proyecto

### ✅ Completado

- Backend completo con API RESTful, autenticación por roles y documentación Swagger
- Todas las vistas del frontend implementadas con lógica del cliente
- Login funcional con validación diferenciada por perfil
- CRUD completo: usuarios, vehículos, celdas, incidencias, pico y placa
- Registro de accesos con validación de pico y placa y cálculo de tiempo de estadía
- Gestión de celdas de parqueo con estado dinámico (disponible/ocupado)
- Sistema de reportes con 10 tipos, filtros y exportación a PDF
- Control de acceso por roles en todas las vistas
- Patrón de diseño consistente: header, nav, footer, notificaciones
- Redirect de usuarios con `?openDialog=users` para centralizar la gestión

### 🔧 Pendiente

- **Responsive design**: agregar `@media queries` para tablets y móviles

### 📋 Mejoras futuras

- Implementar autenticación JWT para sesiones persistentes
- Agregar middleware de validación en rutas del backend
- Implementar paginación en endpoints de listado
- Rate limiting para protección contra abuso de API

---

## 🤝 Autores

| Nombre | GitHub | Rol |
|--------|--------|-----|
| **Adrian Yesid Restrepo** | [@4DR14N-DEV](https://github.com/4DR14N-DEV) | Desarrollo Full-Stack |
| **Oscar David Gamboa** | [@Oskardmt009](https://github.com/Oskardmt009) | Desarrollo Full-Stack |
| **Johan Andrey Forero** | [@Johanfor](https://github.com/Johanfor) | Desarrollo Full-Stack |

---

## 📄 Licencia

Este proyecto está licenciado bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

> **Nota**: Este proyecto fue desarrollado como proyecto académico. Para producción, se recomienda implementar autenticación JWT, rate limiting, y validaciones adicionales de seguridad.
