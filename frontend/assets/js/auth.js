const showNotification = (message, type) => {
  const div = document.createElement("div");
  div.className = `notification ${type}`;

  div.innerHTML = `<p>${message}</p>
  <span>x</span>`;

  const closeBtn = div.querySelector("span");
  closeBtn.addEventListener("click", () => {
    div.remove();
  });

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
};

const restricUserAccess = () => {
  const user = JSON.parse(sessionStorage.getItem("loguedUser"));

  if (!user) {
    window.location.href = "/frontend/views/index.html";
    return;
  }

  if (user.perfilUsuario === 3) {
    const headerLinks = document.querySelectorAll("header a, header nav a");

    headerLinks.forEach((link) => {
      if (link.href.includes("perfil_usuario")) {
        return;
      }

      link.addEventListener("click", (e) => {
        e.preventDefault();
        showNotification("No tienes acceso a esta sección", "error");
      });

      link.style.opacity = "0.5";
      link.style.cursor = "not-allowed";
      link.style.pointerEvents = "none";
    });
  }
};

export { restricUserAccess, showNotification };
