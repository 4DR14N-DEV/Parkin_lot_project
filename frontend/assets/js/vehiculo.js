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

//Selectores de vehiculo
const plate = document.getElementById("placa");
const type = document.getElementById("tipo");
const brand = document.getElementById("marca");
const model = document.getElementById("modelo");
const color = document.getElementById("color-input");
const userId = document.getElementById("usuario-id");
const userName = document.getElementById("usuario-nombre");
const formVehicle = document.getElementById("form-vehiculo");

userId.addEventListener("change", async () => {
  const id = userId.value;

  if (!id) {
    userName.value = "";
    return;
  }

  try {
    //Obtener id de usuario registrados
    const response = await fetch(`http://localhost:3000/api/usuarios/${id}`);

    const data = await response.json();

    if (data.success && data.data) {
      userName.value = `${data.data.primerNombre} ${data.data.primerApellido}`;
    } else {
      userName.value = "";
      showNotification("Usuario no encontrado", "error");
    }
  } catch (error) {
    userName.value = "";
    showNotification("Error al buscar usuario", "error");
  }
});

//Registrar vehiculos
const createVehicles = async () => {
  const dataVehicle = {
    placa: plate.value,
    tipo: type.value,
    color: color.value,
    modelo: model.value,
    marca: brand.value,
    usuario: parseInt(userId.value),
  };

  try {
    const response = await fetch("http://localhost:3000/api/vehiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataVehicle),
    });

    const data = await response.json();

    if (data.success) {
      showNotification("Vehiculo registrado exitosamente", "success");
      formVehicle.reset();
      userName.value = "";
    } else {
      showNotification(data.message, "error");
    }
  } catch (error) {
    showNotification("Error al registrar vehículo", "error");
  }
};
//---

let editingVehicleId = null;

const openVehiclesDialog = async () => {
  const vehiclesDialog = document.getElementById("vehiculosDialog");
  const vehiclesContainer = document.getElementById(
    "vehiculos-table-container",
  );

  vehiclesDialog.showModal();

  try {
    const response = await fetch("http://localhost:3000/api/vehiculos");
    const data = await response.json();

    if (!data.success || !data.data || data.data.length === 0) {
      vehiclesContainer.innerHTML = "<p>No hay vehículos registrados</p>";
      return;
    }

    const loggedUser = JSON.parse(sessionStorage.getItem("loguedUser"));
    const isAdmin = loggedUser.perfilUsuario === 1;

    const actionsHeader = isAdmin ? `<th>Acciones</th>` : "";

    let tableHTML = `<table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Placa</th>
          <th>Tipo</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Color</th>
          <th>ID Usuario</th>
          ${actionsHeader}
        </tr>
      </thead>
      <tbody>`;

    data.data.forEach((veh) => {
      tableHTML += `<tr><td>${veh.id}</td>
          <td>${veh.placa}</td>
          <td>${veh.tipo}</td>
          <td>${veh.marca}</td>
          <td>${veh.modelo}</td>
          <td>${veh.color}</td>
          <td>${veh.usuario}</td>
          <td>
             ${
               isAdmin
                 ? `<button class="btn-upd-vehiculo" data-id="${veh.id}">Actualizar</button>
               <button class="btn-del-vehiculo" data-id="${veh.id}">Eliminar</button>`
                 : ``
             }
          </td>
        </tr>`;
    });

    tableHTML += `</tbody></table>`;
    vehiclesContainer.innerHTML = tableHTML;

    vehiclesContainer.querySelectorAll(".btn-upd-vehiculo").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const vehicleId = btn.dataset.id;
        editingVehicleId = vehicleId;

        const editDialog = document.getElementById("edit-vehiculo-dialog");

        try {
          const res = await fetch(
            `http://localhost:3000/api/vehiculos/${vehicleId}`,
          );

          const vehicleData = await res.json();

          if (!vehicleData.success || !vehicleData.data) {
            showNotification(
              "No se pudieron cargar los datos del vehículo",
              "error",
            );
            return;
          }

          const v = vehicleData.data;

          document.getElementById("edit-placa").value = v.placa || "";
          document.getElementById("edit-tipo").value = v.tipo || "";
          document.getElementById("edit-marca").value = v.marca || "";
          document.getElementById("edit-modelo").value = v.modelo || "";
          document.getElementById("edit-color").value = v.color || "";
          document.getElementById("edit-usuario").value = v.usuario || "";

          editDialog.showModal();
        } catch (error) {
          showNotification("Error al cargar datos del vehículo", "error");
        }
      });
    });

    vehiclesContainer.querySelectorAll(".btn-del-vehiculo").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const vehicleId = btn.dataset.id;

        try {
          const res = await fetch(
            `http://localhost:3000/api/vehiculos/${vehicleId}`,
            {
              method: "DELETE",
            },
          );

          const delData = await res.json();

          if (delData.success) {
            showNotification("Vehículo eliminado exitosamente", "success");
            openVehiclesDialog();
          } else {
            showNotification(delData.message, "error");
          }
        } catch (error) {
          showNotification("Error al eliminar vehículo", "error");
        }
      });
    });
  } catch (error) {
    vehiclesContainer.innerHTML = `<p>Error al cargar vehículos</p>`;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("close-vehiculos-dialog");
  const vehiclesDialog = document.getElementById("vehiculosDialog");
  if (closeBtn && vehiclesDialog) {
    closeBtn.addEventListener("click", () => {
      vehiclesDialog.close();
    });
  }
});

const editVehiclesCloseBtn = document.getElementById("edit-vehiculo-close");
const editVehicleDialog = document.getElementById("edit-vehiculo-dialog");

if (editVehiclesCloseBtn && editVehicleDialog) {
  editVehiclesCloseBtn.addEventListener("click", () => {
    editVehicleDialog.close();
  });
}

const editVehicleForm = document.getElementById("edit-vehiculo-form");

if (editVehicleForm && editVehicleDialog) {
  editVehicleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updateData = {
      placa: document.getElementById("edit-placa").value,
      tipo: document.getElementById("edit-tipo").value,
      marca: document.getElementById("edit-marca").value,
      modelo: document.getElementById("edit-modelo").value,
      color: document.getElementById("edit-color").value,
      usuario: parseInt(document.getElementById("edit-usuario").value),
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/vehiculos/${editingVehicleId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        },
      );

      const data = await response.json();

      if (data.success) {
        editVehicleDialog.close();
        showNotification("Vehículo actualizado exitosamente", "success");
        openVehiclesDialog();
      } else {
        showNotification(data.message, "error");
      }
    } catch (error) {
      showNotification("No se pudo actualizar el vehículo", "error");
    }
  });
}

formVehicle.addEventListener("submit", (e) => {
  e.preventDefault();
  createVehicles();
});

const btnVerVehiculos = document.getElementById("btn-ver-vehiculos");

btnVerVehiculos.addEventListener("click", () => {
  openVehiclesDialog();
});
