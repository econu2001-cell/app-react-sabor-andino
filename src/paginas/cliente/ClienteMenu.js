import React, { useState, useEffect, useReducer } from "react";
import CompModal from "../../Componentes/CompModal";
import CompNavBar from "../../Componentes/CompNavBar";
import { useTema } from "../../Contex/ContexTema";
import CompFooter from "../../Componentes/CompFooter";

//importar para optimizar mi web
import { useCallback } from "react";
import { useMemo } from "react";
import { Suspense } from "react";

const CompRecetaCard = React.lazy(() =>
  import("../../Componentes/CompRecetaCard")
);
// Datos simulados de platos del menú con las imágenes del proyecto
const platosData = [
  { id: 1, nombre: "Lomo Saltado",    precio: 32.00, categoria: "Platos criollos",
  img: "/img/lomo saltado.png"       },
  { id: 2, nombre: "Ají de Gallina",  precio: 28.00, categoria: "Platos criollos",
     img: "/img/Aji-de-gallina.png"     },
  { id: 3, nombre: "Arroz con Pollo", precio: 25.00, categoria: "Platos criollos",
     img: "/img/arros con pollo.png"    },
  { id: 4, nombre: "Chaufa",          precio: 22.00, categoria: "Platos criollos",
     img: "/img/chaufa.png"             },
  { id: 5, nombre: "Ceviche de Filete",   precio: 35.00, categoria: "Ceviches",
     img: "/img/ceviche de filete.png"    },
  { id: 6, nombre: "Ceviche de Mariscos", precio: 40.00, categoria: "Ceviches",
     img: "/img/ceviche de mariscos.png"  },
  { id: 7, nombre: "Ceviche de Caballa",  precio: 30.00, categoria: "Ceviches",
     img: "/img/ceviche de caballa.png"   },
  { id: 8, nombre: "Chicha Morada", precio: 8.00, categoria: "Bebidas",
     img: "/img/chicha morada.png" },
  { id: 9, nombre: "Limonada",      precio: 7.00, categoria: "Bebidas",
     img: "/img/limonada.png"      },
];

const estadoInicial = {
  carrito: []
};

function carritoReducer(state, action) {
  switch (action.type) {

    case "AGREGAR": {
      const existe = state.carrito.find(i => i.id === action.payload.id);

      if (existe && existe.cantidad >= 5) {
        alert("⚠️ Solo 5 unidades del mismo plato");
        return state;
      }

      if (existe) {
        return {
          carrito: state.carrito.map(i =>
            i.id === action.payload.id
              ? { ...i, cantidad: i.cantidad + 1 }
              : i
          )
        };
      }

      if (state.carrito.length >= 5) {
        alert("⚠️ Solo 5 platos diferentes en el pedido");
        return state;
      }

      return {
        carrito: [...state.carrito, { ...action.payload, cantidad: 1 }]
      };
    }

   case "AUMENTAR": {
  const item = state.carrito.find(i => i.id === action.payload);

  if (item.cantidad >= 5) {
    alert("Solo 5 unidades del mismo plato");
    return state;
  }

  return {
    carrito: state.carrito.map(i =>
      i.id === action.payload
        ? { ...i, cantidad: i.cantidad + 1 }
        : i
    )
  };
}

    case "DISMINUIR":
      return {
        carrito: state.carrito
          .map(i =>
            i.id === action.payload
              ? { ...i, cantidad: i.cantidad - 1 }
              : i
          )
          .filter(i => i.cantidad > 0)
      };

    case "ELIMINAR":
      return {
        carrito: state.carrito.filter(i => i.id !== action.payload)
      };

    case "VACIAR":
      return estadoInicial;

    default:
      return state;
  }
}

