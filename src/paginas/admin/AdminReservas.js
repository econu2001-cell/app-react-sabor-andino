import React, { useState } from "react";
import CompModal from "../../Componentes/CompModal";
import CompNavBar from "../../Componentes/CompNavBar";
import { useTema } from "../../Contex/ContexTema";
import CompFooter from "../../Componentes/CompFooter";

// Datos simulados de reservas del restaurante
const reservasIniciales = [
  {
    id: "001", cliente: "María González", telefono: "987654321",
    fecha: "Domingo, 15 de marzo", hora: "19:00", personas: 5,
    mesa: 2, tipo: "presencial", estado: "Confirmada",
  },
  {
    id: "002", cliente: "Luis Martínez", telefono: "987654321",
    fecha: "Domingo, 15 de marzo", hora: "19:00", personas: 8,
    mesa: 4, tipo: "telefono", estado: "Pendiente",
  },
  {
    id: "003", cliente: "Jorge Sánchez", telefono: "987654321",
    fecha: "Sábado, 21 de marzo", hora: "19:00", personas: 4,
    mesa: 5, tipo: "presencial", estado: "Confirmada",
  },
];

// Relaciona cada estado con su clase CSS de badge
const estadoClase = {
  "Confirmada": "reserva-badge-confirmada",
  "Pendiente":  "reserva-badge-pendiente",
  "Cancelada":  "reserva-badge-cancelada",
};

