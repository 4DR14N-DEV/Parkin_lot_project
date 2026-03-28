function mostrarTab(tab) {
  const tabs = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".tab-button");

  tabs.forEach((t) => t.classList.remove("active"));
  buttons.forEach((b) => b.classList.remove("active"));

  document.getElementById(tab).classList.add("active");
  event.target.classList.add("active");
}