function ClienteMenu({ vistaCliente, setVistaCliente, onLogout }) {

  const { tema, cambiarTema } = useTema();

  // Filtro activo de categoría
  const [filtro, setFiltro] = useState("Platos criollos");


  // Controla si el modal del carrito está abierto
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // Controla si se muestra modal de confirmar eliminación
  const [itemEliminar, setItemEliminar] = useState(null);

  // Mensaje de retroalimentación al agregar o confirmar pedido
  const [mensaje, setMensaje] = useState("");

  //  Estados para recetas API optimizada
  const [busqueda, setBusqueda] = useState("");
  const [recetas, setRecetas] = useState([]);
  const [loadingRecetas, setLoadingRecetas] = useState(false);
  const [errorRecetas, setErrorRecetas] = useState("");

  //Carrito
  const [state, dispatch] = useReducer(carritoReducer, estadoInicial);
  const carrito = state.carrito;

  // Muestra mensaje y lo oculta en 2 segundos — igual que CompHooks useEffect con límite
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 2000);
      // Libera memoria igual que CompHooks
      return () => clearTimeout(timer);
    }
  }, [mensaje]);


    // useCallback igual que tu profe (optimiza llamada API)
    const buscarRecetas = useCallback(async () => {
      if (!busqueda) return;

      setLoadingRecetas(true);  setErrorRecetas("");
      setRecetas([]);

      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${busqueda}`
        );
        const data = await res.json();
         if (!data.meals) {
        throw new Error(" No se encontró ninguna receta");
        }
        setRecetas(data.meals);
      } catch (err) {
        setErrorRecetas(err.message);
      } finally {
        setLoadingRecetas(false);
      }
    }, [busqueda]);

    // useMemo igual que tu profe (optimiza filtrado)
    const recetasFiltradas = useMemo(() => {
      return recetas;
    }, [recetas]);

    const totalRecetas = useMemo(() => {
      return recetasFiltradas.length;
    }, [recetasFiltradas]);

  // Filtra los platos según la categoría activa
  const platosFiltrados = platosData.filter((p) => p.categoria === filtro);

  // Agrega un plato al carrito
const agregarAlCarrito = (plato) => {
  dispatch({ type: "AGREGAR", payload: plato });
};

const aumentar = (id) => {
  dispatch({ type: "AUMENTAR", payload: id });
};

const disminuir = (id) => {
  dispatch({ type: "DISMINUIR", payload: id });
};

const confirmarEliminar = () => {
  dispatch({ type: "ELIMINAR", payload: itemEliminar.id });
  setItemEliminar(null);
};

  // Calcula el subtotal del carrito
  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad, 0
  );

  // Confirma el pedido — limpia el carrito y muestra retroalimentación
  const confirmarPedido = () => {
    dispatch({ type: "VACIAR" });
    setMostrarCarrito(false);
    setMensaje("🎉 ¡Pedido confirmado! Gracias por tu compra");
  };

  // Total de items en el carrito para el badge
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Componente interno de tarjeta de plato — evita repetir el bloque
  const TarjetaPlato = ({ p }) => (
    <div className="menu-card">
      <div className="menu-img-contenedor">
        <img src={p.img} alt={p.nombre} className="menu-img" />
      </div>
      <div className="menu-info">
        <span className="menu-nombre">{p.nombre}</span>
        <span className="menu-precio">S/ {p.precio.toFixed(2)}</span>
        <button
          className="cli-btn-agregar"
          onClick={() => agregarAlCarrito(p)}
        >
          Agregar
        </button>
      </div>
    </div>
  );

  return (
    <div className={`admin-contenedor ${tema}`}>

      <header className="admin-header">
        <div>
          <h5 className="admin-header-titulo">Sabor Andino</h5>
          <small className="admin-header-subtitulo">Nuestro Menú</small>
        </div>

        {/* Lado derecho: tema + perfil */}
        <div className="d-flex align-items-center gap-3">

          {/* Switch modo oscuro */}
          <div className="form-check form-switch mb-0">
            <input
              type="checkbox"
              className="form-check-input"
              id="switchTemaCliente"
              checked={tema === "dark"}
              onChange={cambiarTema}
            />
            <label className="form-check-label text-white" htmlFor="switchTemaCliente">
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

        {/*  SECTION MENSAJE RETROALIMENTACIÓN  */}
        {mensaje && (
          <section className="menu-mensaje mb-3">
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

        {/*  SECTION GRILLA DE PLATOS */}
        <section className="menu-grilla">
          {platosFiltrados[0] && <TarjetaPlato p={platosFiltrados[0]} />}
          {platosFiltrados[1] && <TarjetaPlato p={platosFiltrados[1]} />}
          {platosFiltrados[2] && <TarjetaPlato p={platosFiltrados[2]} />}
          {platosFiltrados[3] && <TarjetaPlato p={platosFiltrados[3]} />}
          {platosFiltrados[4] && <TarjetaPlato p={platosFiltrados[4]} />}
          {platosFiltrados[5] && <TarjetaPlato p={platosFiltrados[5]} />}
        </section>

      </main>


      {/*BOTÓN CARRITO FIJO */}
      {/* Solo aparece si hay items en el carrito */}
      {totalItems > 0 && (
        <button
          className="cli-carrito-flotante"
          onClick={() => setMostrarCarrito(true)}
        >
          🛍 <span className="cli-carrito-badge">{totalItems}</span>
        </button>
      )}

      {/* MODAL CARRITO DE PEDIDOS  */}
      {mostrarCarrito && (
        <CompModal
          title="Mi Pedido"
          content={
            <div className="d-flex flex-column gap-3">
            {carrito.length === 5 && (
  <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
    Has alcanzado el máximo de 5 platos en tu pedido.
  </p>
)}

              {/* Item 1 del carrito */}
              {carrito[0] && (
                <div className="cli-item-carrito">
                  <img src={carrito[0].img} alt={carrito[0].nombre} className="cli-item-img" />
                  <div className="cli-item-info">
                    <span className="cli-item-nombre">{carrito[0].nombre}</span>
                    <span className="cli-item-precio">S/ {carrito[0].precio.toFixed(2)}</span>
                    {/* Botones - cantidad + igual que CompHooks */}
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <button className="cli-btn-cantidad" onClick={() => disminuir(carrito[0].id)}>−</button>
                      <span>{carrito[0].cantidad}</span>
                      <button className="cli-btn-cantidad" onClick={() => aumentar(carrito[0].id)}>+</button>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-end gap-1">
                    <span className="cli-item-subtotal">S/ {(carrito[0].precio * carrito[0].cantidad).toFixed(2)}</span>
                    <button className="btn-reserva btn-reserva-cancelar" onClick={() => setItemEliminar(carrito[0])}>
                      Cancelar Pedido
                    </button>
                  </div>
                </div>
              )}

              {/* Item 2 del carrito */}
              {carrito[1] && (
                <div className="cli-item-carrito">
                  <img src={carrito[1].img} alt={carrito[1].nombre} className="cli-item-img" />
                  <div className="cli-item-info">
                    <span className="cli-item-nombre">{carrito[1].nombre}</span>
                    <span className="cli-item-precio">S/ {carrito[1].precio.toFixed(2)}</span>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <button className="cli-btn-cantidad" onClick={() => disminuir(carrito[1].id)}>−</button>
                      <span>{carrito[1].cantidad}</span>
                      <button className="cli-btn-cantidad" onClick={() => aumentar(carrito[1].id)}>+</button>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-end gap-1">
                    <span className="cli-item-subtotal">S/ {(carrito[1].precio * carrito[1].cantidad).toFixed(2)}</span>
                    <button className="btn-reserva btn-reserva-cancelar" onClick={() => setItemEliminar(carrito[1])}>
                      Cancelar Pedido
                    </button>
                  </div>
                </div>
              )}

              {/* Item 3 del carrito */}
              {carrito[2] && (
                <div className="cli-item-carrito">
                  <img src={carrito[2].img} alt={carrito[2].nombre} className="cli-item-img" />
                  <div className="cli-item-info">
                    <span className="cli-item-nombre">{carrito[2].nombre}</span>
                    <span className="cli-item-precio">S/ {carrito[2].precio.toFixed(2)}</span>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <button className="cli-btn-cantidad" onClick={() => disminuir(carrito[2].id)}>−</button>
                      <span>{carrito[2].cantidad}</span>
                      <button className="cli-btn-cantidad" onClick={() => aumentar(carrito[2].id)}>+</button>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-end gap-1">
                    <span className="cli-item-subtotal">S/ {(carrito[2].precio * carrito[2].cantidad).toFixed(2)}</span>
                    <button className="btn-reserva btn-reserva-cancelar" onClick={() => setItemEliminar(carrito[2])}>
                      Cancelar Pedido
                    </button>
                  </div>
                </div>
              )}

              {/* Item 4 del carrito */}
              {carrito[3] && (
                <div className="cli-item-carrito">
                  <img src={carrito[3].img} alt={carrito[3].nombre} className="cli-item-img" />
                  <div className="cli-item-info">
                    <span className="cli-item-nombre">{carrito[3].nombre}</span>
                    <span className="cli-item-precio">S/ {carrito[3].precio.toFixed(2)}</span>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <button className="cli-btn-cantidad" onClick={() => disminuir(carrito[3].id)}>−</button>
                      <span>{carrito[3].cantidad}</span>
                      <button className="cli-btn-cantidad" onClick={() => aumentar(carrito[3].id)}>+</button>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-end gap-1">
                    <span className="cli-item-subtotal">S/ {(carrito[3].precio * carrito[3].cantidad).toFixed(2)}</span>
                    <button className="btn-reserva btn-reserva-cancelar" onClick={() => setItemEliminar(carrito[3])}>
                      Cancelar Pedido
                    </button>
                  </div>
                </div>
              )}

              {/* Item 5 del carrito */}
              {carrito[4] && (
                <div className="cli-item-carrito">
                  <img src={carrito[4].img} alt={carrito[4].nombre} className="cli-item-img" />
                  <div className="cli-item-info">
                    <span className="cli-item-nombre">{carrito[4].nombre}</span>
                    <span className="cli-item-precio">S/ {carrito[4].precio.toFixed(2)}</span>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <button className="cli-btn-cantidad" onClick={() => disminuir(carrito[4].id)}>−</button>
                      <span>{carrito[4].cantidad}</span>
                      <button className="cli-btn-cantidad" onClick={() => aumentar(carrito[4].id)}>+</button>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-end gap-1">
                    <span className="cli-item-subtotal">S/ {(carrito[4].precio * carrito[4].cantidad).toFixed(2)}</span>
                    <button className="btn-reserva btn-reserva-cancelar" onClick={() => setItemEliminar(carrito[4])}>
                      Cancelar Pedido
                    </button>
                  </div>
                </div>
              )}
             

              {/* Subtotal */}
              <div className="d-flex justify-content-between mt-2">
                <strong>Subtotal</strong>
                <strong>S/ {subtotal.toFixed(2)}</strong>
              </div>

              {/* Botón confirmar pedido */}
              <button className="btn-reserva-guardar" onClick={confirmarPedido}>
                Confirmar pedido
              </button>

            </div>
          }
          onClose={() => setMostrarCarrito(false)}
        />
      )}

      {/*  MODAL CONFIRMAR ELIMINAR ITEM */}
      {itemEliminar && (
        <CompModal
          title="Cancelar Pedido"
          content={
            <div className="text-center">
              <p>¿Desea eliminar <strong>{itemEliminar.nombre}</strong> del pedido?</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn-reserva btn-reserva-cancelar" onClick={confirmarEliminar}>
                  SI
                </button>
                <button className="btn-reserva btn-reserva-confirmar" onClick={() => setItemEliminar(null)}>
                  NO
                </button>
              </div>
            </div>
          }
          onClose={() => setItemEliminar(null)}
        />
      )}

      <hr />
<div className="recetas-contenedor">   
  <h4 className="mt-4">Recetas sugeridas</h4>

  <div className="input-group mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Buscar receta..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
  />
  <button className="btn btn-success" onClick={buscarRecetas}>
    Buscar
  </button>
  </div>

    {loadingRecetas && <p>Cargando recetas...</p>}
    {totalRecetas > 0 && (
      <p><b>Se encontraron {totalRecetas} recetas</b></p>
    )}
    {errorRecetas && (
      <p style={{ color: "red", fontWeight: "bold" }}>
        {errorRecetas}
      </p>
    )}

    <Suspense fallback={<p>Cargando tarjetas...</p>}>
      <div className="row">
        {recetasFiltradas.map((meal) => (
          <CompRecetaCard key={meal.idMeal} meal={meal} />
        ))}
      </div>
    </Suspense>
    </div> 
   

          <footer>
            <CompFooter />
          </footer>

      {/* BARRA DE NAVEGACIÓN INFERIOR CLIENTE */}
      
      <CompNavBar vistaAdmin={vistaCliente} setVistaAdmin={setVistaCliente} esCliente={true} />

    </div>
  );
}

export default ClienteMenu;