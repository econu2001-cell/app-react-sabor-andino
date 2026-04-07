import React from "react";
import CompTimerPedido from "../../Componentes/CompTimerPedido";
import { useTema } from "../../Contex/ContexTema";
import CompNavBar from "../../Componentes/CompNavBar";
import CompFooter from "../../Componentes/CompFooter";
import CompFetchReniec from "../../Apis/CompFetchReniec";
import CompAxiosReniec from "../../Apis/CompAxiosReniec";
// Datos simulados de los pedidos recientes del restaurante
const pedidosRecientes = [
  { id: "001", mesa: 5,  descripcion: "Ceviche Clásico, Chicha Morada",  total: 43, estado: "En Preparación", timer: 300 },
  { id: "002", mesa: 8,  descripcion: "Lomo Saltado x2, Pisco Sour",    total: 82, estado: "Listo" },
  { id: "003", mesa: 3,  descripcion: "Ají de Gallina, Arroz con Leche", total: 40, estado: "Cancelado" },
  { id: "004", mesa: 12, descripcion: "Anticuchos, Suspiro Limeño",      total: 43, estado: "Entregado" },
];

// Relaciona cada estado con su clase CSS correspondiente
const estadoClase = {
  "En Preparación": "admin-estado-preparacion",
  "Listo":          "admin-estado-listo",
  "Cancelado":      "admin-estado-cancelado",
  "Entregado":      "admin-estado-entregado",
};


// Relaciona cada métrica con su clase de color de fondo
const metricaClase = {
  "Ventas Hoy":      "admin-metrica-ventas",
  "Pedidos Activos": "admin-metrica-pedidos",
  "Reservas Hoy":    "admin-metrica-reservas",
  "Mesas Ocupadas":  "admin-metrica-mesas",
};

function AdminPanel({ onLogout, vistaAdmin, setVistaAdmin, onVolver   }) {
    const { tema, cambiarTema } = useTema();
  return (
    // Contenedor principal — clase CSS maneja el paddingBottom
    <div className={`admin-contenedor ${tema}`}>

      {/* Header rojo superior */}
     <header className="admin-header d-flex justify-content-between align-items-center">

        {/* LADO IZQUIERDO: botón volver + título */}
        <div className="d-flex align-items-center gap-3">

          <div className="text-start">
            <h5 className="admin-header-titulo m-0">Panel de Administración</h5>
            <small className="admin-header-subtitulo">
              Sabor Andino · Tablero
            </small>
          </div>

        </div>

        {/* LADO DERECHO: switch tema + cerrar sesión */}
        <div className="d-flex align-items-center gap-3">

          <div className="form-check form-switch mb-0">
            <input
              type="checkbox"
              className="form-check-input"
              id="switchTemaAdmin"
              checked={tema === "dark"}
              onChange={cambiarTema}
            />
            <label
              className="form-check-label text-white"
              htmlFor="switchTemaAdmin"
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
        


  

                {/*  TARJETAS DE MÉTRICAS */}
          <div className="row g-3 mb-3">

            <div className="col-6">
              <div className={`card admin-metrica-card ${metricaClase["Ventas Hoy"]}`}>
                <div className="admin-metrica-icono">💹</div>
                <div className="admin-metrica-valor">S/ 2,450</div>
                <div className="admin-metrica-label">Ventas Hoy</div>
              </div>
            </div>

            <div className="col-6">
              <div className={`card admin-metrica-card ${metricaClase["Pedidos Activos"]}`}>
                <div className="admin-metrica-icono">📋</div>
                <div className="admin-metrica-valor">23</div>
                <div className="admin-metrica-label">Pedidos Activos</div>
              </div>
            </div>

            <div className="col-6">
              <div className={`card admin-metrica-card ${metricaClase["Reservas Hoy"]}`}>
                <div className="admin-metrica-icono">📅</div>
                <div className="admin-metrica-valor">15</div>
                <div className="admin-metrica-label">Reservas Hoy</div>
              </div>
            </div>

            <div className="col-6">
              <div className={`card admin-metrica-card ${metricaClase["Mesas Ocupadas"]}`}>
                <div className="admin-metrica-icono">🍽️</div>
                <div className="admin-metrica-valor">8/15</div>
                <div className="admin-metrica-label">Mesas Ocupadas</div>
              </div>
            </div>

          </div>

        {/* LISTA DE PEDIDOS RECIENTES */}
        <div className="card admin-pedidos-card">

          {/* Encabezado de la lista */}
          <div className="card-header admin-pedidos-header">
            Pedidos Recientes
          </div>

          <div className="card-body p-0">
            {/* Recorremos cada pedido y lo mostramos como una fila */}
            {pedidosRecientes.map((p) => (
              <div key={p.id} className="admin-pedido-fila">

                {/* Fila superior: info del pedido y total */}
                <div className="d-flex justify-content-between">
                  <div>
                    {/* Número de pedido y mesa */}
                    <span className="admin-pedido-titulo">
                      #{p.id} · Mesa {p.mesa}
                    </span>

                    {/* Descripción de los platos pedidos */}
                    <p className="admin-pedido-descripcion">{p.descripcion}</p>
                  </div>

                  {/* Total del pedido alineado a la derecha */}
                  <span className="admin-pedido-total">S/ {p.total}</span>
                </div>
        
                    <div className="d-flex align-items-center gap-2">
                     {/* Badge del estado igual que antes */}
                    <span className={`admin-estado-badge ${estadoClase[p.estado]}`}>
                    {p.estado}
                    </span>

                    {/* Timer — aparece SOLO si el pedido está En Preparación */}
                    {p.estado === "En Preparación" && (
                     <CompTimerPedido segundos={p.timer} />
                )}

                
            </div>
              

              </div>
            ))}
          </div>
                  {/* CONSULTA DNI RENIEC */}
        <div className="card mt-4">
          <div className="card-header">
            Consulta DNI - RENIEC
          </div>

          <div className="card-body">
            <div className="row">
              
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    Consulta DNI - RENIEC (Fetch)
                  </div>
                  <div className="card-body">
                    <CompFetchReniec />
                  </div>
                </div>
              </div>


              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    Consulta DNI - RENIEC (Axios)
                  </div>
                  <div className="card-body">
                    <CompAxiosReniec />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        </div>
        
    
    <footer>
      <CompFooter />
    </footer>
          {/*BARRA DE NAVEGACIÓN INFERIOR  */}
      <CompNavBar vistaAdmin={vistaAdmin} setVistaAdmin={setVistaAdmin} />
      </div>
      
  );
}


export default AdminPanel;