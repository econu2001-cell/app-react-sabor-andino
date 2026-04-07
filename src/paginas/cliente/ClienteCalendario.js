import React, { useState, useEffect } from "react";
import CompModal from "../../Componentes/CompModal";
import CompNavBar from "../../Componentes/CompNavBar";
import { useTema } from "../../Contex/ContexTema";
import CompFooter from "../../Componentes/CompFooter";
// Reservas del restaurante (días ocupados por otros) — días en rojo
const reservasRestaurante = [1, 3, 15, 21];

// Nombres de los meses para el encabezado del calendario
const nombresMeses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Días que tiene cada mes — índice 0 = Enero
const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Día de la semana en que empieza cada mes de 2026 (0=Dom, 1=Lun...)
const inicioPorMes = [4, 0, 0, 3, 5, 1, 3, 6, 2, 4, 0, 2];

function ClienteCalendario({ vistaCliente, setVistaCliente, onLogout, reservas, setReservas }) {

  // Trae el tema actual
  const { tema, cambiarTema } = useTema();

  // Mes actual que se muestra — empieza en marzo (índice 2)
  const [mesActual, setMesActual] = useState(2);

  // Día seleccionado al hacer click
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  // Controla el modal de nueva reserva
  const [mostrarNueva, setMostrarNueva] = useState(false);

  // Controla el modal de ver mi reserva
  const [mostrarMiReserva, setMostrarMiReserva] = useState(false);

  // Controla el modal de confirmación de cancelar
  const [mostrarCancelar, setMostrarCancelar] = useState(false);

  // Controla el modal de día ocupado por el restaurante
  const [mostrarOcupado, setMostrarOcupado] = useState(false);

  // Controla el modal de confirmación de reserva exitosa
  const [mostrarExito, setMostrarExito] = useState(false);

  // Mensaje de retroalimentación
  const [mensaje, setMensaje] = useState("");

  // Formulario de nueva reserva
  const [form, setForm] = useState({
    cliente: "", telefono: "", fecha: "",
    hora: "", personas: "", mesa: "", tipo: "presencial"
  });

  // Oculta el mensaje en 2 segundos — mismo patrón useEffect de CompHooks
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  // Avanza al siguiente mes
  const mesSiguiente = () => {
    if (mesActual < 11) setMesActual(mesActual + 1);
  };

  // Regresa al mes anterior
  const mesAnterior = () => {
    if (mesActual > 0) setMesActual(mesActual - 1);
  };

  // Busca si hay una reserva del cliente en ese día y mes
  const buscarMiReserva = (dia) => {
    return reservas.find((r) =>
      r.fecha === `${dia}/${String(mesActual + 1).padStart(2, "0")}/2026`
    );
  };

  // Maneja el click en un día del calendario
  const handleClickDia = (dia) => {
    if (!dia) return;
    setDiaSeleccionado(dia);

    // Si el día tiene reserva del restaurante → muestra aviso
    if (mesActual === 2 && reservasRestaurante.includes(dia)) {
      setMostrarOcupado(true);
      return;
    }

    // Si el cliente tiene una reserva en ese día → muestra su reserva
    const miReserva = buscarMiReserva(dia);
    if (miReserva) {
      setMostrarMiReserva(true);
      return;
    }

    // Si el día está libre → abre formulario con fecha pre-llenada
    setForm({
      cliente: "", telefono: "",
      fecha: `${dia}/${String(mesActual + 1).padStart(2, "0")}/2026`,
      hora: "", personas: "", mesa: "", tipo: "presencial"
    });
    setMostrarNueva(true);
  };

  // Guarda la nueva reserva — valida todos los campos
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
    // Crea la nueva reserva
    const nueva = {
      id:       String(reservas.length + 1).padStart(3, "0"),
      mesa:     form.mesa,
      telefono: form.telefono,
      fecha:    form.fecha,
      hora:     form.hora,
      personas: form.personas,
      tipo:     form.tipo,
      estado:   "Confirmada",
    };
    // Agrega a la lista compartida de App.js
    setReservas((prev) => [...prev, nueva]);
    setMostrarNueva(false);
    // Resetea el formulario
    setForm({ cliente: "", telefono: "", fecha: "", hora: "", personas: "", mesa: "", tipo: "presencial" });
    // Muestra modal de éxito — requiere click en Aceptar para cerrar
    setMostrarExito(true);
  };

  // Cancela la reserva del día seleccionado
  const cancelarReserva = () => {
    const fechaBuscar = `${diaSeleccionado}/${String(mesActual + 1).padStart(2, "0")}/2026`;
    setReservas((prev) => prev.filter((r) => r.fecha !== fechaBuscar));
    setMostrarCancelar(false);
    setMostrarMiReserva(false);
    setMensaje("❌ Reserva cancelada");
  };

  // Obtiene la clase CSS del día según su estado
  const claseDelDia = (dia) => {
    if (!dia) return "";
    // Verde — mi reserva
    if (buscarMiReserva(dia)) return "cal-dia cal-dia-mia";
    // Rojo — reserva del restaurante
    if (mesActual === 2 && reservasRestaurante.includes(dia)) return "cal-dia cal-dia-reserva";
    // Libre
    return "cal-dia cal-dia-libre";
  };

  // Genera los espacios vacíos antes del día 1 según el mes
  const espaciosVacios = inicioPorMes[mesActual];

  // Total de días del mes actual
  const totalDias = diasPorMes[mesActual];

  // Reserva del día seleccionado para mostrar en modal
  const miReservaSeleccionada = diaSeleccionado ? buscarMiReserva(diaSeleccionado) : null;

  return (
    <div className={`admin-contenedor ${tema}`}>

      <header className="admin-header">
        <div className="d-flex align-items-center gap-2">

          {/* Flecha para regresar al menú */}
          <button className="btn-volver" onClick={() => setVistaCliente("menu")}>←</button>

          <div>
            <h5 className="admin-header-titulo">Calendario de reservas</h5>
            <small className="admin-header-subtitulo">Selecciona fecha y completa el formulario</small>
          </div>

        </div>

        {/* Lado derecho: tema + ver clase + perfil */}
        <div className="d-flex align-items-center gap-2">

          {/* Switch modo oscuro */}
          <div className="form-check form-switch mb-0">
            <input
              type="checkbox"
              className="form-check-input"
              id="switchTemaCliCal"
              checked={tema === "dark"}
              onChange={cambiarTema}
            />
            <label className="form-check-label text-white" htmlFor="switchTemaCliCal">
              {tema === "dark" ? "Oscuro" : "Claro"}
            </label>
          </div>

          {/* Botón perfil — regresa al login */}
          <button className="cli-btn-perfil" onClick={onLogout}>👤</button>

        </div>
      </header>

      <main className="container py-3">

        {/* SECTION BOTÓN NUEVA RESERVA  */}
        <section className="mb-3">
          <button
            className="menu-btn-nuevo"
            onClick={() => {
              setDiaSeleccionado(null);
              setForm({ cliente: "", telefono: "", fecha: "", hora: "", personas: "", mesa: "", tipo: "presencial" });
              setMostrarNueva(true);
            }}
          >
            + Crear nueva reserva
          </button>
        </section>

        {/*  SECTION MENSAJE RETROALIMENTACIÓN  */}
        {mensaje && (
          <section className="menu-mensaje mb-3">{mensaje}</section>
        )}

        {/* SECTION CALENDARIO  */}
        <section className="cal-contenedor">
          <div className="cal-fondo">

            {/* Encabezado del mes con botones < > */}
            <div className="cal-mes-header">
              <button className="cal-btn-mes" onClick={mesAnterior}>‹</button>
              <span className="cal-mes-titulo">{nombresMeses[mesActual]} de 2026</span>
              <button className="cal-btn-mes" onClick={mesSiguiente}>›</button>
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

              {/* Espacios vacíos antes del día 1 */}
              {espaciosVacios >= 1 && <span></span>}
              {espaciosVacios >= 2 && <span></span>}
              {espaciosVacios >= 3 && <span></span>}
              {espaciosVacios >= 4 && <span></span>}
              {espaciosVacios >= 5 && <span></span>}
              {espaciosVacios >= 6 && <span></span>}

              {/* Días del mes — cada uno con su clase dinámica */}
              {totalDias >= 1  && <button onClick={() => handleClickDia(1)}  className={claseDelDia(1)}>1</button>}
              {totalDias >= 2  && <button onClick={() => handleClickDia(2)}  className={claseDelDia(2)}>2</button>}
              {totalDias >= 3  && <button onClick={() => handleClickDia(3)}  className={claseDelDia(3)}>3</button>}
              {totalDias >= 4  && <button onClick={() => handleClickDia(4)}  className={claseDelDia(4)}>4</button>}
              {totalDias >= 5  && <button onClick={() => handleClickDia(5)}  className={claseDelDia(5)}>5</button>}
              {totalDias >= 6  && <button onClick={() => handleClickDia(6)}  className={claseDelDia(6)}>6</button>}
              {totalDias >= 7  && <button onClick={() => handleClickDia(7)}  className={claseDelDia(7)}>7</button>}
              {totalDias >= 8  && <button onClick={() => handleClickDia(8)}  className={claseDelDia(8)}>8</button>}
              {totalDias >= 9  && <button onClick={() => handleClickDia(9)}  className={claseDelDia(9)}>9</button>}
              {totalDias >= 10 && <button onClick={() => handleClickDia(10)} className={claseDelDia(10)}>10</button>}
              {totalDias >= 11 && <button onClick={() => handleClickDia(11)} className={claseDelDia(11)}>11</button>}
              {totalDias >= 12 && <button onClick={() => handleClickDia(12)} className={claseDelDia(12)}>12</button>}
              {totalDias >= 13 && <button onClick={() => handleClickDia(13)} className={claseDelDia(13)}>13</button>}
              {totalDias >= 14 && <button onClick={() => handleClickDia(14)} className={claseDelDia(14)}>14</button>}
              {totalDias >= 15 && <button onClick={() => handleClickDia(15)} className={claseDelDia(15)}>15</button>}
              {totalDias >= 16 && <button onClick={() => handleClickDia(16)} className={claseDelDia(16)}>16</button>}
              {totalDias >= 17 && <button onClick={() => handleClickDia(17)} className={claseDelDia(17)}>17</button>}
              {totalDias >= 18 && <button onClick={() => handleClickDia(18)} className={claseDelDia(18)}>18</button>}
              {totalDias >= 19 && <button onClick={() => handleClickDia(19)} className={claseDelDia(19)}>19</button>}
              {totalDias >= 20 && <button onClick={() => handleClickDia(20)} className={claseDelDia(20)}>20</button>}
              {totalDias >= 21 && <button onClick={() => handleClickDia(21)} className={claseDelDia(21)}>21</button>}
              {totalDias >= 22 && <button onClick={() => handleClickDia(22)} className={claseDelDia(22)}>22</button>}
              {totalDias >= 23 && <button onClick={() => handleClickDia(23)} className={claseDelDia(23)}>23</button>}
              {totalDias >= 24 && <button onClick={() => handleClickDia(24)} className={claseDelDia(24)}>24</button>}
              {totalDias >= 25 && <button onClick={() => handleClickDia(25)} className={claseDelDia(25)}>25</button>}
              {totalDias >= 26 && <button onClick={() => handleClickDia(26)} className={claseDelDia(26)}>26</button>}
              {totalDias >= 27 && <button onClick={() => handleClickDia(27)} className={claseDelDia(27)}>27</button>}
              {totalDias >= 28 && <button onClick={() => handleClickDia(28)} className={claseDelDia(28)}>28</button>}
              {totalDias >= 29 && <button onClick={() => handleClickDia(29)} className={claseDelDia(29)}>29</button>}
              {totalDias >= 30 && <button onClick={() => handleClickDia(30)} className={claseDelDia(30)}>30</button>}
              {totalDias >= 31 && <button onClick={() => handleClickDia(31)} className={claseDelDia(31)}>31</button>}

            </div>

            {/* Leyenda */}
            <div className="d-flex gap-3 mt-3">
              <div className="cal-leyenda">
                <span className="cal-leyenda-color"></span>
                <small>Días con reserva</small>
              </div>
              <div className="cal-leyenda">
                <span className="cal-leyenda-color-mia"></span>
                <small>Tus reservas</small>
              </div>
            </div>

          </div>
        </section>

      </main>



      {/* MODAL NUEVA RESERVA*/}
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
                // Si viene pre-llenada desde el calendario no se puede editar
                readOnly={!!diaSeleccionado}
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
                  type="radio" name="tipoCalNueva" value="presencial"
                  checked={form.tipo === "presencial"}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                />
                👤 Reserva presencial
              </label>
              <label className="reserva-radio">
                <input
                  type="radio" name="tipoCalNueva" value="telefono"
                  checked={form.tipo === "telefono"}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                />
                📞 Reserva por teléfono
              </label>

              <button className="btn-reserva-guardar mt-2" onClick={guardarReserva}>
                Crear reserva
              </button>

            </div>
          }
          onClose={() => setMostrarNueva(false)}
        />
      )}

      {/* MODAL ÉXITO — requiere click en Aceptar*/}
      {mostrarExito && (
        <CompModal
          title="¡Reserva exitosa!"
          content={
            <div className="text-center">
              <p style={{ fontSize: "40px" }}>🎉</p>
              <p>Tu mesa ha sido reservada con éxito.</p>
              <button
                className="btn-reserva-guardar"
                onClick={() => setMostrarExito(false)}
              >
                Aceptar
              </button>
            </div>
          }
          onClose={() => setMostrarExito(false)}
        />
      )}

      {/*  MODAL DÍA OCUPADO  */}
      {mostrarOcupado && (
        <CompModal
          title="Día no disponible"
          content={
            <div className="text-center">
              <p style={{ fontSize: "32px" }}>🚫</p>
              <p>Este día ya tiene reservas del restaurante.<br />Solo puedes ver tus propias reservas.</p>
              <button
                className="btn-reserva-guardar"
                onClick={() => setMostrarOcupado(false)}
              >
                Aceptar
              </button>
            </div>
          }
          onClose={() => setMostrarOcupado(false)}
        />
      )}

      {/* MODAL VER MI RESERVA  */}
      {mostrarMiReserva && miReservaSeleccionada && (
        <CompModal
          title="Mis reservas"
          content={
            <div className="d-flex flex-column gap-2">

              {/* Mesa y personas */}
              <div className="d-flex justify-content-between align-items-center">
                <span className="cli-reserva-mesa">Mesa #{miReservaSeleccionada.mesa}</span>
                <span className="cli-reserva-personas">👥 {miReservaSeleccionada.personas}</span>
              </div>

              {/* Teléfono */}
              <div className="cli-reserva-icono-rojo-fila">
                <span className="cli-icono-cuadro">📞</span>
                <div>
                  <small>Teléfono</small><br />
                  <span>{miReservaSeleccionada.telefono}</span>
                </div>
              </div>

              {/* Fecha */}
              <div className="cli-reserva-icono-rojo-fila">
                <span className="cli-icono-cuadro">📅</span>
                <div>
                  <small>Fecha</small><br />
                  <span>{miReservaSeleccionada.fecha}</span>
                </div>
              </div>

              {/* Hora */}
              <div className="cli-reserva-icono-rojo-fila">
                <span className="cli-icono-cuadro">⏱</span>
                <div>
                  <small>Hora</small><br />
                  <span>{miReservaSeleccionada.hora}</span>
                </div>
              </div>

              {/* Tipo de reserva — solo lectura */}
              <p className="cli-reserva-label mb-1">Tipo de reserva</p>
              <div className={`reserva-radio ${miReservaSeleccionada.tipo === "presencial" ? "cli-radio-activo" : ""}`}>
                <input type="radio" readOnly checked={miReservaSeleccionada.tipo === "presencial"} onChange={() => {}} />
                👤 Reserva presencial
              </div>
              <div className={`reserva-radio ${miReservaSeleccionada.tipo === "telefono" ? "cli-radio-activo" : ""}`}>
                <input type="radio" readOnly checked={miReservaSeleccionada.tipo === "telefono"} onChange={() => {}} />
                📞 Reserva por teléfono
              </div>

              {/* Botón cancelar reserva */}
              <button
                className="cli-btn-cancelar-reserva mt-2"
                onClick={() => { setMostrarMiReserva(false); setMostrarCancelar(true); }}
              >
                Cancelar Reserva
              </button>

            </div>
          }
          onClose={() => setMostrarMiReserva(false)}
        />
      )}

      {/*  MODAL CONFIRMAR CANCELAR */}
      {mostrarCancelar && (
        <CompModal
          title="Cancelar Reserva"
          content={
            <div className="text-center">
              <p>¿Desea cancelar la reserva del día <strong>{diaSeleccionado}</strong>?</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn-reserva btn-reserva-cancelar" onClick={cancelarReserva}>SI</button>
                <button className="btn-reserva btn-reserva-confirmar" onClick={() => setMostrarCancelar(false)}>NO</button>
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
      <CompNavBar vistaAdmin={vistaCliente} setVistaAdmin={setVistaCliente} esCliente={true}
      />

    </div>
  );
}

export default ClienteCalendario;