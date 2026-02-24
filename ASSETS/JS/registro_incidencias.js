document
  .getElementById("incidenciaForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const notif = document.getElementById("notificacion");
    document.getElementById("notificacion-texto").textContent =
      "Incidencia registrada exitosamente.";
    notif.style.display = "flex";
    this.reset();
  });
