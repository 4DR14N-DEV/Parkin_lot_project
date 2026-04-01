import { restricUserAccess, showNotification } from "./auth.js";
restricUserAccess();
//Redirect link usuarios
const usersLink = document.getElementById("a-users");
if (usersLink) {
  const user = JSON.parse(sessionStorage.getItem("loguedUser"));
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

// ===== CARGAR CELDAS DISPONIBLES =====
const cargarCeldasDisponibles = async () => {
  const celdaSelect = document.getElementById("celda-entrada");
  try {
    const response = await fetch("http://localhost:3000/api/celdas");
    const data = await response.json();
    if (!data.success || !data.data) return;
    // Limpiar opciones excepto la primera
    celdaSelect.innerHTML = '<option value="">Seleccione una celda</option>';
    // Filtrar solo celdas disponibles
    const disponibles = data.data.filter(
      (c) => c.estado.toLowerCase() === "disponible",
    );
    disponibles.forEach((celda) => {
      const option = document.createElement("option");
      option.value = celda.id;
      option.textContent = `${celda.tipo.toUpperCase()}${String(celda.id).padStart(3, "0")}`;
      celdaSelect.appendChild(option);
    });
    if (disponibles.length === 0) {
      celdaSelect.innerHTML =
        '<option value="">No hay celdas disponibles</option>';
    }
  } catch (error) {
    celdaSelect.innerHTML = '<option value="">Error al cargar celdas</option>';
  }
};
// Cargar al iniciar
cargarCeldasDisponibles();

// ===== TABS =====

const tabEntrada = document.getElementById("tab-entrada");
const tabSalida = document.getElementById("tab-salida");
const panelEntrada = document.getElementById("panel-entrada");
const panelSalida = document.getElementById("panel-salida");

tabEntrada.addEventListener("click", () => {
  tabEntrada.classList.add("active");
  tabSalida.classList.remove("active");
  panelEntrada.classList.add("active");
  panelSalida.classList.remove("active");
});

tabSalida.addEventListener("click", () => {
  tabSalida.classList.add("active");
  tabEntrada.classList.remove("active");
  panelSalida.classList.add("active");
  panelEntrada.classList.remove("active");
});

// ===== AUTO-COMPLETAR FECHA Y HORA =====

const setDateTime = (fechaId, horaId) => {
  const now = new Date();
  const fecha = now.toISOString().split("T")[0];
  const hora = now.toTimeString().slice(0, 5);
  document.getElementById(fechaId).value = fecha;
  document.getElementById(horaId).value = hora;
};

setDateTime("fecha-entrada", "hora-entrada");
setDateTime("fecha-salida", "hora-salida");

// ===== SELECTORES =====

const formEntrada = document.getElementById("form-entrada");
const puertaEntrada = document.getElementById("puerta-entrada");
const placaEntrada = document.getElementById("placa-entrada");
const celdaEntrada = document.getElementById("celda-entrada");

const formSalida = document.getElementById("form-salida");
const puertaSalida = document.getElementById("puerta-salida");
const placaSalida = document.getElementById("placa-salida");

// ===== BUSCAR VEHÍCULO POR PLACA =====
const buscarVehiculoPorPlaca = async (placa) => {
  const response = await fetch("http://localhost:3000/api/vehiculos");
  const data = await response.json();
  if (!data.success || !data.data) return null;
  return data.data.find((v) => v.placa.toUpperCase() === placa.toUpperCase());
};
// ===== VALIDAR PICO Y PLACA =====
const validarPicoPlaca = async (placa, tipoVehiculo) => {
  // Días de la semana en español
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];
  const diaHoy = diasSemana[new Date().getDay()];
  // Fetch restricciones
  const response = await fetch("http://localhost:3000/api/pico-y-placa");
  const data = await response.json();
  if (!data.success || !data.data) return true;
  // Filtrar por día y tipo
  const restricciones = data.data.filter(
    (r) =>
      r.dia.trim() === diaHoy.trim() &&
      r.tipoVehiculo.toLowerCase() === tipoVehiculo.toLowerCase(),
  );
  if (restricciones.length === 0) return true;
  // Obtener dígito según tipo
  let digito;
  if (tipoVehiculo.toLowerCase() === "carro") {
    digito = parseInt(placa.slice(-1)); // Último dígito
  } else {
    digito = parseInt(placa.match(/\d/)[0]); // Primer dígito
  }
  // Verificar si el dígito está restringido
  const estaRestringido = restricciones.some(
    (r) => Number(r.numero) === digito,
  );
  return !estaRestringido;
};

// ===== CALCULAR ESTADÍA =====
const calcularEstadia = async (vehiculoId) => {
  try {
    // Buscar tiempo de entrada guardado en el cliente
    const entryMap = JSON.parse(sessionStorage.getItem("entryMap") || "{}");
    const entryTime = entryMap[vehiculoId];

    if (!entryTime) return 0;

    const ahora = Date.now();
    const diffMs = ahora - entryTime;
    const diffMinutos = Math.max(0, Math.round(diffMs / (1000 * 60)));

    // Limpiar entrada del mapa
    delete entryMap[vehiculoId];
    sessionStorage.setItem("entryMap", JSON.stringify(entryMap));

    return diffMinutos;
  } catch (error) {
    return 0;
  }
};

