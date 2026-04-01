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
//Selectores
const tipoVehiculo = document.getElementById("tipo-vehiculo");
const dia = document.getElementById("dia");
const numero = document.getElementById("numero");
const formPicoPlaca = document.getElementById("form-pico-placa");
const restriccionesContainer = document.getElementById(
  "restricciones-container",
);
//Listar restricciones
const renderRestricciones = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/pico-y-placa");
    const data = await response.json();
    if (!data.success || !data.data || data.data.length === 0) {
      restriccionesContainer.innerHTML =
        "<p>No hay restricciones registradas</p>";
      return;
    }
    let tableHTML = `<table>
      <thead>
        <tr>
          <th>Tipo Vehículo</th>
          <th>Día</th>
          <th>Dígito</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>`;
    data.data.forEach((r) => {
      tableHTML += `
        <tr>
          <td>${r.tipoVehiculo}</td>
          <td>${r.dia}</td>
          <td>${r.numero}</td>
          <td>
            <button class="btn-eliminar" data-id="${r.id}">Eliminar</button>
          </td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    restriccionesContainer.innerHTML = tableHTML;
    //Listeners botones eliminar
    restriccionesContainer.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        try {
          const res = await fetch(
            `http://localhost:3000/api/pico-y-placa/${id}`,
            { method: "DELETE" },
          );
          const delData = await res.json();
          if (delData.success) {
            showNotification("Restricción eliminada", "success");
            renderRestricciones();
          } else {
            showNotification(delData.message, "error");
          }
        } catch (error) {
          showNotification("Error al eliminar restricción", "error");
        }
      });
    });
  } catch (error) {
    restriccionesContainer.innerHTML = "<p>Error al cargar restricciones</p>";
  }
};
renderRestricciones();
//Crear restricción
formPicoPlaca.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    tipoVehiculo: tipoVehiculo.value,
    dia: dia.value,
    numero: parseInt(numero.value),
  };
  try {
    const response = await fetch("http://localhost:3000/api/pico-y-placa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (resData.success) {
      showNotification("Restricción creada exitosamente", "success");
      formPicoPlaca.reset();
      renderRestricciones();
    } else {
      showNotification(resData.message, "error");
    }
  } catch (error) {
    showNotification("Error al crear restricción", "error");
  }
});
