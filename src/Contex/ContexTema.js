import { createContext} from "react";
import { useContext } from "react";
import { useState } from "react";

const ContexTema = createContext();

export function TemaProvider({ children }){
    const[tema, setTema]= useState("lidht");

    function cambiarTema(){
        setTema((prev)=> (prev==="lidht" ? "dark" : "lidht")
        );
    }

    return(
        <ContexTema.Provider value={{ tema, cambiarTema} }>
            <div className={tema}> {children} </div>

        </ContexTema.Provider>

    );
}

export function useTema(){
    return useContext(ContexTema);
}