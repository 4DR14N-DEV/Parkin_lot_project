import {
  restricUserAccess,
  showNotification,
  openUsersDialog,
} from "./auth.js";
restricUserAccess();

//Selectores de perfil de usuario
const name = document.getElementById("nombre");
const documentUser = document.getElementById("documento");
const email = document.getElementById("correo");
const phone = document.getElementById("celular");
const state = document.getElementById("estado");
const userProfile = document.getElementById("perfilUsu");
const photoUser = document.querySelector(".foto-perfil");
const userVehicles = document.querySelector(".vehiculos");

//Selectores para actualizar usuario
const btnUpdate = document.getElementById("btn-update");
const updateDialog = document.getElementById("update-dialog");
const slcDocType = document.getElementById("tipo-documento");
const docNumber = document.getElementById("numero-documento");
const firstName = document.getElementById("primer-nombre");
const secondName = document.getElementById("segundo-nombre");
const lastName = document.getElementById("primer-apellido");
const secondLastName = document.getElementById("segundo-apellido");
const dirEmail = document.getElementById("direccion-correo");
const telphone = document.getElementById("numero-celular");
const picUser = document.getElementById("foto-perfil-user");
const userState = document.getElementById("estado-upd");
const btnCloseDialog = document.getElementById("close-dialog");

//Selector para el link de listado de usuarios
const usersLink = document.getElementById("a-users");

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("openDialog") === "users") {
  // Esperar a que el DOM esté listo y auth.js haya cargado
  const user = JSON.parse(sessionStorage.getItem("loguedUser"));
  if (user && (user.perfilUsuario === 1 || user.perfilUsuario === 2)) {
    openUsersDialog();
  }
  // Limpiar el query param de la URL sin recargar
  window.history.replaceState({}, "", "/frontend/views/perfil_usuario.html");
}

const renderUserData = async () => {
  const user = JSON.parse(sessionStorage.getItem("loguedUser"));

  name.value = `${user.primerNombre}${user.segundoNombre ? " " + user.segundoNombre : ""} ${user.primerApellido}${user.segundoApellido ? " " + user.segundoApellido : ""}`;
  documentUser.value = `${user.tipoDocumento.toUpperCase()} ${user.numeroDocumento}`;
  email.value = `${user.direccionCorreo}`;
  phone.value = `${user.numeroCelular}`;
  state.textContent = `Estado: ${user.estado}`;
  userProfile.textContent = `Perfil de usuario: ${user.perfilUsuario}`;
  // photoUser.setAttribute("src", `${user.fotoPerfil}`);
  photoUser.setAttribute("alt", `Foto de ${user.primerNombre}`);

  try {
    const response = await fetch(
      `http://localhost:3000/api/vehiculos/usuario/${user.id}`,
    );

    const data = await response.json();

    if (!data.success || !data.data || data.data.length === 0) {
      // showNotification("No tiene Vehiculos asociados", "error");
      return;
    }

    userVehicles.innerHTML = "<h2>Vehículos Asociados</h2>";
    data.data.forEach((v) => {
      userVehicles.innerHTML += `<div class="user-vehicle"><span>${v.id}</span><span>${v.placa}</span><span>${v.color}</span><span>${v.marca}</span><span>${v.tipo}</span></div>`;
    });
  } catch (error) {
    console.error("Error:", error);
    showNotification("Error al obtener vehiculos asocokiados");
  }
};

renderUserData();

const renderUpdateData = () => {
  const user = JSON.parse(sessionStorage.getItem("loguedUser"));
  console.log(user);

  slcDocType.value = user.tipoDocumento;
  docNumber.value = user.numeroDocumento;
  firstName.value = user.primerNombre;
  secondName.value = user.segundoNombre;
  lastName.value = user.primerApellido;
  secondLastName.value = user.segundoApellido;
  dirEmail.value = user.direccionCorreo;
  telphone.value = user.numeroCelular;
  picUser.value = user.fotoPerfil;
  picUser.setAttribute("alt", `Foto de ${user.primerNombre}`);
  userState.value = user.estado;
};

const catchDataUpdated = async () => {
  const updateData = {
    tipoDocumento: slcDocType.value,
    numeroDocumento: docNumber.value,
    primerNombre: firstName.value,
    segundoNombre: secondName.value,
    primerApellido: lastName.value,
    segundoApellido: secondLastName.value,
    direccionCorreo: dirEmail.value,
    numeroCelular: telphone.value,
    fotoPerfil: picUser.value,
    estado: userState.value,
  };

  try {
    const user = JSON.parse(sessionStorage.getItem("loguedUser"));

    const response = await fetch(
      `http://localhost:3000/api/usuarios/${user.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      },
    );

    const data = await response.json();

    if (data.success) {
      sessionStorage.setItem("loguedUser", JSON.stringify(data.data));
      updateDialog.close();
      renderUserData();
      showNotification("Datos actualizados exitosamente", "success");
    }
  } catch (error) {
    showNotification("No se puede actualizar el perfil", "error");
  }
};

const renderAllUsers = () => {
  if (usersLink) {
    const user = JSON.parse(sessionStorage.getItem("loguedUser"));
    if (user.perfilUsuario === 1 || user.perfilUsuario === 2) {
      usersLink.addEventListener("click", (e) => {
        e.preventDefault();
        openUsersDialog();
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
};

renderAllUsers();

btnUpdate.addEventListener("click", (e) => {
  e.preventDefault();
  updateDialog.showModal();
  renderUpdateData();
});

btnCloseDialog.addEventListener("click", () => {
  updateDialog.close();
});

const formUpdates = document.getElementById("form-update");

formUpdates.addEventListener("submit", async (e) => {
  e.preventDefault();
  catchDataUpdated();
});
