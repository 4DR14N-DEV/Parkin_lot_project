import { showNotification } from "./auth.js";

//Obtener los elementos HTML y selectores
const mainForm = document.getElementById("login-form");
const selectOptions = document.getElementById("menu");
const docUser = document.getElementById("doc-user");
const password = document.getElementById("password");
const btnSubmit = document.getElementById("btn-submit");

//Verificar el tipo de usuario que desea ingresar
const verifyTypeUser = () => {
  if (selectOptions.value === "") {
    docUser.setAttribute("hidden", true);
    password.setAttribute("hidden", true);
  } else if (selectOptions.value === "usuario") {
    docUser.hidden = false;
    password.setAttribute("hidden", true);
  } else {
    docUser.hidden = false;
    password.hidden = false;
  }
};

const login = async () => {
  btnSubmit.disabled = true;
  btnSubmit.textContent = "Loading...";

  const userType = selectOptions.value;
  const docUserValue = docUser.value;
  const passwordValue = password.value;

  const profileMap = {
    administrador: 1,
    operador: 2,
    usuario: 3,
  };

  const userProfile = profileMap[userType];

  try {
    if (!userProfile) throw new Error("Seleccione un rol");
    if (!docUserValue) throw new Error("Ingrese número de documento");
    if ((userProfile === 1 || userProfile === 2) && !passwordValue)
      throw new Error("Ingrese una contraseña");
    const response = await fetch("http://localhost:3000/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numeroDocumento: docUserValue,
        clave: passwordValue || null,
        perfilUsuario: userProfile,
      }),
    });

    if (!response) {
      showNotification("Error del servidor", "error");
      return;
    }

    const data = await response.json();

    if (data.success) {
      sessionStorage.setItem("loguedUser", JSON.stringify(data.data));
      showNotification("Login exitoso!", "success");

      docUser.value = "";
      password.value = "";
      selectOptions.value = "";

      setTimeout(() => {
        const profile = data.data.perfilUsuario;

        if (profile === 1) {
          window.location.href = "/frontend/views/reporte_consulta.html";
        } else if (profile === 2) {
          window.location.href = "/frontend/views/reporte_consulta.html";
        } else if (profile === 3) {
          window.location.href = "/frontend/views/celdas_parqueo.html";
        }
      }, 400);
    } else {
      showNotification(data.message, "error");
    }
  } catch (error) {
    showNotification(error.message, "error");
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Sign in";
  }
};

selectOptions.addEventListener("change", (e) => {
  e.preventDefault();
  verifyTypeUser();
});

mainForm.addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});
