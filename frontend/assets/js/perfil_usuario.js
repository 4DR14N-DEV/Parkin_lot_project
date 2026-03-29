import { restricUserAccess, showNotification } from "./auth.js";
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
const updateDialog = document.getElementById("updateDialog");
const formUpdate = document.getElementById("formUpdate");
const slcDocType = document.getElementById("tipo-documento");
const docNumber = document.getElementById("numero-documento");
const firstName = document.getElementById("primer-nombre");
const secondName = document.getElementById("segundo-nombre");
const lastName = document.getElementById("primer-apellido");
const secondLastName = document.getElementById("segundo-apellido");
const dirEmail = document.getElementById("direccion-correo");
const telphone = document.getElementById("numero-celular");
const picUser = document.getElementById("foto-perfil");
const userState = document.getElementById("estado");
const userPassword = document.getElementById("password-upd");
const btnSave = document.getElementById("btn-save");
const btnCloseDialog = document.getElementById("close-dialog");

const renderUserData = async () => {
  const user = JSON.parse(sessionStorage.getItem("loguedUser"));
  console.log("Usuario:", user);
  console.log("User ID:", user.id);

  name.value = `${user.primerNombre}${user.segundoNombre ? " " + user.segundoNombre : ""} ${user.primerApellido}${user.segundoApellido ? " " + user.segundoApellido : ""}`;
  documentUser.value = `${user.tipoDocumento} ${user.numeroDocumento}`;
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
    console.log(response);

    const data = await response.json();
    console.log("data:", data);

    if (!data.success || !data.data || data.data.length === 0) {
      showNotification("No tiene Vehiculos asosiados");
      return;
    }

    data.data.forEach((v) => {
      userVehicles.innerHTML += `<div id="userVehicle"><span>${v.id}</span><span>${v.placa}</span><span>${v.color}</span><span>${v.marca}</span><span>${v.tipo}</span></div>`;
    });
  } catch (error) {
    console.error("Error:", error);
    showNotification("Error al obtener vehiculos asosiados");
  }
};

renderUserData();

btnUpdate.addEventListener("click", (e) => {
  e.preventDefault();

  updateDialog.showModal();
});
