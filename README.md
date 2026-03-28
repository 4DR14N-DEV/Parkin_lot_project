# 🚗 Parking Lot Management System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

## 📋 Descripción

Sistema completo de gestión de parqueaderos con arquitectura **Full-Stack**, que permite administrar vehículos, usuarios, celdas de parqueo, incidencias, pico y placa, y reportes. El sistema soporta autenticación por roles (Administrador, Operario, Usuario) con validación diferenciada de credenciales.

---

## 🏗️ Arquitectura

```
Parkin_lot_project/
├── 🖥️  backend/                    # API REST (Node.js + Express)
│   ├── app.js                      # Punto de entrada del servidor
│   ├── config/                     # Configuración de BD y variables
│   ├── models/                     # Modelos de datos (clases)
│   ├── services/                   # Lógica de negocio
│   ├── routes/                     # Rutas de la API
│   └── test/                       # Pruebas unitarias (Jest)
│
├── 🌐 frontend/                    # Interfaz de usuario
│   ├── assets/
│   │   ├── css/                    # Estilos por vista
│   │   ├── js/                     # Lógica del cliente
│   │   ├── images/                 # Recursos gráficos
│   │   └── fonts/                  # Tipografías personalizadas
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
- **Base de datos MySQL** con mysql2
- **Autenticación por roles** con bcrypt (hashing de contraseñas)
- **Validación de credenciales** diferenciada por perfil:
  - Administrador/Operario: documento + contraseña
  - Usuario: solo documento
- **Documentación automática** con Swagger/OpenAPI
- **Pruebas unitarias** con Jest (modelos y servicios)
- **CORS configurado** para desarrollo local

### Frontend

- **9 vistas completas** con navegación intuitiva
- **Responsive design** con CSS Grid/Flexbox
- **Notificaciones personalizadas** (reemplazo de alert nativos)
- **Validación de formularios** en el cliente
- **Manejo de sesión** con sessionStorage
- **Dinamismo**: mostrar/ocultar campos según rol

---

## 🔌 Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/usuarios/login` | Iniciar sesión |
| `GET` | `/api/usuarios` | Listar todos los usuarios |
| `GET` | `/api/usuarios/:id` | Obtener usuario por ID |
| `POST` | `/api/usuarios` | Crear nuevo usuario |
| `PUT` | `/api/usuarios/:id` | Actualizar usuario |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario |
| `GET` | `/api/vehiculos` | Listar vehículos |
| `GET` | `/api/celdas` | Listar celdas |
| `GET` | `/api/accesos-salidas` | Historial de accesos |
| `GET` | `/api/historial-parqueo` | Historial de parqueo |
| `GET` | `/api/incidencias` | Listar incidencias |
| `GET` | `/api/pico-y-placa` | Consultar pico y placa |
| `GET` | `/api/reporte-incidencias` | Reportes de incidencia |

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
| JavaScript (Vanilla) | Lógica del cliente |
| Fetch API | Comunicación con backend |

---

## ⚙️ Instalación y configuración

### Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- [MySQL](https://www.mysql.com/) >= 8.0
- [Git](https://git-scm.com/)

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

5. **Iniciar el servidor**

   ```bash
   cd backend
   npm start
   ```

   El servidor estará disponible en: `http://localhost:3000`

6. **Acceder al frontend**

   ```bash
   cd ../frontend
   # Abrir index.html con Live Server (VS Code)
   # O usar cualquier servidor HTTP local
   ```

---

## 🔐 Sistema de autenticación

### Roles de usuario

| Rol | Perfil ID | Login requiere |
|-----|-----------|----------------|
| Administrador | 1 | Documento + Contraseña |
| Operario | 2 | Documento + Contraseña |
| Usuario | 3 | Solo Documento |

### Ejemplo de login (Frontend)

```javascript
// Para administrador/operario
const response = await fetch("http://localhost:3000/api/usuarios/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    numeroDocumento: "8947676234",
    clave: "tu_contraseña",
    perfilUsuario: 1  // 1=admin, 2=operario
  })
});

// Para usuario
const response = await fetch("http://localhost:3000/api/usuarios/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    numeroDocumento: "651684841",
    clave: null,
    perfilUsuario: 3
  })
});
```

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

| Vista | Descripción |
|-------|-------------|
| Login | Autenticación por roles |
| Registro Usuario | Crear nuevo usuario |
| Registro Vehículo | Registrar vehículo |
| Celdas Parqueo | Estado de celdas |
| Acceso/Salida | Control de entradas/salidas |
| Incidencias | Reportar incidencias |
| Pico y Placa | Consultar restricciones |
| Perfil Usuario | Datos del usuario |
| Reporte Consulta | Generar reportes |

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

## 🙏 Agradecimientos

- Comunidad de Node.js y Express
- Documentación oficial de MySQL
- Swagger para documentación de APIs

---

> **Nota**: Este proyecto fue desarrollado como proyecto académico. Para producción, se recomienda implementar autenticación JWT, rate limiting, y validaciones adicionales de seguridad.
