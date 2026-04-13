import { useState } from "react";
import axios from "axios";


function CompAxiosReniec(){
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dni, setDni] = useState("");
    const [person, setPerson] = useState(null);

    const axiosDNI = async()=>{
        setLoading(true); setError(null); setPerson(null);
        if (dni.length !== 8) {
            setError("El DNI debe tener 8 dígitos");
            setLoading(false);
         return;
    }
      try {
            const response = await axios.get
             (`https://graphperu.daustinn.com/api/query/${dni}` );
             setPerson(response.data);
              } catch (e) {
             if (e.response && e.response.status === 400) {
                setError("No se encontraron resultados para este DNI");
            } else {
                setError("Ocurrió un error al consultar el servicio");
            }
        } 
        finally {
            setLoading(false);
        }
    
    }

return (
        <div className="row">
            <div className="input-group mb-3">
                <input 
                    type="text" className="form-control"
                    placeholder="Ingrese número de DNI"
                    maxLength={8} required
                    value={dni} onChange={(e)=>setDni(e.target.value)} />
                <button className="btn btn-primary" 
                    onClick={axiosDNI}
                >
                    Consultar en Reniec
                </button>
            </div>
            {loading && <p>Consultando a Reniec....</p>}
            {error && <p>{error}</p>}
            {person &&
            <>
            <h5>Datos encontrados</h5>
                <div className="row g-3">
                    <div className="col-md-4">
                        <label htmlFor="nombres" className="form-label">Nombres completos:</label>
                        <input 
                            type="text" className="form-control" 
                            readOnly value={person.names} />
                    </div>

                <div className="col-md-6">
                    <label htmlFor="apellidoPaterno" className="form-label">Apellidos completos:</label>
                    <input 
                        type="text" className="form-control" 
                        readOnly value={person.surnames} />
                </div>

            </div>
                    </>
                    }
        </div>
    );
}

export default CompAxiosReniec;