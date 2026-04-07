import React from "react";

function CompFooter(){
    const anio = new Date().getFullYear();
    
    return(
        <div className="mi-footer">
            <p>
                Desarrollador por Eddi Cordova Nuñez<br/>
                <small>Todos los derechos reservados | {anio}</small>
            </p>
        </div>
    );
}
export default CompFooter;