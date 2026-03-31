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

const containerPadre = document.getElementById("container");

containerPadre.addEventListener("click", (e) => {
  e.preventDefault();
  const celda = e.target.closest(".celdas");
  if (!celda) return;

  const esOcupado = celda.classList.toggle("ocupado");
  const spanEstado = celda.querySelector(".estado-celda");

  spanEstado.textContent = esOcupado ? "Ocupado" : "Disponible";
});
