import React, { useState } from "react";
import CompModal from "../../Componentes/CompModal";
import CompNavBar from "../../Componentes/CompNavBar";
import { useTema } from "../../Contex/ContexTema";
import CompFooter from "../../Componentes/CompFooter";



// Datos de platos del menú con tus imágenes
const platosIniciales = [
  { id: 1, nombre: "Lomo Saltado",    precio: 32.00, categoria: "Platos criollos", img: "/img/lomo saltado.png"      },
  { id: 2, nombre: "Ají de Gallina",  precio: 28.00, categoria: "Platos criollos", img: "/img/Aji-de-gallina.png"    },
  { id: 3, nombre: "Arroz con Pollo", precio: 25.00, categoria: "Platos criollos", img: "/img/arros con pollo.png"   },
  { id: 4, nombre: "Chaufa",          precio: 22.00, categoria: "Platos criollos", img: "/img/chaufa.png"            },
  { id: 5, nombre: "Ceviche de Filete",   precio: 35.00, categoria: "Ceviches", img: "/img/ceviche de filete.png"   },
  { id: 6, nombre: "Ceviche de Mariscos", precio: 40.00, categoria: "Ceviches", img: "/img/ceviche de mariscos.png" },
  { id: 7, nombre: "Ceviche de Caballa",  precio: 30.00, categoria: "Ceviches", img: "/img/ceviche de caballa.png"  },
  { id: 8, nombre: "Chicha Morada",   precio: 8.00,  categoria: "Bebidas", img: "/img/chicha morada.png" },
  { id: 9, nombre: "Limonada",        precio: 7.00,  categoria: "Bebidas", img: "/img/limonada.png"      },
];

