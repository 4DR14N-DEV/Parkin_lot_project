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

let editingUserId = null;

const openUsersDialog = async () => {
  const usersDialog = document.getElementById("usersDialog");
  const usersContainer = document.getElementById("users-table-container");

  usersDialog.showModal();

  try {
    const response = await fetch("http://localhost:3000/api/usuarios");
    const data = await response.json();

    if (!data.success || !data.data) {
      usersContainer.innerHTML = "<p>No hay usuarios registrados</p>";
      return;
    }

    let tableHTML = `<table>
    <thead>
    <tr>
    <th>ID</th>
    <th>Tipo documento</th>
    <th>N° documento</th>
    <th>Nombre completo</th>
    <th>Correo</th>
    <th>N° Celular</th>
    <th>Foto de perfil</th>
    <th>Estado</th>
    <th>Perfil de usuario</th>
    <th>Acciones</th>
    </tr>
    </thead>
    <tbody>
    `;

    data.data.forEach((user) => {
      tableHTML += `
      <tr>
      <td>${user.id}</td>
      <td>${user.tipoDocumento.toUpperCase()}</td>
      <td>${user.numeroDocumento}</td>
      <td>${user.primerNombre}${user.segundoNombre ? " " + user.segundoNombre : ""} ${user.primerApellido}${user.segundoApellido ? " " + user.segundoApellido : ""}</td>
      <td>${user.direccionCorreo}</td>
      <td>${user.numeroCelular}</td>
      <td>${user.fotoPerfil}</td>
      <td>${user.estado}</td>
      <td>${user.perfilUsuario}</td>
      <td>
      <button class="btn-upd-users" data-id="${user.id}">Actualizar</button>
      <button class="btn-toggle" data-id="${user.id}" data-estado="${user.estado}">${user.estado === "activo" ? "Inactivar" : "Activar"}</button>
      </td>
      </tr>
      `;
    });

    tableHTML += `</tbody></table>`;
    usersContainer.innerHTML = tableHTML;

    usersContainer.querySelectorAll(".btn-upd-users").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const userId = btn.dataset.id;
        editingUserId = userId;

        //Selectores para editar un usuario desde el table (users-table-container)
        const editUsersDialog = document.getElementById("edit-users-dialog");
        const editUserDocType = document.getElementById("edit-tipo-documento");
        const editUserDocNumber = document.getElementById(
          "edit-numero-documento",
        );
        const editUserFirstName = document.getElementById("edit-primer-nombre");
        const editUserSecondName = document.getElementById(
          "edit-segundo-nombre",
        );
        const editUserLastName = document.getElementById(
          "edit-primer-apellido",
        );
        const editUserSecondLastName = document.getElementById(
          "edit-segundo-apellido",
        );
        const editUserEmail = document.getElementById("edit-direccion-correo");
        const editUserTelphone = document.getElementById("edit-numero-celular");
        const editPicUser = document.getElementById("edit-foto-perfil-user");
        const editUserState = document.getElementById("edit-estado");

        try {
          const response = await fetch(
            `http://localhost:3000/api/usuarios/${userId}`,
          );

          const data = await response.json();

          if (!data.success || !data.data) {
            showNotification(
              "No se pudieron cargar los datos del usuario",
              "error",
            );
            return;
          }

          const user = data.data;

          editUserDocType.value = user.tipoDocumento
            ? user.tipoDocumento.toLowerCase()
            : "";
          editUserDocNumber.value = user.numeroDocumento || "";
          editUserFirstName.value = user.primerNombre || "";
          editUserSecondName.value = user.segundoNombre || "";
          editUserLastName.value = user.primerApellido || "";
          editUserSecondLastName.value = user.segundoApellido || "";
          editUserEmail.value = user.direccionCorreo || "";
          editUserTelphone.value = user.numeroCelular || "";
          editPicUser.src = user.fotoPerfil || "";
          editPicUser.alt = `Foto de ${user.primerNombre}`;
          editUserState.value = user.estado || "";

          editUsersDialog.showModal();
        } catch (error) {
          console.error("Error:", error);
          showNotification("Error al cargar datos del usuario", "error");
        }
      });
    });

    usersContainer.querySelectorAll(".btn-toggle").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const userId = btn.dataset.id;
        const currentEstado = btn.dataset.estado;
        const newEstado = currentEstado === "activo" ? "inactivo" : "activo";

        await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: newEstado }),
        });

        openUsersDialog();
      });
    });
  } catch (error) {
    console.error("Error:", error);
    usersContainer.innerHTML = "<p>Error al cargar usuarios</p>";
  }
};

const editCloseDialog = document.getElementById("edit-close-dialog");
const editUsersDialog = document.getElementById("edit-users-dialog");
const editFormUsers = document.getElementById("edit-users-form");
if (editCloseDialog && editUsersDialog) {
  editCloseDialog.addEventListener("click", () => {
    editUsersDialog.close();
  });
}
if (editFormUsers && editUsersDialog) {
  editFormUsers.addEventListener("submit", async (e) => {
    e.preventDefault();
    const updateData = {
      tipoDocumento: document
        .getElementById("edit-tipo-documento")
        .value.toUpperCase(),
      numeroDocumento: document.getElementById("edit-numero-documento").value,
      primerNombre: document.getElementById("edit-primer-nombre").value,
      segundoNombre: document.getElementById("edit-segundo-nombre").value,
      primerApellido: document.getElementById("edit-primer-apellido").value,
      segundoApellido: document.getElementById("edit-segundo-apellido").value,
      direccionCorreo: document.getElementById("edit-direccion-correo").value,
      numeroCelular: document.getElementById("edit-numero-celular").value,
      fotoPerfil: document.getElementById("edit-foto-perfil-user").alt || "",
      estado: document.getElementById("edit-estado").value,
    };
    try {
      const response = await fetch(
        `http://localhost:3000/api/usuarios/${editingUserId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        },
      );
      const data = await response.json();
      if (data.success) {
        editUsersDialog.close();
        showNotification("Usuario actualizado exitosamente", "success");
        openUsersDialog();
        const loggedUser = JSON.parse(sessionStorage.getItem("loguedUser"));
        if (loggedUser && String(loggedUser.id) === String(editingUserId)) {
          sessionStorage.setItem("loguedUser", JSON.stringify(data.data));
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("No se pudo actualizar el usuario", "error");
    }
  });
}
const closeUsersDialog = () => {
  const usersDialog = document.getElementById("usersDialog");
  usersDialog.close();
};
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("close-users-dialog");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeUsersDialog);
  }
});
export {
  restricUserAccess,
  showNotification,
  openUsersDialog,
  closeUsersDialog,
};
