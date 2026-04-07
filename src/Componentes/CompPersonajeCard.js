import React from "react";
/* Optimizar con React.memo
-optimizar cada personaje
-si el planeta no cambia, entonces el personaje no se renderiza innecesariamente
*/
const CompPersonajeCard = React.memo( ({char})=>{
    return(
        <div className="card text-center col-sm-3">
            <h6>{char.name}<br/>
                <small style={{color:"#fbc02d"}}>{char.race}</small>
            </h6>
            <img src={char.image} alt={char.name} className="card-img-top"
                 style={{height:"90px"}} />
            <small>{char.ki} ki</small>
        </div>
    );
} );
export default CompPersonajeCard;