function AdminMenu({ vistaAdmin, setVistaAdmin, onLogout, onVolver }) {

  const { tema, cambiarTema } = useTema();

  // Lista de platos — empieza con los datos simulados
  const [platos, setPlatos] = useState(platosIniciales);

  // Filtro activo: Platos criollos, Ceviches o Bebidas
  const [filtro, setFiltro] = useState("Platos criollos");

  // Plato seleccionado para editar — null = modal cerrado
  const [platoEditar, setPlatoEditar] = useState(null);

  // Plato seleccionado para eliminar — null = modal cerrado
  const [platoEliminar, setPlatoEliminar] = useState(null);

  // Controla si se muestra el modal de agregar nuevo plato
  const [mostrarAgregar, setMostrarAgregar] = useState(false);

  // Mensaje de retroalimentación cuando se agrega a pedidos
  const [mensaje, setMensaje] = useState("");

  // Datos del formulario de edición
  const [formEditar, setFormEditar] = useState({});

  // Datos del formulario de agregar nuevo plato
  const [formAgregar, setFormAgregar] = useState({
    nombre: "", precio: 0, categoria: "Platos criollos", img: ""
  });

  // Filtra los platos según la categoría activa
  const platosFiltrados = platos.filter((p) => p.categoria === filtro);

  // Abre el modal de edición con los datos del plato seleccionado
  const abrirEditar = (plato) => {
    setPlatoEditar(plato);
    setFormEditar({ ...plato });
  };

  // Guarda los cambios del formulario de edición
  const guardarEditar = () => {
    setPlatos((prev) =>
      prev.map((p) => (p.id === formEditar.id ? { ...formEditar } : p))
    );
    setPlatoEditar(null);
  };

  // Elimina el plato seleccionado
  const confirmarEliminar = () => {
    setPlatos((prev) => prev.filter((p) => p.id !== platoEliminar.id));
    setPlatoEliminar(null);
  };

  // Agrega un nuevo plato a la lista
  const agregarPlato = () => {
    const nuevoPlato = {
      ...formAgregar,
      // Genera un id nuevo sumando 1 al último id
      id: platos.length + 1,
      precio: parseFloat(formAgregar.precio),
    };
    setPlatos((prev) => [...prev, nuevoPlato]);
    setMostrarAgregar(false);
    // Resetea el formulario
    setFormAgregar({ nombre: "", precio: 0, categoria: "Platos criollos", img: "" });
  };

  // Agrega el plato al pedido y muestra retroalimentación 2 segundos
  const agregarAPedido = (plato) => {
    setMensaje(`✅ "${plato.nombre}" se agregó a pedidos`);
    // Cierra el mensaje automáticamente después de 2 segundos
    setTimeout(() => setMensaje(""), 2000);
  };

  // Componente interno de tarjeta de plato — evita repetir el bloque
  const TarjetaPlato = ({ p }) => (
    <div className="menu-card">

      {/* Imagen del plato */}
      <div className="menu-img-contenedor">
        <img src={p.img} alt={p.nombre} className="menu-img" />

        {/* Botón Agregar encima de la imagen */}
        <button
          className="menu-btn-agregar-img"
          onClick={() => agregarAPedido(p)}
        >
          + Agregar
        </button>
      </div>

      {/* Información del plato */}
      <div className="menu-info">
        <span className="menu-nombre">{p.nombre}</span>
        <span className="menu-precio">S/ {p.precio.toFixed(2)}</span>

        {/* Botones editar y eliminar */}
        <div className="d-flex gap-2 mt-2">
          <button
            className="btn-menu-editar"
            onClick={() => abrirEditar(p)}
          >
            ✏️ Editar
          </button>
          <button
            className="btn-menu-eliminar"
            onClick={() => setPlatoEliminar(p)}
          >
            🗑 Eliminar
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
          <h5 className="admin-header-titulo m-0">Sabor Andino</h5>
          <small className="admin-header-subtitulo">
            Nuestro Menú
          </small>
        </div>

      </div>

      {/* DERECHA: switch + cerrar */}
      <div className="d-flex align-items-center gap-3">

        <div className="form-check form-switch mb-0">
          <input
            type="checkbox"
            className="form-check-input"
            id="switchTemaMenu"
            checked={tema === "dark"}
            onChange={cambiarTema}
          />
          <label
            className="form-check-label text-white"
            htmlFor="switchTemaMenu"
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

        {/* SECTION BOTÓN AGREGAR NUEVO PLATO  */}
        <section className="mb-3">
          <button
            className="menu-btn-nuevo"
            onClick={() => setMostrarAgregar(true)}
          >
            + Agregar Nuevo Plato
          </button>
        </section>

        {/*SECTION MENSAJE RETROALIMENTACIÓN */}
        {mensaje && (
          <section className="menu-mensaje">
            {mensaje}
          </section>
        )}

        {/* SECTION FILTROS DE CATEGORÍA */}
        <section className="d-flex gap-2 mb-3 flex-wrap">
          <button
            className={`filtro ${filtro === "Platos criollos" ? "activo" : ""}`}
            onClick={() => setFiltro("Platos criollos")}
          >
            Platos criollos
          </button>
          <button
            className={`filtro ${filtro === "Ceviches" ? "activo" : ""}`}
            onClick={() => setFiltro("Ceviches")}
          >
            Ceviches
          </button>
          <button
            className={`filtro ${filtro === "Bebidas" ? "activo" : ""}`}
            onClick={() => setFiltro("Bebidas")}
          >
            Bebidas
          </button>
        </section>

        {/*  SECTION GRILLA DE PLATOS  */}
        <section className="menu-grilla">
          {platosFiltrados[0] && <TarjetaPlato p={platosFiltrados[0]} />}
          {platosFiltrados[1] && <TarjetaPlato p={platosFiltrados[1]} />}
          {platosFiltrados[2] && <TarjetaPlato p={platosFiltrados[2]} />}
          {platosFiltrados[3] && <TarjetaPlato p={platosFiltrados[3]} />}
          {platosFiltrados[4] && <TarjetaPlato p={platosFiltrados[4]} />}
          {platosFiltrados[5] && <TarjetaPlato p={platosFiltrados[5]} />}
        </section>

      </main>


      {/* EDITAR PLATO  */}
      {platoEditar && (
        <CompModal
          title="Editar Plato"
          content={
            <div className="d-flex flex-column gap-2">

              <label className="reserva-label">Nombre del plato</label>
              <input
                className="form-control"
                value={formEditar.nombre}
                onChange={(e) => setFormEditar({ ...formEditar, nombre: e.target.value })}
              />

              <label className="reserva-label">Precio (S/)</label>
              <input
                className="form-control"
                type="number"
                value={formEditar.precio}
                onChange={(e) => setFormEditar({ ...formEditar, precio: e.target.value })}
              />

              <label className="reserva-label">Categoría</label>
              <select
                className="form-control"
                value={formEditar.categoria}
                onChange={(e) => setFormEditar({ ...formEditar, categoria: e.target.value })}
              >
                <option value="Platos criollos">Platos criollos</option>
                <option value="Ceviches">Ceviches</option>
                <option value="Bebidas">Bebidas</option>
              </select>

              <label className="reserva-label">URL de imagen (opcional)</label>
              <input
                className="form-control"
                value={formEditar.img}
                onChange={(e) => setFormEditar({ ...formEditar, img: e.target.value })}
              />

              <button
                className="btn-reserva-guardar mt-2"
                onClick={guardarEditar}
              >
                Guardar cambios
              </button>

            </div>
          }
          onClose={() => setPlatoEditar(null)}
        />
      )}
      <footer>
         <CompFooter />
      </footer>

      {/* MODAL CONFIRMAR ELIMINAR  */}
      {platoEliminar && (
        <CompModal
          title="Eliminar Plato"
          content={
            <div className="text-center">
              <p>¿Desea eliminar <strong>{platoEliminar.nombre}</strong>?</p>
              <div className="d-flex justify-content-center gap-3">
                {/* SI — elimina el plato */}
                <button
                  className="btn-reserva btn-reserva-cancelar"
                  onClick={confirmarEliminar}
                >
                  SI
                </button>
                {/* NO — cierra el modal sin cambios */}
                <button
                  className="btn-reserva btn-reserva-confirmar"
                  onClick={() => setPlatoEliminar(null)}
                >
                  NO
                </button>
              </div>
            </div>
          }
          onClose={() => setPlatoEliminar(null)}
        />
      )}

      {/*MODAL AGREGAR NUEVO PLATO */}
      {mostrarAgregar && (
        <CompModal
          title="Agregar Plato"
          content={
            <div className="d-flex flex-column gap-2">

              <label className="reserva-label">Nombre del plato</label>
              <input
                className="form-control"
                placeholder="escriba el nombre"
                value={formAgregar.nombre}
                onChange={(e) => setFormAgregar({ ...formAgregar, nombre: e.target.value })}
              />

              <label className="reserva-label">Precio (S/)</label>
              <input
                className="form-control"
                type="number"
                placeholder="0"
                value={formAgregar.precio}
                onChange={(e) => setFormAgregar({ ...formAgregar, precio: e.target.value })}
              />

              <label className="reserva-label">Categoría</label>
              <select
                className="form-control"
                value={formAgregar.categoria}
                onChange={(e) => setFormAgregar({ ...formAgregar, categoria: e.target.value })}
              >
                <option value="Platos criollos">Platos criollos</option>
                <option value="Ceviches">Ceviches</option>
                <option value="Bebidas">Bebidas</option>
              </select>

              <label className="reserva-label">URL de imagen (opcional)</label>
              <input
                className="form-control"
                placeholder="link"
                value={formAgregar.img}
                onChange={(e) => setFormAgregar({ ...formAgregar, img: e.target.value })}
              />

              <button
                className="btn-reserva-guardar mt-2"
                onClick={agregarPlato}
              >
                Agregar Plato
              </button>

            </div>
          }
          onClose={() => setMostrarAgregar(false)}
        />
      )}

      <CompNavBar vistaAdmin={vistaAdmin} setVistaAdmin={setVistaAdmin} />

    </div>
  );
}

export default AdminMenu;