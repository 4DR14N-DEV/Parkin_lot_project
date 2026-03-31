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

//Selectores para registrar un nuevo usuario
const docType = document.getElementById("tipo-documento");
const docNumber = document.getElementById("numero-documento");
const firstName = document.getElementById("primer-nombre");
const secondName = document.getElementById("segundo-nombre");
const lastName = document.getElementById("primer-apellido");
const secondLastName = document.getElementById("segundo-apellido");
const email = document.getElementById("direccion-correo");
const telephon = document.getElementById("numero-celular");
const password = document.getElementById("clave");
const userProfile = document.getElementById("perfil-usuario");
const picUser = document.getElementById("foto-perfil");
const formNewUser = document.getElementById("form-registro");

//Funcion para crear un nuevo usuario
const createUser = async () => {
  const dataUser = {
    tipoDocumento: docType.value,
    numeroDocumento: docNumber.value,
    primerNombre: firstName.value,
    segundoNombre: secondName.value,
    primerApellido: lastName.value,
    segundoApellido: secondLastName.value,
    direccionCorreo: email.value,
    numeroCelular: telephon.value,
    fotoPerfil: picUser.value,
    estado: "activo",
    clave: password.value,
    perfilUsuario: parseInt(userProfile.value),
  };

  try {
    const response = await fetch("http://localhost:3000/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataUser),
    });

    const data = await response.json();

    if (data.success) {
      showNotification("Usuario registrado exitosamente", "success");
      formNewUser.reset();
    } else {
      showNotification(data.message, "error");
    }
  } catch (error) {
    showNotification("Error al registrar usuario", "error");
  }
};

formNewUser.addEventListener("submit", (e) => {
  e.preventDefault();
  createUser();
});
