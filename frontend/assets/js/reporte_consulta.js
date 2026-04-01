import { restricUserAccess, showNotification } from "./auth.js";
restricUserAccess();
// ===== ACCESO SOLO ADMIN =====
const user = JSON.parse(sessionStorage.getItem("loguedUser"));
if (!user || user.perfilUsuario !== 1) {
  window.location.href = "/frontend/views/celdas_parqueo.html";
}
//Redirect link usuarios
const usersLink = document.getElementById("a-users");
if (usersLink) {
  if (user.perfilUsuario === 1 || user.perfilUsuario === 2) {
    usersLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href =
        "/frontend/views/perfil_usuario.html?openDialog=users";
    });
  } else {
    usersLink.addEventListener("click", (e) => {
      e.preventDefault();
      showNotification("No tienes acceso a esta sección", "error");
    });
    usersLink.style.opacity = "0.5";
    usersLink.style.cursor = "not-allowed";
    usersLink.style.pointerEvents = "none";
  }
}

// ===== SIDEBAR =====
const sidebarButtons = document.querySelectorAll(".menu-btn");
let reporteActual = null;
sidebarButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Quitar active de todos
    sidebarButtons.forEach((b) => b.classList.remove("active"));
    // Activar el clickeado
    btn.classList.add("active");
    // Guardar reporte seleccionado
    reporteActual = btn.dataset.report;
    // Limpiar resultado
    resultDiv.innerHTML = "<h3>Selecciona un reporte del menú izquierdo</h3>";
    // Limpiar filtros
    filtroDesde.value = "";
    filtroHasta.value = "";
    filtroBuscar.value = "";
  });
});
// ===== SELECTORES FILTROS =====
const filtroDesde = document.getElementById("from");
const filtroHasta = document.getElementById("to");
const filtroBuscar = document.querySelector(".filters input[type='text']");
const btnGenerar = document.querySelector(".filters button");
const resultDiv = document.getElementById("result");

// ===== GENERAR REPORTE =====
btnGenerar.addEventListener("click", () => {
  if (!reporteActual) {
    showNotification("Selecciona un tipo de reporte del menú", "error");
    return;
  }
  switch (reporteActual) {
    case "usuarios":
      generarReporteUsuarios();
      break;
    case "vehiculos":
      generarReporteVehiculos();
      break;
    case "entradas":
      generarReporteAccesos("entrada");
      break;
    case "salidas":
      generarReporteAccesos("salida");
      break;
    case "incidencias":
      generarReporteIncidencias();
      break;
    case "pico":
      generarReportePicoPlaca();
      break;
    case "topceldas":
      generarReporteCeldas();
      break;
    case "ocupacion":
      generarReporteCeldasOcupadas();
      break;
    case "topvehiculos":
      generarReporteVehiculosFrecuentes();
      break;
    case "horas":
      generarReporteHorasPico();
      break;
    default:
      showNotification("Reporte no implementado aún", "error");
  }
});

