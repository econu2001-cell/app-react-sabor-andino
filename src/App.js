import React, { useState } from 'react';
import './App.css';

// PAGINAS
// página de Login
import Login from './paginas/Login';
// pagina admin
import AdminPanel from './paginas/admin/AdminPanel';
import AdminPedidos from './paginas/admin/AdminPedidos';
import AdminReservas from './paginas/admin/AdminReservas';
import AdminMesas from './paginas/admin/AdminMesas';
import AdminMenu from './paginas/admin/AdminMenu';
import AdminCalendario from './paginas/admin/AdminCalendario';
import ClienteMenu from './paginas/cliente/ClienteMenu';
import ClienteReservas from './paginas/cliente/ClienteReservas';
import ClienteMesas from './paginas/cliente/ClienteMesas';
import ClienteCalendario from './paginas/cliente/ClienteCalendario';


function App() {
  const [vistaAdmin, setVistaAdmin] = useState("panel");
  // Estado de vista para el cliente
 const [vistaCliente, setVistaCliente] = useState("menu");
     // Estado de sesión: null = no logueado, "cliente" o "admin" = logueado
  const [sesion, setSesion] = useState(null);

  // Función que recibe el rol desde Login y activa la sesión
  const handleLogin = (rol) => {
    setSesion(rol); // guarda "cliente" o "admin"
  };

  // Función para cerrar sesión y volver al Login
   const handleLogout = () => {
    setSesion(null);
  };
  // Estado compartido de reservas del cliente — se pasa a ClienteReservas y ClienteMesas
const [reservasCliente, setReservasCliente] = useState([
  {
    id: "001", mesa: 1, telefono: "983 345 455",
    fecha: "Domingo, 29 de marzo de 2026", hora: "19:00",
    personas: 4, tipo: "presencial", estado: "Confirmada",
  },
]);
  // Si NO hay sesión activa  muestra el Login
    if (!sesion) {
    return <Login onLogin={handleLogin} />;
  }

    // Si el rol es "admin" muestra el panel de administración
    
  if (sesion === "admin") {
   if (vistaAdmin === "pedidos") {
    return <AdminPedidos onVolver={() => setVistaAdmin("panel")}
    vistaAdmin={vistaAdmin} setVistaAdmin={setVistaAdmin} 
    onLogout={handleLogout} />;
  }
  if (vistaAdmin === "reservas") {
    return <AdminReservas vistaAdmin={vistaAdmin}
                          setVistaAdmin={setVistaAdmin}
                          onLogout={handleLogout}
                           onVolver={() => setVistaAdmin("panel")} />;
  }
  if (vistaAdmin === "mesas") {
    return <AdminMesas vistaAdmin={vistaAdmin} setVistaAdmin={setVistaAdmin} 
    onLogout={handleLogout} onVolver={() => setVistaAdmin("panel")}/>;
  }

  if (vistaAdmin === "menu") {
     return <AdminMenu vistaAdmin={vistaAdmin} setVistaAdmin={setVistaAdmin}
     onLogout={handleLogout}  onVolver={() => setVistaAdmin("panel")}/>;
  }   
  if (vistaAdmin === "calendar") {
  return <AdminCalendario vistaAdmin={vistaAdmin} setVistaAdmin={setVistaAdmin} 
  onLogout={handleLogout} onVolver={() => setVistaAdmin("panel")}/>;
  }
  return (
    <AdminPanel 
      onLogout={handleLogout}
      irPedidos={() => setVistaAdmin("pedidos")}
      vistaAdmin={vistaAdmin} setVistaAdmin={setVistaAdmin}
      onVolver={() => setVistaAdmin("inicio")} 
    />
  );
}

// Si el rol es "cliente"  muestra la vista del cliente
if (sesion === "cliente") {
  if (vistaCliente === "menu") {
    return <ClienteMenu
      vistaCliente={vistaCliente}
      setVistaCliente={setVistaCliente}
      onLogout={handleLogout}
    />;
  }
  if (vistaCliente === "reservas") {
  return <ClienteReservas
    vistaCliente={vistaCliente}
    setVistaCliente={setVistaCliente}
    onLogout={handleLogout}
    reservas={reservasCliente}
    setReservas={setReservasCliente}
  />;
}
if (vistaCliente === "mesas") {
  return <ClienteMesas
    vistaCliente={vistaCliente}
    setVistaCliente={setVistaCliente}
    onLogout={handleLogout}
    reservas={reservasCliente}
    setReservas={setReservasCliente}
  />;
}
 if (vistaCliente === "calendar") {
    return <ClienteCalendario
      vistaCliente={vistaCliente}
      setVistaCliente={setVistaCliente}
      onLogout={handleLogout}
      reservas={reservasCliente}
      setReservas={setReservasCliente}
    />;
  }

}

  
}

export default App;