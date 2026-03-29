import { restricUserAccess } from "./auth.js";
restricUserAccess();

const containerPadre = document.getElementById("container");

containerPadre.addEventListener("click", (e) => {
  e.preventDefault();
  const celda = e.target.closest(".celdas");
  if (!celda) return;

  const esOcupado = celda.classList.toggle("ocupado");
  const spanEstado = celda.querySelector(".estado-celda");

  spanEstado.textContent = esOcupado ? "Ocupado" : "Disponible";
});
