import React, { useState, useEffect } from "react";
import CompModal from "../../Componentes/CompModal";
import CompNavBar from "../../Componentes/CompNavBar";
import { useTema } from "../../Contex/ContexTema";
import CompFooter from "../../Componentes/CompFooter";



function ClienteReservas({ vistaCliente, setVistaCliente, onLogout, reservas, setReservas }) {

  // Trae el tema actual igual que en los demás componentes
  const { tema, cambiarTema } = useTema();

  // Controla si se muestra el modal de nueva reserva
  const [mostrarNueva, setMostrarNueva] = useState(false);

  // Reserva seleccionada para cancelar — null = modal cerrado
  const [reservaCancelar, setReservaCancelar] = useState(null);

  // Mensaje de retroalimentación
  const [mensaje, setMensaje] = useState("");

  // Formulario de nueva reserva — empieza vacío
  const [form, setForm] = useState({
    cliente: "", telefono: "", fecha: "",
    hora: "", personas: "", mesa: "", tipo: "presencial"
  });

  // Oculta el mensaje automáticamente en 2 segundos
  // mismo patrón useEffect con límite de CompHooks
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 2000);
      // Libera memoria igual que CompHooks
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  // Guarda la nueva reserva — valida que todos los campos estén llenos
  const guardarReserva = () => {
    if (
      !form.cliente  ||
      !form.telefono ||
      !form.fecha    ||
      !form.hora     ||
      !form.personas ||
      !form.mesa
    ) {
      alert("Por favor complete todos los campos");
      return;
    }
    // Crea la nueva reserva con un id nuevo
    const nueva = {
      id: String(reservas.length + 1).padStart(3, "0"),
      mesa:     form.mesa,
      telefono: form.telefono,
      fecha:    form.fecha,
      hora:     form.hora,
      personas: form.personas,
      tipo:     form.tipo,
      estado:   "Confirmada",
    };
    // Agrega la nueva reserva a la lista
    setReservas((prev) => [...prev, nueva]);
    setMostrarNueva(false);
  // Resetea el formulario
    setForm({ cliente: "", telefono: "", fecha: "", hora: "", 
      personas: "", mesa: "", tipo: "presencial" });
    // Resetea el formulario
    setMensaje("✅ Mesa reservada correctamente");
  };

  // Cancela la reserva seleccionada — la elimina de la lista
  const cancelarReserva = () => {
    setReservas((prev) => prev.filter((r) => r.id !== reservaCancelar.id));
    setReservaCancelar(null);
    setMensaje("❌ Reserva cancelada");
  };

  // Componente interno de tarjeta de reserva — evita repetir el bloque
  const TarjetaReserva = ({ r }) => (
    <div className="cli-reserva-card">

      {/* Fila superior: mesa y personas */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="cli-reserva-mesa">Mesa #{r.mesa}</span>
        <span className="cli-reserva-personas">👥 {r.personas}</span>
      </div>

      {/* Teléfono */}
      <div className="d-flex align-items-center gap-2 cli-reserva-dato">
        <span className="cli-reserva-icono-rojo">📞</span>
        <span>{r.telefono}</span>
      </div>

      {/* Fecha */}
      <div className="d-flex align-items-center gap-2 cli-reserva-dato">
        <span className="cli-reserva-icono-rojo">📅</span>
        <span>{r.fecha}</span>
      </div>

      {/* Hora */}
      <div className="d-flex align-items-center gap-2 cli-reserva-dato mb-2">
        <span className="cli-reserva-icono-rojo">⏱</span>
        <span>{r.hora}</span>
      </div>

      {/* Tipo de reserva — solo lectura, no se puede cambiar */}
      <p className="cli-reserva-label mb-1">Tipo de reserva</p>

      {/* Reserva presencial — marcado si es presencial */}
      <div className={`reserva-radio ${r.tipo === "presencial" ? "cli-radio-activo" : ""}`}>
        <input
          type="radio"
          readOnly
          checked={r.tipo === "presencial"}
          onChange={() => {}}
        />
        👤 Reserva presencial
      </div>

      {/* Reserva por teléfono — marcado si es por teléfono */}
      <div className={`reserva-radio ${r.tipo === "telefono" ? "cli-radio-activo" : ""}`}>
        <input
          type="radio"
          readOnly
          checked={r.tipo === "telefono"}
          onChange={() => {}}
        />
        📞 Reserva por teléfono
      </div>

      {/* Botón cancelar reserva */}
      <button
        className="cli-btn-cancelar-reserva mt-3"
        onClick={() => setReservaCancelar(r)}
      >
        Cancelar Reserva
      </button>

    </div>
  );

  return (
    <div className={`admin-contenedor ${tema}`}>
      <header className="admin-header">
        <div className="d-flex align-items-center gap-2">

          {/* Flecha para regresar al menú */}
          <button
            className="btn-volver"
            onClick={() => setVistaCliente("menu")}
          >
            ←
          </button>

          <div>
            <h5 className="admin-header-titulo">Reservas</h5>
            <small className="admin-header-subtitulo">Gestión de reservaciones</small>
          </div>

        </div>

        {/* Lado derecho: tema + perfil */}
        <div className="d-flex align-items-center gap-3">

          {/* Switch modo oscuro */}
          <div className="form-check form-switch mb-0">
            <input
              type="checkbox"
              className="form-check-input"
              id="switchTemaCliReservas"
              checked={tema === "dark"}
              onChange={cambiarTema}
            />
            <label className="form-check-label text-white" htmlFor="switchTemaCliReservas">
              {tema === "dark" ? "Oscuro" : "Claro"}
            </label>
          </div>

          {/* Botón perfil — regresa al login */}
          <button className="cli-btn-perfil" onClick={onLogout}>
            👤
          </button>

        </div>
      </header>

      <main className="container py-3">

        {/*  SECTION BOTÓN NUEVA RESERVA  */}
        <section className="mb-3">
          <button
            className="menu-btn-nuevo"
            onClick={() => setMostrarNueva(true)}
          >
            + Crear nueva reserva
          </button>
        </section>

        {/* SECTION MENSAJE RETROALIMENTACIÓN */}
        {mensaje && (
          <section className="menu-mensaje mb-3">
            {mensaje}
          </section>
        )}

        {/* SECTION LISTA DE RESERVAS */}
        {/* Mostramos cada reserva individualmente sin .map */}
        <section>
          {reservas[0] && <TarjetaReserva r={reservas[0]} />}
          {reservas[1] && <TarjetaReserva r={reservas[1]} />}
          {reservas[2] && <TarjetaReserva r={reservas[2]} />}
          {reservas[3] && <TarjetaReserva r={reservas[3]} />}
          {reservas[4] && <TarjetaReserva r={reservas[4]} />}
        </section>

      </main>

      
      {/* MODAL NUEVA RESERVA */}
      {mostrarNueva && (
        <CompModal
          title="Nueva Reserva"
          content={
            <div className="d-flex flex-column gap-2">

              <label className="reserva-label">Nombre del Cliente</label>
              <input
                className="form-control"
                placeholder="Ingrese el nombre"
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
              />

              <label className="reserva-label">Teléfono</label>
              <input
                className="form-control"
                placeholder="999 999 999"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />

              <label className="reserva-label">Fecha</label>
              <input
                className="form-control"
                placeholder="dd/mm/aaaa"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />

              <label className="reserva-label">Hora</label>
              <input
                className="form-control"
                placeholder="13:20"
                value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
              />

              <label className="reserva-label">Número de Personas</label>
              <input
                className="form-control"
                type="number"
                placeholder="0"
                value={form.personas}
                onChange={(e) => setForm({ ...form, personas: e.target.value })}
              />

              <label className="reserva-label">Mesa</label>
              <input
                className="form-control"
                placeholder="Seleccione mesa"
                value={form.mesa}
                onChange={(e) => setForm({ ...form, mesa: e.target.value })}
              />

              <label className="reserva-label">Tipo de Reserva</label>
              <label className="reserva-radio">
                <input
                  type="radio"
                  name="tipoNueva"
                  value="presencial"
                  checked={form.tipo === "presencial"}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                />
                👤 Reserva presencial
              </label>
              <label className="reserva-radio">
                <input
                  type="radio"
                  name="tipoNueva"
                  value="telefono"
                  checked={form.tipo === "telefono"}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                />
                📞 Reserva por teléfono
              </label>

              {/* Botón crear reserva — valida campos antes de guardar */}
              <button
                className="btn-reserva-guardar mt-2"
                onClick={guardarReserva}
              >
                Crear reserva
              </button>

            </div>
          }
          onClose={() => setMostrarNueva(false)}
        />
      )}

      {/* MODAL CONFIRMAR CANCELAR  */}
      {reservaCancelar && (
        <CompModal
          title="Cancelar Reserva"
          content={
            <div className="text-center">
              <p>¿Desea cancelar la reserva de la <strong>Mesa #{reservaCancelar.mesa}</strong>?</p>
              <div className="d-flex justify-content-center gap-3">
                {/* SI — cancela la reserva */}
                <button
                  className="btn-reserva btn-reserva-cancelar"
                  onClick={cancelarReserva}
                >
                  SI
                </button>
                {/* NO — cierra el modal sin cambios */}
                <button
                  className="btn-reserva btn-reserva-confirmar"
                  onClick={() => setReservaCancelar(null)}
                >
                  NO
                </button>
              </div>
            </div>
          }
          onClose={() => setReservaCancelar(null)}
        />
      )}
      
    <footer>
      <CompFooter />
    </footer>

      <CompNavBar  vistaAdmin={vistaCliente} setVistaAdmin={setVistaCliente} esCliente={true}
      />

    </div>
  );
}

export default ClienteReservas;