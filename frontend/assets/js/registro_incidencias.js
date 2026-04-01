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
const nombre = document.getElementById("nombre");
const formIncidencia = document.getElementById("form-incidencia");
const incidenciasContainer = document.getElementById("incidencias-container");
let editingIncidenciaId = null;
// ===== LISTAR INCIDENCIAS =====
const renderIncidencias = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/incidencias");
    const data = await response.json();
    if (!data.success || !data.data || data.data.length === 0) {
      incidenciasContainer.innerHTML = "<p>No hay incidencias registradas</p>";
      return;
    }
    let tableHTML = `<table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>`;
    data.data.forEach((inc) => {
      tableHTML += `
        <tr>
          <td>${inc.id}</td>
          <td>${inc.nombre}</td>
          <td>
            <button class="btn-upd-incidencia" data-id="${inc.id}">Actualizar</button>
            <button class="btn-del-incidencia" data-id="${inc.id}">Eliminar</button>
          </td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    incidenciasContainer.innerHTML = tableHTML;
    //Listeners actualizar
    incidenciasContainer
      .querySelectorAll(".btn-upd-incidencia")
      .forEach((btn) => {
        btn.addEventListener("click", async () => {
          const incId = btn.dataset.id;
          editingIncidenciaId = incId;
          const editDialog = document.getElementById("edit-incidencia-dialog");
          try {
            const res = await fetch(
              `http://localhost:3000/api/incidencias/${incId}`,
            );
            const incData = await res.json();
            if (!incData.success || !incData.data) {
              showNotification("No se pudieron cargar los datos", "error");
              return;
            }
            document.getElementById("edit-nombre").value =
              incData.data.nombre || "";
            editDialog.showModal();
          } catch (error) {
            showNotification("Error al cargar incidencia", "error");
          }
        });
      });
    //Listeners eliminar
    incidenciasContainer
      .querySelectorAll(".btn-del-incidencia")
      .forEach((btn) => {
        btn.addEventListener("click", async () => {
          const incId = btn.dataset.id;
          try {
            const res = await fetch(
              `http://localhost:3000/api/incidencias/${incId}`,
              {
                method: "DELETE",
              },
            );
            const delData = await res.json();
            if (delData.success) {
              showNotification("Incidencia eliminada", "success");
              renderIncidencias();
            } else {
              showNotification(delData.message, "error");
            }
          } catch (error) {
            showNotification("Error al eliminar incidencia", "error");
          }
        });
      });
  } catch (error) {
    incidenciasContainer.innerHTML = "<p>Error al cargar incidencias</p>";
  }
};
renderIncidencias();
// ===== CREAR INCIDENCIA =====
formIncidencia.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:3000/api/incidencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nombre.value }),
    });
    const data = await response.json();
    if (data.success) {
      showNotification("Incidencia creada exitosamente", "success");
      formIncidencia.reset();
      renderIncidencias();
    } else {
      showNotification(data.message, "error");
    }
  } catch (error) {
    showNotification("Error al crear incidencia", "error");
  }
});
// ===== CERRAR DIALOG EDICIÓN =====
const editCloseDialog = document.getElementById("edit-incidencia-close");
const editIncidenciaDialog = document.getElementById("edit-incidencia-dialog");
if (editCloseDialog && editIncidenciaDialog) {
  editCloseDialog.addEventListener("click", () => {
    editIncidenciaDialog.close();
  });
}
// ===== SUBMIT EDICIÓN =====
const editIncidenciaForm = document.getElementById("edit-incidencia-form");
if (editIncidenciaForm && editIncidenciaDialog) {
  editIncidenciaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const updateData = {
      nombre: document.getElementById("edit-nombre").value,
    };
    try {
      const response = await fetch(
        `http://localhost:3000/api/incidencias/${editingIncidenciaId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        },
      );
      const data = await response.json();
      if (data.success) {
        editIncidenciaDialog.close();
        showNotification("Incidencia actualizada exitosamente", "success");
        renderIncidencias();
      } else {
        showNotification(data.message, "error");
      }
    } catch (error) {
      showNotification("Error al actualizar incidencia", "error");
    }
  });
}

// ===== CARGAR SELECTS DEL DIALOG REPORTE =====
const cargarDatosReporte = async () => {
  const selectVehiculo = document.getElementById("reporte-vehiculo");
  const selectIncidencia = document.getElementById("reporte-incidencia");
  try {
    const [vehiculosRes, incidenciasRes] = await Promise.all([
      fetch("http://localhost:3000/api/vehiculos"),
      fetch("http://localhost:3000/api/incidencias"),
    ]);
    const vehiculosData = await vehiculosRes.json();
    const incidenciasData = await incidenciasRes.json();
    // Llenar select de vehículos
    if (vehiculosData.success && vehiculosData.data) {
      vehiculosData.data.forEach((v) => {
        const option = document.createElement("option");
        option.value = v.id;
        option.textContent = `${v.placa} - ${v.tipo} ${v.marca}`;
        selectVehiculo.appendChild(option);
      });
    }
    // Llenar select de incidencias
    if (incidenciasData.success && incidenciasData.data) {
      incidenciasData.data.forEach((inc) => {
        const option = document.createElement("option");
        option.value = inc.id;
        option.textContent = inc.nombre;
        selectIncidencia.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
cargarDatosReporte();
// ===== ABRIR DIALOG REPORTE =====
const btnReporteIncidencia = document.getElementById("btn-reporte-incidencia");
const reporteIncidenciaDialog = document.getElementById(
  "reporte-incidencia-dialog",
);
btnReporteIncidencia.addEventListener("click", () => {
  reporteIncidenciaDialog.showModal();
});
// ===== CERRAR DIALOG REPORTE =====
const reporteCloseDialog = document.getElementById("reporte-incidencia-close");
if (reporteCloseDialog && reporteIncidenciaDialog) {
  reporteCloseDialog.addEventListener("click", () => {
    reporteIncidenciaDialog.close();
  });
}
// ===== SUBMIT REPORTE =====
const reporteIncidenciaForm = document.getElementById(
  "reporte-incidencia-form",
);
if (reporteIncidenciaForm && reporteIncidenciaDialog) {
  reporteIncidenciaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const vehiculo = document.getElementById("reporte-vehiculo").value;
    const incidencia = document.getElementById("reporte-incidencia").value;
    if (!vehiculo || !incidencia) {
      showNotification("Complete todos los campos obligatorios", "error");
      return;
    }
    const data = {
      vehiculo: parseInt(vehiculo),
      incidencia: parseInt(incidencia),
      fechaHora: new Date().toISOString(),
    };
    try {
      const response = await fetch(
        "http://localhost:3000/api/reporte-incidencias",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      const resData = await response.json();
      if (resData.success) {
        reporteIncidenciaDialog.close();
        showNotification(
          "Reporte de incidencia creado exitosamente",
          "success",
        );
        reporteIncidenciaForm.reset();
      } else {
        showNotification(resData.message, "error");
      }
    } catch (error) {
      showNotification("Error al crear reporte de incidencia", "error");
    }
  });
}
