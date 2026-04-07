import React, { useState } from "react";
import CompModal from "../../Componentes/CompModal";
import CompNavBar from "../../Componentes/CompNavBar";
import { useTema } from "../../Contex/ContexTema";
import CompFooter from "../../Componentes/CompFooter";

// Reservas simuladas con día del mes como clave
const reservasIniciales = {
  15: { cliente: "María González", telefono: "987654321", fecha: "Domingo, 15 de marzo", hora: "19:00", personas: 5, mesa: 2, tipo: "presencial", estado: "Confirmada" },
  21: { cliente: "Luis Martínez",  telefono: "987654321", fecha: "Viernes, 21 de marzo",  hora: "20:00", personas: 3, mesa: 4, tipo: "telefono",   estado: "Pendiente"  },
};

const diasMes = [
  1, 2, 3, 4, 5, 6, 7,    
  8, 9, 10, 11, 12, 13, 14, 
  15, 16, 17, 18, 19, 20, 21, 
  22, 23, 24, 25, 26, 27, 28, 
  29, 30, 31                
];

function AdminCalendario({ vistaAdmin, setVistaAdmin, onLogout, onVolver }) {
  
  const { tema, cambiarTema } = useTema();
  const [mes, setMes] = useState(3);   
  const [anio, setAnio] = useState(2026);

  // Reservas del mes — clave es el día
  const [reservas, setReservas] = useState(reservasIniciales);

  // Día seleccionado al hacer click
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  // Controla el modal de ver reserva
  const [mostrarReserva, setMostrarReserva] = useState(false);

  // Controla el modal de nueva reserva
  const [mostrarNueva, setMostrarNueva] = useState(false);

  // Controla el modal de editar reserva
  const [mostrarEditar, setMostrarEditar] = useState(false);

  // Controla el modal de cancelar reserva
  const [mostrarCancelar, setMostrarCancelar] = useState(false);

  // Mensaje de retroalimentación
  const [mensaje, setMensaje] = useState("");

  // Formulario de nueva reserva
  const [formNueva, setFormNueva] = useState({
    cliente: "", telefono: "", fecha: "", hora: "",
    personas: "", mesa: "", tipo: "presencial"
  });

  // Formulario de editar reserva
  const [formEditar, setFormEditar] = useState({});

  // Muestra mensaje y lo oculta en 2 segundos
  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 2000);
  };

  // Al hacer click en un día con reserva  abre modal de reserva
  // Al hacer click en día sin reserva abre modal de nueva reserva
  const handleClickDia = (dia) => {
    if (!dia) return;
    setDiaSeleccionado(dia);
    if (reservas[dia]) {
      setMostrarReserva(true);
    } else {
      // Pre-llena la fecha en el formulario
      setFormNueva({
        cliente: "", telefono: "",
        fecha: `${dia}/03/2026`,
        hora: "", personas: "", mesa: "", tipo: "presencial"
      });
      setMostrarNueva(true);
    }
  };

  // Guarda la nueva reserva — valida que todos los campos estén llenos
  const guardarNueva = () => {
    if (
      !formNueva.cliente  ||
      !formNueva.telefono ||
      !formNueva.fecha    ||
      !formNueva.hora     ||
      !formNueva.personas ||
      !formNueva.mesa
    ) {
      alert("Por favor complete todos los campos");
      return;
    }
    setReservas((prev) => ({
      ...prev,
      [diaSeleccionado]: { ...formNueva, estado: "Confirmada" }
    }));
    setMostrarNueva(false);
    mostrarMensaje("✅ Reserva creada correctamente");
  };

  // Abre el modal de edición con los datos actuales
  const abrirEditar = () => {
    setFormEditar({ ...reservas[diaSeleccionado] });
    setMostrarReserva(false);
    setMostrarEditar(true);
  };

  // Guarda los cambios de edición
  const guardarEditar = () => {
    setReservas((prev) => ({
      ...prev,
      [diaSeleccionado]: { ...formEditar }
    }));
    setMostrarEditar(false);
    mostrarMensaje("✅ Reserva actualizada correctamente");
  };

  // Cancela la reserva del día seleccionado
  const cancelarReserva = () => {
    setReservas((prev) => {
      const nuevas = { ...prev };
      delete nuevas[diaSeleccionado];
      return nuevas;
    });
    setMostrarCancelar(false);
    mostrarMensaje("❌ Reserva cancelada");
  };

  
  return (
    <div className={`admin-contenedor ${tema} d-flex flex-column min-vh-100`}>

    <header className="admin-header d-flex justify-content-between align-items-center">

  {/* IZQUIERDA: flecha + títulos */}
  <div className="d-flex align-items-center gap-3">

    <button className="btn-volver" onClick={onVolver}>
      ←
    </button>

    <div className="text-start">
      <h5 className="admin-header-titulo m-0">Calendario de reservas</h5>
      <small className="admin-header-subtitulo">
        Selecciona fecha y completa el formulario
      </small>
    </div>

  </div>

  {/* DERECHA: switch + cerrar */}
  <div className="d-flex align-items-center gap-3">

    <div className="form-check form-switch mb-0">
      <input
        type="checkbox"
        className="form-check-input"
        id="switchTemaCalendario"
        checked={tema === "dark"}
        onChange={cambiarTema}
      />
      <label
        className="form-check-label text-white"
        htmlFor="switchTemaCalendario"
      >
        {tema === "dark" ? "Tema oscuro" : "Tema claro"}
      </label>
    </div>

    <button
      className="btn-cerrar"
      onClick={onLogout}
    >
      Cerrar sesión
    </button>

  </div>

</header>

      <main className="container py-3 flex-grow-1">

        {/* SECTION BOTÓN NUEVA RESERVA */}
        <section className="mb-3">
          <button
            className="menu-btn-nuevo"
            onClick={() => {
              setDiaSeleccionado(null);
              setFormNueva({ cliente: "", telefono: "", fecha: "", hora: "", personas: "", mesa: "", tipo: "presencial" });
              setMostrarNueva(true);
            }}
          >
            + Crear nueva reserva
          </button>
        </section>

        {/*SECTION MENSAJE RETROALIMENTACIÓN */}
        {mensaje && (
          <section className="menu-mensaje mb-3">
            {mensaje}
          </section>
        )}
        {/* SECTION CALENDARIO */}
<section className="cal-contenedor">
  <div className="cal-fondo">

    {/* Encabezado del mes con botones < > */}
    <div className="cal-mes-header">
      <button
        className="cal-btn-mes"
        onClick={() => {
          if (mes === 1) { setMes(12); setAnio(anio - 1); }
          else { setMes(mes - 1); }
        }}
      >
        ‹
      </button>

      <span className="cal-mes-titulo">
        {new Date(anio, mes - 1).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
      </span>

      <button
        className="cal-btn-mes"
        onClick={() => {
          if (mes === 12) { setMes(1); setAnio(anio + 1); }
          else { setMes(mes + 1); }
        }}
      >
        ›
      </button>
    </div>

    {/* Encabezados de días de la semana */}
    <div className="cal-semana">
      <span>Dom</span>
      <span>Lun</span>
      <span>Mar</span>
      <span>Mié</span>
      <span>Jue</span>
      <span>Vie</span>
      <span>Sáb</span>
    </div>

    {/* Grilla de días */}
    <div className="cal-grilla">

      {/* Espacios iniciales */}
      {Array(new Date(anio, mes - 1, 1).getDay()).fill(null).map((_, i) => (
        <span key={`espacio-${i}`}></span>
      ))}

      {/* Días del mes */}
      {diasMes.map((dia) => (
        <button
          key={dia}
          onClick={() => handleClickDia(dia)}
          className={`cal-dia ${reservas[dia] ? "cal-dia-reserva" : "cal-dia-libre"}`}
        >
          {dia}
        </button>
      ))}

    </div>

    {/* Leyenda */}
    <div className="d-flex gap-3 mt-3">
      <div className="cal-leyenda">
        <span className="cal-leyenda-color"></span>
        <small>Días con reserva</small>
      </div>
    </div>

          </div>
        </section>

      </main>

     
      {/* MODAL VER RESERVA*/}
      {mostrarReserva && diaSeleccionado && reservas[diaSeleccionado] && (
        <CompModal
          title={`Reserva del ${diaSeleccionado} de marzo`}
          content={
            <div className="d-flex flex-column gap-2">

              {/* Nombre y estado */}
              <div className="d-flex justify-content-between align-items-center">
                <strong>{reservas[diaSeleccionado].cliente}</strong>
                <span className={`reserva-badge ${reservas[diaSeleccionado].estado === "Confirmada" ? "reserva-badge-confirmada" : "reserva-badge-pendiente"}`}>
                  {reservas[diaSeleccionado].estado}
                </span>
              </div>

              {/* Teléfono */}
              <small>📞 Teléfono<br />{reservas[diaSeleccionado].telefono}</small>

              {/* Detalles */}
              <div className="d-flex gap-3 reserva-detalles">
                <span>📅 Fecha<br /><strong>{reservas[diaSeleccionado].fecha}</strong></span>
                <span>⏱ Hora<br /><strong>{reservas[diaSeleccionado].hora}</strong></span>
                <span>👤 Personas<br /><strong>{reservas[diaSeleccionado].personas}</strong></span>
                <span>Mesa<br /><strong>#{reservas[diaSeleccionado].mesa}</strong></span>
              </div>

              {/* Botones editar y cancelar */}
              <div className="d-flex gap-2 mt-2">
                <button className="btn-reserva btn-reserva-editar" onClick={abrirEditar}>
                  ✏️ Editar
                </button>
                <button
                  className="btn-reserva btn-reserva-cancelar"
                  onClick={() => { setMostrarReserva(false); setMostrarCancelar(true); }}
                >
                  ✖ Cancelar
                </button>
              </div>

              {/* Botón crear nueva reserva dentro del modal */}
              <button
                className="menu-btn-nuevo mt-2"
                onClick={() => {
                  setMostrarReserva(false);
                  setDiaSeleccionado(null);
                  setFormNueva({ cliente: "", telefono: "", fecha: "", hora: "", personas: "", mesa: "", tipo: "presencial" });
                  setMostrarNueva(true);
                }}
              >
                + Crear nueva reserva
              </button>

            </div>
          }
          onClose={() => setMostrarReserva(false)}
        />
      )}

      {/* MODAL NUEVA RESERVA  */}
      {mostrarNueva && (
        <CompModal
          title="Nueva Reserva"
          content={
            <div className="d-flex flex-column gap-2">

              <label className="reserva-label">Nombre del Cliente</label>
              <input
                className="form-control"
                placeholder="Ingrese el nombre"
                value={formNueva.cliente}
                onChange={(e) => setFormNueva({ ...formNueva, cliente: e.target.value })}
              />

              <label className="reserva-label">Teléfono</label>
              <input
                className="form-control"
                placeholder="999 999 999"
                value={formNueva.telefono}
                onChange={(e) => setFormNueva({ ...formNueva, telefono: e.target.value })}
              />

              <label className="reserva-label">Fecha</label>
              <input
                className="form-control"
                placeholder="dd/mm/aaaa"
                value={formNueva.fecha}
                onChange={(e) => setFormNueva({ ...formNueva, fecha: e.target.value })}
              />

              <label className="reserva-label">Hora</label>
              <input
                className="form-control"
                placeholder="13:20"
                value={formNueva.hora}
                onChange={(e) => setFormNueva({ ...formNueva, hora: e.target.value })}
              />

              <label className="reserva-label">Número de Personas</label>
              <input
                className="form-control"
                type="number"
                placeholder="0"
                value={formNueva.personas}
                onChange={(e) => setFormNueva({ ...formNueva, personas: e.target.value })}
              />

              <label className="reserva-label">Mesa</label>
              <input
                className="form-control"
                placeholder="Seleccione mesa"
                value={formNueva.mesa}
                onChange={(e) => setFormNueva({ ...formNueva, mesa: e.target.value })}
              />

              <label className="reserva-label">Tipo de Reserva</label>
              <label className="reserva-radio">
                <input
                  type="radio" name="tipoNueva" value="presencial"
                  checked={formNueva.tipo === "presencial"}
                  onChange={(e) => setFormNueva({ ...formNueva, tipo: e.target.value })}
                />
                👤 Reserva presencial
              </label>
              <label className="reserva-radio">
                <input
                  type="radio" name="tipoNueva" value="telefono"
                  checked={formNueva.tipo === "telefono"}
                  onChange={(e) => setFormNueva({ ...formNueva, tipo: e.target.value })}
                />
                📞 Reserva por teléfono
              </label>

              <button className="btn-reserva-guardar mt-2" onClick={guardarNueva}>
                Crear reserva
              </button>

            </div>
          }
          onClose={() => setMostrarNueva(false)}
        />
      )}

      {/*  MODAL EDITAR RESERVA  */}
      {mostrarEditar && (
        <CompModal
          title="Editar Reserva"
          content={
            <div className="d-flex flex-column gap-2">

              <label className="reserva-label">Nombre del Cliente</label>
              <input
                className="form-control"
                value={formEditar.cliente}
                onChange={(e) => setFormEditar({ ...formEditar, cliente: e.target.value })}
              />

              <label className="reserva-label">Teléfono</label>
              <input
                className="form-control"
                value={formEditar.telefono}
                onChange={(e) => setFormEditar({ ...formEditar, telefono: e.target.value })}
              />

              <label className="reserva-label">Fecha</label>
              <input
                className="form-control"
                value={formEditar.fecha}
                onChange={(e) => setFormEditar({ ...formEditar, fecha: e.target.value })}
              />

              <label className="reserva-label">Hora</label>
              <input
                className="form-control"
                value={formEditar.hora}
                onChange={(e) => setFormEditar({ ...formEditar, hora: e.target.value })}
              />

              <label className="reserva-label">Número de Personas</label>
              <input
                className="form-control"
                type="number"
                value={formEditar.personas}
                onChange={(e) => setFormEditar({ ...formEditar, personas: e.target.value })}
              />

              <label className="reserva-label">Mesa</label>
              <input
                className="form-control"
                value={formEditar.mesa}
                onChange={(e) => setFormEditar({ ...formEditar, mesa: e.target.value })}
              />

              <label className="reserva-label">Tipo de Reserva</label>
              <label className="reserva-radio">
                <input
                  type="radio" name="tipoEditar" value="presencial"
                  checked={formEditar.tipo === "presencial"}
                  onChange={(e) => setFormEditar({ ...formEditar, tipo: e.target.value })}
                />
                👤 Reserva presencial
              </label>
              <label className="reserva-radio">
                <input
                  type="radio" name="tipoEditar" value="telefono"
                  checked={formEditar.tipo === "telefono"}
                  onChange={(e) => setFormEditar({ ...formEditar, tipo: e.target.value })}
                />
                📞 Reserva por teléfono
              </label>

              <button className="btn-reserva-guardar mt-2" onClick={guardarEditar}>
                Guardar cambios
              </button>

            </div>
          }
          onClose={() => setMostrarEditar(false)}
        />
      )}

      {/* MODAL CONFIRMAR CANCELAR*/}
      {mostrarCancelar && (
        <CompModal
          title="Cancelar Reserva"
          content={
            <div className="text-center">
              <p>¿Desea cancelar la reserva del día <strong>{diaSeleccionado}</strong>?</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn-reserva btn-reserva-cancelar" onClick={cancelarReserva}>
                  SI
                </button>
                <button className="btn-reserva btn-reserva-confirmar" onClick={() => setMostrarCancelar(false)}>
                  NO
                </button>
              </div>
            </div>
          }
          onClose={() => setMostrarCancelar(false)}
        />
      )}
      <footer>
        <CompFooter />
      </footer>

      {/*  BARRA DE NAVEGACIÓN INFERIOR  */}
      <CompNavBar vistaAdmin={vistaAdmin} setVistaAdmin={setVistaAdmin} />

    </div>
  );
}

export default AdminCalendario;