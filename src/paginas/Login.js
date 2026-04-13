import React, { useState } from "react";

// FUNCIONES DE "BASE DE DATOS" EN LOCALSTORAGE
const obtenerUsuarios = () => {
  const data = localStorage.getItem("usuarios");
  return data ? JSON.parse(data) : [];
};

const guardarUsuarios = (usuarios) => {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
};
// Componente Login — recibe "onLogin" como prop desde App.js
function Login({ onLogin }) {

  // Controla qué formulario se muestra: "login" o "registro"
  const [vista, setVista] = useState("login");

  // Guarda el rol seleccionado: "cliente" o "admin"
  const [rol, setRol] = useState("cliente");

  // Guarda lo que escribe el usuario en el campo email
  const [email, setEmail] = useState("");

  // Guarda lo que escribe el usuario en el campo contraseña
  const [password, setPassword] = useState("");

  // Guarda todos los campos del formulario de registro en un objeto
  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    celular: "",
    email: "",
    password: "",
    confirmar: ""
  });

  const handleLogin = (e) => {
  e.preventDefault();

  const usuarios = obtenerUsuarios();

  const usuarioValido = usuarios.find(
    u => u.email === email && u.password === password
  );

  if (!usuarioValido) {
    alert("Correo o contraseña incorrectos");
    return;
  }

  onLogin(rol);
};

  // Registrarse"
 const handleRegistro = (e) => {
  e.preventDefault();

  if (form.password !== form.confirmar) {
    alert("Las contraseñas no coinciden");
    return;
  }

  const usuarios = obtenerUsuarios();

  // Verificar si el correo ya existe
  const existe = usuarios.find(u => u.email === form.email);
  if (existe) {
    alert("Este correo ya está registrado");
    return;
  }

  // Guardar nuevo usuario
  usuarios.push(form);
  guardarUsuarios(usuarios);

  alert("Registro exitoso, ahora puedes iniciar sesión");
  setVista("login");
};

  return (
    // Div principal 
    <div
      className="login-fondo"
      style={{
        background: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/img/lomo saltado.png') center/cover no-repeat"
      }}
    >
      {/* Tarjeta blanca del centro  estilos en App.css clase "login-card" */}
      <div className="login-card card">
        <div className="card-body p-4">

          <div className="text-center mb-3">
            <h4 className="login-titulo">Sabor Andino</h4>
            <small className="text-muted">Auténtica cocina peruana</small>
          </div>

          {/* Tabs para cambiar entre "Ingresar" y "Registrarse"
              La clase cambia entre "activo" e "inactivo" según el valor de "vista" */}
          <div className="login-tabs">
            <button
              className={`login-tab-btn ${vista === "login" ? "activo" : "inactivo"}`}
              onClick={() => setVista("login")} // cambia vista a "login"
            >
              Ingresar
            </button>
            <button
              className={`login-tab-btn ${vista === "registro" ? "activo" : "inactivo"}`}
              onClick={() => setVista("registro")} // cambia vista a "registro"
            >
              Registrarse
            </button>
          </div>

          {/* Condición: si vista es "login" muestra el form de login,
              si no muestra el form de registro */}
          {vista === "login" ? (

            // FORMULARIO DE LOGIN
            <form onSubmit={handleLogin}>


              <p className="small text-muted mb-2">Ingresar como:</p>

              {/* Botones de rol: Cliente y Administrador
                  Usamos .map() para no repetir el mismo botón dos veces
                  El array tiene los dos roles: "cliente" y "admin" */}
              <div className="d-flex gap-2 mb-3">
                {["cliente", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    // Si "r" es igual al rol activo  clase "activo", si no  "inactivo"
                    className={`btn login-rol-btn ${rol === r ? "activo" : "inactivo"}`}
                    onClick={() => setRol(r)} // guarda el rol seleccionado
                  >
                    {/* Icono diferente según el rol */}
                    <span style={{ fontSize: 22 }}>
                      {r === "cliente" ? "👤" : "👨‍💼"}
                    </span>
                    <small className="mt-1">
                      {r === "cliente" ? "Cliente" : "Administrador"}
                    </small>
                  </button>
                ))}
              </div>

              {/* Campo de correo electrónico
                  onChange actualiza el estado "email" cada vez que el usuario escribe */}
              <div className="mb-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Campo de contraseña
                  onChange actualiza el estado "password" cada vez que el usuario escribe */}
              <div className="mb-2">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Link de olvidé mi contraseña — solo visual, sin función aún */}
              <div className="text-end mb-3">
                <span className="login-link">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>

              {/* Botón que envía el form y ejecuta handleLogin */}
              <button type="submit" className="login-btn-primary">
                Ingresar
              </button>

              {/* Link para cambiar al formulario de registro */}
              <p className="text-center small mt-3 mb-0">
                ¿No tienes cuenta?{" "}
                <span
                  className="login-link"
                  onClick={() => setVista("registro")} // cambia a la vista de registro
                >
                  Regístrate
                </span>
              </p>

            </form>

          ) : (

            // FORMULARIO DE REGISTRO 
            <form onSubmit={handleRegistro}> {[
                { key: "nombre",    placeholder: "Nombres y apellidos",  type: "text" },
                { key: "dni",       placeholder: "DNI",                  type: "text" },
                { key: "celular",   placeholder: "Celular",              type: "tel" },
                { key: "email",     placeholder: "Correo electrónico",   type: "email" },
                { key: "password",  placeholder: "Contraseña",           type: "password" },
                { key: "confirmar", placeholder: "Confirmar contraseña", type: "password" },
              ].map((f) => (
                <div className="mb-2" key={f.key}>
                  <input
                    type={f.type}
                    className="form-control"
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    // ...form copia todos los campos actuales
                    // [f.key] actualiza solo el campo que el usuario está escribiendo
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    required
                  />
                </div>
              ))}

              {/* Botón que envía el form y ejecuta handleRegistro */}
              <button type="submit" className="login-btn-primary mt-2">
                Registrarse
              </button>

            </form>
          )}

          {/* Pie de la tarjeta con año y nombre del restaurante */}
          <p className="login-footer">
            © 2026 Sabor Andino · Cocina Peruana
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;