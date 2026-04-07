import { useState } from "react";

function CompFetchReniec(){
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dni, setDni] = useState("");
    const [person, setPerson] = useState(null);

    const fetchDNI = async () => {
        if (dni.length !== 8) {
            setError("El DNI debe tener 8 dígitos");
            return;
        }

        setLoading(true); setError(null); setPerson(null);
        try {
            const response = await
             fetch(`https://graphperu.daustinn.com/api/query/${dni}` );

            

            if (!response.ok) {
                throw new Error("No se pudo obtener información");
            }

            const data = await response.json();
            setPerson(data);

        } catch (e) {
            setError(e.message);
        } finally {
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
                    onClick={fetchDNI}
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
                        <label htmlFor="nombres" className="form-label">Nombres:</label>
                        <input 
                            type="text" className="form-control" 
                            readOnly value={person.fullName} />
                    </div>

                <div className="col-md-4">
                    <label htmlFor="apellidoPaterno" className="form-label">Apellido Paterno:</label>
                    <input 
                        type="text" className="form-control" 
                        readOnly value={person.paternalLastName} />
                </div>

                <div className="col-md-4">
                    <label htmlFor="apellidoMaterno" className="form-label">Apellido Materno:</label>
                    <input 
                        type="text" className="form-control" 
                        readOnly value={person.maternalLastName} />
                </div>
            </div>
                    </>
                    }
        </div>
    );

}
export default CompFetchReniec;