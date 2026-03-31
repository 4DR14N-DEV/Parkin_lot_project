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

formVehicle.addEventListener("submit", (e) => {
  e.preventDefault();
  createVehicles();
});
