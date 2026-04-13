import React, { useState } from "react";
import CompModal from "../../Componentes/CompModal";
import CompTimerPedido from "../../Componentes/CompTimerPedido";
import { useTema } from "../../Contex/ContexTema";
import CompNavBar from "../../Componentes/CompNavBar";
import CompFooter from "../../Componentes/CompFooter";

// Datos de los pedidos del restaurante
const pedidosIniciales = [
  {
    id: "001", mesa: 5, cliente: "Juan Pérez", hora: "18:30",
    items: [
      { nombre: "Ceviche Clásico", cantidad: 1, precio: 35.00 },
      { nombre: "Chicha Morada",   cantidad: 2, precio: 8.00  },
    ],
    total: 100.00, estado: "En Preparación", timer: 300,
  },
  {
    id: "002", mesa: 8, cliente: "María González", hora: "18:45",
    items: [
      { nombre: "Lomo Saltado", cantidad: 2, precio: 32.00 },
      { nombre: "Pisco Sour",   cantidad: 1, precio: 18.00 },
    ],
    total: 100.00, estado: "Listo", timer: null,
  },
  {
    id: "003", mesa: 3, cliente: "Carlos López", hora: "19:00",
    items: [
      { nombre: "Ají de Gallina",   cantidad: 1, precio: 28.00 },
      { nombre: "Arroz con Leche",  cantidad: 1, precio: 12.00 },
    ],
    total: 100.00, estado: "En Preparación", timer: 180,
  },
  {
    id: "004", mesa: 6, cliente: "Juan Pérez", hora: "18:30",
    items: [
      { nombre: "Ceviche Clásico", cantidad: 1, precio: 35.00 },
      { nombre: "Chicha Morada",   cantidad: 2, precio: 8.00  },
    ],
    total: 100.00, estado: "Listo", timer: null,
  },
];

// Relaciona cada estado con su clase CSS de badge
const estadoClase = {
  "En Preparación": "badge-preparacion",
  "Listo":          "badge-listo",
  "Cancelado":      "badge-cancelado",
  "Entregado":      "badge-entregado",
};

