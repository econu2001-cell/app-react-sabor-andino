import React from "react";
import { useState } from "react";
import { useEffect } from "react";

function CompTimerPedido({ segundos = 300 }) {

    // Estado del contador empieza en los segundos 
    const [tiempoRestante, setTiempoRestante] = useState(segundos);

    // setInterval resta 1 cada segundo
    useEffect(() => {
        // Si llegó a 0 detiene el intervalo
        if (tiempoRestante <= 0) return;

        const intervalo = setInterval(() => {
            setTiempoRestante((prev) => prev - 1); // resta 1 cada segundo
        }, 1000);

        // Libera memoria 
        return () => clearInterval(intervalo);

    }, [tiempoRestante]);

    // Convierte segundos a formato mm:ss
    const minutos = Math.floor(tiempoRestante / 60);
    const seg = tiempoRestante % 60;
    const formato = `${String(minutos).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;

    // Verde listo - Rojo menos de 1 min - Naranja normal
    const clase =
        tiempoRestante <= 0  ? "timer-listo" :
        tiempoRestante <= 60 ? "timer-urgente" :
        "timer-normal";

    return (
        <span className={`timer-badge ${clase}`}>
            {/* Si llegó a 0 muestra listo, si no muestra el tiempo */}
            {tiempoRestante <= 0 ? "✓ Listo" : `⏱ ${formato}`}
        </span>
    );
}

export default CompTimerPedido;