// ===== REPORTE USUARIOS =====
const generarReporteUsuarios = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/usuarios");
    const data = await response.json();
    if (!data.success || !data.data || data.data.length === 0) {
      resultDiv.innerHTML = "<p>No hay usuarios registrados</p>";
      return;
    }
    let usuarios = data.data;
    // Filtrar por búsqueda (ID)
    const busqueda = filtroBuscar.value.trim();
    if (busqueda) {
      usuarios = usuarios.filter(
        (u) =>
          String(u.id) === busqueda || String(u.numeroDocumento) === busqueda,
      );
    }
    if (usuarios.length === 0) {
      resultDiv.innerHTML =
        "<p>No se encontraron usuarios con ese criterio</p>";
      return;
    }
    // Renderizar tabla
    let tableHTML = `<h3>Reporte de Usuarios registrados (${usuarios.length} registros)</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Documento</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Celular</th>
            <th>Estado</th>
            <th>Perfil</th>
          </tr>
        </thead>
        <tbody>`;
    usuarios.forEach((u) => {
      const nombre = `${u.primerNombre}${u.segundoNombre ? " " + u.segundoNombre : ""} ${u.primerApellido}${u.segundoApellido ? " " + u.segundoApellido : ""}`;
      const perfil =
        u.perfilUsuario === 1
          ? "Admin"
          : u.perfilUsuario === 2
            ? "Operario"
            : "Usuario";
      tableHTML += `
        <tr>
          <td>${u.id}</td>
          <td>${u.tipoDocumento} ${u.numeroDocumento}</td>
          <td>${nombre}</td>
          <td>${u.direccionCorreo || "-"}</td>
          <td>${u.numeroCelular || "-"}</td>
          <td>${u.estado}</td>
          <td>${perfil}</td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    resultDiv.innerHTML = tableHTML;
  } catch (error) {
    resultDiv.innerHTML = "<p>Error al generar reporte</p>";
  }
};

// ===== REPORTE VEHÍCULOS =====
const generarReporteVehiculos = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/vehiculos");
    const data = await response.json();
    if (!data.success || !data.data || data.data.length === 0) {
      resultDiv.innerHTML = "<p>No hay vehículos registrados</p>";
      return;
    }
    let vehiculos = data.data;
    // Filtrar por búsqueda (ID o placa)
    const busqueda = filtroBuscar.value.trim().toUpperCase();
    if (busqueda) {
      vehiculos = vehiculos.filter(
        (v) =>
          String(v.id) === busqueda || v.placa.toUpperCase().includes(busqueda),
      );
    }
    if (vehiculos.length === 0) {
      resultDiv.innerHTML =
        "<p>No se encontraron vehículos con ese criterio</p>";
      return;
    }
    // Renderizar tabla
    let tableHTML = `<h3>Reporte de Vehículos registrados (${vehiculos.length} registros)</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Placa</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Color</th>
            <th>ID Usuario</th>
          </tr>
        </thead>
        <tbody>`;
    vehiculos.forEach((v) => {
      tableHTML += `
        <tr>
          <td>${v.id}</td>
          <td>${v.placa}</td>
          <td>${v.tipo}</td>
          <td>${v.marca}</td>
          <td>${v.modelo}</td>
          <td>${v.color}</td>
          <td>${v.usuario}</td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    resultDiv.innerHTML = tableHTML;
  } catch (error) {
    resultDiv.innerHTML = "<p>Error al generar reporte</p>";
  }
};