// ===== ACTUALIZAR ESTADO CELDA =====
const actualizarEstadoCelda = async (celdaId, nuevoEstado) => {
  const response = await fetch(`http://localhost:3000/api/celdas/${celdaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: nuevoEstado }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al actualizar celda");
  }
};

// ===== REGISTRAR ENTRADA =====
formEntrada.addEventListener("submit", async (e) => {
  e.preventDefault();
  const placa = placaEntrada.value.trim();
  const puerta = puertaEntrada.value;
  const celdaId = parseInt(celdaEntrada.value);
  if (!placa || !puerta || !celdaId) {
    showNotification("Complete todos los campos obligatorios", "error");
    return;
  }
  try {
    const vehiculo = await buscarVehiculoPorPlaca(placa);
    if (!vehiculo) {
      showNotification("Vehículo no registrado en el sistema", "error");
      return;
    }
    const permitido = await validarPicoPlaca(placa, vehiculo.tipo);
    if (!permitido) {
      showNotification(
        `Acceso denegado: ${placa} incumple pico y placa hoy`,
        "error",
      );
      return;
    }
    const fechaHora = new Date().toISOString();
    const response = await fetch("http://localhost:3000/api/accesos-salidas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movimiento: "entrada",
        fechaHora: fechaHora,
        puerta: puerta,
        tiempoEstadia: "0",
        vehiculo: vehiculo.id,
      }),
    });
    const data = await response.json();
    if (data.success) {
      // Guardar tiempo de entrada del cliente (Date.now) para calcular estadía
      const entryMap = JSON.parse(sessionStorage.getItem("entryMap") || "{}");
      entryMap[vehiculo.id] = Date.now();
      sessionStorage.setItem("entryMap", JSON.stringify(entryMap));

      try {
        await actualizarEstadoCelda(celdaId, "ocupado");
        // Guardar relación vehículo-celda
        const celdaMap = JSON.parse(sessionStorage.getItem("celdaMap") || "{}");
        celdaMap[vehiculo.id] = celdaId;
        sessionStorage.setItem("celdaMap", JSON.stringify(celdaMap));
      } catch (celdaError) {
        showNotification(
          "Entrada registrada pero no se pudo ocupar la celda",
          "error",
        );
        formEntrada.reset();
        setDateTime("fecha-entrada", "hora-entrada");
        cargarCeldasDisponibles();
        return;
      }
      showNotification("Entrada registrada exitosamente", "success");
      formEntrada.reset();
      setDateTime("fecha-entrada", "hora-entrada");
      cargarCeldasDisponibles();
    } else {
      showNotification(data.message, "error");
    }
  } catch (error) {
    showNotification("Error al registrar entrada", "error");
  }
});

// ===== REGISTRAR SALIDA =====
formSalida.addEventListener("submit", async (e) => {
  e.preventDefault();
  const placa = placaSalida.value.trim();
  const puerta = puertaSalida.value;
  if (!placa || !puerta) {
    showNotification("Complete todos los campos obligatorios", "error");
    return;
  }
  try {
    const vehiculo = await buscarVehiculoPorPlaca(placa);
    if (!vehiculo) {
      showNotification("Vehículo no registrado en el sistema", "error");
      return;
    }
    const estadia = await calcularEstadia(vehiculo.id);
    const fechaHora = new Date().toISOString();
    const response = await fetch("http://localhost:3000/api/accesos-salidas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movimiento: "salida",
        fechaHora: fechaHora,
        puerta: puerta,
        tiempoEstadia: String(estadia),
        vehiculo: vehiculo.id,
      }),
    });
    const data = await response.json();
    if (data.success) {
      // Liberar celda del vehículo
      const celdaMap = JSON.parse(sessionStorage.getItem("celdaMap") || "{}");
      const celdaIdSalida = celdaMap[vehiculo.id];
      if (celdaIdSalida) {
        try {
          await actualizarEstadoCelda(celdaIdSalida, "disponible");
          delete celdaMap[vehiculo.id];
          sessionStorage.setItem("celdaMap", JSON.stringify(celdaMap));
        } catch (celdaError) {
          showNotification(
            "Salida registrada pero no se pudo liberar la celda",
            "error",
          );
          formSalida.reset();
          setDateTime("fecha-salida", "hora-salida");
          cargarCeldasDisponibles();
          return;
        }
      }
      showNotification(
        `Salida registrada. Tiempo de estadía: ${estadia} minutos`,
        "success",
      );
      formSalida.reset();
      setDateTime("fecha-salida", "hora-salida");
      cargarCeldasDisponibles();
    } else {
      showNotification(data.message, "error");
    }
  } catch (error) {
    showNotification("Error al registrar salida", "error");
  }
});