function AdminReservas({ vistaAdmin, setVistaAdmin, onLogout, onVolver  }) {

  const { tema, cambiarTema } = useTema();
  // Lista de reservas — empieza con los datos simulados
  const [reservas, setReservas] = useState(reservasIniciales);

  // Filtro activo: Todas, Pendientes o Confirmadas
  const [filtro, setFiltro] = useState("Todas");

  // Reserva seleccionada para editar — null = modal cerrado
  const [reservaEditar, setReservaEditar] = useState(null);

  // Reserva seleccionada para cancelar — null = modal cerrado
  const [reservaCancelar, setReservaCancelar] = useState(null);

  // Guarda los datos del formulario de edición
  const [form, setForm] = useState({});

  // Filtra las reservas según el botón activo
  const reservasFiltradas = reservas.filter((r) => {
    if (filtro === "Todas")       return true;
    if (filtro === "Pendientes")  return r.estado === "Pendiente";
    if (filtro === "Confirmadas") return r.estado === "Confirmada";
    return true;
  });

  // Abre el modal de edición con los datos de la reserva seleccionada
  const abrirEditar = (reserva) => {
    setReservaEditar(reserva);
    // Copia los datos actuales al formulario
    setForm({ ...reserva });
  };

  // Guarda los cambios del formulario en la lista de reservas
  const guardarCambios = () => {
    setReservas((prev) =>
      prev.map((r) => (r.id === form.id ? { ...form } : r))
    );
    setReservaEditar(null);
  };

  // Confirma una reserva pendiente directamente
  const confirmarReserva = (id) => {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: "Confirmada" } : r))
    );
  };

  // Cancela la reserva seleccionada
  const cancelarReserva = () => {
    setReservas((prev) =>
      prev.map((r) =>
        r.id === reservaCancelar.id ? { ...r, estado: "Cancelada" } : r
      )
    );
    setReservaCancelar(null);
  };

  return (
    <div className={`admin-contenedor ${tema} d-flex flex-column min-vh-100`}>

      
     <header className="admin-header d-flex justify-content-between align-items-center">

        {/* LADO IZQUIERDO: botón + título juntos */}
        <div className="d-flex align-items-center gap-3">

          <button className="btn-volver" onClick={onVolver}>
            ←
          </button>

          <div className="text-start">
            <h5 className="admin-header-titulo m-0">Gestión de Reservas</h5>
            <small className="admin-header-subtitulo">
              Administrar reservaciones
            </small>
          </div>

        </div>

        {/* LADO DERECHO: switch y logout */}
        <div className="d-flex align-items-center gap-3">
          <div className="form-check form-switch mb-0">
            <input
              type="checkbox"
              className="form-check-input"
              id="switchTemaReservas"
              checked={tema === "dark"}
              onChange={cambiarTema}
            />
            <label className="form-check-label text-white" htmlFor="switchTemaReservas">
              {tema === "dark" ? "Tema oscuro" : "Tema claro"}
            </label>
          </div>

          <button className="btn-cerrar" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>

      </header>

         {/* CONTENIDO */}
    <main className="flex-grow-1">
      
      {/* FILTROS  */}
      <div className="d-flex gap-2 p-3">
        <button
          className={`filtro ${filtro === "Todas" ? "activo" : ""}`}
          onClick={() => setFiltro("Todas")}
        >
          Todas
        </button>
        <button
          className={`filtro ${filtro === "Pendientes" ? "activo" : ""}`}
          onClick={() => setFiltro("Pendientes")}
        >
          Pendientes
        </button>
        <button
          className={`filtro ${filtro === "Confirmadas" ? "activo" : ""}`}
          onClick={() => setFiltro("Confirmadas")}
        >
          Confirmadas
        </button>
      </div>

      {/* LISTA DE RESERVAS  */}
      <div className="px-3">
        {reservasFiltradas.map((r) => (
          <div key={r.id} className="reserva-card">

            {/* Fila superior: nombre y badge de estado */}
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="reserva-nombre">{r.cliente}</span>
              <span className={`reserva-badge ${estadoClase[r.estado]}`}>
                {r.estado}
              </span>
            </div>

            {/* Teléfono */}
            <p className="reserva-dato mb-2">📞 {r.telefono}</p>

            {/* Detalles: fecha, hora, personas, mesa */}
            <div className="d-flex gap-3 reserva-detalles mb-3">
              <span>📅 Fecha<br /><strong>{r.fecha}</strong></span>
              <span>⏱ Hora<br /><strong>{r.hora}</strong></span>
              <span>👤 Personas<br /><strong>{r.personas}</strong></span>
              <span>Mesa<br /><strong>#{r.mesa}</strong></span>
            </div>

            {/* Botones de acción según el estado */}
            <div className="d-flex gap-2">

              {/* Si está Confirmada → botón Editar */}
              {r.estado === "Confirmada" && (
                <button
                  className="btn-reserva btn-reserva-editar"
                  onClick={() => abrirEditar(r)}
                >
                  ✏️ Editar
                </button>
              )}

              {/* Si está Pendiente → botón Confirmar */}
              {r.estado === "Pendiente" && (
                <button
                  className="btn-reserva btn-reserva-confirmar"
                  onClick={() => confirmarReserva(r.id)}
                >
                  ✔️ Confirmar
                </button>
              )}

              {/* Botón Cancelar — aparece siempre excepto si ya está Cancelada */}
              {r.estado !== "Cancelada" && (
                <button
                  className="btn-reserva btn-reserva-cancelar"
                  onClick={() => setReservaCancelar(r)}
                >
                  ✖ Cancelar
                </button>
              )}

            </div>
          </div>
        ))}
      </div>

      {/*  MODAL EDITAR RESERVA  */}
      {reservaEditar && (
        <CompModal
          title={`Editar Reserva`}
          content={
            <div className="d-flex flex-column gap-2">

              <label className="reserva-label">Nombre del Cliente</label>
              <input
                className="form-control"
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
              />

              <label className="reserva-label">Teléfono</label>
              <input
                className="form-control"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />

              <label className="reserva-label">Fecha</label>
              <input
                className="form-control"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />

              <label className="reserva-label">Hora</label>
              <input
                className="form-control"
                value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
              />

              <label className="reserva-label">Número de Personas</label>
              <input
                className="form-control"
                type="number"
                value={form.personas}
                onChange={(e) => setForm({ ...form, personas: e.target.value })}
              />

              <label className="reserva-label">Mesa</label>
              <select
                className="form-control"
                value={form.mesa}
                onChange={(e) => setForm({ ...form, mesa: e.target.value })}
              >
                <option value="2">Mesa 2</option>
                <option value="4">Mesa 4</option>
                <option value="5">Mesa 5</option>
                <option value="6">Mesa 6</option>
              </select>

              <label className="reserva-label">Tipo de Reserva</label>
              <label className="reserva-radio">
                <input
                  type="radio"
                  name="tipo"
                  value="presencial"
                  checked={form.tipo === "presencial"}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                />
                👤 Reserva presencial
              </label>
              <label className="reserva-radio">
                <input
                  type="radio"
                  name="tipo"
                  value="telefono"
                  checked={form.tipo === "telefono"}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                />
                📞 Reserva por teléfono
              </label>

              {/* Botón guardar cambios */}
              <button
                className="btn-reserva-guardar mt-2"
                onClick={guardarCambios}
              >
                Guardar cambios
              </button>

            </div>
          }
          onClose={() => setReservaEditar(null)}
        />
      )}

      {/*  MODAL CONFIRMAR CANCELACIÓN*/}
      {reservaCancelar && (
        <CompModal
          title="Cancelar Reserva"
          content={
            <div className="text-center">
              <p>¿Desea cancelar la Reserva?</p>
              <div className="d-flex justify-content-center gap-3">
                {/* SI — cancela la reserva */}
                <button
                  className="btn-reserva btn-reserva-confirmar"
                  onClick={cancelarReserva}
                >
                  SI
                </button>
                {/* NO — cierra el modal sin cambios */}
                <button
                  className="btn-reserva btn-reserva-cancelar"
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
      </main>

    <footer className="mt-auto">
      <CompFooter />
    </footer>

      {/*  BARRA DE NAVEGACIÓN INFERIOR  */}
      <CompNavBar vistaAdmin={vistaAdmin} setVistaAdmin={setVistaAdmin} />

    </div>
  );
}

export default AdminReservas;