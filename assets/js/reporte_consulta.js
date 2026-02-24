const buttons = document.querySelectorAll(".menu-btn");
const result = document.getElementById("result");
let currentReport = null;

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentReport = btn.dataset.report;
    result.innerHTML = `<h3>Reporte seleccionado: ${btn.textContent}</h3>`;
  });
});

function generateReport() {
  if (!currentReport) {
    result.innerHTML = "<h3>Selecciona primero un reporte</h3>";
    return;
  }

  switch (currentReport) {
    case "usuarios":
      renderTable(
        ["Nombre", "Documento", "Rol"],
        [
          ["Ana Ruiz", "123", "Admin"],
          ["Carlos Perez", "456", "Usuario"],
        ],
      );
      break;

    case "vehiculos":
      renderTable(
        ["Placa", "Tipo", "Propietario"],
        [
          ["ABC123", "Carro", "Ana Ruiz"],
          ["XYZ987", "Moto", "Carlos Perez"],
        ],
      );
      break;

    case "pico":
      result.innerHTML = `
            <h3>Vehículos restringidos</h3>
            <div class="cards">
              <div class="card">
                Total hoy
                <h2>18</h2>
              </div>
            </div>`;
      break;

    default:
      result.innerHTML =
        "<h3>Reporte generado (demo visual lista para backend)</h3>";
  }
}

function renderTable(headers, rows) {
  let html = "<table><tr>";
  headers.forEach((h) => (html += `<th>${h}</th>`));
  html += "</tr>";

  rows.forEach((r) => {
    html += "<tr>";
    r.forEach((c) => (html += `<td>${c}</td>`));
    html += "</tr>";
  });

  html += "</table>";
  result.innerHTML = html;
}

window.onload = () => {
  document.activeElement.blur();
};
