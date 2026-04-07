import React, { useState, useEffect } from "react";
import CompModal from "../../Componentes/CompModal";
import CompNavBar from "../../Componentes/CompNavBar";
import { useTema } from "../../Contex/ContexTema";
import CompFooter from "../../Componentes/CompFooter";

// Datos de las mesas del restaurante
const mesasIniciales = [
  { id: 1, estado: "Ocupada",    personas: 4, fecha: "16/02/2026", hora: "19:00" },
  { id: 2, estado: "Disponible", personas: 0, fecha: "",           hora: ""      },
  { id: 3, estado: "Disponible", personas: 0, fecha: "",           hora: ""      },
  { id: 4, estado: "Ocupada",    personas: 4, fecha: "18/02/2026", hora: "19:00" },
  { id: 5, estado: "Ocupada",    personas: 4, fecha: "16/02/2026", hora: "19:00" },
];

function ClienteMesas({ vistaCliente, setVistaCliente, onLogout, reservas, setReservas }) {

  // Trae el tema actual
  const { tema, cambiarTema } = useTema();

  // Lista de mesas
  const [mesas, setMesas] = useState(mesasIniciales);

  // Filtro activo: Todas, Disponibles u Ocupadas
  const [filtro, setFiltro] = useState("Todas");

  // Mesa seleccionada para reservar — null = modal cerrado
  const [mesaReservar, setMesaReservar] = useState(null);

  // Mensaje de retroalimentación
  const [mensaje, setMensaje] = useState("");

  // Formulario de reserva — mesa se pre-llena con la mesa seleccionada
  const [form, setForm] = useState({
    cliente: "", telefono: "", fecha: "",
    hora: "", personas: "", mesa: "", tipo: "presencial"
  });

  // Oculta el mensaje en 2 segundos — mismo patrón useEffect de CompHooks
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 2000);
      // Libera memoria igual que CompHooks
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  // Abre el modal de reserva y pre-llena el número de mesa
  const abrirReservar = (mesa) => {
    setMesaReservar(mesa);
    setForm({
      cliente: "", telefono: "", fecha: "",
      hora: "", personas: "",
      // Pre-llena el número de mesa seleccionada
      mesa: String(mesa.id),
      tipo: "presencial"
    });
  };

  // Guarda la reserva  valida que todos los campos estén llenos
 const guardarReserva = () => {
    if (
      !form.cliente  ||
      !form.telefono ||
      !form.fecha    ||
      !form.hora     ||
      !form.personas
    ) {
      alert("Por favor complete todos los campos");
      return;
    }

    // Marca la mesa como Ocupada
    setMesas((prev) =>
      prev.map((m) =>
        m.id === mesaReservar.id
          ? { ...m, estado: "Ocupada", personas: form.personas, fecha: form.fecha, hora: form.hora }
          : m
      )
    );

    // Agrega la reserva a la lista compartida de App.js
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
    setReservas((prev) => [...prev, nueva]);

    setMesaReservar(null);
    setMensaje("✅ Mesa reservada correctamente");
  };

  // Componente interno de tarjeta de mesa — evita repetir el bloque
  const TarjetaMesa = ({ m }) => (
    <div className="mesa-card">

      {/* Imagen de la mesa */}
      <img src="/img/mesas.png"
        alt={`Mesa ${m.id}`}
        className="mesa-img"
      />

      {/* Contenido de la tarjeta */}
      <div className="mesa-info">

        {/* Fila superior: nombre y botón reservar si está disponible */}
        <div className="d-flex justify-content-between align-items-center">
          <span className="mesa-nombre">Mesa #{m.id}</span>

          {/* Botón Reservar — solo aparece si está Disponible */}
          {m.estado === "Disponible" && (
            <button
              className="cli-btn-reservar-mesa"
              onClick={() => abrirReservar(m)}
            >
              Reservar
            </button>
          )}

          {/* Icono de personas — solo aparece si está Ocupada */}
          {m.estado === "Ocupada" && (
            <span className="cli-reserva-personas">👥 {m.personas}</span>
          )}
        </div>

        {/* Datos solo si está Ocupada */}
        {m.estado === "Ocupada" && (
          <div className="mesa-detalles">
            <small>📅 {m.fecha}</small><br />
            <small>⏱ {m.hora}</small><br />
            <small>👤 {m.personas} personas</small>
          </div>
        )}

        {/* Badge de estado */}
        <div className="mt-1">
          <span className={`mesa-badge ${m.estado === "Disponible" ? "mesa-badge-disponible" : "mesa-badge-ocupada"}`}>
            {m.estado}
          </span>
        </div>

      </div>
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
            <h5 className="admin-header-titulo">Mesas</h5>
            <small className="admin-header-subtitulo">Estado de disponibilidad</small>
          </div>

        </div>

        {/* Lado derecho: tema + perfil */}
        <div className="d-flex align-items-center gap-3">

          {/* Switch modo oscuro */}
          <div className="form-check form-switch mb-0">
            <input
              type="checkbox"
              className="form-check-input"
              id="switchTemaCliMesas"
              checked={tema === "dark"}
              onChange={cambiarTema}
            />
            <label className="form-check-label text-white" htmlFor="switchTemaCliMesas">
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

        {/* SECTION MENSAJE RETROALIMENTACIÓN  */}
        {mensaje && (
          <section className="menu-mensaje mb-3">
            {mensaje}
          </section>
        )}

        {/*  SECTION FILTROS  */}
        <section className="d-flex gap-2 mb-3">
          <button
            className={`filtro ${filtro === "Todas" ? "activo" : ""}`}
            onClick={() => setFiltro("Todas")}
          >
            Todas
          </button>
          <button
            className={`filtro ${filtro === "Disponibles" ? "activo" : ""}`}
            onClick={() => setFiltro("Disponibles")}
          >
            Disponibles
          </button>
          <button
            className={`filtro ${filtro === "Ocupadas" ? "activo" : ""}`}
            onClick={() => setFiltro("Ocupadas")}
          >
            Ocupadas
          </button>
        </section>

        {/* SECTION LISTA DE MESAS */}
        {/* Cada mesa se muestra solo si pasa el filtro activo */}
        <section>
          {filtro === "Todas" && (
            <>
              <TarjetaMesa m={mesas[0]} />
              <TarjetaMesa m={mesas[1]} />
              <TarjetaMesa m={mesas[2]} />
              <TarjetaMesa m={mesas[3]} />
              <TarjetaMesa m={mesas[4]} />
            </>
          )}

          {filtro === "Disponibles" && (
            <>
              {mesas[0].estado === "Disponible" && <TarjetaMesa m={mesas[0]} />}
              {mesas[1].estado === "Disponible" && <TarjetaMesa m={mesas[1]} />}
              {mesas[2].estado === "Disponible" && <TarjetaMesa m={mesas[2]} />}
              {mesas[3].estado === "Disponible" && <TarjetaMesa m={mesas[3]} />}
              {mesas[4].estado === "Disponible" && <TarjetaMesa m={mesas[4]} />}
            </>
          )}

          {filtro === "Ocupadas" && (
            <>
              {mesas[0].estado === "Ocupada" && <TarjetaMesa m={mesas[0]} />}
              {mesas[1].estado === "Ocupada" && <TarjetaMesa m={mesas[1]} />}
              {mesas[2].estado === "Ocupada" && <TarjetaMesa m={mesas[2]} />}
              {mesas[3].estado === "Ocupada" && <TarjetaMesa m={mesas[3]} />}
              {mesas[4].estado === "Ocupada" && <TarjetaMesa m={mesas[4]} />}
            </>
          )}
        </section>

      </main>


      {/*  MODAL RESERVAR MESA  */}
      {mesaReservar && (
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

              {/* Mesa pre-llenada y deshabilitada — no se puede cambiar */}
              <label className="reserva-label">Mesa</label>
              <input
                className="form-control"
                value={`Mesa #${form.mesa}`}
                disabled
              />

              <label className="reserva-label">Tipo de Reserva</label>
              <label className="reserva-radio">
                <input
                  type="radio"
                  name="tipoMesa"
                  value="presencial"
                  checked={form.tipo === "presencial"}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                />
                👤 Reserva presencial
              </label>
              <label className="reserva-radio">
                <input
                  type="radio"
                  name="tipoMesa"
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
          onClose={() => setMesaReservar(null)}
        />
      )}
        
      <footer>
        <CompFooter />
      </footer>


      
      <CompNavBar vistaAdmin={vistaCliente} setVistaAdmin={setVistaCliente} esCliente={true}
      />

    </div>
  );
}

export default ClienteMesas;