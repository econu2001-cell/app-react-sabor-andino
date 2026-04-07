import React from "react";
// IMPORTANDO LIBRERIA DE REACT
import { useState } from "react";
import { useEffect } from "react";

function CompHooks(){
    // CREANDO UN HOOKS DE TIPO ENTERO
    const[contador, setContador] = useState(1);
    // CREANDO UN HOOKS DE TIPO FECHA / HORA
    const[ hora, setHora ] = useState(new Date())
    // CREAR UN HOOKS USEEFFECT
    useEffect( ()=>{
        const intervalo = setInterval( ()=>{setHora(new Date())},1000);
        return () => clearInterval(intervalo) //LIBERANDO MEMORIA 
    },[]

    );
    return (
        <div>
            <article>
              <h5> Uso de hooks useState</h5>
              <h6>Número de Personas: {contador}</h6>
              <button type="button" className="btn btn-success"
                     onClick={ ()=> setContador(contador+1)}>+</button>

              <button type="button" className="btn btn-danger"
                     onClick={ ()=> setContador(contador-1)}>-</button>
            </article>
            <article>
                <h5>Uso de Hooks useEffect</h5>
                <h6>La hora actual es: {hora.toLocaleTimeString()}</h6>
            </article>
        </div>
    );
}
export default CompHooks;
