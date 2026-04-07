import React from "react";

// Recibe vistaAdmin (vista activa) y setVistaAdmin (para cambiar de vista)
// igual que los demás componentes reciben props desde App.js
function CompNavBar({ vistaAdmin, setVistaAdmin, esCliente }) {

   // Botones del panel admin
  const botonesAdmin = [
    { id: "panel",    icono: "⊞",  label: "Tablero"    },
    { id: "pedidos",  icono: "🧾", label: "Pedidos"    },
    { id: "reservas", icono: "≡",  label: "Reservas"   },
    { id: "mesas",    icono: "⊡",  label: "Mesas"      },
    { id: "menu",     icono: "🍽️", label: "Menú"       },
    { id: "calendar", icono: "📅", label: "Calendario" },
  ];

   // Botones del cliente 
  const botonesCliente = [
    { id: "menu",      icono: "🍽️", label: "Menú"       },
    { id: "reservas",  icono: "≡",  label: "Reservas"   },
    { id: "mesas",     icono: "⊡",  label: "Mesas"      },
    { id: "calendar",  icono: "📅", label: "Calendario" },
  ];
   // Elige qué botones mostrar según si es cliente o admin
  const botones = esCliente ? botonesCliente : botonesAdmin;

 return (
    <div className="navbar-inferior">
      <button
        className={`navbar-btn ${vistaAdmin === botones[0].id ? "activo" : ""}`}
        onClick={() => setVistaAdmin(botones[0].id)}
      >
        <span className="navbar-icono">{botones[0].icono}</span>
        <small className="navbar-label">{botones[0].label}</small>
      </button>

      <button
        className={`navbar-btn ${vistaAdmin === botones[1].id ? "activo" : ""}`}
        onClick={() => setVistaAdmin(botones[1].id)}
      >
        <span className="navbar-icono">{botones[1].icono}</span>
        <small className="navbar-label">{botones[1].label}</small>
      </button>

      <button
        className={`navbar-btn ${vistaAdmin === botones[2].id ? "activo" : ""}`}
        onClick={() => setVistaAdmin(botones[2].id)}
      >
        <span className="navbar-icono">{botones[2].icono}</span>
        <small className="navbar-label">{botones[2].label}</small>
      </button>

      <button
        className={`navbar-btn ${vistaAdmin === botones[3].id ? "activo" : ""}`}
        onClick={() => setVistaAdmin(botones[3].id)}
      >
        <span className="navbar-icono">{botones[3].icono}</span>
        <small className="navbar-label">{botones[3].label}</small>
      </button>

      {/* Solo muestra los botones 5 y 6 si es admin */}
      {!esCliente && botones[4] && (
        <button
          className={`navbar-btn ${vistaAdmin === botones[4].id ? "activo" : ""}`}
          onClick={() => setVistaAdmin(botones[4].id)}
        >
          <span className="navbar-icono">{botones[4].icono}</span>
          <small className="navbar-label">{botones[4].label}</small>
        </button>
      )}

      {!esCliente && botones[5] && (
        <button
          className={`navbar-btn ${vistaAdmin === botones[5].id ? "activo" : ""}`}
          onClick={() => setVistaAdmin(botones[5].id)}
        >
          <span className="navbar-icono">{botones[5].icono}</span>
          <small className="navbar-label">{botones[5].label}</small>
        </button>
      )}

    </div>
  );
}
export default CompNavBar;