// ===== REPORTE ENTRADAS / SALIDAS =====
const generarReporteAccesos = async (tipo) => {
  try {
    const response = await fetch("http://localhost:3000/api/accesos-salidas");
    const data = await response.json();
    if (!data.success || !data.data || data.data.length === 0) {
      resultDiv.innerHTML = `<p>No hay registros de ${tipo}</p>`;
      return;
    }
    let registros = data.data.filter(
      (r) => r.movimiento.toLowerCase() === tipo,
    );
    // Filtrar por fecha
    const desde = filtroDesde.value;
    const hasta = filtroHasta.value;
    if (desde) {
      registros = registros.filter((r) => r.fechaHora >= desde);
    }
    if (hasta) {
      registros = registros.filter((r) => r.fechaHora <= hasta + "T23:59:59");
    }
    // Filtrar por búsqueda (ID vehículo)
    const busqueda = filtroBuscar.value.trim();
    if (busqueda) {
      registros = registros.filter((r) => String(r.vehiculo) === busqueda);
    }
    if (registros.length === 0) {
      resultDiv.innerHTML = `<p>No se encontraron ${tipo}s con esos criterios</p>`;
      return;
    }
    // Renderizar tabla
    const titulo = tipo === "entrada" ? "Entradas" : "Salidas";
    let tableHTML = `<h3>Reporte de ${titulo} (${registros.length} registros)</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Movimiento</th>
            <th>Fecha y Hora</th>
            <th>Puerta</th>
            <th>Tiempo Estadía (min)</th>
            <th>ID Vehículo</th>
          </tr>
        </thead>
        <tbody>`;
    registros.forEach((r) => {
      // Formatear fecha legible
      const fecha = new Date(r.fechaHora).toLocaleString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      tableHTML += `
        <tr>
          <td>${r.id}</td>
          <td>${r.movimiento}</td>
          <td>${fecha}</td>
          <td>${r.puerta}</td>
          <td>${r.tiempoEstadia || "-"}</td>
          <td>${r.vehiculo}</td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    resultDiv.innerHTML = tableHTML;
  } catch (error) {
    resultDiv.innerHTML = "<p>Error al generar reporte</p>";
  }
};

// ===== REPORTE INCIDENCIAS =====
const generarReporteIncidencias = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/reporte-incidencias",
    );
    const data = await response.json();
    if (!data.success || !data.data || data.data.length === 0) {
      resultDiv.innerHTML = "<p>No hay reportes de incidencias</p>";
      return;
    }
    let registros = data.data;
    // Filtrar por fecha
    const desde = filtroDesde.value;
    const hasta = filtroHasta.value;
    if (desde) {
      registros = registros.filter((r) => r.fechaHora >= desde);
    }
    if (hasta) {
      registros = registros.filter((r) => r.fechaHora <= hasta + "T23:59:59");
    }
    // Filtrar por búsqueda (ID vehículo)
    const busqueda = filtroBuscar.value.trim();
    if (busqueda) {
      registros = registros.filter((r) => String(r.vehiculo) === busqueda);
    }
    if (registros.length === 0) {
      resultDiv.innerHTML =
        "<p>No se encontraron incidencias con esos criterios</p>";
      return;
    }
    // Renderizar tabla
    let tableHTML = `<h3>Reporte de Incidencias (${registros.length} registros)</h3>
      <table>
        <thead>
          <tr>
            <th>ID Vehículo</th>
            <th>ID Incidencia</th>
            <th>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>`;
    registros.forEach((r) => {
      const fecha = r.fechaHora
        ? new Date(r.fechaHora).toLocaleString("es-CO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-";
      tableHTML += `
        <tr>
          <td>${r.vehiculo}</td>
          <td>${r.incidencia}</td>
          <td>${fecha}</td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    resultDiv.innerHTML = tableHTML;
  } catch (error) {
    resultDiv.innerHTML = "<p>Error al generar reporte</p>";
  }
};

// ===== REPORTE PICO Y PLACA =====
const generarReportePicoPlaca = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/pico-y-placa");
    const data = await response.json();
    if (!data.success || !data.data || data.data.length === 0) {
      resultDiv.innerHTML = "<p>No hay restricciones de pico y placa</p>";
      return;
    }
    let registros = data.data;
    // Filtrar por búsqueda (día o tipo de vehículo)
    const busqueda = filtroBuscar.value.trim().toLowerCase();
    if (busqueda) {
      registros = registros.filter(
        (r) =>
          r.dia.toLowerCase().includes(busqueda) ||
          r.tipoVehiculo.toLowerCase().includes(busqueda),
      );
    }
    if (registros.length === 0) {
      resultDiv.innerHTML =
        "<p>No se encontraron restricciones con ese criterio</p>";
      return;
    }
    // Agrupar por día
    const porDia = {};
    registros.forEach((r) => {
      if (!porDia[r.dia]) porDia[r.dia] = [];
      porDia[r.dia].push(r);
    });
    // Renderizar tabla
    let tableHTML = `<h3>Reporte Pico y Placa (${registros.length} restricciones)</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Día</th>
            <th>Tipo Vehículo</th>
            <th>Dígito Restringido</th>
          </tr>
        </thead>
        <tbody>`;
    registros.forEach((r) => {
      tableHTML += `
        <tr>
          <td>${r.id}</td>
          <td>${r.dia}</td>
          <td>${r.tipoVehiculo}</td>
          <td>${r.numero}</td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    resultDiv.innerHTML = tableHTML;
  } catch (error) {
    resultDiv.innerHTML = "<p>Error al generar reporte</p>";
  }
};

// ===== REPORTE CELDAS =====
const generarReporteCeldas = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/celdas");
    const data = await response.json();
    if (!data.success || !data.data || data.data.length === 0) {
      resultDiv.innerHTML = "<p>No hay celdas registradas</p>";
      return;
    }
    let celdas = data.data;
    // Filtrar por búsqueda (tipo o estado)
    const busqueda = filtroBuscar.value.trim().toLowerCase();
    if (busqueda) {
      celdas = celdas.filter(
        (c) =>
          c.tipo.toLowerCase().includes(busqueda) ||
          c.estado.toLowerCase().includes(busqueda),
      );
    }
    if (celdas.length === 0) {
      resultDiv.innerHTML = "<p>No se encontraron celdas con ese criterio</p>";
      return;
    }
    // Contar por estado
    const totalDisponibles = celdas.filter(
      (c) => c.estado.toLowerCase() === "disponible",
    ).length;
    const totalOcupadas = celdas.filter(
      (c) => c.estado.toLowerCase() === "ocupado",
    ).length;
    // Contar por tipo
    const porTipo = {};
    celdas.forEach((c) => {
      if (!porTipo[c.tipo])
        porTipo[c.tipo] = { total: 0, disponibles: 0, ocupadas: 0 };
      porTipo[c.tipo].total++;
      if (c.estado.toLowerCase() === "disponible")
        porTipo[c.tipo].disponibles++;
      else porTipo[c.tipo].ocupadas++;
    });
    // Renderizar resumen + tabla
    let tableHTML = `<h3>Reporte de Celdas (${celdas.length} celdas)</h3>
      <div class="cards">
        <div class="card"><p>Disponibles</p><h2>${totalDisponibles}</h2></div>
        <div class="card"><p>Ocupadas</p><h2>${totalOcupadas}</h2></div>
        <div class="card"><p>Total</p><h2>${celdas.length}</h2></div>
      </div>`;
    // Resumen por tipo
    tableHTML += `<table style="margin-top: 1rem;">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Total</th>
          <th>Disponibles</th>
          <th>Ocupadas</th>
        </tr>
      </thead>
      <tbody>`;
    Object.keys(porTipo).forEach((tipo) => {
      tableHTML += `
        <tr>
          <td>${tipo}</td>
          <td>${porTipo[tipo].total}</td>
          <td>${porTipo[tipo].disponibles}</td>
          <td>${porTipo[tipo].ocupadas}</td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    // Tabla detalle
    tableHTML += `<table style="margin-top: 1rem;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>`;
    celdas.forEach((c) => {
      const nombre = `${c.tipo.toUpperCase()}${String(c.id).padStart(3, "0")}`;
      tableHTML += `
        <tr>
          <td>${c.id}</td>
          <td>${nombre}</td>
          <td>${c.tipo}</td>
          <td>${c.estado}</td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    resultDiv.innerHTML = tableHTML;
  } catch (error) {
    resultDiv.innerHTML = "<p>Error al generar reporte</p>";
  }
};

// ===== REPORTE CELDAS OCUPADAS =====
const generarReporteCeldasOcupadas = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/celdas");
    const data = await response.json();
    if (!data.success || !data.data) {
      resultDiv.innerHTML = "<p>Error al obtener celdas</p>";
      return;
    }
    // Filtrar solo ocupadas
    const celdasOcupadas = data.data.filter(
      (c) => c.estado.toLowerCase() === "ocupado",
    );
    if (celdasOcupadas.length === 0) {
      resultDiv.innerHTML = "<p>No hay celdas ocupadas actualmente</p>";
      return;
    }
    // Contar por tipo
    const porTipo = {};
    celdasOcupadas.forEach((c) => {
      if (!porTipo[c.tipo]) porTipo[c.tipo] = 0;
      porTipo[c.tipo]++;
    });
    // Renderizar resumen + tabla
    let tableHTML = `<h3>Celdas Ocupadas (${celdasOcupadas.length} de ${data.data.length})</h3>
      <div class="cards">`;
    Object.keys(porTipo).forEach((tipo) => {
      tableHTML += `<div class="card"><p>${tipo}</p><h2>${porTipo[tipo]}</h2></div>`;
    });
    tableHTML += `</div>
      <table style="margin-top: 1rem;">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>`;
    celdasOcupadas.forEach((c) => {
      const nombre = `${c.tipo.toUpperCase()}${String(c.id).padStart(3, "0")}`;
      tableHTML += `
        <tr>
          <td>${c.id}</td>
          <td>${nombre}</td>
          <td>${c.tipo}</td>
          <td>${c.estado}</td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    resultDiv.innerHTML = tableHTML;
  } catch (error) {
    resultDiv.innerHTML = "<p>Error al generar reporte</p>";
  }
};

// ===== REPORTE VEHÍCULOS FRECUENTES =====
const generarReporteVehiculosFrecuentes = async () => {
  try {
    // Fetch accesos y vehículos en paralelo
    const [accesosRes, vehiculosRes] = await Promise.all([
      fetch("http://localhost:3000/api/accesos-salidas"),
      fetch("http://localhost:3000/api/vehiculos"),
    ]);
    const accesosData = await accesosRes.json();
    const vehiculosData = await vehiculosRes.json();
    if (
      !accesosData.success ||
      !accesosData.data ||
      accesosData.data.length === 0
    ) {
      resultDiv.innerHTML = "<p>No hay registros de accesos</p>";
      return;
    }
    // Contar accesos por vehículo
    const conteo = {};
    accesosData.data.forEach((r) => {
      if (!conteo[r.vehiculo]) conteo[r.vehiculo] = 0;
      conteo[r.vehiculo]++;
    });
    // Crear mapa de vehículos para datos
    const vehiculosMap = {};
    if (vehiculosData.success && vehiculosData.data) {
      vehiculosData.data.forEach((v) => {
        vehiculosMap[v.id] = v;
      });
    }
    // Ordenar por frecuencia descendente
    const ranking = Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .map(([id, cantidad]) => ({
        id: Number(id),
        cantidad,
        vehiculo: vehiculosMap[id] || null,
      }));
    // Filtrar por búsqueda
    const busqueda = filtroBuscar.value.trim().toUpperCase();
    let resultados = ranking;
    if (busqueda) {
      resultados = ranking.filter(
        (r) =>
          String(r.id) === busqueda ||
          (r.vehiculo && r.vehiculo.placa.toUpperCase().includes(busqueda)),
      );
    }
    if (resultados.length === 0) {
      resultDiv.innerHTML =
        "<p>No se encontraron vehículos con ese criterio</p>";
      return;
    }
    // Renderizar
    let tableHTML = `<h3>Vehículos Frecuentes (${resultados.length} vehículos)</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>ID Vehículo</th>
            <th>Placa</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Total Accesos</th>
          </tr>
        </thead>
        <tbody>`;
    resultados.forEach((r, index) => {
      tableHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${r.id}</td>
          <td>${r.vehiculo ? r.vehiculo.placa : "-"}</td>
          <td>${r.vehiculo ? r.vehiculo.tipo : "-"}</td>
          <td>${r.vehiculo ? r.vehiculo.marca : "-"}</td>
          <td>${r.cantidad}</td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    resultDiv.innerHTML = tableHTML;
  } catch (error) {
    resultDiv.innerHTML = "<p>Error al generar reporte</p>";
  }
};

// ===== REPORTE HORAS PICO =====
const generarReporteHorasPico = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/accesos-salidas");
    const data = await response.json();
    if (!data.success || !data.data || data.data.length === 0) {
      resultDiv.innerHTML = "<p>No hay registros de accesos</p>";
      return;
    }
    let registros = data.data;
    // Filtrar por fecha si hay filtro
    const desde = filtroDesde.value;
    const hasta = filtroHasta.value;
    if (desde) {
      registros = registros.filter((r) => r.fechaHora >= desde);
    }
    if (hasta) {
      registros = registros.filter((r) => r.fechaHora <= hasta + "T23:59:59");
    }
    // Contar por hora
    const porHora = {};
    for (let i = 0; i < 24; i++) {
      porHora[i] = { entradas: 0, salidas: 0, total: 0 };
    }
    registros.forEach((r) => {
      const fecha = new Date(r.fechaHora);
      const hora = fecha.getHours();
      if (r.movimiento.toLowerCase() === "entrada") {
        porHora[hora].entradas++;
      } else {
        porHora[hora].salidas++;
      }
      porHora[hora].total++;
    });
    // Ordenar por total descendente para ver las más concurridas primero
    const ranking = Object.entries(porHora)
      .map(([hora, datos]) => ({
        hora: Number(hora),
        ...datos,
      }))
      .sort((a, b) => b.total - a.total);
    // Encontrar la hora más concurrida
    const horaPico = ranking[0];
    // Renderizar
    let tableHTML = `<h3>Horas Pico (${registros.length} movimientos analizados)</h3>
      <div class="cards">
        <div class="card"><p>Hora más concurrida</p><h2>${String(horaPico.hora).padStart(2, "0")}:00</h2></div>
        <div class="card"><p>Total movimientos</p><h2>${horaPico.total}</h2></div>
      </div>
      <table style="margin-top: 1rem;">
        <thead>
          <tr>
            <th>Hora</th>
            <th>Entradas</th>
            <th>Salidas</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>`;
    ranking.forEach((r) => {
      const horaFormateada = `${String(r.hora).padStart(2, "0")}:00`;
      tableHTML += `
        <tr>
          <td>${horaFormateada}</td>
          <td>${r.entradas}</td>
          <td>${r.salidas}</td>
          <td>${r.total}</td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    resultDiv.innerHTML = tableHTML;
  } catch (error) {
    resultDiv.innerHTML = "<p>Error al generar reporte</p>";
  }
};
