import { restricUserAccess } from "./auth.js";
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

//Selector del container
const celdasContainer = document.getElementById("celdas-container");
//Renderizar celdas
const renderCeldas = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/celdas");
    const data = await response.json();
    if (!data.success || !data.data || data.data.length === 0) {
      celdasContainer.innerHTML = "<p>No hay celdas registradas</p>";
      return;
    }
    celdasContainer.innerHTML = "";
    data.data.forEach((celda) => {
      const estadoClass =
        celda.estado.toLowerCase() === "disponible" ? "disponible" : "ocupado";
      // Generar nombre identificador: tipo + id con padding
      // Ej: "Carro" + "001" → "CARRO001"
      const nombreFormateado =
        celda.tipo.toUpperCase() + String(celda.id).padStart(3, "0");
      const card = document.createElement("div");
      card.className = `celda-card ${estadoClass}`;
      card.innerHTML = `
        <div class="celda-nombre">${nombreFormateado}</div>
        <div class="celda-id">ID: ${celda.id}</div>
        <div class="celda-tipo">Tipo: ${celda.tipo}</div>
        <span class="celda-estado">${celda.estado}</span>
      `;
      card.dataset.celdaId = celda.id;
      card.addEventListener("click", () => {
        mostrarVehiculoEnCelda(card);
      });
      celdasContainer.appendChild(card);
    });
  } catch (error) {
    celdasContainer.innerHTML = "<p>Error al cargar celdas</p>";
    showNotification("Error al obtener celdas de parqueo", "error");
  }
};
renderCeldas();

// ===== CLICK EN CELDA OCUPADA =====
const vehiculoDialog = document.getElementById("vehiculo-dialog");
const closeVehiculoDialog = document.getElementById("close-vehiculo-dialog");
closeVehiculoDialog.addEventListener("click", () => {
  vehiculoDialog.close();
});
const mostrarVehiculoEnCelda = async (celdaElement) => {
  // Verificar si está ocupada
  if (!celdaElement.classList.contains("ocupado")) return;
  // Obtener el ID de la celda del atributo data
  const celdaId = celdaElement.dataset.celdaId;
  // Buscar en sessionStorage qué vehículo ocupa esta celda
  const celdaMap = JSON.parse(sessionStorage.getItem("celdaMap") || "{}");
  const vehicleId = Object.keys(celdaMap).find(
    (key) => celdaMap[key] == celdaId,
  );
  if (!vehicleId) {
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:3000/api/vehiculos/${vehicleId}`,
    );
    const data = await response.json();
    if (!data.success || !data.data) return;
    const v = data.data;
    document.getElementById("vd-placa").textContent = v.placa;
    document.getElementById("vd-tipo").textContent = v.tipo;
    document.getElementById("vd-marca").textContent = v.marca;
    document.getElementById("vd-modelo").textContent = v.modelo;
    document.getElementById("vd-color").textContent = v.color;
    document.getElementById("vd-usuario").textContent = v.usuario;
    vehiculoDialog.showModal();
  } catch (error) {
    console.error("Error:", error);
  }
};
