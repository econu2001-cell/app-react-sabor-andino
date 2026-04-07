import { useState } from "react";

//importar para optimizar mi web
import { useCallback } from "react";
import { useMemo } from "react";
import { Suspense } from "react";

const CompRecetaCard = React.lazy(() =>
  import("../Componentes/CompRecetaCard")
);


function CompFetchMealDB() {

  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState(null);


  const buscarReceta = useCallback(async () => {
    if (!nombre) return;
    setLoading(true)
    setError(null);
    setRecetas([]);
  

    try {
      const res = await 
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${busqueda}`
      );
      const data = await res.json();

      if (!data.meals) {
      throw new Error("Receta no encontrada");
    }

    setRecetas(data.meals);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [busqueda]);

    /*optimizar los valores con useMemo:
        - evitar cálculos innecesarios cuando se cambien los personajes*/
    const totalRecetas = useMemo(() => {
      return recetas.length;
    }, [recetas]);

 return (
  <div className="card p-3">
    <h5>Buscar Recetas</h5>

    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Ej: chicken, beef, pasta"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <button className="btn btn-success" onClick={buscarReceta}>
        Buscar
      </button>
    </div>

    {loading && <p>Buscando recetas...</p>}
    {error && <p className="text-danger">{error}</p>}
    {recetas.length > 0 && (
      <p>Se encontraron {totalRecetas} recetas</p>
    )}

    <Suspense fallback={<p>Cargando recetas...</p>}>
  <div className="row">
    {recetas.length > 0 &&
      recetas.map((meal) =>
        meal ? (
          <CompRecetaCard key={meal.idMeal} meal={meal} />
        ) : null
      )}
  </div>
</Suspense>
  </div>
);
}

export default CompFetchMealDB;