function AdminPedidos({ onVolver, vistaAdmin, setVistaAdmin, onLogout }) {

  // Estado con la lista de pedidos — empieza con los datos simulados
  const [pedidos, setPedidos] = useState(pedidosIniciales);

  // Filtro activo: "Activos" muestra todos, o filtra por estado
  const [filtro, setFiltro] = useState("Activos");

  // Pedido seleccionado para gestionar — null = modal cerrado
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const { tema, cambiarTema } = useTema();

  // Filtra los pedidos según el botón activo
  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtro === "Activos")        return true; // muestra todos
    if (filtro === "En Preparación") return p.estado === "En Preparación";
    if (filtro === "Listos")         return p.estado === "Listo";
    return true;
  });

  // Cambia el estado de un pedido por su id
  // Recibe el id del pedido y el nuevo estado a asignar
  const cambiarEstado = (id, nuevoEstado) => {
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, estado: nuevoEstado } : p
      )
    );
    // Cierra el modal después de gestionar
    setPedidoSeleccionado(null);
  };

  return (
    <div className={`admin-contenedor ${tema} d-flex flex-column min-vh-100`}>

    <header className="admin-header d-flex justify-content-between align-items-center">

  {/* IZQUIERDA */}
  <div className="d-flex align-items-center gap-3">
    <button className="btn-volver" onClick={onVolver}>←</button>
    <div>
      <h5 className="admin-header-titulo">Gestión de Pedidos</h5>
      <small className="admin-header-subtitulo">
        Control de órdenes del restaurante
      </small>
    </div>
  </div>

  {/* DERECHA */}
  <div className="d-flex align-items-center gap-3">

    {/* SWITCH */}
    <div className="form-check form-switch mb-0">
      <input
        type="checkbox"
        className="form-check-input"
        id="switchTemaPedidos"
        checked={tema === "dark"}
        onChange={() => cambiarTema()}
      />
      <label
        className="form-check-label text-white"
        htmlFor="switchTemaPedidos"
      >
        {tema === "dark" ? "Tema oscuro" : "Tema claro"}
      </label>
    </div>

    {/* LOGOUT */}
    <button
      className="btn-cerrar"
      onClick={onLogout}
    >
      Cerrar sesión
    </button>

  </div>

</header>
            <main className="flex-grow-1">

      {/*  FILTROS */}
      {/* Usamos .map() igual que en Login para no repetir botones */}
      <div className="d-flex gap-2 p-3">
        {["Activos", "En Preparación", "Listos"].map((f) => (
          <button
            key={f}
            // Si el filtro activo es igual al botón → clase "activo"
            className={`filtro ${filtro === f ? "activo" : ""}`}
            onClick={() => setFiltro(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/*  LISTA DE PEDIDOS */}
      <div className="px-3">
        {pedidosFiltrados.map((p) => (
          <div key={p.id} className="pedido-card">

            {/* Fila superior: título del pedido y badge de estado */}
            <div className="d-flex justify-content-between align-items-center">
              <span className="admin-pedido-titulo">
                #{p.id} · Mesa {p.mesa}
              </span>
              {/* Badge de estado con clase dinámica */}
              <span className={`badge-estado ${estadoClase[p.estado]}`}>
                {p.estado}
              </span>
            </div>

            {/* Cliente y hora */}
            <p className="pedido-cliente mb-1">
              {p.cliente} · ⏱ {p.hora}
            </p>

            {/* Timer — solo aparece si el pedido tiene timer y está En Preparación */}
            {p.estado === "En Preparación" && p.timer && (
              <CompTimerPedido segundos={p.timer} />
            )}

            {/* Items del pedido — recorremos el array con .map() */}
            <div className="pedido-items">
              {p.items.map((item, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between"
                >
                  <span>{item.cantidad}x {item.nombre}</span>
                  <span>S/ {(item.cantidad * item.precio).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="my-2" />

            {/* Fila inferior: total y botón gestionar */}
            <div className="d-flex justify-content-between align-items-center">
              <span className="pedido-total">
                Total: S/ {p.total.toFixed(2)}
              </span>
              {/* Al hacer click guarda el pedido en pedidoSeleccionado → abre modal */}
              <button
                className="btn-gestionar"
                onClick={() => setPedidoSeleccionado(p)}
              >
                Gestionar
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* MODAL DE GESTIÓN */}
      {/* Solo se muestra si hay un pedidoSeleccionado */}
      {pedidoSeleccionado && (
        <CompModal
          title={`Gestionar Pedido #${pedidoSeleccionado.id}`}
          content={
            <div className="d-flex flex-column gap-2">

              {/* Botón En Preparación */}
              <button
                className="btn-gestion btn-gestion-preparacion"
                onClick={() => cambiarEstado(pedidoSeleccionado.id, "En Preparación")}
              >
                En preparación
              </button>

              {/* Botón Marcar como Listo */}
              <button
                className="btn-gestion btn-gestion-listo"
                onClick={() => cambiarEstado(pedidoSeleccionado.id, "Listo")}
              >
                ✅ Marcar como Listo
              </button>

              {/* Botón Marcar como Entregado */}
              <button
                className="btn-gestion btn-gestion-entregado"
                onClick={() => cambiarEstado(pedidoSeleccionado.id, "Entregado")}
              >
                Marcar como Entregado
              </button>

              {/* Botón Cancelar Pedido */}
              <button
                className="btn-gestion btn-gestion-cancelar"
                onClick={() => cambiarEstado(pedidoSeleccionado.id, "Cancelado")}
              >
                ❌ Cancelar Pedido
              </button>

            </div>
          }
          onClose={() => setPedidoSeleccionado(null)}
        />
      )}
      </main>
      <footer>
       <CompFooter />
        </footer>
  
      <CompNavBar vistaAdmin={vistaAdmin} setVistaAdmin={setVistaAdmin} />
            
    </div>
    
  );
}

export default AdminPedidos;