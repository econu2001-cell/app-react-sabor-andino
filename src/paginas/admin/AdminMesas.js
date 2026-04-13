import React, { useState } from "react";
import CompModal from "../../Componentes/CompModal";
import CompNavBar from "../../Componentes/CompNavBar";
import { useTema } from "../../Contex/ContexTema";
import CompFooter from "../../Componentes/CompFooter";
// Datos simulados de las mesas del restaurante
const mesasIniciales = [
  { id: 1, estado: "Ocupada",    cliente: "Ana Torres",   personas: 4, hora: "21:00" },
  { id: 2, estado: "Disponible", cliente: "",             personas: 0, hora: ""      },
  { id: 3, estado: "Disponible", cliente: "",             personas: 0, hora: ""      },
  { id: 4, estado: "Ocupada",    cliente: "Luis Pérez",   personas: 3, hora: "20:00" },
  { id: 5, estado: "Ocupada",    cliente: "María Quispe", personas: 2, hora: "19:30" },
];

// Relaciona cada estado con su clase CSS de badge
const estadoClase = {
  "Disponible": "mesa-badge-disponible",
  "Ocupada":    "mesa-badge-ocupada",
};

function AdminMesas({ vistaAdmin, setVistaAdmin, onLogout, onVolver   }) {

  // Trae el tema actual igual que en AdminPanel
  const { tema, cambiarTema } = useTema();

  // Lista de mesas — empieza con los datos simulados
  const [mesas, setMesas] = useState(mesasIniciales);

  // Filtro activo: Todas, Disponibles u Ocupadas
  const [filtro, setFiltro] = useState("Todas");

  // Mesa seleccionada para editar — null = modal cerrado
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  // Cambia el estado de una mesa entre Ocupada y Disponible
  const cambiarEstado = (id) => {
    setMesas((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              estado:   m.estado === "Ocupada" ? "Disponible" : "Ocupada",
              cliente:  m.estado === "Ocupada" ? "" : m.cliente,
              personas: m.estado === "Ocupada" ? 0  : m.personas,
              hora:     m.estado === "Ocupada" ? "" : m.hora,
            }
          : m
      )
    );
    setMesaSeleccionada(null);
  };

  // Filtra manualmente cada mesa según el filtro activo
  const mesa1 = mesas[0];
  const mesa2 = mesas[1];
  const mesa3 = mesas[2];
  const mesa4 = mesas[3];
  const mesa5 = mesas[4];

  // Función que decide si una mesa se muestra según el filtro
  const mostrar = (m) => {
    if (filtro === "Todas")       return true;
    if (filtro === "Disponibles") return m.estado === "Disponible";
    if (filtro === "Ocupadas")    return m.estado === "Ocupada";
    return true;
  };

  // Componente interno para mostrar cada tarjeta de mesa
 
  const TarjetaMesa = ({ m }) => (
    <div className="mesa-card">

      {/* Imagen de la mesa */}
      <img src="/img/mesas.png"
        alt={`Mesa ${m.id}`}
        className="mesa-img"
      />

      {/* Contenido de la tarjeta */}
      <div className="mesa-info">

        {/* Nombre de la mesa */}
        <span className="mesa-nombre">Mesa #{m.id}</span>

        {/* Datos solo si está Ocupada */}
        {m.estado === "Ocupada" && (
          <div className="mesa-detalles">
            <small>📅 {new Date().toLocaleDateString()}</small><br />
            <small>⏱ {m.hora}</small><br />
            <small>👤 {m.personas} personas</small>
          </div>
        )}

        {/* Badge de estado con botón editar */}
        <div className="d-flex align-items-center gap-2 mt-1">
          <span className={`mesa-badge ${estadoClase[m.estado]}`}>
            {m.estado}
          </span>
          {/* Botón lápiz para abrir modal */}
          <button
            className="mesa-btn-editar"
            onClick={() => setMesaSeleccionada(m)}
          >
            ✏️
          </button>
        </div>

      </div>
    </div>
  );

  return (
    <div className={`admin-contenedor ${tema} d-flex flex-column min-vh-100`}>

     <header className="admin-header d-flex justify-content-between align-items-center">

        {/* IZQUIERDA: flecha + títulos */}
        <div className="d-flex align-items-center gap-3">

          <button className="btn-volver" onClick={onVolver}>
            ←
          </button>

          <div className="text-start">
            <h5 className="admin-header-titulo m-0">Mesas</h5>
            <small className="admin-header-subtitulo">
              Estado de disponibilidad
            </small>
          </div>

        </div>

        {/* DERECHA: tema + cerrar */}
        <div className="d-flex align-items-center gap-3">

          <div className="form-check form-switch mb-0">
            <input
              type="checkbox"
              className="form-check-input"
              id="switchTemaMesas"
              checked={tema === "dark"}
              onChange={cambiarTema}
            />
            <label
              className="form-check-label text-white"
              htmlFor="switchTemaMesas"
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

        {/*  SECTION LISTA DE MESAS */}
        {/* Cada mesa se muestra solo si pasa el filtro activo */}
        <section>
          {mostrar(mesa1) && <TarjetaMesa m={mesa1} />}
          {mostrar(mesa2) && <TarjetaMesa m={mesa2} />}
          {mostrar(mesa3) && <TarjetaMesa m={mesa3} />}
          {mostrar(mesa4) && <TarjetaMesa m={mesa4} />}
          {mostrar(mesa5) && <TarjetaMesa m={mesa5} />}
        </section>

      </main>

      {/* MODAL EDITAR MESA  */}
      {mesaSeleccionada && (
        <CompModal
          title={`Mesa #${mesaSeleccionada.id}`}
          content={
            <div className="d-flex flex-column gap-3">

              {/* Estado actual de la mesa */}
              <div className={`mesa-modal-estado ${estadoClase[mesaSeleccionada.estado]}`}>
                <small>Estado Actual</small>
                <strong>{mesaSeleccionada.estado}</strong>
              </div>

              {/* Si está Ocupada muestra los datos del cliente */}
              {mesaSeleccionada.estado === "Ocupada" && (
                <div className="mesa-modal-datos">
                  <p><small>Cliente</small><br /><strong>{mesaSeleccionada.cliente}</strong></p>
                  <p><small>Personas</small><br /><strong>{mesaSeleccionada.personas}</strong></p>
                  <p><small>Hora de ingreso</small><br /><strong>{mesaSeleccionada.hora}</strong></p>
                </div>
              )}

              {/* Botón según el estado actual */}
              {mesaSeleccionada.estado === "Disponible" ? (
                <button
                  className="mesa-btn-ocupar"
                  onClick={() => cambiarEstado(mesaSeleccionada.id)}
                >
                  ✏️ Marcar como Ocupada
                </button>
              ) : (
                <button
                  className="mesa-btn-liberar"
                  onClick={() => cambiarEstado(mesaSeleccionada.id)}
                >
                  ✏️ Marcar como Disponible
                </button>
              )}

            </div>
          }
          onClose={() => setMesaSeleccionada(null)}
        />
      )}
       <footer>
           <CompFooter />
        </footer>

      <CompNavBar vistaAdmin={vistaAdmin} setVistaAdmin={setVistaAdmin} />

    </div>
  );
}

export default AdminMesas;