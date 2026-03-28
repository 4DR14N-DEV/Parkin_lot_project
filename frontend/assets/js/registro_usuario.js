document
  .getElementById("registroForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    // Simulación de ID autogenerado (en producción vendría del servidor)
    const nuevoId = Math.floor(100000 + Math.random() * 900000);
    const notif = document.getElementById("notificacion");
    document.getElementById("notificacion-texto").textContent =
      "✅ Registro realizado exitosamente. ID asignado: " + nuevoId;
    notif.style.display = "flex";
    this.reset();
  });
